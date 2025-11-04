import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Navigate, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import ProfileCard from "@/components/dashboard/ProfileCard";
import PurchasesCard from "@/components/dashboard/PurchasesCard";
import QuickActionsCard from "@/components/dashboard/QuickActionsCard";
import FileManagementCard from "@/components/dashboard/FileManagementCard";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BookOpen, Puzzle, GraduationCap, Users, Gamepad2 } from "lucide-react";

interface Purchase {
  id: string;
  bundle_type: string;
  amount: number;
  status: string;
  purchased_at: string;
  includes_ai_prompts?: boolean;
}

interface Profile {
  first_name: string | null;
  last_name: string | null;
  email: string;
}

const Dashboard = () => {
  const { user, signOut, loading } = useAuth();
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loadingData, setLoadingData] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    if (user) {
      fetchUserData();
    }
  }, [user]);

  const fetchUserData = async () => {
    try {
      // Fetch purchases
      const { data: purchasesData, error: purchasesError } = await supabase
        .from('user_purchases')
        .select('*, includes_ai_prompts')
        .eq('user_id', user?.id)
        .order('purchased_at', { ascending: false });

      if (purchasesError) throw purchasesError;

      // Fetch profile
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user?.id)
        .single();

      if (profileError) throw profileError;

      setPurchases(purchasesData || []);
      setProfile(profileData);
    } catch (error) {
      console.error('Error fetching user data:', error);
      toast({
        title: "Error",
        description: "Failed to load your data. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoadingData(false);
    }
  };

  if (loading || loadingData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-100 via-purple-100 via-blue-100 to-green-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-600 mx-auto"></div>
          <p className="mt-4 text-lg text-purple-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 via-purple-100 via-blue-100 to-green-100 py-8 px-4">
      <div className="container mx-auto max-w-6xl">
        <DashboardHeader 
          firstName={profile?.first_name} 
          onSignOut={signOut} 
        />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          <ProfileCard 
            firstName={profile?.first_name}
            lastName={profile?.last_name}
            email={profile?.email || ''}
            memberSince={new Date(user.created_at).toLocaleDateString()}
          />

          <PurchasesCard purchases={purchases} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <QuickActionsCard />
          <FileManagementCard />
        </div>

        {/* AI Content Creator Section */}
        <Card className="border-2 border-purple-200 bg-gradient-to-br from-purple-50 to-pink-50">
          <CardHeader>
            <CardTitle className="text-2xl bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              🤖 AI Content Creator (NEW!)
            </CardTitle>
            <CardDescription>
              Create custom educational content with AI - stories, games, quizzes, and live tutoring
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Link to="/ai-story-creator">
                <Button className="w-full h-24 flex-col gap-2 bg-white hover:bg-purple-50 text-purple-600 border-2 border-purple-200">
                  <BookOpen className="w-8 h-8" />
                  <span className="font-semibold">Story Creator</span>
                  <span className="text-xs text-gray-500">AI + Images</span>
                </Button>
              </Link>
              <Link to="/game-creator">
                <Button className="w-full h-24 flex-col gap-2 bg-white hover:bg-orange-50 text-orange-600 border-2 border-orange-200">
                  <Gamepad2 className="w-8 h-8" />
                  <span className="font-semibold">Game Builder</span>
                  <span className="text-xs text-gray-500">NEW!</span>
                </Button>
              </Link>
              <Button className="w-full h-24 flex-col gap-2 bg-white hover:bg-blue-50 text-blue-600 border-2 border-blue-200" disabled>
                <GraduationCap className="w-8 h-8" />
                <span className="font-semibold">Quiz Maker</span>
                <span className="text-xs text-gray-500">Coming Soon</span>
              </Button>
              <Button className="w-full h-24 flex-col gap-2 bg-white hover:bg-green-50 text-green-600 border-2 border-green-200" disabled>
                <Users className="w-8 h-8" />
                <span className="font-semibold">AI Tutor</span>
                <span className="text-xs text-gray-500">Coming Soon</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
