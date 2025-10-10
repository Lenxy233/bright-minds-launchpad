import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface AnswerZone {
  id: string;
  x_position: number;
  y_position: number;
  width: number;
  height: number;
  correct_answer: string;
  order_index: number;
}

interface Puzzle {
  id: string;
  title: string;
  description: string | null;
  image_url: string;
  answer_zones: AnswerZone[];
}

export default function Puzzle() {
  const [puzzles, setPuzzles] = useState<Puzzle[]>([]);
  const [currentPuzzleIndex, setCurrentPuzzleIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [showResults, setShowResults] = useState(false);
  const [loading, setLoading] = useState(true);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageSize, setImageSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    loadPuzzles();
  }, []);

  const loadPuzzles = async () => {
    try {
      const { data: puzzlesData, error: puzzlesError } = await supabase
        .from("puzzles")
        .select("*")
        .order("created_at", { ascending: true });

      if (puzzlesError) throw puzzlesError;

      const puzzlesWithZones = await Promise.all(
        puzzlesData.map(async (puzzle) => {
          const { data: zones, error: zonesError } = await supabase
            .from("puzzle_answer_zones")
            .select("*")
            .eq("puzzle_id", puzzle.id)
            .order("order_index", { ascending: true });

          if (zonesError) throw zonesError;

          return {
            ...puzzle,
            answer_zones: zones,
          };
        })
      );

      setPuzzles(puzzlesWithZones);
    } catch (error) {
      console.error("Error loading puzzles:", error);
      toast.error("Failed to load puzzles");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setAnswers({});
    setShowResults(false);
    setImageLoaded(false);
  }, [currentPuzzleIndex]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-lg">Loading puzzles...</p>
      </div>
    );
  }

  if (puzzles.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="p-8 text-center">
          <h2 className="text-2xl font-bold mb-4">No Puzzles Available</h2>
          <p className="text-muted-foreground">
            Please create some puzzles in the admin panel first.
          </p>
        </Card>
      </div>
    );
  }

  const puzzle = puzzles[currentPuzzleIndex];

  const handleAnswerChange = (zoneId: string, value: string) => {
    setAnswers({ ...answers, [zoneId]: value });
  };

  const checkAnswers = () => {
    let correctCount = 0;
    puzzle.answer_zones.forEach((zone) => {
      const userAnswer = answers[zone.id]?.toLowerCase().trim();
      const correctAnswer = zone.correct_answer.toLowerCase().trim();
      if (userAnswer === correctAnswer) {
        correctCount++;
      }
    });

    setShowResults(true);

    if (correctCount === puzzle.answer_zones.length) {
      toast.success("Perfect! All answers are correct! 🎉", {
        duration: 3000,
      });
    } else {
      toast.error(
        `${correctCount} out of ${puzzle.answer_zones.length} correct. Try again!`,
        {
          duration: 3000,
        }
      );
    }
  };

  const resetPuzzle = () => {
    setAnswers({});
    setShowResults(false);
  };

  const nextPuzzle = () => {
    if (currentPuzzleIndex < puzzles.length - 1) {
      setCurrentPuzzleIndex(currentPuzzleIndex + 1);
    }
  };

  const previousPuzzle = () => {
    if (currentPuzzleIndex > 0) {
      setCurrentPuzzleIndex(currentPuzzleIndex - 1);
    }
  };

  const isCorrect = (zoneId: string) => {
    if (!showResults) return null;
    const userAnswer = answers[zoneId]?.toLowerCase().trim();
    const zone = puzzle.answer_zones.find((z) => z.id === zoneId);
    return userAnswer === zone?.correct_answer.toLowerCase().trim();
  };

  const handleImageLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const img = e.currentTarget;
    setImageSize({ width: img.naturalWidth, height: img.naturalHeight });
    setImageLoaded(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-100 to-pink-100 p-6">
      <div className="container mx-auto max-w-5xl">
        <h1 className="text-4xl font-bold text-center mb-8 text-primary">
          Interactive Puzzles
        </h1>

        <Card className="p-6 mb-6">
          <div className="flex items-center justify-between mb-6">
            <Button
              onClick={previousPuzzle}
              disabled={currentPuzzleIndex === 0}
              variant="outline"
              size="sm"
            >
              <ChevronLeft className="h-4 w-4 mr-1" />
              Previous
            </Button>
            <div className="text-center flex-1">
              <h2 className="text-2xl font-bold">{puzzle.title}</h2>
              {puzzle.description && (
                <p className="text-muted-foreground mt-1">
                  {puzzle.description}
                </p>
              )}
            </div>
            <Button
              onClick={nextPuzzle}
              disabled={currentPuzzleIndex === puzzles.length - 1}
              variant="outline"
              size="sm"
            >
              Next
              <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </div>

          <div className="relative inline-block w-full">
            <img
              src={puzzle.image_url}
              alt={puzzle.title}
              className="w-full h-auto rounded-lg"
              onLoad={handleImageLoad}
            />
            {imageLoaded &&
              puzzle.answer_zones.map((zone) => {
                const correct = isCorrect(zone.id);
                const displayWidth = document.querySelector("img")?.clientWidth || 0;
                const scale = imageSize.width > 0 ? displayWidth / imageSize.width : 1;

                return (
                  <Input
                    key={zone.id}
                    value={answers[zone.id] || ""}
                    onChange={(e) => handleAnswerChange(zone.id, e.target.value)}
                    disabled={showResults}
                    className={`absolute ${
                      showResults
                        ? correct
                          ? "border-green-500 bg-green-50"
                          : "border-red-500 bg-red-50"
                        : "bg-white/90 border-2 border-primary"
                    }`}
                    style={{
                      left: `${zone.x_position * scale}px`,
                      top: `${zone.y_position * scale}px`,
                      width: `${zone.width * scale}px`,
                      height: `${zone.height * scale}px`,
                      position: "absolute",
                      fontSize: `${Math.max(12, zone.height * scale * 0.5)}px`,
                    }}
                  />
                );
              })}
          </div>

          <div className="mt-6 text-center">
            {!showResults ? (
              <Button onClick={checkAnswers} size="lg" className="px-8">
                Check Answers
              </Button>
            ) : (
              <Button onClick={resetPuzzle} size="lg" className="px-8">
                Try Again
              </Button>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}
