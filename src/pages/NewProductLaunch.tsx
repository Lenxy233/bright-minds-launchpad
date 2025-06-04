import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { ArrowLeft, Sparkles, Plus } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

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

    setProcessing(true);

    try {
      // If user is logged in, save purchase record before redirecting
      if (user) {
        const bundleDetails = {
          "kids-curriculum": { 
            baseAmount: 1999, 
            baseUrl: "https://buy.stripe.com/eVqdR9a7H3kb2sk8H5gMw08",
            withPromptsUrl: "https://buy.stripe.com/cNi14n2Ff4of7ME1eDgMw0e"
          },
          "video-bundle": { 
            baseAmount: 1999, 
            baseUrl: "https://buy.stripe.com/7sY5kDfs1dYP1og0azgMw09",
            withPromptsUrl: "https://buy.stripe.com/cNi14n2Ff4of7ME1eDgMw0e"
          },
          "animation-video": { 
            baseAmount: 1999, 
            baseUrl: "https://buy.stripe.com/dRmeVd0x7f2Td6Y1eDgMw0a",
            withPromptsUrl: "https://buy.stripe.com/cNi14n2Ff4of7ME1eDgMw0e"
          }
        };

        const bundle = bundleDetails[request as keyof typeof bundleDetails];
        
        if (bundle) {
          const totalAmount = bundle.baseAmount + (includeAiPrompts ? 199 : 0);
          const checkoutUrl = includeAiPrompts ? bundle.withPromptsUrl : bundle.baseUrl;

          // Create pending purchase record
          const { error } = await supabase
            .from('user_purchases')
            .insert({
              user_id: user.id,
              email: user.email,
              bundle_type: request,
              amount: totalAmount,
              status: 'pending',
              includes_ai_prompts: includeAiPrompts
            });

          if (error) {
            console.error('Error creating purchase record:', error);
          }

          // Redirect to Stripe
          window.open(checkoutUrl, "_blank");
        }
      } else {
        // For non-authenticated users, redirect directly
        const urls = {
          "kids-curriculum": includeAiPrompts 
            ? "https://buy.stripe.com/cNi14n2Ff4of7ME1eDgMw0e"
            : "https://buy.stripe.com/eVqdR9a7H3kb2sk8H5gMw08",
          "video-bundle": includeAiPrompts 
            ? "https://buy.stripe.com/cNi14n2Ff4of7ME1eDgMw0e"
            : "https://buy.stripe.com/7sY5kDfs1dYP1og0azgMw09",
          "animation-video": includeAiPrompts 
            ? "https://buy.stripe.com/cNi14n2Ff4of7ME1eDgMw0e"
            : "https://buy.stripe.com/dRmeVd0x7f2Td6Y1eDgMw0a"
        };

        const url = urls[request as keyof typeof urls];
        if (url) {
          window.open(url, "_blank");
        }
      }
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

  const bundleOptions = [
    { value: "kids-curriculum", label: "Kids Curriculum Bundle - $19.99" },
    { value: "video-bundle", label: "Video Bundle - $19.99" },
    { value: "animation-video", label: "Animation Video Bundle - $19.99" }
  ];

  const calculateTotal = () => {
    const basePrice = 19.99;
    const aiPromptsPrice = includeAiPrompts ? 1.99 : 0;
    return (basePrice + aiPromptsPrice).toFixed(2);
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
                  {user ? (
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
                      <p className="text-green-700">You're signed in! Your purchase will be automatically linked to your account.</p>
                      <p className="text-sm text-green-600 mt-2">Email: {user.email}</p>
                    </div>
                  ) : (
                    <>
                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center">
                        <p className="text-blue-700">
                          <Link to="/auth" className="underline font-medium">Sign in</Link> to automatically track your purchases!
                        </p>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <Label htmlFor="firstName" className="text-lg font-medium">First Name</Label>
                          <Input
                            id="firstName"
                            type="text"
                            value={firstName}
                            onChange={(e) => setFirstName(e.target.value)}
                            placeholder="Enter your first name"
                            className="h-12 text-lg"
                            required={!user}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="lastName" className="text-lg font-medium">Last Name</Label>
                          <Input
                            id="lastName"
                            type="text"
                            value={lastName}
                            onChange={(e) => setLastName(e.target.value)}
                            placeholder="Enter your last name"
                            className="h-12 text-lg"
                            required={!user}
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email" className="text-lg font-medium">Email Address</Label>
                        <Input
                          id="email"
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="Enter your email address"
                          className="h-12 text-lg"
                          required={!user}
                        />
                      </div>
                    </>
                  )}
                </TabsContent>

                <TabsContent value="request" className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="request" className="text-lg font-medium">Choose Your Bundle</Label>
                    <Select value={request} onValueChange={setRequest} required>
                      <SelectTrigger className="h-12 text-lg">
                        <SelectValue placeholder="Select a bundle option" />
                      </SelectTrigger>
                      <SelectContent>
                        {bundleOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value} className="text-lg py-3">
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Add-on Section */}
                  <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg p-6 border-2 border-yellow-200">
                    <h3 className="text-xl font-bold text-orange-800 mb-4 flex items-center gap-2">
                      <Plus className="w-5 h-5" />
                      Optional Add-On
                    </h3>
                    <div className="flex items-start space-x-3">
                      <Checkbox 
                        id="ai-prompts" 
                        checked={includeAiPrompts}
                        onCheckedChange={(checked) => setIncludeAiPrompts(checked === true)}
                        className="mt-1"
                      />
                      <div className="flex-1">
                        <Label htmlFor="ai-prompts" className="text-lg font-semibold text-orange-700 cursor-pointer">
                          Image Design Style AI Prompts - $1.99
                        </Label>
                        <p className="text-sm text-gray-600 mt-1">
                          Get 200+ professional AI prompts for creating stunning image designs and artwork styles. Perfect for MidJourney, DALL-E, and other AI image generators.
                        </p>
                        <div className="mt-2 bg-white rounded p-3 border border-orange-200">
                          <p className="text-xs text-orange-600 font-medium">✨ What's included:</p>
                          <ul className="text-xs text-gray-600 mt-1 space-y-1">
                            <li>• 200+ curated AI art prompts</li>
                            <li>• Style guides for different art techniques</li>
                            <li>• Ready-to-use prompt templates</li>
                            <li>• Commercial usage rights included</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Order Summary */}
                  <div className="bg-white rounded-lg p-6 border-2 border-purple-200 shadow-sm">
                    <h3 className="text-lg font-bold text-purple-800 mb-3">Order Summary</h3>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Bundle Price:</span>
                        <span>$19.99</span>
                      </div>
                      {includeAiPrompts && (
                        <div className="flex justify-between text-sm text-orange-600">
                          <span>AI Prompts Add-on:</span>
                          <span>$1.99</span>
                        </div>
                      )}
                      <div className="border-t pt-2 flex justify-between font-bold text-lg">
                        <span>Total:</span>
                        <span className="text-purple-600">${calculateTotal()}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg p-6 border-2 border-purple-200">
                    <h3 className="text-xl font-bold text-purple-800 mb-4">Bundle Details</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                      <div className="bg-white rounded-lg p-4 shadow-sm">
                        <h4 className="font-semibold text-purple-700">Kids Curriculum Bundle</h4>
                        <p className="text-gray-600 mt-2">Educational activities and lesson plans</p>
                        <p className="font-bold text-purple-600 mt-2">$19.99</p>
                      </div>
                      <div className="bg-white rounded-lg p-4 shadow-sm">
                        <h4 className="font-semibold text-purple-700">Video Bundle</h4>
                        <p className="text-gray-600 mt-2">Video tutorials and training content</p>
                        <p className="font-bold text-purple-600 mt-2">$19.99</p>
                      </div>
                      <div className="bg-white rounded-lg p-4 shadow-sm">
                        <h4 className="font-semibold text-purple-700">Animation Video Bundle</h4>
                        <p className="text-gray-600 mt-2">Animated videos for content creation</p>
                        <p className="font-bold text-purple-600 mt-2">$19.99</p>
                      </div>
                    </div>
                  </div>
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
