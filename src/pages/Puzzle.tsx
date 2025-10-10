import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { Link } from "react-router-dom";
import { Home, RefreshCw } from "lucide-react";

const Puzzle = () => {
  const seaCreatures = [
    { name: "Octopus", emoji: "🐙", count: 2 },
    { name: "Fish", emoji: "🐠", count: 8 },
    { name: "Turtle", emoji: "🐢", count: 2 },
    { name: "Seahorse", emoji: "🦭", count: 4 },
    { name: "Whale", emoji: "🐋", count: 1 },
    { name: "Shark", emoji: "🦈", count: 3 },
  ];

  const [answers, setAnswers] = useState<{ [key: string]: string }>({});
  const [showResults, setShowResults] = useState(false);

  const handleAnswerChange = (creature: string, value: string) => {
    setAnswers({ ...answers, [creature]: value });
  };

  const checkAnswers = () => {
    let correct = 0;
    let incorrect = 0;

    seaCreatures.forEach((creature) => {
      const userAnswer = parseInt(answers[creature.name] || "0");
      if (userAnswer === creature.count) {
        correct++;
      } else {
        incorrect++;
      }
    });

    if (incorrect === 0) {
      toast.success(`🎉 Perfect! You got all ${correct} answers correct!`);
    } else {
      toast.info(`You got ${correct} correct and ${incorrect} incorrect. Try again!`);
    }

    setShowResults(true);
  };

  const resetPuzzle = () => {
    setAnswers({});
    setShowResults(false);
    toast.info("Puzzle reset! Try again.");
  };

  const renderCreatures = (creature: typeof seaCreatures[0]) => {
    return Array(creature.count)
      .fill(0)
      .map((_, index) => (
        <span
          key={index}
          className="text-4xl md:text-5xl inline-block m-2 animate-bounce"
          style={{ animationDelay: `${index * 0.1}s` }}
        >
          {creature.emoji}
        </span>
      ));
  };

  const isCorrect = (creature: string, correctCount: number) => {
    return parseInt(answers[creature] || "0") === correctCount;
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-200 via-blue-300 to-cyan-200 p-4 md:p-8">
      <div className="container mx-auto max-w-6xl">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl md:text-6xl font-bold text-blue-600 drop-shadow-lg">
            How Many? 🌊
          </h1>
          <Button asChild variant="outline">
            <Link to="/">
              <Home className="w-4 h-4 mr-2" />
              Home
            </Link>
          </Button>
        </div>

        {/* Main Puzzle Area */}
        <Card className="bg-blue-100/80 backdrop-blur-sm shadow-2xl border-4 border-blue-300 mb-8">
          <CardHeader>
            <CardTitle className="text-2xl md:text-3xl text-center text-blue-700">
              Count the sea creatures!
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-gradient-to-br from-blue-400 to-cyan-400 rounded-3xl p-6 md:p-12 border-4 border-blue-500 shadow-inner min-h-[400px] flex flex-wrap justify-center items-center gap-4">
              {seaCreatures.map((creature) =>
                renderCreatures(creature)
              )}
            </div>
          </CardContent>
        </Card>

        {/* Answer Section */}
        <Card className="bg-white/90 backdrop-blur-sm shadow-2xl border-4 border-blue-300">
          <CardHeader>
            <CardTitle className="text-2xl md:text-3xl text-center text-blue-700">
              Enter your answers
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {seaCreatures.map((creature) => (
                <div
                  key={creature.name}
                  className={`flex items-center gap-4 p-4 rounded-xl border-2 transition-all ${
                    showResults
                      ? isCorrect(creature.name, creature.count)
                        ? "bg-green-100 border-green-400"
                        : "bg-red-100 border-red-400"
                      : "bg-blue-50 border-blue-300"
                  }`}
                >
                  <span className="text-4xl">{creature.emoji}</span>
                  <div className="flex-1">
                    <label className="block text-sm font-semibold text-blue-700 mb-2">
                      {creature.name}
                    </label>
                    <Input
                      type="number"
                      min="0"
                      placeholder="?"
                      value={answers[creature.name] || ""}
                      onChange={(e) =>
                        handleAnswerChange(creature.name, e.target.value)
                      }
                      className="text-center text-xl font-bold"
                      disabled={showResults}
                    />
                    {showResults && (
                      <p className="text-sm mt-2 font-semibold">
                        {isCorrect(creature.name, creature.count) ? (
                          <span className="text-green-600">✓ Correct!</span>
                        ) : (
                          <span className="text-red-600">
                            ✗ Answer: {creature.count}
                          </span>
                        )}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-center gap-4 mt-8">
              {!showResults ? (
                <Button
                  onClick={checkAnswers}
                  size="lg"
                  className="bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white text-xl px-8 py-6 shadow-lg"
                >
                  Check Answers ✨
                </Button>
              ) : (
                <Button
                  onClick={resetPuzzle}
                  size="lg"
                  variant="outline"
                  className="text-xl px-8 py-6 shadow-lg"
                >
                  <RefreshCw className="w-5 h-5 mr-2" />
                  Try Again
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Puzzle;
