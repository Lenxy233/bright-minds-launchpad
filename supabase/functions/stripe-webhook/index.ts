
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

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
    const body = await req.text();
    
    // Parse the webhook event
    const event = JSON.parse(body);
    
    console.log("Webhook event type:", event.type);

    if (event.type === "checkout.session.completed") {
      const session = event.data.object;
      const customerEmail = session.customer_details?.email;
      const sessionId = session.id;
      const amountTotal = session.amount_total;

      console.log("Processing completed checkout for:", customerEmail);

      if (customerEmail) {
        // Update purchase status to completed
        const { error: updateError } = await supabaseClient
          .from('user_purchases')
          .update({ 
            status: 'completed',
            stripe_session_id: sessionId,
            updated_at: new Date().toISOString()
          })
          .eq('email', customerEmail)
          .eq('status', 'pending');

        if (updateError) {
          console.error("Error updating purchase:", updateError);
          return new Response(JSON.stringify({ error: updateError.message }), {
            status: 500,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          });
        }

        console.log("Successfully updated purchase for:", customerEmail);

        // Get the purchase details to determine bundle type
        const { data: purchaseData, error: fetchError } = await supabaseClient
          .from('user_purchases')
          .select('bundle_type, amount')
          .eq('email', customerEmail)
          .eq('stripe_session_id', sessionId)
          .single();

        if (fetchError) {
          console.error("Error fetching purchase details:", fetchError);
        } else if (purchaseData) {
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
