import { useEffect, useState } from "react";
import { CheckCircle2, Sparkles, Download, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useSearchParams } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import confetti from "canvas-confetti";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import FileDownloadList from "@/components/FileDownloadList";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const PurchaseSuccess = () => {
  const { user, signIn, signUp } = useAuth();
  const [searchParams] = useSearchParams();
  const { toast } = useToast();
  
  const [verifiedPurchase, setVerifiedPurchase] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [authLoading, setAuthLoading] = useState(false);
  
  // Auth form states
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  
  const bundleType = searchParams.get('bundle_type') || 'bma-bundle';

  useEffect(() => {
    // Trigger confetti animation
    const duration = 3 * 1000;
    const animationEnd = Date.now() + duration;

    const interval = setInterval(() => {
      const timeLeft = animationEnd - Date.now();
      if (timeLeft <= 0) {
        clearInterval(interval);
        return;
      }

      confetti({
        particleCount: 3,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: ['#9b87f5', '#7E69AB', '#8B5CF6', '#D946EF'],
      });
      confetti({
        particleCount: 3,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: ['#9b87f5', '#7E69AB', '#8B5CF6', '#D946EF'],
      });
    }, 250);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (user?.email) {
      verifyPurchase(user.email);
    } else {
      setLoading(false);
    }
  }, [user]);

  const verifyPurchase = async (userEmail: string) => {
    try {
      const { data, error } = await supabase.functions.invoke('verify-purchase', {
        body: {
          email: userEmail,
          bundleType,
        },
      });

      if (error) throw error;

      if (data?.hasValidPurchase) {
        setVerifiedPurchase(data.purchase);
      } else {
        toast({
          title: "No purchase found",
          description: "We couldn't find a completed purchase with this email.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error verifying purchase:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthLoading(true);
    
    try {
      const { error } = await signIn(email, password);
      if (error) {
        toast({
          title: "Sign in failed",
          description: error.message,
          variant: "destructive",
        });
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setAuthLoading(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthLoading(true);
    
    try {
      const { error } = await signUp(email, password, firstName, lastName);
      if (error) {
        toast({
          title: "Sign up failed",
          description: error.message,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Account created!",
          description: "Please check your email to verify your account.",
        });
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setAuthLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 via-purple-100 via-blue-100 to-green-100 py-12 px-4">
      <div className="container mx-auto max-w-4xl">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-100 mb-6 animate-bounce">
            <CheckCircle2 className="w-12 h-12 text-green-600" />
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold text-purple-900 mb-4">
            🎉 Payment Successful!
          </h1>
          
          <p className="text-xl text-purple-700 mb-2">
            Welcome to Bright Minds Academy
          </p>
          
          <p className="text-lg text-gray-600">
            Thank you for your purchase! Get instant access to your digital products below.
          </p>
        </div>

        {loading ? (
          <Card className="mb-8">
            <CardContent className="p-8 text-center">
              <p className="text-gray-600">Verifying your purchase...</p>
            </CardContent>
          </Card>
        ) : user && verifiedPurchase ? (
          // Authenticated user with verified purchase - show downloads
          <Card className="mb-8 border-2 border-purple-200 shadow-xl">
            <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50">
              <CardTitle className="flex items-center gap-2 text-2xl">
                <Download className="w-6 h-6 text-purple-600" />
                Your Digital Products
              </CardTitle>
              <CardDescription className="text-base">
                Download your bundle content and access your resources instantly
              </CardDescription>
            </CardHeader>
            
            <CardContent className="pt-6">
              <FileDownloadList 
                bundleType={bundleType}
                purchaseStatus="completed"
                includesAiPrompts={verifiedPurchase.includes_ai_prompts}
              />
              
              <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                <div className="flex items-start gap-3">
                  <Mail className="w-5 h-5 text-blue-600 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      Confirmation email sent!
                    </p>
                    <p className="text-sm text-gray-600 mt-1">
                      We've also sent all download links and access details to <strong>{user.email}</strong> as a backup.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ) : (
          // Not authenticated - show auth form
          <Card className="mb-8 border-2 border-purple-200 shadow-xl">
            <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50">
              <CardTitle className="flex items-center gap-2 text-2xl">
                <Sparkles className="w-6 h-6 text-purple-600" />
                Create Your Account
              </CardTitle>
              <CardDescription className="text-base">
                Create an account or sign in to access your purchased content instantly
              </CardDescription>
            </CardHeader>
            
            <CardContent className="pt-6">
              <Tabs defaultValue="signup" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="signup">Create Account</TabsTrigger>
                  <TabsTrigger value="signin">Sign In</TabsTrigger>
                </TabsList>
                
                <TabsContent value="signup">
                  <form onSubmit={handleSignUp} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="firstName">First Name</Label>
                        <Input
                          id="firstName"
                          value={firstName}
                          onChange={(e) => setFirstName(e.target.value)}
                          required
                          disabled={authLoading}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="lastName">Last Name</Label>
                        <Input
                          id="lastName"
                          value={lastName}
                          onChange={(e) => setLastName(e.target.value)}
                          required
                          disabled={authLoading}
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="signup-email">Email (used in purchase)</Label>
                      <Input
                        id="signup-email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Enter the email you used for purchase"
                        required
                        disabled={authLoading}
                      />
                      <p className="text-sm text-gray-500">
                        Use the same email you provided during checkout
                      </p>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="signup-password">Create Password</Label>
                      <Input
                        id="signup-password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        disabled={authLoading}
                        minLength={6}
                      />
                    </div>
                    
                    <Button type="submit" className="w-full" disabled={authLoading}>
                      {authLoading ? "Creating Account..." : "Create Account & Access Downloads"}
                    </Button>
                  </form>
                </TabsContent>
                
                <TabsContent value="signin">
                  <form onSubmit={handleSignIn} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="signin-email">Email</Label>
                      <Input
                        id="signin-email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        disabled={authLoading}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="signin-password">Password</Label>
                      <Input
                        id="signin-password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        disabled={authLoading}
                      />
                    </div>
                    
                    <Button type="submit" className="w-full" disabled={authLoading}>
                      {authLoading ? "Signing In..." : "Sign In & Access Downloads"}
                    </Button>
                  </form>
                </TabsContent>
              </Tabs>
              
              <div className="mt-6 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                <p className="text-sm text-gray-700">
                  <strong>Important:</strong> Create your account using the same email address you provided during checkout to access your purchased content.
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        <Card className="border-2 border-green-200 bg-green-50">
          <CardContent className="p-6 text-center">
            <p className="text-gray-700 mb-2">
              Need help? Contact us at{" "}
              <a href="mailto:support@brightmindsacademy.com" className="text-purple-600 hover:underline font-medium">
                support@brightmindsacademy.com
              </a>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PurchaseSuccess;