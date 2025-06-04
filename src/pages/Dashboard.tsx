
import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Navigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Package, User, LogOut } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import FileDownloadList from "@/components/FileDownloadList";

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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-500';
      case 'pending':
        return 'bg-yellow-500';
      case 'failed':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
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
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Welcome, {profile?.first_name || 'Member'}!
            </h1>
            <p className="text-gray-600 mt-2">Your Bright Minds Academy Dashboard</p>
          </div>
          <Button onClick={signOut} variant="outline" className="flex items-center gap-2">
            <LogOut className="w-4 h-4" />
            Sign Out
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Profile Card */}
          <Card className="bg-white/90 backdrop-blur-sm shadow-xl border-2 border-purple-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="w-5 h-5" />
                Profile
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p><strong>Name:</strong> {profile?.first_name} {profile?.last_name}</p>
                <p><strong>Email:</strong> {profile?.email}</p>
                <p><strong>Member since:</strong> {new Date(user.created_at).toLocaleDateString()}</p>
              </div>
            </CardContent>
          </Card>

          {/* Purchases Overview */}
          <Card className="bg-white/90 backdrop-blur-sm shadow-xl border-2 border-purple-200 lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="w-5 h-5" />
                Your Purchases
              </CardTitle>
              <CardDescription>
                {purchases.length === 0 ? "No purchases yet" : `${purchases.length} purchase(s)`}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {purchases.length === 0 ? (
                <div className="text-center py-8">
                  <Package className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                  <p className="text-gray-600">No purchases found</p>
                  <p className="text-sm text-gray-500 mt-2">
                    Visit our <a href="/" className="text-purple-600 hover:underline">homepage</a> to explore our bundles
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {purchases.map((purchase) => (
                    <div key={purchase.id} className="border rounded-lg p-4 bg-white">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-semibold">{getBundleName(purchase.bundle_type)}</h3>
                        <Badge className={getStatusColor(purchase.status)}>
                          {purchase.status}
                        </Badge>
                      </div>
                      <div className="text-sm text-gray-600 space-y-1">
                        <p>Amount: ${(purchase.amount / 100).toFixed(2)}</p>
                        <p>Purchased: {new Date(purchase.purchased_at).toLocaleDateString()}</p>
                      </div>
                      <FileDownloadList 
                        bundleType={purchase.bundle_type} 
                        purchaseStatus={purchase.status}
                      />
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card className="mt-6 bg-white/90 backdrop-blur-sm shadow-xl border-2 border-purple-200">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-4">
              <Button asChild className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600">
                <a href="/">Browse More Bundles</a>
              </Button>
              <Button asChild variant="outline">
                <a href="/new-product-launch">New Products</a>
              </Button>
            </div>
          </CardContent>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
