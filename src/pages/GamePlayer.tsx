import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { ArrowLeft, Trophy, RefreshCw } from "lucide-react";

interface Game {
  id: string;
  title: string;
  description: string;
  game_type: string;
  difficulty: string;
  age_range: string;
  game_data: {
    sequences?: Array<{
      title: string;
      items: Array<{
        order: number;
        content: string;
        image_prompt: string;
      }>;
    }>;
  };
}

const GamePlayer = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [game, setGame] = useState<Game | null>(null);
  const [loading, setLoading] = useState(true);
  const [score, setScore] = useState(0);
  const [currentSequenceIndex, setCurrentSequenceIndex] = useState(0);
  const [shuffledItems, setShuffledItems] = useState<any[]>([]);
  const [userOrder, setUserOrder] = useState<any[]>([]);

  useEffect(() => {
    if (id) {
      fetchGame();
    }
  }, [id]);

  const fetchGame = async () => {
    try {
      const { data, error } = await supabase
        .from("ai_generated_games")
        .select("*")
        .eq("id", id)
        .single();

      if (error) throw error;
      
      setGame(data as Game);
      
      // Initialize game based on type
      const gameData = data.game_data as any;
      if (data.game_type === "sequence" && gameData.sequences) {
        initializeSequenceGame(gameData.sequences[0]);
      }
    } catch (error) {
      console.error("Error fetching game:", error);
      toast({
        title: "Error",
        description: "Failed to load game",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const initializeSequenceGame = (sequence: any) => {
    const items = [...sequence.items];
    const shuffled = items.sort(() => Math.random() - 0.5);
    setShuffledItems(shuffled);
    setUserOrder([]);
  };

  const handleItemClick = (item: any) => {
    if (userOrder.find((i) => i.order === item.order)) {
      // Already selected, remove it
      setUserOrder(userOrder.filter((i) => i.order !== item.order));
    } else {
      // Add to selection
      setUserOrder([...userOrder, item]);
    }
  };

  const checkSequenceAnswer = () => {
    if (!game?.game_data.sequences) return;
    
    const currentSequence = game.game_data.sequences[currentSequenceIndex];
    
    if (userOrder.length !== currentSequence.items.length) {
      toast({
        title: "Not Complete",
        description: "Please select all items in order",
        variant: "destructive",
      });
      return;
    }

    const isCorrect = userOrder.every((item, index) => item.order === index + 1);

    if (isCorrect) {
      const newScore = score + 10;
      setScore(newScore);
      
      toast({
        title: "Correct! 🎉",
        description: "Great job! Moving to next sequence...",
      });

      // Move to next sequence
      setTimeout(() => {
        const nextIndex = currentSequenceIndex + 1;
        if (game.game_data.sequences && nextIndex < game.game_data.sequences.length) {
          setCurrentSequenceIndex(nextIndex);
          initializeSequenceGame(game.game_data.sequences[nextIndex]);
        } else {
          toast({
            title: "Game Complete! 🏆",
            description: `Final Score: ${newScore}`,
          });
        }
      }, 1500);
    } else {
      toast({
        title: "Try Again",
        description: "The order isn't quite right. Try again!",
        variant: "destructive",
      });
      setUserOrder([]);
    }
  };

  const resetGame = () => {
    setScore(0);
    setCurrentSequenceIndex(0);
    if (game?.game_data.sequences) {
      initializeSequenceGame(game.game_data.sequences[0]);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 flex items-center justify-center">
        <p className="text-muted-foreground">Loading game...</p>
      </div>
    );
  }

  if (!game) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 flex items-center justify-center">
        <Card>
          <CardHeader>
            <CardTitle>Game Not Found</CardTitle>
            <CardDescription>This game doesn't exist or has been removed.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => navigate("/game-creator")}>Create New Game</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const currentSequence = game.game_data.sequences?.[currentSequenceIndex];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
      <header className="bg-white/80 backdrop-blur-sm border-b border-purple-100 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              onClick={() => navigate("/game-creator")}
              className="gap-2"
            >
              <ArrowLeft className="w-5 h-5" />
              Back
            </Button>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 bg-yellow-100 px-4 py-2 rounded-full">
                <Trophy className="w-5 h-5 text-yellow-600" />
                <span className="font-bold text-yellow-600">Score: {score}</span>
              </div>
              <Button onClick={resetGame} variant="outline" size="sm" className="gap-2">
                <RefreshCw className="w-4 h-4" />
                Reset
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <Card className="border-2 border-purple-200 mb-6">
            <CardHeader>
              <CardTitle className="text-3xl bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                {game.title}
              </CardTitle>
              <CardDescription className="text-lg">
                {game.description || `${game.game_type} game - ${game.difficulty} difficulty`}
              </CardDescription>
            </CardHeader>
          </Card>

          {game.game_type === "sequence" && currentSequence && (
            <>
              <Card className="border-2 border-blue-200 mb-6">
                <CardHeader>
                  <CardTitle className="text-xl">
                    {currentSequence.title}
                  </CardTitle>
                  <CardDescription>
                    Sequence {currentSequenceIndex + 1} of {game.game_data.sequences.length} - 
                    Click the items in the correct order!
                  </CardDescription>
                </CardHeader>
              </Card>

              {/* Selected Order Display */}
              {userOrder.length > 0 && (
                <Card className="mb-6 bg-green-50 border-green-200">
                  <CardHeader>
                    <CardTitle className="text-lg">Your Order:</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {userOrder.map((item, index) => (
                        <div
                          key={item.order}
                          className="bg-green-100 border-2 border-green-300 rounded-lg px-4 py-2 font-semibold"
                        >
                          {index + 1}. {item.content}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Shuffled Items */}
              <div className="grid gap-4 md:grid-cols-2 mb-6">
                {shuffledItems.map((item) => {
                  const isSelected = userOrder.find((i) => i.order === item.order);
                  return (
                    <Card
                      key={item.order}
                      className={`cursor-pointer transition-all hover:shadow-lg ${
                        isSelected
                          ? "bg-green-100 border-green-400 border-2"
                          : "hover:border-purple-300"
                      }`}
                      onClick={() => handleItemClick(item)}
                    >
                      <CardContent className="p-6">
                        <p className="text-lg">{item.content}</p>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>

              <Button
                onClick={checkSequenceAnswer}
                size="lg"
                className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                disabled={userOrder.length === 0}
              >
                Check Answer
              </Button>
            </>
          )}
        </div>
      </main>
    </div>
  );
};

export default GamePlayer;
