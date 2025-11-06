import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Trophy, Star, Zap } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import confetti from "canvas-confetti";

interface RewardsDisplayProps {
  kidId: string;
}

interface KidPoints {
  total_points: number;
  level: number;
}

interface KidBadge {
  badge_name: string;
  badge_description: string;
  badge_icon: string;
}

const RewardsDisplay = ({ kidId }: RewardsDisplayProps) => {
  const [points, setPoints] = useState<KidPoints>({ total_points: 0, level: 1 });
  const [badges, setBadges] = useState<KidBadge[]>([]);

  useEffect(() => {
    fetchRewards();
    
    // Set up realtime subscription for new badges
    const subscription = supabase
      .channel('badge-updates')
      .on('postgres_changes', 
        { event: 'INSERT', schema: 'public', table: 'kid_badges', filter: `kid_id=eq.${kidId}` },
        (payload) => {
          const newBadge = payload.new as KidBadge;
          setBadges(prev => [...prev, newBadge]);
          confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 }
          });
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [kidId]);

  const fetchRewards = async () => {
    const [pointsRes, badgesRes] = await Promise.all([
      supabase.from('kid_points' as any).select('*').eq('kid_id', kidId).single(),
      supabase.from('kid_badges' as any).select('*').eq('kid_id', kidId)
    ]);

    if (pointsRes.data && !pointsRes.error) {
      setPoints(pointsRes.data as unknown as KidPoints);
    }
    if (badgesRes.data && !badgesRes.error) {
      setBadges(badgesRes.data as unknown as KidBadge[]);
    }
  };

  return (
    <Card className="border-2 border-yellow-200 bg-gradient-to-br from-yellow-50 to-orange-50">
      <CardContent className="p-4">
        <div className="flex items-center justify-between gap-4">
          {/* Points Display */}
          <div className="flex items-center gap-2">
            <div className="bg-yellow-400 rounded-full p-2">
              <Star className="w-5 h-5 text-white fill-white" />
            </div>
            <div>
              <div className="text-sm font-semibold text-gray-700">Points</div>
              <div className="text-2xl font-bold text-yellow-600">{points.total_points}</div>
            </div>
          </div>

          {/* Level Display */}
          <div className="flex items-center gap-2">
            <div className="bg-purple-400 rounded-full p-2">
              <Zap className="w-5 h-5 text-white fill-white" />
            </div>
            <div>
              <div className="text-sm font-semibold text-gray-700">Level</div>
              <div className="text-2xl font-bold text-purple-600">{points.level}</div>
            </div>
          </div>

          {/* Badges Display */}
          <div className="flex items-center gap-2">
            <div className="bg-pink-400 rounded-full p-2">
              <Trophy className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="text-sm font-semibold text-gray-700">Badges</div>
              <div className="flex gap-1 mt-1">
                {badges.slice(0, 3).map((badge, idx) => (
                  <Badge key={idx} variant="secondary" className="text-lg p-1">
                    {badge.badge_icon}
                  </Badge>
                ))}
                {badges.length > 3 && (
                  <Badge variant="secondary" className="text-xs">+{badges.length - 3}</Badge>
                )}
                {badges.length === 0 && (
                  <span className="text-sm text-gray-500">No badges yet</span>
                )}
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default RewardsDisplay;
