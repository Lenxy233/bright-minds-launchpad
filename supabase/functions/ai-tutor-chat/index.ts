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
    const { messages, storyContext } = await req.json();

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY not configured");
    }

    console.log("AI Tutor chat request received");

    // Build system prompt with story context
    let systemPrompt = `You are a friendly, patient, and encouraging AI tutor for children. Your role is to help students understand and learn.

Guidelines:
- Use simple, age-appropriate language (suitable for ages 4-10)
- Be enthusiastic and encouraging
- Ask follow-up questions to check understanding
- Provide explanations with examples
- Make learning fun and interactive
- Be patient and never judgmental
- Use emojis occasionally to keep it friendly 😊
- Help with various subjects: reading, math, science, social-emotional learning
- Break down complex topics into simple, digestible pieces
- Celebrate progress and effort`;

    if (storyContext) {
      systemPrompt += `\n\nCurrent Story Context:\nTitle: ${storyContext.title}\n\nStory Content:\n${storyContext.content}\n\nFocus on helping the child understand this specific story.`;
    } else {
      systemPrompt += `\n\nYou are helping a child with their learning activities. They may ask about any educational topic. Be ready to help with:
- Reading comprehension and phonics
- Basic math (counting, addition, subtraction)
- Emotions and feelings
- Social skills and friendship
- Geography and world awareness
- Science concepts for young learners
- Any other age-appropriate educational topics`;
    }

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
          ...messages
        ],
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit exceeded. Please try again in a moment." }),
          {
            status: 429,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "AI usage limit reached. Please contact support." }),
          {
            status: 402,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          }
        );
      }
      const errorText = await response.text();
      console.error("AI gateway error:", errorText);
      throw new Error(`AI gateway error: ${response.status}`);
    }

    const data = await response.json();
    const assistantMessage = data.choices?.[0]?.message?.content;

    if (!assistantMessage) {
      throw new Error("No response from AI");
    }

    console.log("AI Tutor response generated successfully");

    return new Response(
      JSON.stringify({ message: assistantMessage }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );

  } catch (error) {
    console.error("Error in ai-tutor-chat:", error);
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