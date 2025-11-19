import { useEffect, useState } from "react";
import { CheckCircle2, Mail, Download, Sparkles, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import confetti from "canvas-confetti";

const PurchaseSuccess = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [emailSent, setEmailSent] = useState(false);

  useEffect(() => {
    // Trigger confetti animation
    const duration = 3 * 1000;
    const animationEnd = Date.now() + duration;

    const randomInRange = (min: number, max: number) => {
      return Math.random() * (max - min) + min;
    };

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

    // Simulate email being sent
    setTimeout(() => setEmailSent(true), 2000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 via-purple-100 via-blue-100 to-green-100 py-12 px-4">
      <div className="container mx-auto max-w-3xl">
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
            Thank you for your purchase! You now have access to all our amazing content.
          </p>
        </div>

        <Card className="mb-8 border-2 border-purple-200 shadow-xl">
          <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50">
            <CardTitle className="flex items-center gap-2 text-2xl">
              <Sparkles className="w-6 h-6 text-purple-600" />
              What Happens Next?
            </CardTitle>
            <CardDescription className="text-base">
              Follow these simple steps to get started
            </CardDescription>
          </CardHeader>
          
          <CardContent className="pt-6 space-y-6">
            <div className="flex gap-4 p-4 bg-blue-50 rounded-lg border-2 border-blue-200">
              <div className="flex-shrink-0">
                <div className="flex items-center justify-center w-10 h-10 rounded-full bg-blue-500 text-white font-bold">
                  1
                </div>
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-lg text-gray-900 mb-2 flex items-center gap-2">
                  <Mail className="w-5 h-5 text-blue-600" />
                  Check Your Email
                </h3>
                <p className="text-gray-700 mb-2">
                  {emailSent ? (
                    <span className="text-green-600 font-medium">✓ Confirmation email sent!</span>
                  ) : (
                    <span className="text-blue-600">Sending confirmation email...</span>
                  )}
                </p>
                <p className="text-gray-600 text-sm">
                  We've sent you an email with your purchase details and access instructions. 
                  <span className="font-medium"> Please check your spam folder</span> if you don't see it in your inbox.
                </p>
              </div>
            </div>

            <div className="flex gap-4 p-4 bg-purple-50 rounded-lg border-2 border-purple-200">
              <div className="flex-shrink-0">
                <div className="flex items-center justify-center w-10 h-10 rounded-full bg-purple-500 text-white font-bold">
                  2
                </div>
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-lg text-gray-900 mb-2 flex items-center gap-2">
                  <Download className="w-5 h-5 text-purple-600" />
                  Access Your Content
                </h3>
                {user ? (
                  <p className="text-gray-700">
                    You're already logged in! Head to your dashboard to access all your resources.
                  </p>
                ) : (
                  <p className="text-gray-700">
                    Create an account or log in with the email you used for purchase to access your content.
                  </p>
                )}
              </div>
            </div>

            <div className="flex gap-4 p-4 bg-green-50 rounded-lg border-2 border-green-200">
              <div className="flex-shrink-0">
                <div className="flex items-center justify-center w-10 h-10 rounded-full bg-green-500 text-white font-bold">
                  3
                </div>
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-lg text-gray-900 mb-2 flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-green-600" />
                  Start Learning
                </h3>
                <p className="text-gray-700">
                  Explore worksheets, activities, AI tools, and so much more. Everything is now unlocked for you!
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          {user ? (
            <Button
              onClick={() => navigate("/dashboard")}
              size="lg"
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold text-lg px-8 py-6"
            >
              Go to Dashboard
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          ) : (
            <>
              <Button
                onClick={() => navigate("/auth")}
                size="lg"
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold text-lg px-8 py-6"
              >
                Create Account / Login
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
              <Button
                onClick={() => navigate("/")}
                size="lg"
                variant="outline"
                className="border-2 border-purple-600 text-purple-600 hover:bg-purple-50 font-bold text-lg px-8 py-6"
              >
                Back to Home
              </Button>
            </>
          )}
        </div>

        <div className="mt-8 text-center">
          <p className="text-gray-600 mb-2">Need help?</p>
          <p className="text-sm text-gray-500">
            Contact us at{" "}
            <a href="mailto:support@brightmindsacademy.com" className="text-purple-600 hover:underline font-medium">
              support@brightmindsacademy.com
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default PurchaseSuccess;
