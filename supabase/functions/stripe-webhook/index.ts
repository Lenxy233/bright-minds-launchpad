import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";
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
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      { auth: { persistSession: false } }
    );

    const signature = req.headers.get("stripe-signature");
    const webhookSecret = Deno.env.get("STRIPE_WEBHOOK_SECRET");
    const stripeSecretKey = Deno.env.get("STRIPE_SECRET_KEY");

    if (!signature || !webhookSecret) {
      console.error("Missing webhook signature or secret");
      return new Response(JSON.stringify({ error: "Webhook signature missing" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const body = await req.text();
    const stripe = new Stripe(stripeSecretKey ?? "", {
      apiVersion: "2023-10-16",
    });
    
    // Verify the webhook signature
    let event: Stripe.Event;
    try {
      event = await stripe.webhooks.constructEventAsync(body, signature, webhookSecret);
    } catch (err) {
      console.error("Webhook signature verification failed:", err.message);
      return new Response(JSON.stringify({ error: "Invalid signature" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    
    console.log("Webhook event type:", event.type);

    if (event.type === "checkout.session.completed") {
      const session = event.data.object;
      const customerEmail = session.customer_details?.email;
      const sessionId = session.id;
      const amountTotal = session.amount_total;

      console.log("Processing completed checkout for:", customerEmail);

      if (customerEmail) {
        // First, try to update existing pending purchase
        const { data: existingPurchase, error: updateError } = await supabaseClient
          .from('user_purchases')
          .update({ 
            status: 'completed',
            stripe_session_id: sessionId,
            updated_at: new Date().toISOString()
          })
          .eq('email', customerEmail)
          .eq('status', 'pending')
          .select('bundle_type, amount, email, user_id')
          .maybeSingle();

        let purchaseData = existingPurchase;

        // If no pending purchase found, create a new completed purchase
        if (!existingPurchase && !updateError) {
          console.log("No pending purchase found, creating new completed purchase for:", customerEmail);
          
          // Get or create user based on email
          const { data: profile } = await supabaseClient
            .from('profiles')
            .select('id')
            .eq('email', customerEmail)
            .maybeSingle();

          const userId = profile?.id || crypto.randomUUID();

          const { data: newPurchase, error: insertError } = await supabaseClient
            .from('user_purchases')
            .insert({
              user_id: userId,
              email: customerEmail,
              bundle_type: 'bma-bundle',
              amount: amountTotal || 1900,
              status: 'completed',
              stripe_session_id: sessionId,
              currency: 'usd',
              purchased_at: new Date().toISOString()
            })
            .select('bundle_type, amount, email')
            .single();

          if (insertError) {
            console.error("Error creating purchase:", insertError);
            return new Response(JSON.stringify({ error: insertError.message }), {
              status: 500,
              headers: { ...corsHeaders, "Content-Type": "application/json" },
            });
          }

          purchaseData = newPurchase;
          console.log("Successfully created purchase for:", customerEmail);
        } else if (updateError) {
          console.error("Error updating purchase:", updateError);
          return new Response(JSON.stringify({ error: updateError.message }), {
            status: 500,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          });
        } else {
          console.log("Successfully updated existing purchase for:", customerEmail, "Bundle:", purchaseData?.bundle_type);
        }

        // Send confirmation email
        try {
          const emailResponse = await supabaseClient.functions.invoke('send-purchase-email', {
            body: {
              email: customerEmail,
              bundleType: purchaseData.bundle_type,
              amount: purchaseData.amount
            }
          });

          if (emailResponse.error) {
            console.error("Error sending confirmation email:", emailResponse.error);
          } else {
            console.log("Confirmation email sent successfully to:", customerEmail);
          }
        } catch (emailError) {
          console.error("Error invoking email function:", emailError);
        }
      }
    }

    return new Response(JSON.stringify({ received: true }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Webhook error:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
