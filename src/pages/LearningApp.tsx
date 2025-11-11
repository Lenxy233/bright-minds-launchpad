import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { GraduationCap, Users, BookOpen, Trophy, Star, ArrowLeft, Puzzle, Gamepad2, Sparkles, MessageCircle, PlaySquare, Settings } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import KindergartenCurriculumSection from "@/components/KindergartenCurriculumSection";
import RewardsDisplay from "@/components/RewardsDisplay";
import AITutorChat from "@/components/AITutorChat";
import { useAuth } from "@/contexts/AuthContext";

const LearningApp = () => {
  const [isKidLogin, setIsKidLogin] = useState(false);
  const [username, setUsername] = useState("");
  const [pin, setPin] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [kidProfile, setKidProfile] = useState<any>(null);
  const [showAITutor, setShowAITutor] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  const { user } = useAuth();

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
        // Store the kid profile in session and state
        sessionStorage.setItem('kidProfile', JSON.stringify(data));
        setKidProfile(data);
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

  const fetchParentAccess = () => {
    // If already logged in, go to parent dashboard, otherwise to auth
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
            <div className="flex items-center gap-2">
              {user && (
                <Button onClick={() => navigate('/curriculum-lesson-admin')} variant="outline" size="sm">
                  <Settings className="w-4 h-4 mr-2" />
                  Manage Lessons
                </Button>
              )}
              <Button onClick={fetchParentAccess} variant="outline">
                Parent/Teacher Login
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12">
        {kidProfile && (
          <div className="mb-8 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-3xl font-bold">Welcome back, {kidProfile.username}! 🎉</h2>
              <Button 
                variant="outline" 
                onClick={() => {
                  setKidProfile(null);
                  setIsKidLogin(false);
                  sessionStorage.removeItem('kidProfile');
                }}
              >
                Logout
              </Button>
            </div>
            <RewardsDisplay kidId={kidProfile.id} />
          </div>
        )}
        
        {!isKidLogin && !kidProfile ? (
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
                  onClick={fetchParentAccess}
                >
                  <Users className="w-5 h-5 mr-2" />
                  Parent/Teacher Access
                </Button>
              </div>
            </section>

            {/* Features Grid */}
            <section className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
              <Card 
                className="border-2 border-purple-200 bg-white/90 backdrop-blur-sm hover:shadow-xl transition-shadow cursor-pointer"
                onClick={() => navigate('/story-books')}
              >
                <CardHeader>
                  <BookOpen className="w-12 h-12 text-purple-600 mb-4" />
                  <CardTitle>Story Books</CardTitle>
                  <CardDescription>
                    Read along with audio narration. Interactive stories that come alive!
                  </CardDescription>
                </CardHeader>
              </Card>

              <Card 
                className="border-2 border-pink-200 bg-white/90 backdrop-blur-sm hover:shadow-xl transition-shadow cursor-pointer"
                onClick={() => navigate('/ai-story-creator')}
              >
                <CardHeader>
                  <Sparkles className="w-12 h-12 text-pink-600 mb-4" />
                  <CardTitle>AI Story Creator</CardTitle>
                  <CardDescription>
                    Create your own custom stories with AI! Pick themes, lessons, and watch magic happen.
                  </CardDescription>
                </CardHeader>
              </Card>

              <Card 
                className="border-2 border-green-200 bg-white/90 backdrop-blur-sm hover:shadow-xl transition-shadow cursor-pointer"
                onClick={() => navigate('/puzzle')}
              >
                <CardHeader>
                  <Puzzle className="w-12 h-12 text-green-600 mb-4" />
                  <CardTitle>Puzzles</CardTitle>
                  <CardDescription>
                    Count, match, and solve fun puzzles. Learn while playing!
                  </CardDescription>
                </CardHeader>
              </Card>

              <Card 
                className="border-2 border-orange-200 bg-white/90 backdrop-blur-sm hover:shadow-xl transition-shadow cursor-pointer"
                onClick={() => navigate('/games-library')}
              >
                <CardHeader>
                  <Gamepad2 className="w-12 h-12 text-orange-600 mb-4" />
                  <CardTitle>Games Library</CardTitle>
                  <CardDescription>
                    Play fun learning games! Quiz games, matching activities, and more.
                  </CardDescription>
                </CardHeader>
              </Card>

              <Card 
                className="border-2 border-amber-200 bg-white/90 backdrop-blur-sm hover:shadow-xl transition-shadow cursor-pointer"
                onClick={() => navigate('/game-creator')}
              >
                <CardHeader>
                  <Sparkles className="w-12 h-12 text-amber-600 mb-4" />
                  <CardTitle>Create AI Game</CardTitle>
                  <CardDescription>
                    Build custom learning games with AI. Make your own educational activities!
                  </CardDescription>
                </CardHeader>
              </Card>

              <Card 
                className="border-2 border-blue-200 bg-white/90 backdrop-blur-sm hover:shadow-xl transition-shadow cursor-pointer"
                onClick={() => setShowAITutor(true)}
              >
                <CardHeader>
                  <MessageCircle className="w-12 h-12 text-blue-600 mb-4" />
                  <CardTitle>AI Tutor</CardTitle>
                  <CardDescription>
                    Ask questions and get help with any topic! Your friendly learning assistant.
                  </CardDescription>
                </CardHeader>
              </Card>

              <Card 
                className="border-2 border-red-200 bg-white/90 backdrop-blur-sm hover:shadow-xl transition-shadow cursor-pointer"
                onClick={() => navigate('/video-learning')}
              >
                <CardHeader>
                  <PlaySquare className="w-12 h-12 text-red-600 mb-4" />
                  <CardTitle>Video Learning</CardTitle>
                  <CardDescription>
                    Watch educational videos and take quizzes! Learn by watching and testing your knowledge.
                  </CardDescription>
                </CardHeader>
              </Card>

              <Card className="border-2 border-yellow-200 bg-white/90 backdrop-blur-sm hover:shadow-xl transition-shadow">
                <CardHeader>
                  <Trophy className="w-12 h-12 text-yellow-600 mb-4" />
                  <CardTitle>Earn Rewards</CardTitle>
                  <CardDescription>
                    Collect stars, unlock badges, and track your progress. Every activity is a new achievement!
                  </CardDescription>
                </CardHeader>
              </Card>
            </section>

            {/* Kindergarten Curriculum Section */}
            <KindergartenCurriculumSection />

            {/* CTA Section */}
            <section className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-3xl p-12 text-white text-center mt-16">
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

      {/* AI Tutor Overlay */}
      {showAITutor && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-2xl h-[600px] bg-white rounded-lg shadow-2xl">
            <AITutorChat onClose={() => setShowAITutor(false)} />
          </div>
        </div>
      )}
    </div>
  );
};

export default LearningApp;
