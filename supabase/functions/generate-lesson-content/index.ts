import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { topic, category, contentType, ageRange } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");

    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const systemPrompt = `You are an expert kindergarten curriculum designer specializing in creating practical, activity-based lessons for ages 4-6. Focus on hands-on learning with clear, simple steps. For math lessons, include specific numbers, counting activities, and visual aids. Keep language simple and child-friendly.`;

    const contentTypeGuidance = contentType === 'Video' 
      ? 'Create a lesson plan for a video activity. Include what children should do while watching and after.'
      : contentType === 'Image'
      ? 'Create a worksheet or visual activity. Describe what should be drawn/shown and how children interact with it.'
      : 'Create a hands-on activity with clear, numbered steps.';

    const userPrompt = `Create a practical kindergarten ${contentType} lesson about "${topic}" for ${category}.

Age: ${ageRange || "4-6 years"}

${contentTypeGuidance}

Generate EXACTLY in this format:

TITLE: [Short, catchy title - max 6 words]

DESCRIPTION: [One sentence explaining what children will learn]

CONTENT:
[For Math: Include specific numbers, counting exercises, visual descriptions]
[Write 5-8 clear, simple steps that a teacher or parent can follow]
[Each step should be one sentence, starting with an action word]
[Example: "1. Place 5 blocks in front of the child"]

LEARNING GOALS: [2-3 specific skills children will practice]

MATERIALS: [Simple list of items needed]

Keep it practical, specific, and activity-based. Avoid lengthy explanations or stories.`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit exceeded. Please try again later." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "Payment required. Please add credits to your workspace." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      throw new Error("AI generation failed");
    }

    const data = await response.json();
    const generatedContent = data.choices?.[0]?.message?.content;

    if (!generatedContent) {
      throw new Error("No content generated");
    }

    // Parse the structured response
    const titleMatch = generatedContent.match(/TITLE:\s*(.+)/i);
    const descMatch = generatedContent.match(/DESCRIPTION:\s*(.+)/i);
    const contentMatch = generatedContent.match(/CONTENT:\s*([\s\S]+?)(?=LEARNING GOALS:|$)/i);
    const goalsMatch = generatedContent.match(/LEARNING GOALS:\s*([\s\S]+?)(?=MATERIALS:|$)/i);
    const materialsMatch = generatedContent.match(/MATERIALS:\s*([\s\S]+?)$/i);

    const parsedContent = {
      title: titleMatch?.[1]?.trim() || "Untitled Lesson",
      description: descMatch?.[1]?.trim() || "",
      content: contentMatch?.[1]?.trim() || generatedContent,
      learningGoals: goalsMatch?.[1]?.trim() || "",
      materials: materialsMatch?.[1]?.trim() || "",
      rawContent: generatedContent
    };

    return new Response(
      JSON.stringify(parsedContent),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error in generate-lesson-content:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
