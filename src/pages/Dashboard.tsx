
import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Navigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import ProfileCard from "@/components/dashboard/ProfileCard";
import PurchasesCard from "@/components/dashboard/PurchasesCard";
import QuickActionsCard from "@/components/dashboard/QuickActionsCard";

interface Purchase {
  id: string;
  bundle_type: string;
  amount: number;
  status: string;
  purchased_at: string;
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
        .select('*')
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

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <ProfileCard 
            firstName={profile?.first_name}
            lastName={profile?.last_name}
            email={profile?.email || ''}
            memberSince={new Date(user.created_at).toLocaleDateString()}
          />

          <PurchasesCard purchases={purchases} />
        </div>

        <QuickActionsCard />
      </div>
    </div>
  );
};

export default Dashboard;
