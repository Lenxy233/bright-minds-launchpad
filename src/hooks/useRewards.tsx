import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import confetti from "canvas-confetti";

interface AwardPointsResult {
  total_points: number;
  level: number;
  points_earned: number;
  badge_awarded: string | null;
}

export const useRewards = () => {
  const { toast } = useToast();

  const awardPoints = async (
    kidId: string,
    activityType: string,
    activityId: string,
    points: number = 10
  ): Promise<AwardPointsResult | null> => {
    try {
      const { data, error } = await supabase.rpc('award_points', {
        p_kid_id: kidId,
        p_activity_type: activityType,
        p_activity_id: activityId,
        p_points: points
      }) as { data: AwardPointsResult | null; error: any };

      if (error) throw error;
      if (!data) throw new Error('No data returned');

      const result = data;

      // Show success toast
      toast({
        title: `+${result.points_earned} Points! 🌟`,
        description: `Total: ${result.total_points} points (Level ${result.level})`,
      });

      // If badge was awarded, show special celebration
      if (result.badge_awarded) {
        confetti({
          particleCount: 150,
          spread: 100,
          origin: { y: 0.6 }
        });
        
        toast({
          title: `🏆 New Badge Unlocked!`,
          description: result.badge_awarded,
        });
      }

      return result;
    } catch (error) {
      console.error('Error awarding points:', error);
      toast({
        title: "Oops!",
        description: "Couldn't award points right now.",
        variant: "destructive"
      });
      return null;
    }
  };

  return { awardPoints };
};
