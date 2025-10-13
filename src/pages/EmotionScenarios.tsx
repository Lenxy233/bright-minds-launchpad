import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

const EmotionScenarios = () => {
  const navigate = useNavigate();
  const [currentScenario, setCurrentScenario] = useState(0);
  const [selectedEmotion, setSelectedEmotion] = useState<string | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [score, setScore] = useState(0);

  const scenarios = [
    {
      situation: "Your best friend shares their favorite toy with you",
      correctEmotion: "Happy",
      emoji: "😊",
      color: "from-yellow-400 to-yellow-600"
    },
    {
      situation: "You can't find your favorite stuffed animal anywhere",
      correctEmotion: "Sad",
      emoji: "😢",
      color: "from-blue-400 to-blue-600"
    },
    {
      situation: "Someone pushed you in line at the playground",
      correctEmotion: "Angry",
      emoji: "😠",
      color: "from-red-400 to-red-600"
    },
    {
      situation: "Tomorrow is your birthday party with all your friends!",
      correctEmotion: "Excited",
      emoji: "🤩",
      color: "from-purple-400 to-purple-600"
    },
    {
      situation: "You hear a strange, loud noise in the middle of the night",
      correctEmotion: "Worried",
      emoji: "😰",
      color: "from-orange-400 to-orange-600"
    },
    {
      situation: "You're sitting quietly, reading your favorite book",
      correctEmotion: "Calm",
      emoji: "😌",
      color: "from-green-400 to-green-600"
    },
    {
      situation: "Your parent says you can get ice cream after dinner",
      correctEmotion: "Happy",
      emoji: "😊",
      color: "from-yellow-400 to-yellow-600"
    },
    {
      situation: "Your friend doesn't want to play with you today",
      correctEmotion: "Sad",
      emoji: "😢",
      color: "from-blue-400 to-blue-600"
    },
    {
      situation: "Someone broke your favorite crayon on purpose",
      correctEmotion: "Angry",
      emoji: "😠",
      color: "from-red-400 to-red-600"
    },
    {
      situation: "You're going to the zoo to see all the animals!",
      correctEmotion: "Excited",
      emoji: "🤩",
      color: "from-purple-400 to-purple-600"
    },
    {
      situation: "It's your first day at a new school",
      correctEmotion: "Worried",
      emoji: "😰",
      color: "from-orange-400 to-orange-600"
    },
    {
      situation: "You're relaxing in the garden watching butterflies",
      correctEmotion: "Calm",
      emoji: "😌",
      color: "from-green-400 to-green-600"
    }
  ];

  const emotionOptions = [
    { name: "Happy", emoji: "😊", color: "from-yellow-400 to-yellow-600" },
    { name: "Sad", emoji: "😢", color: "from-blue-400 to-blue-600" },
    { name: "Angry", emoji: "😠", color: "from-red-400 to-red-600" },
    { name: "Excited", emoji: "🤩", color: "from-purple-400 to-purple-600" },
    { name: "Worried", emoji: "😰", color: "from-orange-400 to-orange-600" },
    { name: "Calm", emoji: "😌", color: "from-green-400 to-green-600" }
  ];

  const handleEmotionSelect = (emotion: string) => {
    setSelectedEmotion(emotion);
    setShowFeedback(true);
    
    if (emotion === scenarios[currentScenario].correctEmotion) {
      setScore(score + 1);
    }
  };

  const handleNext = () => {
    if (currentScenario < scenarios.length - 1) {
      setCurrentScenario(currentScenario + 1);
      setSelectedEmotion(null);
      setShowFeedback(false);
    }
  };

  const handleRestart = () => {
    setCurrentScenario(0);
    setSelectedEmotion(null);
    setShowFeedback(false);
    setScore(0);
  };

  const isCorrect = selectedEmotion === scenarios[currentScenario].correctEmotion;
  const isGameComplete = currentScenario === scenarios.length - 1 && showFeedback;

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 p-4 md:p-8">
      {/* Header */}
      <div className="max-w-4xl mx-auto mb-8">
        <Button
          variant="ghost"
          onClick={() => navigate("/feelings-emotions")}
          className="mb-4"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Feelings
        </Button>
        
        <div className="text-center">
          <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent mb-4">
            Feeling Situations 🌟
          </h1>
          <p className="text-lg md:text-xl text-gray-700">
            Read the situation and choose how you would feel!
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto">
        <Card className="bg-white/90 backdrop-blur-sm shadow-2xl border-4 border-pink-200">
          <CardHeader className="text-center bg-gradient-to-r from-pink-100 to-purple-100 border-b-4 border-pink-200">
            <CardTitle className="text-2xl text-purple-800">
              Scenario {currentScenario + 1} of {scenarios.length}
            </CardTitle>
            <CardDescription className="text-lg text-gray-700">
              Score: {score} / {currentScenario + (showFeedback ? 1 : 0)}
            </CardDescription>
          </CardHeader>
          <CardContent className="p-8">
            {!isGameComplete ? (
              <>
                {/* Scenario */}
                <div className="mb-8 p-6 bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl border-2 border-purple-200">
                  <p className="text-xl md:text-2xl text-center text-gray-800 font-semibold">
                    {scenarios[currentScenario].situation}
                  </p>
                </div>

                {/* Emotion Options */}
                {!showFeedback ? (
                  <div>
                    <p className="text-center text-lg text-gray-600 mb-4">
                      How would you feel?
                    </p>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {emotionOptions.map((emotion) => (
                        <Button
                          key={emotion.name}
                          onClick={() => handleEmotionSelect(emotion.name)}
                          className={`h-auto py-6 text-lg bg-gradient-to-br ${emotion.color} hover:opacity-90 hover:scale-105 transition-all`}
                        >
                          <div className="flex flex-col items-center gap-2">
                            <span className="text-4xl">{emotion.emoji}</span>
                            <span className="font-bold">{emotion.name}</span>
                          </div>
                        </Button>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className={`p-8 rounded-xl border-4 animate-in fade-in scale-in ${
                    isCorrect 
                      ? "bg-gradient-to-br from-green-50 to-blue-50 border-green-300" 
                      : "bg-gradient-to-br from-orange-50 to-yellow-50 border-orange-300"
                  }`}>
                    <div className="text-center">
                      <div className="text-8xl mb-4 animate-bounce">
                        {isCorrect ? "✓" : scenarios[currentScenario].emoji}
                      </div>
                      <p className={`text-2xl font-bold mb-2 ${
                        isCorrect ? "text-green-700" : "text-orange-700"
                      }`}>
                        {isCorrect ? "Perfect! 🎉" : "Good try!"}
                      </p>
                      <p className="text-xl text-gray-800 mb-6">
                        {isCorrect 
                          ? `Yes! Most people would feel ${scenarios[currentScenario].correctEmotion}!`
                          : `Many people would feel ${scenarios[currentScenario].correctEmotion} in this situation.`
                        }
                      </p>
                      <Button
                        onClick={handleNext}
                        className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-lg py-6 px-8"
                      >
                        {currentScenario < scenarios.length - 1 ? "Next Scenario →" : "See Results"}
                      </Button>
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center animate-in fade-in scale-in">
                <div className="bg-gradient-to-br from-green-50 to-blue-50 rounded-xl p-8 border-4 border-green-300">
                  <p className="text-6xl mb-4">🎊 🌟 🎉</p>
                  <p className="text-3xl font-bold text-green-800 mb-4">
                    Amazing Work!
                  </p>
                  <p className="text-2xl text-gray-800 mb-6">
                    You got {score} out of {scenarios.length} correct!
                  </p>
                  <p className="text-lg text-gray-700 mb-8">
                    {score === scenarios.length 
                      ? "Perfect score! You really understand feelings!"
                      : score >= scenarios.length * 0.7
                        ? "Great job! You're getting really good at recognizing emotions!"
                        : "Good effort! Keep practicing to understand feelings better!"}
                  </p>
                  <div className="flex gap-4 justify-center">
                    <Button
                      onClick={handleRestart}
                      className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-lg py-6 px-8"
                    >
                      Play Again! 🔄
                    </Button>
                    <Button
                      onClick={() => navigate("/feelings-emotions")}
                      variant="outline"
                      className="text-lg py-6 px-8"
                    >
                      Back to Feelings
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default EmotionScenarios;
