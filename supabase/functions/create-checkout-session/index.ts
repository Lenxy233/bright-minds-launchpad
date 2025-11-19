import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.21.0?target=deno";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { email, userId, bundleType } = await req.json();
    
    const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") ?? "", {
      apiVersion: "2023-10-16",
    });

    // Get the origin from the request
    const origin = req.headers.get("origin") || "https://bf8e9fbe-f2be-4015-982e-07ef00c36842.lovableproject.com";
    
    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: "BMA Bundle - Bright Minds Academy",
              description: "Complete access to educational worksheets, activities, and AI tools",
            },
            unit_amount: 1900, // $19.00 in cents
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${origin}/purchase-success?session_id={CHECKOUT_SESSION_ID}&bundle_type=${bundleType || 'bma-bundle'}`,
      cancel_url: `${origin}/`,
      ...(email ? { customer_email: email } : {}),
      metadata: {
        bundle_type: bundleType || "bma-bundle",
        user_id: userId || "",
      },
    });

    console.log("Created checkout session for:", email);

    return new Response(
      JSON.stringify({ url: session.url }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );
  } catch (error) {
    console.error("Error creating checkout session:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 400,
      }
    );
  }
});
