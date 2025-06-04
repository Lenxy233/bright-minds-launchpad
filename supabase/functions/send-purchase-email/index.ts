
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface PurchaseEmailRequest {
  email: string;
  bundleType: string;
  amount: number;
  customerName?: string;
}

const getBundleName = (bundleType: string) => {
  switch (bundleType) {
    case 'kids-curriculum':
      return 'Kids Curriculum Bundle';
    case 'video-bundle':
      return 'Video Bundle';
    case 'animation-video':
      return 'Animation Video Bundle';
    default:
      return bundleType;
  }
};

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { email, bundleType, amount, customerName }: PurchaseEmailRequest = await req.json();
    
    console.log("Sending purchase confirmation email to:", email);

    const bundleName = getBundleName(bundleType);
    const formattedAmount = (amount / 100).toFixed(2);
    const firstName = customerName || "Friend";

    const emailResponse = await resend.emails.send({
      from: "Bright Minds Academy <membership@brightmindsacademy.de>",
      to: [email],
      subject: `Congratulations ${firstName}! Welcome to Bright Minds Academy`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="text-align: center; margin-bottom: 30px;">
            <img src="https://ezgwdqegozawvuchpaor.supabase.co/storage/v1/object/public/uploads/69fc66c6-3b7b-4fa2-9348-5adcf71e90ee.png" alt="Bright Minds Academy" style="width: 60px; height: 60px; margin: 20px 0;">
            <h1 style="color: #7c3aed; margin-bottom: 10px;">🎉 Congratulations ${firstName}!</h1>
            <h2 style="color: #1e293b; margin-bottom: 20px;">Welcome to Bright Minds Academy</h2>
            <p style="font-size: 18px; color: #475569; margin-bottom: 30px;">
              You've just launched into a future full of fun, growth, and greatness!
            </p>
          </div>
          
          <div style="background: linear-gradient(135deg, #fdf2f8, #f3e8ff); padding: 30px; border-radius: 15px; margin-bottom: 30px;">
            <h2 style="color: #7c3aed; margin-bottom: 20px;">Purchase Confirmation</h2>
            <p style="margin-bottom: 15px;"><strong>Bundle:</strong> ${bundleName}</p>
            <p style="margin-bottom: 15px;"><strong>Amount Paid:</strong> $${formattedAmount}</p>
            <p style="margin-bottom: 15px;"><strong>Email:</strong> ${email}</p>
          </div>

          <div style="background: #f8fafc; padding: 25px; border-radius: 10px; margin-bottom: 30px;">
            <h3 style="color: #1e293b; margin-bottom: 15px;">🚀 Create Your Account</h3>
            <p style="margin-bottom: 20px; color: #475569;">Go ahead and create your account using this email:</p>
            <div style="text-align: center;">
              <a href="https://brightmindsacademy.de/auth" 
                 style="background: linear-gradient(135deg, #7c3aed, #ec4899); 
                        color: white; 
                        padding: 15px 30px; 
                        text-decoration: none; 
                        border-radius: 8px; 
                        font-weight: bold; 
                        display: inline-block;
                        margin: 10px;">
                Click Here to Create Your Account ✨
              </a>
            </div>
          </div>

          <div style="background: #fff3cd; border: 1px solid #ffeaa7; padding: 20px; border-radius: 10px; margin-bottom: 30px;">
            <h3 style="color: #856404; margin-bottom: 15px;">⚠️ Important: Registration Instructions</h3>
            <p style="margin-bottom: 15px; color: #856404; font-weight: bold;">
              You MUST register using this exact email address: <span style="background: #fff; padding: 2px 8px; border-radius: 4px; border: 1px solid #ddd;">${email}</span>
            </p>
            <p style="color: #856404;">
              This is the email you used for your purchase. Using a different email will prevent you from accessing your content.
            </p>
          </div>

          <div style="border-top: 2px solid #e2e8f0; padding-top: 20px; text-align: center; color: #64748b;">
            <p>Remember to use the email address <strong>${email}</strong> when creating your account.</p>
            <p style="margin-top: 20px;">Have questions? Reply to this email and we'll help you get started!</p>
            <p style="margin-top: 15px; font-size: 14px;">
              Best regards,<br>
              <strong>The Bright Minds Academy Team</strong>
            </p>
          </div>
        </div>
      `,
    });

    console.log("Purchase confirmation email sent successfully:", emailResponse);

    return new Response(JSON.stringify(emailResponse), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Error sending purchase confirmation email:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
