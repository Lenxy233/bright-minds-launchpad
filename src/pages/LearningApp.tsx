import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { GraduationCap, Users, BookOpen, Trophy, Star, ArrowLeft } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const LearningApp = () => {
  const [isKidLogin, setIsKidLogin] = useState(false);
  const [username, setUsername] = useState("");
  const [pin, setPin] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleKidLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Database query will work once types are regenerated
      const { data, error } = await supabase
        .from('kid_profiles' as any)
        .select('*')
        .eq('username', username)
        .eq('pin', pin)
        .maybeSingle();

      if (error || !data) {
        toast({
          title: "Login Failed",
          description: "Invalid username or PIN. Please try again.",
          variant: "destructive"
        });
      } else {
        toast({
          title: "Welcome back!",
          description: `Hi ${username}! Let's learn!`,
        });
        // Store the kid profile in session storage
        sessionStorage.setItem('kidProfile', JSON.stringify(data));
        // TODO: Navigate to kid dashboard when it's built
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleParentAccess = () => {
    navigate('/auth');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-purple-100 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center gap-2 text-purple-600 hover:text-purple-700">
              <ArrowLeft className="w-5 h-5" />
              <span className="font-semibold">Back to Main Site</span>
            </Link>
            <div className="flex items-center gap-2">
              <GraduationCap className="w-8 h-8 text-purple-600" />
              <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                Kids Learning Platform
              </h1>
            </div>
            <Button onClick={handleParentAccess} variant="outline">
              Parent/Teacher Login
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12">
        {!isKidLogin ? (
          <>
            {/* Hero Section */}
            <section className="text-center mb-16">
              <h2 className="text-5xl font-bold mb-6 bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent">
                Fun Learning for Bright Minds!
              </h2>
              <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
                A safe, colorful world where kids explore worksheets, earn badges, and learn at their own pace.
              </p>
              
              <div className="flex gap-4 justify-center">
                <Button 
                  size="lg" 
                  className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                  onClick={() => setIsKidLogin(true)}
                >
                  <Star className="w-5 h-5 mr-2" />
                  Kid Login
                </Button>
                <Button 
                  size="lg" 
                  variant="outline"
                  onClick={handleParentAccess}
                >
                  <Users className="w-5 h-5 mr-2" />
                  Parent/Teacher Access
                </Button>
              </div>
            </section>

            {/* Features Grid */}
            <section className="grid md:grid-cols-3 gap-8 mb-16">
              <Card className="border-2 border-purple-200 bg-white/90 backdrop-blur-sm hover:shadow-xl transition-shadow">
                <CardHeader>
                  <BookOpen className="w-12 h-12 text-purple-600 mb-4" />
                  <CardTitle>Explore & Learn</CardTitle>
                  <CardDescription>
                    Browse worksheets by grade, subject, and difficulty. Free exploration for curious minds!
                  </CardDescription>
                </CardHeader>
              </Card>

              <Card className="border-2 border-pink-200 bg-white/90 backdrop-blur-sm hover:shadow-xl transition-shadow">
                <CardHeader>
                  <Trophy className="w-12 h-12 text-pink-600 mb-4" />
                  <CardTitle>Earn Rewards</CardTitle>
                  <CardDescription>
                    Collect stars, unlock badges, and track your progress. Every worksheet is a new achievement!
                  </CardDescription>
                </CardHeader>
              </Card>

              <Card className="border-2 border-blue-200 bg-white/90 backdrop-blur-sm hover:shadow-xl transition-shadow">
                <CardHeader>
                  <Users className="w-12 h-12 text-blue-600 mb-4" />
                  <CardTitle>Parent Dashboard</CardTitle>
                  <CardDescription>
                    Parents and teachers can monitor progress, assign activities, and celebrate achievements.
                  </CardDescription>
                </CardHeader>
              </Card>
            </section>

            {/* CTA Section */}
            <section className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-3xl p-12 text-white text-center">
              <h3 className="text-4xl font-bold mb-4">Ready to Start Learning?</h3>
              <p className="text-xl mb-8 opacity-90">
                Join thousands of kids on their learning journey!
              </p>
              <Button 
                size="lg" 
                variant="secondary"
                className="bg-white text-purple-600 hover:bg-gray-100"
                onClick={() => setIsKidLogin(true)}
              >
                Get Started Now
              </Button>
            </section>
          </>
        ) : (
          /* Kid Login Form */
          <div className="max-w-md mx-auto">
            <Card className="border-2 border-purple-200 bg-white/90 backdrop-blur-sm">
              <CardHeader className="text-center">
                <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <Star className="w-10 h-10 text-white" />
                </div>
                <CardTitle className="text-3xl">Welcome Back!</CardTitle>
                <CardDescription>Enter your username and PIN to continue learning</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleKidLogin} className="space-y-4">
                  <div>
                    <Label htmlFor="username">Username</Label>
                    <Input
                      id="username"
                      type="text"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      placeholder="Your username"
                      required
                      className="text-lg"
                    />
                  </div>
                  <div>
                    <Label htmlFor="pin">PIN (4 digits)</Label>
                    <Input
                      id="pin"
                      type="password"
                      inputMode="numeric"
                      maxLength={4}
                      value={pin}
                      onChange={(e) => setPin(e.target.value)}
                      placeholder="••••"
                      required
                      className="text-lg text-center tracking-widest"
                    />
                  </div>
                  <Button 
                    type="submit" 
                    className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                    disabled={isLoading}
                  >
                    {isLoading ? "Logging in..." : "Start Learning!"}
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    className="w-full"
                    onClick={() => setIsKidLogin(false)}
                  >
                    Back
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        )}
      </main>
    </div>
  );
};

export default LearningApp;
