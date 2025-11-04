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
    const { gameType, topic, difficulty, ageRange, title, description } = await req.json();

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY not configured");
    }

    console.log("Generating game:", { gameType, topic, difficulty, ageRange });

    // Generate game content based on type
    const gamePrompt = generateGamePrompt(gameType, topic, difficulty, ageRange, description);

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: "You are an expert educational game designer for children. Always return valid JSON." },
          { role: "user", content: gamePrompt }
        ],
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("AI generation error:", errorText);
      throw new Error(`AI generation failed: ${response.status}`);
    }

    const data = await response.json();
    const gameContent = data.choices?.[0]?.message?.content;
    
    if (!gameContent) {
      throw new Error("No game content generated");
    }

    // Parse the JSON response
    let gameData;
    try {
      const cleanedContent = gameContent.replace(/```json\n?|\n?```/g, '').trim();
      gameData = JSON.parse(cleanedContent);
    } catch (parseError) {
      console.error("Failed to parse game JSON:", gameContent);
      throw new Error("Failed to parse generated game");
    }

    console.log("Game content generated successfully");

    // Save to database
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const authHeader = req.headers.get("Authorization");
    const token = authHeader?.replace("Bearer ", "");
    const { data: { user } } = await supabase.auth.getUser(token);

    if (!user) {
      throw new Error("Unauthorized");
    }

    const { data: game, error: gameError } = await supabase
      .from("ai_generated_games")
      .insert({
        user_id: user.id,
        game_type: gameType,
        title: title,
        description: description || `${topic} ${gameType} game for ages ${ageRange}`,
        difficulty: difficulty,
        age_range: ageRange,
        game_data: gameData,
        is_published: true
      })
      .select()
      .single();

    if (gameError) {
      console.error("Error saving game:", gameError);
      throw gameError;
    }

    console.log("Game saved successfully:", game.id);

    return new Response(
      JSON.stringify({
        success: true,
        game: {
          id: game.id,
          title: game.title,
          gameType: game.game_type,
          gameData: gameData
        }
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );

  } catch (error) {
    console.error("Error in generate-game:", error);
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

function generateGamePrompt(gameType: string, topic: string, difficulty: string, ageRange: string, description?: string): string {
  const basePrompt = `Create an educational ${gameType} game about "${topic}" for children aged ${ageRange} at ${difficulty} difficulty level.
${description ? `Additional requirements: ${description}` : ''}

Return a JSON object with the following structure:`;

  switch (gameType) {
    case "matching":
      return `${basePrompt}
{
  "items": [
    { "id": 1, "left": "item/question", "right": "matching item/answer", "image_prompt": "description for left item" },
    // 8-12 pairs depending on difficulty
  ]
}
Make sure items are educational, age-appropriate, and fun!`;

    case "quiz":
      return `${basePrompt}
{
  "questions": [
    {
      "question": "Question text",
      "options": ["option1", "option2", "option3", "option4"],
      "correct": 0,
      "explanation": "Why this answer is correct",
      "image_prompt": "description for question image"
    },
    // 10-15 questions depending on difficulty
  ]
}`;

    case "memory":
      return `${basePrompt}
{
  "cards": [
    { "id": 1, "content": "content", "pair_id": 1, "image_prompt": "description" },
    { "id": 2, "content": "matching content", "pair_id": 1, "image_prompt": "description" },
    // 12-20 cards (6-10 pairs) depending on difficulty
  ]
}`;

    case "sorting":
      return `${basePrompt}
{
  "categories": [
    { "name": "Category 1", "color": "#color" },
    { "name": "Category 2", "color": "#color" }
  ],
  "items": [
    { "id": 1, "content": "item", "category": 0, "image_prompt": "description" },
    // 12-20 items depending on difficulty
  ]
}`;

    case "sequence":
      return `${basePrompt}
{
  "sequences": [
    {
      "title": "Sequence title",
      "items": [
        { "order": 1, "content": "first item", "image_prompt": "description" },
        { "order": 2, "content": "second item", "image_prompt": "description" },
        // 4-8 items per sequence
      ]
    },
    // 3-5 sequences depending on difficulty
  ]
}`;

    default:
      return basePrompt;
  }
}
