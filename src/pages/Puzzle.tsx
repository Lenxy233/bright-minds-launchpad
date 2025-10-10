import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { Link } from "react-router-dom";
import { Home, RefreshCw, ChevronLeft, ChevronRight } from "lucide-react";

// Import puzzle images
import puzzle1 from "@/assets/puzzles/puzzle-1-counting.png";
import puzzle2 from "@/assets/puzzles/puzzle-2-crossword-animals.png";
import puzzle3 from "@/assets/puzzles/puzzle-3-crossword-kids.png";
import puzzle4 from "@/assets/puzzles/puzzle-4-crossword-animals-2.png";
import puzzle5 from "@/assets/puzzles/puzzle-5-crossword-farm.png";

const puzzles = [
  {
    id: 1,
    title: "How Many Sea Creatures?",
    image: puzzle1,
    questions: [
      { id: "octopus", label: "Octopus", answer: "2" },
      { id: "fish", label: "Fish", answer: "8" },
      { id: "turtle", label: "Turtle", answer: "2" },
      { id: "seahorse", label: "Seahorse", answer: "4" },
      { id: "whale", label: "Whale", answer: "1" },
      { id: "shark", label: "Shark", answer: "3" },
    ],
  },
  {
    id: 2,
    title: "Crossword - Animals",
    image: puzzle2,
    questions: [
      { id: "1across", label: "1. Across - Polar bear", answer: "POLARBEAR" },
      { id: "4across", label: "4. Across - Snake", answer: "SNAKE" },
      { id: "1down", label: "1. Down - Pig", answer: "PIG" },
      { id: "2down", label: "2. Down - Cat", answer: "CAT" },
      { id: "3down", label: "3. Down - Rat", answer: "RAT" },
      { id: "4down", label: "4. Down - Sheep", answer: "SHEEP" },
      { id: "5down", label: "5. Down - Bee", answer: "BEE" },
    ],
  },
  {
    id: 3,
    title: "Crossword Puzzle for Kids",
    image: puzzle3,
    questions: [
      { id: "c", label: "C - Cat", answer: "CAT" },
      { id: "n", label: "N - Narwhal", answer: "NARWHAL" },
      { id: "k", label: "K - Krab", answer: "KRAB" },
      { id: "b", label: "B - Bird", answer: "BIRD" },
      { id: "o", label: "O - Ostrich", answer: "OSTRICH" },
      { id: "p", label: "P - Penguin", answer: "PENGUIN" },
      { id: "s", label: "S - Snake", answer: "SNAKE" },
      { id: "n2", label: "N (bottom) - Newt", answer: "NEWT" },
    ],
  },
  {
    id: 4,
    title: "Crossword for Kids - Animals",
    image: puzzle4,
    questions: [
      { id: "1across", label: "1. Across - Elephant", answer: "ELEPHANT" },
      { id: "2across", label: "2. Across - Lion", answer: "LION" },
      { id: "1down", label: "1. Down - Cheetah", answer: "CHEETAH" },
      { id: "3down", label: "3. Down - Crocodile", answer: "CROCODILE" },
      { id: "4down", label: "4. Down - Zebra", answer: "ZEBRA" },
      { id: "5down", label: "5. Down - Giraffe", answer: "GIRAFFE" },
    ],
  },
  {
    id: 5,
    title: "Crossword - Farm Animals",
    image: puzzle5,
    questions: [
      { id: "1down", label: "1. Duck", answer: "DUCK" },
      { id: "2across", label: "2. Bull", answer: "BULL" },
      { id: "3down", label: "3. Cow", answer: "COW" },
      { id: "4across", label: "4. Horse", answer: "HORSE" },
      { id: "5across", label: "5. Goat", answer: "GOAT" },
      { id: "6across", label: "6. Pig", answer: "PIG" },
      { id: "7across", label: "7. Rooster", answer: "ROOSTER" },
    ],
  },
];

