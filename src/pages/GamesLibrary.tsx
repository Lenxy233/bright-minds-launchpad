import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { ArrowLeft, Plus, Gamepad2, Trash2, Play } from "lucide-react";

interface Game {
  id: string;
  title: string;
  description: string;
  game_type: string;
  difficulty: string;
  age_range: string;
  created_at: string;
  user_id: string;
}

const GamesLibrary = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [gameToDelete, setGameToDelete] = useState<Game | null>(null);

  useEffect(() => {
    if (user) {
      fetchGames();
    }
  }, [user]);

  const fetchGames = async () => {
    try {
      const { data, error } = await supabase
        .from("ai_generated_games")
        .select("*")
        .eq("user_id", user?.id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setGames(data || []);
    } catch (error) {
      console.error("Error fetching games:", error);
      toast({
        title: "Error",
        description: "Failed to load your games",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClick = (e: React.MouseEvent, game: Game) => {
    e.stopPropagation();
    setGameToDelete(game);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!gameToDelete) return;

    try {
      const { error } = await supabase
        .from("ai_generated_games")
        .delete()
        .eq("id", gameToDelete.id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Game deleted successfully",
      });

      fetchGames();
    } catch (error) {
      console.error("Error deleting game:", error);
      toast({
        title: "Error",
        description: "Failed to delete game",
        variant: "destructive",
      });
    } finally {
      setDeleteDialogOpen(false);
      setGameToDelete(null);
    }
  };

  const getGameTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      matching: "Matching Game",
      quiz: "Quiz",
      memory: "Memory Cards",
      sorting: "Sorting Game",
      sequence: "Sequence Game",
    };
    return labels[type] || type;
  };

  const getGameTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      matching: "bg-blue-100 text-blue-700",
      quiz: "bg-green-100 text-green-700",
      memory: "bg-purple-100 text-purple-700",
      sorting: "bg-orange-100 text-orange-700",
      sequence: "bg-pink-100 text-pink-700",
    };
    return colors[type] || "bg-gray-100 text-gray-700";
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 flex items-center justify-center">
        <Card>
          <CardHeader>
            <CardTitle>Sign In Required</CardTitle>
            <CardDescription>Please sign in to view your games</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => navigate("/auth")}>Sign In</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
      <header className="bg-white/80 backdrop-blur-sm border-b border-purple-100 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              onClick={() => navigate("/learning-app")}
              className="gap-2"
            >
              <ArrowLeft className="w-5 h-5" />
              Back
            </Button>
            <div className="flex items-center gap-2">
              <Gamepad2 className="w-6 h-6 text-purple-600" />
              <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                My Games Library
              </h1>
            </div>
            <Button onClick={() => navigate("/game-creator")} className="gap-2">
              <Plus className="w-4 h-4" />
              Create New
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto">
          {loading ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">Loading your games...</p>
            </div>
          ) : games.length === 0 ? (
            <div className="text-center py-12">
              <Gamepad2 className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
              <h2 className="text-2xl font-bold mb-2">No Games Yet</h2>
              <p className="text-muted-foreground mb-6">
                Create your first learning game with AI!
              </p>
              <Button
                onClick={() => navigate("/game-creator")}
                size="lg"
                className="gap-2"
              >
                <Plus className="w-5 h-5" />
                Create Your First Game
              </Button>
            </div>
          ) : (
            <>
              <div className="mb-6">
                <h2 className="text-2xl font-bold mb-2">Your Games ({games.length})</h2>
                <p className="text-muted-foreground">
                  Click on any game to play it or manage your collection
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {games.map((game) => (
                  <Card
                    key={game.id}
                    className="cursor-pointer hover:shadow-lg transition-all hover:-translate-y-1 relative border-2 border-purple-200"
                    onClick={() => navigate(`/games/${game.id}`)}
                  >
                    <Button
                      variant="destructive"
                      size="icon"
                      className="absolute top-2 right-2 z-10 h-8 w-8"
                      onClick={(e) => handleDeleteClick(e, game)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>

                    <CardHeader>
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <CardTitle className="line-clamp-2 flex-1">{game.title}</CardTitle>
                      </div>
                      <div className="flex gap-2 flex-wrap">
                        <Badge className={getGameTypeColor(game.game_type)}>
                          {getGameTypeLabel(game.game_type)}
                        </Badge>
                        <Badge variant="outline">{game.difficulty}</Badge>
                        <Badge variant="outline">{game.age_range}</Badge>
                      </div>
                      {game.description && (
                        <CardDescription className="line-clamp-2 mt-2">
                          {game.description}
                        </CardDescription>
                      )}
                    </CardHeader>

                    <CardContent>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-muted-foreground">
                          Created {new Date(game.created_at).toLocaleDateString()}
                        </span>
                        <Button size="sm" className="gap-2">
                          <Play className="w-4 h-4" />
                          Play
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </>
          )}
        </div>
      </main>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Game</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{gameToDelete?.title}"? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default GamesLibrary;
