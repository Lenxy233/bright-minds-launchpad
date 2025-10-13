import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Heart, Smile, Frown, Angry, Meh, Laugh, AlertCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import happyImage from "@/assets/emotions/happy.jpg";
import sadImage from "@/assets/emotions/sad.jpg";
import angryImage from "@/assets/emotions/angry.jpg";
import excitedImage from "@/assets/emotions/excited.jpg";
import worriedImage from "@/assets/emotions/worried.jpg";
import calmImage from "@/assets/emotions/calm.jpg";

const FeelingsEmotions = () => {
  const navigate = useNavigate();
  const [selectedEmotion, setSelectedEmotion] = useState<string | null>(null);
  const [currentScenario, setCurrentScenario] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [matchingGame, setMatchingGame] = useState<{
    selectedFace: string | null;
    selectedName: string | null;
    matches: Record<string, string>;
    completed: string[];
  }>({
    selectedFace: null,
    selectedName: null,
    matches: {},
    completed: []
  });

  const emotions = [
    {
      name: "Happy",
      emoji: "😊",
      image: happyImage,
      icon: Smile,
      color: "from-yellow-400 to-yellow-600",
      description: "When you feel joyful, cheerful, and everything feels good!",
      examples: ["Playing with friends", "Getting a birthday present", "Eating your favorite food"]
    },
    {
      name: "Sad",
      emoji: "😢",
      image: sadImage,
      icon: Frown,
      color: "from-blue-400 to-blue-600",
      description: "When you feel down, hurt, or want to cry.",
      examples: ["Losing a toy", "Missing someone", "Not getting to play outside"]
    },
    {
      name: "Angry",
      emoji: "😠",
      image: angryImage,
      icon: Angry,
      color: "from-red-400 to-red-600",
      description: "When you feel mad, frustrated, or want to yell.",
      examples: ["Someone takes your toy", "Rules feel unfair", "Things don't go your way"]
    },
    {
      name: "Excited",
      emoji: "🤩",
      image: excitedImage,
      icon: Laugh,
      color: "from-purple-400 to-purple-600",
      description: "When you can't wait for something amazing to happen!",
      examples: ["Going to the park", "Having a playdate", "Learning something new"]
    },
    {
      name: "Worried",
      emoji: "😰",
      image: worriedImage,
      icon: AlertCircle,
      color: "from-orange-400 to-orange-600",
      description: "When you feel nervous or scared about something.",
      examples: ["First day at school", "Hearing loud noises", "Being in the dark"]
    },
    {
      name: "Calm",
      emoji: "😌",
      image: calmImage,
      icon: Meh,
      color: "from-green-400 to-green-600",
      description: "When you feel peaceful, relaxed, and everything is okay.",
      examples: ["Reading a book", "Taking deep breaths", "Cuddling with a pet"]
    }
  ];

  const scenarios = [
    {
      question: "Your best friend shares their favorite toy with you. How do you feel?",
      correctAnswer: "Happy",
      emoji: "😊"
    },
    {
      question: "You can't find your favorite stuffed animal. How do you feel?",
      correctAnswer: "Sad",
      emoji: "😢"
    },
    {
      question: "Someone pushed you in line. How do you feel?",
      correctAnswer: "Angry",
      emoji: "😠"
    },
    {
      question: "Tomorrow is your birthday party! How do you feel?",
      correctAnswer: "Excited",
      emoji: "🤩"
    },
    {
      question: "You hear a strange noise at night. How do you feel?",
      correctAnswer: "Worried",
      emoji: "😰"
    },
    {
      question: "You're sitting quietly and listening to soft music. How do you feel?",
      correctAnswer: "Calm",
      emoji: "😌"
    }
  ];

  const handleNextScenario = () => {
    setShowAnswer(false);
    setCurrentScenario((prev) => (prev + 1) % scenarios.length);
  };

  const handleFaceClick = (emotionName: string) => {
    if (matchingGame.completed.includes(emotionName)) return;
    
    if (matchingGame.selectedName) {
      // If a name is already selected, try to match
      if (matchingGame.selectedName === emotionName) {
        // Correct match!
        setMatchingGame({
          ...matchingGame,
          matches: { ...matchingGame.matches, [emotionName]: emotionName },
          completed: [...matchingGame.completed, emotionName],
          selectedFace: null,
          selectedName: null
        });
      } else {
        // Wrong match, reset selection
        setMatchingGame({
          ...matchingGame,
          selectedFace: null,
          selectedName: null
        });
      }
    } else {
      // Select this face
      setMatchingGame({
        ...matchingGame,
        selectedFace: emotionName
      });
    }
  };

  const handleNameClick = (emotionName: string) => {
    if (matchingGame.completed.includes(emotionName)) return;
    
    if (matchingGame.selectedFace) {
      // If a face is already selected, try to match
      if (matchingGame.selectedFace === emotionName) {
        // Correct match!
        setMatchingGame({
          ...matchingGame,
          matches: { ...matchingGame.matches, [emotionName]: emotionName },
          completed: [...matchingGame.completed, emotionName],
          selectedFace: null,
          selectedName: null
        });
      } else {
        // Wrong match, reset selection
        setMatchingGame({
          ...matchingGame,
          selectedFace: null,
          selectedName: null
        });
      }
    } else {
      // Select this name
      setMatchingGame({
        ...matchingGame,
        selectedName: emotionName
      });
    }
  };

  const resetMatchingGame = () => {
    setMatchingGame({
      selectedFace: null,
      selectedName: null,
      matches: {},
      completed: []
    });
  };

  const shuffledEmotionNames = [...emotions].sort(() => Math.random() - 0.5);

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 p-4 md:p-8">
      {/* Header */}
      <div className="max-w-6xl mx-auto mb-8">
        <Button
          variant="ghost"
          onClick={() => navigate("/learning-app")}
          className="mb-4"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Learning
        </Button>
        
        <div className="text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Heart className="w-12 h-12 text-red-500 animate-pulse" />
            <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
              Feelings & Emotions
            </h1>
            <Heart className="w-12 h-12 text-red-500 animate-pulse" />
          </div>
          <p className="text-lg md:text-xl text-gray-700">
            Let's learn about our feelings and how to recognize them!
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto space-y-8">
        {/* Emotions Grid */}
        <section>
          <h2 className="text-3xl font-bold text-center mb-6 text-purple-800">
            Meet the Feelings!
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {emotions.map((emotion) => {
              const Icon = emotion.icon;
              const isSelected = selectedEmotion === emotion.name;
              return (
                <Card
                  key={emotion.name}
                  className={`cursor-pointer transition-all duration-300 transform hover:scale-105 hover:shadow-2xl ${
                    isSelected ? "ring-4 ring-purple-500 scale-105" : ""
                  }`}
                  onClick={() => setSelectedEmotion(isSelected ? null : emotion.name)}
                >
                  <CardHeader className={`bg-gradient-to-br ${emotion.color} text-white rounded-t-lg p-0 overflow-hidden`}>
                    <div className="relative w-full aspect-square">
                      <img 
                        src={emotion.image} 
                        alt={`${emotion.name} emotion`}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4">
                        <CardTitle className="text-center text-2xl text-white">{emotion.name}</CardTitle>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-4">
                    <CardDescription className="text-gray-700 text-center mb-4">
                      {emotion.description}
                    </CardDescription>
                    {isSelected && (
                      <div className="mt-4 p-4 bg-purple-50 rounded-lg animate-in fade-in slide-in-from-top-2">
                        <p className="font-semibold text-purple-800 mb-2">When might you feel this way?</p>
                        <ul className="space-y-1 text-sm">
                          {emotion.examples.map((example, idx) => (
                            <li key={idx} className="flex items-start gap-2">
                              <span className="text-purple-600">•</span>
                              <span className="text-gray-700">{example}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </section>

        {/* Scenario Practice */}
        <section>
          <h2 className="text-3xl font-bold text-center mb-6 text-purple-800">
            Feeling Detective! 🔍
          </h2>
          <Card className="bg-white/90 backdrop-blur-sm shadow-2xl border-4 border-pink-200">
            <CardHeader className="text-center bg-gradient-to-r from-pink-100 to-purple-100 border-b-4 border-pink-200">
              <CardTitle className="text-2xl text-purple-800">
                Scenario #{currentScenario + 1}
              </CardTitle>
              <CardDescription className="text-lg text-gray-700">
                Read the situation and guess how the person might feel!
              </CardDescription>
            </CardHeader>
            <CardContent className="p-8">
              <div className="text-center mb-8">
                <p className="text-xl md:text-2xl text-gray-800 font-semibold mb-6">
                  {scenarios[currentScenario].question}
                </p>
                
                {!showAnswer ? (
                  <div className="space-y-4">
                    <p className="text-gray-600 mb-4">Pick a feeling:</p>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {emotions.slice(0, 6).map((emotion) => (
                        <Button
                          key={emotion.name}
                          onClick={() => setShowAnswer(true)}
                          className={`h-auto py-6 text-lg bg-gradient-to-br ${emotion.color} hover:opacity-90`}
                        >
                          <div className="flex flex-col items-center gap-2">
                            <span className="text-3xl">{emotion.emoji}</span>
                            <span>{emotion.name}</span>
                          </div>
                        </Button>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="bg-gradient-to-br from-green-50 to-blue-50 rounded-xl p-8 border-4 border-green-300 animate-in fade-in scale-in">
                    <div className="text-center">
                      <div className="text-8xl mb-4 animate-bounce">
                        {scenarios[currentScenario].emoji}
                      </div>
                      <p className="text-green-700 font-bold text-lg mb-2">✨ The Answer Is... ✨</p>
                      <p className="text-4xl text-green-800 font-bold mb-6">
                        {scenarios[currentScenario].correctAnswer}!
                      </p>
                      <Button
                        onClick={handleNextScenario}
                        className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-lg py-6"
                      >
                        Next Scenario →
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Matching Game */}
        <section>
          <h2 className="text-3xl font-bold text-center mb-6 text-purple-800">
            Match the Feelings! 🎯
          </h2>
          <Card className="bg-white/90 backdrop-blur-sm shadow-2xl border-4 border-purple-200">
            <CardHeader className="text-center bg-gradient-to-r from-purple-100 to-pink-100 border-b-4 border-purple-200">
              <CardTitle className="text-2xl text-purple-800">
                Click a face, then click its matching name!
              </CardTitle>
              <CardDescription className="text-lg text-gray-700">
                {matchingGame.completed.length === emotions.length 
                  ? "🎉 Amazing! You matched all the feelings!" 
                  : `Match ${matchingGame.completed.length} of ${emotions.length}`}
              </CardDescription>
            </CardHeader>
            <CardContent className="p-8">
              <div className="grid md:grid-cols-2 gap-8">
                {/* Emotion Faces */}
                <div className="space-y-4">
                  <h3 className="text-xl font-bold text-center text-purple-700 mb-4">Feeling Faces</h3>
                  <div className="grid grid-cols-2 gap-4">
                    {emotions.map((emotion) => {
                      const isCompleted = matchingGame.completed.includes(emotion.name);
                      const isSelected = matchingGame.selectedFace === emotion.name;
                      return (
                        <button
                          key={emotion.name}
                          onClick={() => handleFaceClick(emotion.name)}
                          disabled={isCompleted}
                          className={`relative aspect-square rounded-xl overflow-hidden transition-all duration-300 ${
                            isCompleted 
                              ? "opacity-50 cursor-not-allowed" 
                              : isSelected 
                                ? "ring-4 ring-purple-500 scale-105 shadow-2xl" 
                                : "hover:scale-105 hover:shadow-xl cursor-pointer"
                          }`}
                        >
                          <img 
                            src={emotion.image} 
                            alt={emotion.name}
                            className="w-full h-full object-cover"
                          />
                          {isCompleted && (
                            <div className="absolute inset-0 bg-green-500/30 flex items-center justify-center">
                              <span className="text-6xl">✓</span>
                            </div>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Emotion Names */}
                <div className="space-y-4">
                  <h3 className="text-xl font-bold text-center text-purple-700 mb-4">Feeling Names</h3>
                  <div className="grid grid-cols-1 gap-4">
                    {shuffledEmotionNames.map((emotion) => {
                      const isCompleted = matchingGame.completed.includes(emotion.name);
                      const isSelected = matchingGame.selectedName === emotion.name;
                      return (
                        <Button
                          key={emotion.name}
                          onClick={() => handleNameClick(emotion.name)}
                          disabled={isCompleted}
                          className={`h-auto py-6 text-2xl font-bold transition-all duration-300 ${
                            isCompleted
                              ? "bg-green-500 cursor-not-allowed opacity-75"
                              : isSelected
                                ? `bg-gradient-to-r ${emotion.color} ring-4 ring-purple-500 scale-105 shadow-2xl`
                                : `bg-gradient-to-r ${emotion.color} hover:scale-105`
                          }`}
                        >
                          {emotion.name} {isCompleted && "✓"}
                        </Button>
                      );
                    })}
                  </div>
                </div>
              </div>

              {matchingGame.completed.length === emotions.length && (
                <div className="mt-8 text-center animate-in fade-in scale-in">
                  <div className="bg-gradient-to-br from-green-50 to-blue-50 rounded-xl p-8 border-4 border-green-300">
                    <p className="text-4xl mb-4">🎉 🌟 🎊</p>
                    <p className="text-2xl font-bold text-green-800 mb-4">
                      Perfect! You know all your feelings!
                    </p>
                    <Button
                      onClick={resetMatchingGame}
                      className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-lg py-6"
                    >
                      Play Again! 🔄
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </section>

        {/* Tips Section */}
        <section>
          <Card className="bg-gradient-to-br from-yellow-50 to-orange-50 border-4 border-yellow-200">
            <CardHeader>
              <CardTitle className="text-2xl text-center text-orange-800">
                💡 Tips for Understanding Feelings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="p-4 bg-white rounded-lg shadow">
                  <p className="font-semibold text-purple-800 mb-2">🌟 All feelings are okay!</p>
                  <p className="text-gray-700">There are no "bad" feelings. It's okay to feel any way you feel.</p>
                </div>
                <div className="p-4 bg-white rounded-lg shadow">
                  <p className="font-semibold text-blue-800 mb-2">💬 Talk about it!</p>
                  <p className="text-gray-700">Share your feelings with someone you trust, like a parent or teacher.</p>
                </div>
                <div className="p-4 bg-white rounded-lg shadow">
                  <p className="font-semibold text-green-800 mb-2">🌈 Feelings change!</p>
                  <p className="text-gray-700">If you feel sad or angry now, remember it won't last forever.</p>
                </div>
                <div className="p-4 bg-white rounded-lg shadow">
                  <p className="font-semibold text-pink-800 mb-2">🤗 Be kind to yourself!</p>
                  <p className="text-gray-700">Treat yourself with the same kindness you show to your friends.</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>
      </div>
    </div>
  );
};

export default FeelingsEmotions;
