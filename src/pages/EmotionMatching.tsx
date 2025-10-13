import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import happyImage from "@/assets/emotions/happy.jpg";
import sadImage from "@/assets/emotions/sad.jpg";
import angryImage from "@/assets/emotions/angry.jpg";
import excitedImage from "@/assets/emotions/excited.jpg";
import worriedImage from "@/assets/emotions/worried.jpg";
import calmImage from "@/assets/emotions/calm.jpg";

const EmotionMatching = () => {
  const navigate = useNavigate();
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
      image: happyImage,
      color: "from-yellow-400 to-yellow-600",
    },
    {
      name: "Sad",
      image: sadImage,
      color: "from-blue-400 to-blue-600",
    },
    {
      name: "Angry",
      image: angryImage,
      color: "from-red-400 to-red-600",
    },
    {
      name: "Excited",
      image: excitedImage,
      color: "from-purple-400 to-purple-600",
    },
    {
      name: "Worried",
      image: worriedImage,
      color: "from-orange-400 to-orange-600",
    },
    {
      name: "Calm",
      image: calmImage,
      color: "from-green-400 to-green-600",
    }
  ];

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
          onClick={() => navigate("/feelings-emotions")}
          className="mb-4"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Feelings
        </Button>
        
        <div className="text-center">
          <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent mb-4">
            Match the Feelings! 🎯
          </h1>
          <p className="text-lg md:text-xl text-gray-700">
            Click a face, then click its matching name!
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto">
        <Card className="bg-white/90 backdrop-blur-sm shadow-2xl border-4 border-purple-200">
          <CardHeader className="text-center bg-gradient-to-r from-purple-100 to-pink-100 border-b-4 border-purple-200">
            <CardTitle className="text-2xl text-purple-800">
              Match each emotion face with its name
            </CardTitle>
            <CardDescription className="text-lg text-gray-700">
              {matchingGame.completed.length === emotions.length 
                ? "🎉 Amazing! You matched all the feelings!" 
                : `Matched ${matchingGame.completed.length} of ${emotions.length}`}
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
      </div>
    </div>
  );
};

export default EmotionMatching;
