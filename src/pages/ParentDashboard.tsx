import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { LogOut, ArrowLeft } from 'lucide-react';
import KidProfilesTab from '@/components/parent-dashboard/KidProfilesTab';
import WorksheetsTab from '@/components/parent-dashboard/WorksheetsTab';
import ProgressTab from '@/components/parent-dashboard/ProgressTab';

const ParentDashboard = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [parentEmail, setParentEmail] = useState('');

  useEffect(() => {
    if (user?.email) {
      setParentEmail(user.email);
    }
  }, [user]);

  const handleSignOut = async () => {
    await signOut();
    navigate('/auth');
  };

  if (!user) {
    navigate('/auth');
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 via-purple-100 via-blue-100 to-green-100">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate('/learning-app')}
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-purple-900">Parent Dashboard</h1>
              <p className="text-purple-700">{parentEmail}</p>
            </div>
          </div>
          <Button onClick={handleSignOut} variant="outline">
            <LogOut className="mr-2 h-4 w-4" />
            Sign Out
          </Button>
        </div>

        {/* Dashboard Tabs */}
        <Tabs defaultValue="kids" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 bg-white/80">
            <TabsTrigger value="kids">Kid Profiles</TabsTrigger>
            <TabsTrigger value="worksheets">Worksheets</TabsTrigger>
            <TabsTrigger value="progress">Progress & Badges</TabsTrigger>
          </TabsList>

          <TabsContent value="kids">
            <KidProfilesTab parentId={user.id} />
          </TabsContent>

          <TabsContent value="worksheets">
            <WorksheetsTab parentId={user.id} />
          </TabsContent>

          <TabsContent value="progress">
            <ProgressTab parentId={user.id} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default ParentDashboard;
