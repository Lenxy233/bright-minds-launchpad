import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { ArrowLeft, Trophy, RefreshCw, Sparkles } from "lucide-react";

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
    pairs?: Array<{
      left: string;
      right: string;
      left_image_prompt?: string;
      right_image_prompt?: string;
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
  const [draggedItem, setDraggedItem] = useState<any>(null);
  const [dropZoneHighlight, setDropZoneHighlight] = useState(false);
  
  // Matching game state
  const [selectedLeft, setSelectedLeft] = useState<number | null>(null);
  const [selectedRight, setSelectedRight] = useState<number | null>(null);
  const [matchedPairs, setMatchedPairs] = useState<number[]>([]);
  const [matchingPairs, setMatchingPairs] = useState<any[]>([]);
  const [shuffledRightItems, setShuffledRightItems] = useState<any[]>([]);

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
      } else if (data.game_type === "matching" && (gameData.pairs || gameData.items)) {
        const pairsToUse = gameData.pairs || gameData.items;
        initializeMatchingGame(pairsToUse);
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

  const initializeMatchingGame = (pairs: any[]) => {
    setMatchingPairs(pairs);
    const rightItems = pairs.map((pair, index) => ({ ...pair, index }));
    const shuffled = [...rightItems].sort(() => Math.random() - 0.5);
    setShuffledRightItems(shuffled);
    setMatchedPairs([]);
    setSelectedLeft(null);
    setSelectedRight(null);
  };

  const handleMatchingClick = (side: 'left' | 'right', index: number) => {
    if (matchedPairs.includes(index)) return;

    if (side === 'left') {
      setSelectedLeft(index);
      if (selectedRight !== null) {
        checkMatch(index, selectedRight);
      }
    } else {
      setSelectedRight(index);
      if (selectedLeft !== null) {
        checkMatch(selectedLeft, index);
      }
    }
  };

  const checkMatch = (leftIndex: number, rightIndex: number) => {
    if (matchingPairs.length === 0) return;

    const rightItem = shuffledRightItems.find(item => item.index === rightIndex);
    
    if (rightItem && leftIndex === rightItem.index) {
      setMatchedPairs([...matchedPairs, leftIndex, rightIndex]);
      setScore(score + 10);
      toast({
        title: "Match! 🎉",
        description: "Great job!",
      });

      if (matchedPairs.length + 2 === matchingPairs.length * 2) {
        setTimeout(() => {
          toast({
            title: "Game Complete! 🏆",
            description: `Final Score: ${score + 10}`,
          });
        }, 500);
      }
    } else {
      toast({
        title: "Try Again",
        description: "That's not a match!",
        variant: "destructive",
      });
    }

    setSelectedLeft(null);
    setSelectedRight(null);
  };

  const handleDragStart = (e: React.DragEvent, item: any) => {
    setDraggedItem(item);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDropZoneHighlight(true);
  };

  const handleDragLeave = () => {
    setDropZoneHighlight(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDropZoneHighlight(false);
    
    if (draggedItem && !userOrder.find((i) => i.order === draggedItem.order)) {
      setUserOrder([...userOrder, draggedItem]);
      setDraggedItem(null);
    }
  };

  const handleRemoveFromSequence = (item: any) => {
    setUserOrder(userOrder.filter((i) => i.order !== item.order));
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
    } else if (matchingPairs.length) {
      initializeMatchingGame(matchingPairs);
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
              <Card className="border-2 border-blue-200 mb-6 bg-gradient-to-r from-blue-50 to-purple-50">
                <CardHeader>
                  <CardTitle className="text-2xl flex items-center gap-2">
                    <Sparkles className="w-6 h-6 text-purple-600" />
                    {currentSequence.title}
                  </CardTitle>
                  <CardDescription className="text-base">
                    Sequence {currentSequenceIndex + 1} of {game.game_data.sequences.length} - 
                    Drag the bricks to arrange them in order!
                  </CardDescription>
                </CardHeader>
              </Card>

              {/* Drop Zone */}
              <Card 
                className={`mb-6 min-h-[120px] transition-all ${
                  dropZoneHighlight 
                    ? "bg-yellow-50 border-yellow-400 border-4 border-dashed" 
                    : "bg-gradient-to-r from-green-50 to-blue-50 border-green-200 border-2"
                }`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
              >
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    🎯 Arrange Your Sequence Here
                  </CardTitle>
                  <CardDescription>
                    {userOrder.length === 0 
                      ? "Drag bricks here to build your sequence" 
                      : `${userOrder.length} of ${currentSequence.items.length} bricks placed`}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-3 min-h-[60px]">
                    {userOrder.map((item, index) => (
                      <div
                        key={item.order}
                        className="relative group animate-scale-in"
                        onClick={() => handleRemoveFromSequence(item)}
                      >
                        <div className="bg-gradient-to-br from-orange-400 to-red-500 text-white rounded-lg px-6 py-8 shadow-lg hover:shadow-xl transition-all cursor-pointer hover:scale-105 border-4 border-orange-600">
                          <div className="text-center">
                            <div className="text-4xl font-bold mb-1">{item.order}</div>
                            <div className="text-xs opacity-90">Position {index + 1}</div>
                          </div>
                        </div>
                        <div className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-xs font-bold">
                          ✕
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Available Bricks */}
              <Card className="mb-6 border-2 border-purple-200">
                <CardHeader>
                  <CardTitle className="text-lg">🧱 Available Bricks</CardTitle>
                  <CardDescription>
                    Drag these numbered bricks to the sequence area above
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-3 sm:grid-cols-5 gap-4">
                    {shuffledItems.map((item) => {
                      const isPlaced = userOrder.find((i) => i.order === item.order);
                      return (
                        <div
                          key={item.order}
                          draggable={!isPlaced}
                          onDragStart={(e) => handleDragStart(e, item)}
                          className={`
                            transition-all duration-300 cursor-move
                            ${isPlaced 
                              ? "opacity-30 cursor-not-allowed" 
                              : "hover:scale-110 animate-fade-in hover-scale"
                            }
                          `}
                        >
                          <div className={`
                            rounded-lg px-4 py-6 shadow-lg text-center
                            ${isPlaced
                              ? "bg-gray-300 border-4 border-gray-400"
                              : "bg-gradient-to-br from-blue-400 to-purple-500 border-4 border-blue-600 hover:shadow-2xl"
                            }
                          `}>
                            <div className="text-white">
                              <div className="text-3xl font-bold mb-1">{item.order}</div>
                              <div className="text-xs opacity-80 truncate">
                                {isPlaced ? "Placed" : "Drag me"}
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>

              <Button
                onClick={checkSequenceAnswer}
                size="lg"
                className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-xl py-6 animate-pulse"
                disabled={userOrder.length === 0}
              >
                ✓ Check My Answer!
              </Button>
            </>
          )}

          {game.game_type === "matching" && matchingPairs.length > 0 && (
            <Card className="border-2 border-purple-200">
              <CardHeader>
                <CardTitle className="text-2xl flex items-center gap-2">
                  <Sparkles className="w-6 h-6 text-purple-600" />
                  Match the Pairs!
                </CardTitle>
                <CardDescription className="text-base">
                  Click on items from each column to match them together
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-8">
                  {/* Left Column */}
                  <div className="space-y-3">
                    {matchingPairs.map((pair, index) => (
                      <button
                        key={`left-${index}`}
                        onClick={() => handleMatchingClick('left', index)}
                        disabled={matchedPairs.includes(index)}
                        className={`
                          w-full p-4 rounded-lg text-left font-medium transition-all
                          ${matchedPairs.includes(index) 
                            ? 'bg-green-100 border-2 border-green-400 text-green-800' 
                            : selectedLeft === index
                            ? 'bg-blue-200 border-2 border-blue-500 text-blue-900'
                            : 'bg-gradient-to-r from-purple-100 to-pink-100 border-2 border-purple-300 hover:border-purple-500 hover:scale-105'
                          }
                          disabled:cursor-not-allowed
                        `}
                      >
                        {pair.left}
                      </button>
                    ))}
                  </div>

                  {/* Right Column */}
                  <div className="space-y-3">
                    {shuffledRightItems.map((pair, displayIndex) => (
                      <button
                        key={`right-${displayIndex}`}
                        onClick={() => handleMatchingClick('right', pair.index)}
                        disabled={matchedPairs.includes(pair.index)}
                        className={`
                          w-full p-4 rounded-lg text-left font-medium transition-all
                          ${matchedPairs.includes(pair.index) 
                            ? 'bg-green-100 border-2 border-green-400 text-green-800' 
                            : selectedRight === pair.index
                            ? 'bg-blue-200 border-2 border-blue-500 text-blue-900'
                            : 'bg-gradient-to-r from-blue-100 to-purple-100 border-2 border-blue-300 hover:border-blue-500 hover:scale-105'
                          }
                          disabled:cursor-not-allowed
                        `}
                      >
                        {pair.right}
                      </button>
                    ))}
                  </div>
                </div>

                {matchedPairs.length === matchingPairs.length * 2 && (
                  <div className="mt-6 text-center">
                    <p className="text-2xl font-bold text-green-600 animate-bounce">
                      🎉 All Matched! Congratulations! 🎉
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </main>
    </div>
  );
};

export default GamePlayer;
