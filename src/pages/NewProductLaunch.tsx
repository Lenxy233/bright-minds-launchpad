
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import PersonalInfoTab from "@/components/new-product-launch/PersonalInfoTab";
import RequestDetailsTab from "@/components/new-product-launch/RequestDetailsTab";

const NewProductLaunch = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [request, setRequest] = useState("");
  const [includeAiPrompts, setIncludeAiPrompts] = useState(false);
  const [processing, setProcessing] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!request) {
      toast({
        title: "Error",
        description: "Please select a bundle option.",
        variant: "destructive",
      });
      return;
    }

    // Validate email for guest users
    if (!user && !email) {
      toast({
        title: "Error",
        description: "Please enter your email address.",
        variant: "destructive",
      });
      return;
    }

    // Basic email validation
    const emailToUse = email || user?.email || '';
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(emailToUse)) {
      toast({
        title: "Error",
        description: "Please enter a valid email address.",
        variant: "destructive",
      });
      return;
    }

    setProcessing(true);

    try {
      // Create pending purchase record if user is logged in
      if (user) {
        const { error } = await supabase
          .from('user_purchases')
          .insert({
            user_id: user.id,
            email: user.email,
            bundle_type: request,
            amount: 1900,
            status: 'pending',
            includes_ai_prompts: false
          });

        if (error) {
          console.error('Error creating purchase record:', error);
        }
      }

      // Redirect to Stripe payment link
      window.location.href = 'https://buy.stripe.com/6oU00ja7HcULc2Uf5tgMw0f';
    } catch (error) {
      console.error('Error processing purchase:', error);
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setProcessing(false);
    }
  };

  const calculateTotal = () => {
    return "19.00";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 via-purple-100 via-blue-100 to-green-100 py-8 px-4">
      <div className="container mx-auto max-w-4xl">
        <div className="mb-8 flex justify-between items-center">
          <Link 
            to="/" 
            className="inline-flex items-center gap-2 text-purple-600 hover:text-purple-800 font-medium transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>
          
          {user && (
            <Link 
              to="/dashboard"
              className="inline-flex items-center gap-2 text-purple-600 hover:text-purple-800 font-medium transition-colors"
            >
              View Dashboard
            </Link>
          )}
        </div>

        <Card className="bg-white/90 backdrop-blur-sm shadow-xl border-2 border-purple-200">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent flex items-center justify-center gap-2">
              <Sparkles className="w-8 h-8 text-purple-600" />
              New Product Launch
            </CardTitle>
            <CardDescription className="text-lg text-gray-600">
              Upgrade your creative library with additional content and resources
              {user && <span className="block text-sm text-green-600 mt-2">✓ Signed in as {user.email}</span>}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit}>
              <Tabs defaultValue={user ? "request" : "personal"} className="w-full">
                <TabsList className="grid w-full grid-cols-2 mb-8">
                  <TabsTrigger value="personal" className="text-lg py-3">Personal Info</TabsTrigger>
                  <TabsTrigger value="request" className="text-lg py-3">Request Details</TabsTrigger>
                </TabsList>

                <TabsContent value="personal" className="space-y-6">
                  <PersonalInfoTab 
                    firstName={firstName}
                    setFirstName={setFirstName}
                    lastName={lastName}
                    setLastName={setLastName}
                    email={email}
                    setEmail={setEmail}
                  />
                </TabsContent>

                <TabsContent value="request" className="space-y-6">
                  <RequestDetailsTab 
                    request={request}
                    setRequest={setRequest}
                    includeAiPrompts={includeAiPrompts}
                    setIncludeAiPrompts={setIncludeAiPrompts}
                    calculateTotal={calculateTotal}
                  />
                </TabsContent>

                <div className="mt-8 flex justify-center">
                  <Button 
                    type="submit" 
                    size="lg" 
                    disabled={processing}
                    className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-8 py-4 text-lg font-semibold rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                  >
                    <Sparkles className="mr-2 w-5 h-5" />
                    {processing ? "Processing..." : `Pay $${calculateTotal()} - Submit Request`}
                  </Button>
                </div>
              </Tabs>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default NewProductLaunch;
