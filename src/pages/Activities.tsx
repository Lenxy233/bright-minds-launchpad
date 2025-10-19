import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, Play, Edit, Trash2, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";

interface Activity {
  id: string;
  title: string;
  description: string;
  activity_type: string;
  difficulty: string;
  age_range: string;
  is_published: boolean;
  created_at: string;
}

export default function Activities() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadActivities();
  }, [user]);

  const loadActivities = async () => {
    try {
      const { data, error } = await supabase
        .from("activities")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setActivities(data || []);
    } catch (error) {
      console.error("Error loading activities:", error);
      toast.error("Failed to load activities");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this activity?")) return;

    try {
      const { error } = await supabase
        .from("activities")
        .delete()
        .eq("id", id);

      if (error) throw error;
      toast.success("Activity deleted");
      loadActivities();
    } catch (error) {
      console.error("Error deleting activity:", error);
      toast.error("Failed to delete activity");
    }
  };

  const getActivityTypeData = (type: string) => {
    const types: Record<string, { label: string; emoji: string; color: string }> = {
      "matching": { label: "Matching", emoji: "🔗", color: "from-blue-400 to-blue-600" },
      "drag-drop": { label: "Drag & Drop", emoji: "🎯", color: "from-purple-400 to-purple-600" },
      "quiz": { label: "Quiz", emoji: "❓", color: "from-green-400 to-green-600" },
      "tap-find": { label: "Tap to Find", emoji: "👆", color: "from-yellow-400 to-yellow-600" },
      "true-false": { label: "True/False", emoji: "✓✗", color: "from-pink-400 to-pink-600" },
      "fill-blanks": { label: "Fill Blanks", emoji: "📝", color: "from-orange-400 to-orange-600" }
    };
    return types[type] || { label: type, emoji: "🎮", color: "from-gray-400 to-gray-600" };
  };

  const getDifficultyData = (diff: string) => {
    const difficulties: Record<string, { emoji: string; color: string }> = {
      "easy": { emoji: "⭐", color: "bg-green-100 text-green-700" },
      "medium": { emoji: "⭐⭐", color: "bg-yellow-100 text-yellow-700" },
      "hard": { emoji: "⭐⭐⭐", color: "bg-red-100 text-red-700" }
    };
    return difficulties[diff] || { emoji: "⭐", color: "bg-gray-100 text-gray-700" };
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background to-muted flex items-center justify-center">
        <p>Loading activities...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <Button
            variant="ghost"
            onClick={() => navigate("/learning-app")}
            className="mb-4 text-lg"
          >
            <ArrowLeft className="mr-2 h-5 w-5" />
            🏠 Home
          </Button>
          <h1 className="text-5xl md:text-6xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 animate-fade-in">
            🎮 Fun Activities! 🎨
          </h1>
          <p className="text-2xl text-gray-700">
            Click any game to start playing! 🎯
          </p>
          {user && (
            <Button 
              onClick={() => navigate("/activity-builder")}
              className="mt-4 text-xl py-6 px-8 bg-gradient-to-r from-green-400 to-blue-500 hover:from-green-500 hover:to-blue-600"
            >
              <Plus className="mr-2 h-6 w-6" />
              ✨ Create New Activity
            </Button>
          )}
        </div>

        {activities.length === 0 ? (
          <Card className="border-4 border-dashed border-purple-300 bg-white/80">
            <CardContent className="p-12 text-center">
              <div className="text-8xl mb-4">🎨</div>
              <p className="text-2xl text-gray-700 mb-4">
                No games yet! Let's make one! 🚀
              </p>
              {user && (
                <Button 
                  onClick={() => navigate("/activity-builder")}
                  className="text-xl py-6 px-8 bg-gradient-to-r from-purple-400 to-pink-500"
                >
                  <Plus className="mr-2 h-6 w-6" />
                  ✨ Create Activity
                </Button>
              )}
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {activities.map((activity) => {
              const typeData = getActivityTypeData(activity.activity_type);
              const diffData = getDifficultyData(activity.difficulty);
              
              return (
                <Card 
                  key={activity.id} 
                  className="overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border-4 border-transparent hover:border-purple-300 bg-white/90 backdrop-blur-sm animate-fade-in"
                >
                  <div className={`h-3 bg-gradient-to-r ${typeData.color}`} />
                  <CardHeader className="pb-3">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="text-5xl">{typeData.emoji}</div>
                      <div className="flex-1">
                        <CardTitle className="text-2xl font-bold">{activity.title}</CardTitle>
                      </div>
                      {!activity.is_published && (
                        <Badge variant="outline" className="text-sm">📝 Draft</Badge>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex flex-wrap gap-2">
                      <Badge className={`text-lg px-3 py-1 ${diffData.color} border-0`}>
                        {diffData.emoji}
                      </Badge>
                      {activity.age_range && (
                        <Badge variant="outline" className="text-lg px-3 py-1">
                          👶 {activity.age_range}
                        </Badge>
                      )}
                    </div>

                    <Button
                      size="lg"
                      className={`w-full text-xl py-6 bg-gradient-to-r ${typeData.color} hover:scale-105 transition-transform shadow-lg`}
                      onClick={() => navigate(`/activity-player/${activity.id}`)}
                    >
                      <Play className="mr-2 h-6 w-6" />
                      ▶️ Play Now!
                    </Button>
                    
                    {/* Demo story mode button for first activity */}
                    {activities.indexOf(activity) === 0 && (
                      <Button
                        size="lg"
                        className="w-full text-xl py-6 bg-gradient-to-r from-purple-400 to-pink-500 hover:scale-105 transition-transform shadow-lg"
                        onClick={() => navigate(`/interactive-story/demo`)}
                      >
                        📚 Story Mode!
                      </Button>
                    )}
                    
                    {user && (
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => navigate(`/activity-builder/${activity.id}`)}
                          className="flex-1"
                        >
                          <Edit className="h-4 w-4 mr-1" />
                          Edit
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDelete(activity.id)}
                          className="flex-1"
                        >
                          <Trash2 className="h-4 w-4 mr-1" />
                          Delete
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}