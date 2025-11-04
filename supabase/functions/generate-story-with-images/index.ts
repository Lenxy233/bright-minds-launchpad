import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { theme, ageRange, lessonFocus, numPages, illustrationStyle } = await req.json();

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY not configured");
    }

    console.log("Generating story with params:", { theme, ageRange, lessonFocus, numPages });

    // Step 1: Generate story content
    const storyPrompt = `Create an educational children's story with the following requirements:
- Theme: ${theme}
- Age Range: ${ageRange}
- Educational Focus: ${lessonFocus || "general learning"}
- Number of pages: ${numPages}
- Style: Engaging and age-appropriate

Please structure the story as a JSON array with ${numPages} pages. Each page should have:
1. page_number (integer)
2. text (string, 2-3 sentences suitable for ${ageRange})
3. image_prompt (detailed prompt for generating an illustration in ${illustrationStyle} style)

Return ONLY the JSON array, no additional text.`;

    const storyResponse = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: "You are an expert children's book author and educator. Always return valid JSON." },
          { role: "user", content: storyPrompt }
        ],
      }),
    });

    if (!storyResponse.ok) {
      const errorText = await storyResponse.text();
      console.error("Story generation error:", errorText);
      throw new Error(`Story generation failed: ${storyResponse.status}`);
    }

    const storyData = await storyResponse.json();
    const storyContent = storyData.choices?.[0]?.message?.content;
    
    if (!storyContent) {
      throw new Error("No story content generated");
    }

    // Parse the JSON response
    let storyPages;
    try {
      // Remove markdown code blocks if present
      const cleanedContent = storyContent.replace(/```json\n?|\n?```/g, '').trim();
      storyPages = JSON.parse(cleanedContent);
    } catch (parseError) {
      console.error("Failed to parse story JSON:", storyContent);
      throw new Error("Failed to parse generated story");
    }

    console.log(`Generated ${storyPages.length} story pages`);

    // Step 2: Generate cover image
    console.log("Generating cover image for the story");
    const coverPrompt = `Create a captivating cover image for a children's story book about "${theme}". Style: ${illustrationStyle}, bright and inviting, professional children's book cover, title-friendly design with space for text, high quality.`;
    
    let coverImageUrl = null;
    try {
      const coverResponse = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${LOVABLE_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "google/gemini-2.5-flash-image",
          messages: [
            {
              role: "user",
              content: coverPrompt
            }
          ],
          modalities: ["image", "text"]
        }),
      });

      if (coverResponse.ok) {
        const coverData = await coverResponse.json();
        coverImageUrl = coverData.choices?.[0]?.message?.images?.[0]?.image_url?.url;
        console.log("Cover image generated successfully");
      } else {
        console.error("Cover image generation failed");
      }
    } catch (error) {
      console.error("Error generating cover image:", error);
    }

    // Step 3: Generate images for each page
    const pagesWithImages = [];
    
    for (const page of storyPages) {
      console.log(`Generating image for page ${page.page_number}`);
      
      const imagePrompt = `${page.image_prompt}. Style: ${illustrationStyle}, child-friendly, bright colors, high quality illustration.`;
      
      const imageResponse = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${LOVABLE_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "google/gemini-2.5-flash-image",
          messages: [
            {
              role: "user",
              content: imagePrompt
            }
          ],
          modalities: ["image", "text"]
        }),
      });

      if (!imageResponse.ok) {
        console.error(`Image generation failed for page ${page.page_number}`);
        pagesWithImages.push({
          ...page,
          image_url: null,
          image_error: true
        });
        continue;
      }

      const imageData = await imageResponse.json();
      const imageBase64 = imageData.choices?.[0]?.message?.images?.[0]?.image_url?.url;

      pagesWithImages.push({
        ...page,
        image_url: imageBase64 || null
      });

      console.log(`Page ${page.page_number} image generated successfully`);
    }

    // Step 4: Create story in database
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const authHeader = req.headers.get("Authorization");
    const token = authHeader?.replace("Bearer ", "");
    const { data: { user } } = await supabase.auth.getUser(token);

    if (!user) {
      throw new Error("Unauthorized");
    }

    // Create story book
    const storyTitle = `${theme} - ${ageRange}`;
    const { data: storyBook, error: storyError } = await supabase
      .from("story_books")
      .insert({
        title: storyTitle,
        description: `Educational story about ${theme} for ${ageRange}`,
        category: lessonFocus || theme,
        cover_image_url: coverImageUrl,
        created_by: user.id
      })
      .select()
      .single();

    if (storyError) {
      console.error("Error creating story book:", storyError);
      throw storyError;
    }

    // Create story pages
    const storyPagesData = pagesWithImages.map(page => ({
      story_book_id: storyBook.id,
      page_number: page.page_number,
      text_content: page.text,
      image_url: page.image_url
    }));

    const { error: pagesError } = await supabase
      .from("story_pages")
      .insert(storyPagesData);

    if (pagesError) {
      console.error("Error creating story pages:", pagesError);
      throw pagesError;
    }

    console.log("Story book created successfully:", storyBook.id);

    return new Response(
      JSON.stringify({
        success: true,
        storyBook: {
          id: storyBook.id,
          title: storyBook.title,
          pages: pagesWithImages
        }
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );

  } catch (error) {
    console.error("Error in generate-story-with-images:", error);
    return new Response(
      JSON.stringify({
        error: error instanceof Error ? error.message : "Unknown error occurred"
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});