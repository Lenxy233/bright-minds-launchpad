import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Award, TrendingUp, Trophy } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

interface KidProfile {
  id: string;
  username: string;
}

interface ProgressRecord {
  id: string;
  worksheet_id: string;
  completed_at: string;
  score: number;
  worksheets: {
    title: string;
    subject: string;
  };
}

interface BadgeRecord {
  id: string;
  badge_name: string;
  earned_at: string;
}

interface ProgressTabProps {
  parentId: string;
}

const ProgressTab = ({ parentId }: ProgressTabProps) => {
  const [kids, setKids] = useState<KidProfile[]>([]);
  const [selectedKid, setSelectedKid] = useState<string>('');
  const [progress, setProgress] = useState<ProgressRecord[]>([]);
  const [badges, setBadges] = useState<BadgeRecord[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    fetchKids();
  }, [parentId]);

  useEffect(() => {
    if (selectedKid) {
      fetchProgress(selectedKid);
      fetchBadges(selectedKid);
    }
  }, [selectedKid]);

  const fetchKids = async () => {
    const { data, error } = await supabase
      .from('kid_profiles' as any)
      .select('id, username')
      .eq('parent_id', parentId);

    if (error) {
      toast({
        title: 'Error',
        description: 'Failed to load kid profiles',
        variant: 'destructive',
      });
      return;
    }

    setKids(data as any || []);
    if (data && data.length > 0 && (data as any)[0]?.id) {
      setSelectedKid((data as any)[0].id);
    }
  };

  const fetchProgress = async (kidId: string) => {
    const { data, error } = await supabase
      .from('kid_progress' as any)
      .select(`
        *,
        worksheets (
          title,
          subject
        )
      `)
      .eq('kid_id', kidId)
      .order('completed_at', { ascending: false });

    if (error) {
      toast({
        title: 'Error',
        description: 'Failed to load progress',
        variant: 'destructive',
      });
      return;
    }

    setProgress(data as any || []);
  };

  const fetchBadges = async (kidId: string) => {
    const { data, error } = await supabase
      .from('badges' as any)
      .select('*')
      .eq('kid_id', kidId)
      .order('earned_at', { ascending: false });

    if (error) {
      toast({
        title: 'Error',
        description: 'Failed to load badges',
        variant: 'destructive',
      });
      return;
    }

    setBadges(data as any || []);
  };

  const calculateAverageScore = () => {
    if (progress.length === 0) return 0;
    const total = progress.reduce((sum, p) => sum + p.score, 0);
    return Math.round(total / progress.length);
  };

  const selectedKidName = kids.find(k => k.id === selectedKid)?.username || '';

  return (
    <div className="space-y-6">
      <Card className="bg-white/80">
        <CardHeader>
          <CardTitle>Progress & Badges</CardTitle>
          <CardDescription>Track your kid's learning journey</CardDescription>
        </CardHeader>
        <CardContent>
          {kids.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <Trophy className="mx-auto h-12 w-12 mb-4 opacity-50" />
              <p>No kid profiles found. Add a kid profile first!</p>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-medium">Select Kid</label>
                <Select value={selectedKid} onValueChange={setSelectedKid}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose a kid" />
                  </SelectTrigger>
                  <SelectContent>
                    {kids.map((kid) => (
                      <SelectItem key={kid.id} value={kid.id}>
                        {kid.username}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Stats Overview */}
              <div className="grid gap-4 md:grid-cols-3">
                <Card className="bg-gradient-to-br from-green-50 to-emerald-50">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-medium flex items-center gap-2">
                      <TrendingUp className="h-4 w-4 text-green-600" />
                      Worksheets Completed
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-3xl font-bold text-green-700">{progress.length}</p>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-blue-50 to-cyan-50">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-medium flex items-center gap-2">
                      <Trophy className="h-4 w-4 text-blue-600" />
                      Average Score
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-3xl font-bold text-blue-700">{calculateAverageScore()}%</p>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-yellow-50 to-orange-50">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-medium flex items-center gap-2">
                      <Award className="h-4 w-4 text-yellow-600" />
                      Badges Earned
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-3xl font-bold text-yellow-700">{badges.length}</p>
                  </CardContent>
                </Card>
              </div>

              {/* Badges */}
              <Card className="bg-gradient-to-br from-yellow-50 to-orange-50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Award className="h-5 w-5 text-yellow-600" />
                    Badges Earned
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {badges.length === 0 ? (
                    <p className="text-muted-foreground text-center py-8">
                      No badges earned yet. Keep learning!
                    </p>
                  ) : (
                    <div className="flex flex-wrap gap-3">
                      {badges.map((badge) => (
                        <Badge
                          key={badge.id}
                          variant="secondary"
                          className="px-4 py-2 text-sm bg-yellow-200 text-yellow-900"
                        >
                          🏆 {badge.badge_name}
                        </Badge>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Recent Progress */}
              <Card className="bg-gradient-to-br from-purple-50 to-pink-50">
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                </CardHeader>
                <CardContent>
                  {progress.length === 0 ? (
                    <p className="text-muted-foreground text-center py-8">
                      No completed worksheets yet.
                    </p>
                  ) : (
                    <div className="space-y-4">
                      {progress.slice(0, 5).map((item) => (
                        <div key={item.id} className="flex items-center justify-between p-3 bg-white rounded-lg">
                          <div className="flex-1">
                            <p className="font-medium">{item.worksheets.title}</p>
                            <p className="text-sm text-muted-foreground">
                              {new Date(item.completed_at).toLocaleDateString()}
                            </p>
                          </div>
                          <div className="flex items-center gap-3">
                            <Badge variant="secondary">{item.worksheets.subject}</Badge>
                            <div className="text-right min-w-[60px]">
                              <p className="text-lg font-bold text-green-600">{item.score}%</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ProgressTab;