const Puzzle = () => {
  const [currentPuzzle, setCurrentPuzzle] = useState(0);
  const [answers, setAnswers] = useState<{ [key: string]: string }>({});
  const [showResults, setShowResults] = useState(false);

  const puzzle = puzzles[currentPuzzle];

  const handleAnswerChange = (questionId: string, value: string) => {
    setAnswers({ ...answers, [questionId]: value.toUpperCase() });
  };

  const checkAnswers = () => {
    let correct = 0;
    let incorrect = 0;

    puzzle.questions.forEach((question) => {
      const userAnswer = (answers[question.id] || "").toUpperCase().trim();
      const correctAnswer = question.answer.toUpperCase().trim();
      
      if (userAnswer === correctAnswer) {
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

  const nextPuzzle = () => {
    if (currentPuzzle < puzzles.length - 1) {
      setCurrentPuzzle(currentPuzzle + 1);
      setAnswers({});
      setShowResults(false);
    }
  };

  const previousPuzzle = () => {
    if (currentPuzzle > 0) {
      setCurrentPuzzle(currentPuzzle - 1);
      setAnswers({});
      setShowResults(false);
    }
  };

  const isCorrect = (questionId: string, correctAnswer: string) => {
    const userAnswer = (answers[questionId] || "").toUpperCase().trim();
    return userAnswer === correctAnswer.toUpperCase().trim();
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-100 via-pink-100 to-blue-100 p-4 md:p-8">
      <div className="container mx-auto max-w-6xl">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl md:text-5xl font-bold text-purple-700 drop-shadow-lg">
            Puzzle {currentPuzzle + 1} of {puzzles.length}
          </h1>
          <Button asChild variant="outline">
            <Link to="/learning-app">
              <Home className="w-4 h-4 mr-2" />
              Back
            </Link>
          </Button>
        </div>

        {/* Puzzle Navigation */}
        <div className="flex justify-between items-center mb-6">
          <Button
            onClick={previousPuzzle}
            disabled={currentPuzzle === 0}
            variant="outline"
            size="lg"
          >
            <ChevronLeft className="w-5 h-5 mr-2" />
            Previous
          </Button>
          <h2 className="text-2xl font-bold text-purple-600">{puzzle.title}</h2>
          <Button
            onClick={nextPuzzle}
            disabled={currentPuzzle === puzzles.length - 1}
            variant="outline"
            size="lg"
          >
            Next
            <ChevronRight className="w-5 h-5 ml-2" />
          </Button>
        </div>

        {/* Puzzle Image */}
        <Card className="bg-white/90 backdrop-blur-sm shadow-2xl border-4 border-purple-300 mb-8">
          <CardContent className="p-6">
            <div className="bg-gradient-to-br from-white to-purple-50 rounded-xl p-4 border-2 border-purple-200">
              <img
                src={puzzle.image}
                alt={puzzle.title}
                className="w-full h-auto rounded-lg shadow-lg"
              />
            </div>
          </CardContent>
        </Card>

        {/* Answer Section */}
        <Card className="bg-white/90 backdrop-blur-sm shadow-2xl border-4 border-purple-300">
          <CardHeader>
            <CardTitle className="text-2xl md:text-3xl text-center text-purple-700">
              Fill in your answers
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {puzzle.questions.map((question) => (
                <div
                  key={question.id}
                  className={`p-4 rounded-xl border-2 transition-all ${
                    showResults
                      ? isCorrect(question.id, question.answer)
                        ? "bg-green-100 border-green-400"
                        : "bg-red-100 border-red-400"
                      : "bg-purple-50 border-purple-300"
                  }`}
                >
                  <label className="block text-sm font-semibold text-purple-700 mb-2">
                    {question.label}
                  </label>
                  <Input
                    type="text"
                    placeholder="Type answer..."
                    value={answers[question.id] || ""}
                    onChange={(e) =>
                      handleAnswerChange(question.id, e.target.value)
                    }
                    className="text-lg font-semibold uppercase"
                    disabled={showResults}
                  />
                  {showResults && (
                    <p className="text-sm mt-2 font-semibold">
                      {isCorrect(question.id, question.answer) ? (
                        <span className="text-green-600">✓ Correct!</span>
                      ) : (
                        <span className="text-red-600">
                          ✗ Answer: {question.answer}
                        </span>
                      )}
                    </p>
                  )}
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
