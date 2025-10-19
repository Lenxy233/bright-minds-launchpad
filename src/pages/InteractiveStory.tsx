import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft, Volume2, VolumeX } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import confetti from "canvas-confetti";

interface StoryScene {
  id: string;
  image_url: string;
  narration_text: string;
  objects: StoryObject[];
}

interface StoryObject {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  name: string;
  sound_text: string;
  emoji: string;
  animation: "bounce" | "spin" | "pulse" | "shake";
}

export default function InteractiveStory() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [currentScene, setCurrentScene] = useState(0);
  const [scenes, setScenes] = useState<StoryScene[]>([]);
  const [clickedObjects, setClickedObjects] = useState<Set<string>>(new Set());
  const [animatingObject, setAnimatingObject] = useState<string | null>(null);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    loadStory();
  }, [id]);

  const loadStory = async () => {
    // For demo, create sample scenes
    const demoScenes: StoryScene[] = [
      {
        id: "1",
        image_url: "/lovable-uploads/012a16e7-1d39-4676-911a-d55fc31ccf4c.png",
        narration_text: "Welcome to the farm! Can you find all the animals?",
        objects: [
          {
            id: "cow",
            x: 20,
            y: 30,
            width: 15,
            height: 20,
            name: "Cow",
            sound_text: "Moo! I'm a cow!",
            emoji: "🐮",
            animation: "bounce"
          },
          {
            id: "chicken",
            x: 60,
            y: 50,
            width: 12,
            height: 15,
            name: "Chicken",
            sound_text: "Cluck cluck! I'm a chicken!",
            emoji: "🐔",
            animation: "shake"
          },
          {
            id: "pig",
            x: 40,
            y: 60,
            width: 15,
            height: 18,
            name: "Pig",
            sound_text: "Oink oink! I'm a pig!",
            emoji: "🐷",
            animation: "spin"
          }
        ]
      },
      {
        id: "2",
        image_url: "/lovable-uploads/0cc9d733-7771-46ef-97e1-3c3208a21a21.png",
        narration_text: "Look at all the colorful fruits! Tap them to learn their names!",
        objects: [
          {
            id: "apple",
            x: 25,
            y: 35,
            width: 12,
            height: 12,
            name: "Apple",
            sound_text: "I'm a red apple! Yummy!",
            emoji: "🍎",
            animation: "bounce"
          },
          {
            id: "banana",
            x: 50,
            y: 40,
            width: 10,
            height: 15,
            name: "Banana",
            sound_text: "I'm a yellow banana!",
            emoji: "🍌",
            animation: "spin"
          },
          {
            id: "orange",
            x: 70,
            y: 45,
            width: 12,
            height: 12,
            name: "Orange",
            sound_text: "I'm a juicy orange!",
            emoji: "🍊",
            animation: "pulse"
          }
        ]
      }
    ];
    
    setScenes(demoScenes);
    
    // Auto-play narration for first scene
    if (soundEnabled) {
      speakText(demoScenes[0].narration_text);
    }
  };

  const speakText = (text: string) => {
    if (!soundEnabled) return;
    
    setIsSpeaking(true);
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.9;
    utterance.pitch = 1.2;
    utterance.volume = 1;
    
    utterance.onend = () => setIsSpeaking(false);
    
    window.speechSynthesis.cancel(); // Cancel any ongoing speech
    window.speechSynthesis.speak(utterance);
  };

  const handleObjectClick = (object: StoryObject) => {
    // Mark as clicked
    setClickedObjects(prev => new Set([...prev, object.id]));
    
    // Trigger animation
    setAnimatingObject(object.id);
    setTimeout(() => setAnimatingObject(null), 1000);
    
    // Play sound
    speakText(object.sound_text);
    
    // Show emoji feedback
    const rect = document.getElementById(`object-${object.id}`)?.getBoundingClientRect();
    if (rect) {
      confetti({
        particleCount: 30,
        spread: 60,
        origin: {
          x: (rect.left + rect.width / 2) / window.innerWidth,
          y: (rect.top + rect.height / 2) / window.innerHeight
        },
        colors: ['#FFD700', '#FFA500', '#FF69B4', '#87CEEB']
      });
    }
  };

  const nextScene = () => {
    if (currentScene < scenes.length - 1) {
      setCurrentScene(currentScene + 1);
      setClickedObjects(new Set());
      speakText(scenes[currentScene + 1].narration_text);
    } else {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
      toast.success("🎉 Story Complete!");
    }
  };

  const previousScene = () => {
    if (currentScene > 0) {
      setCurrentScene(currentScene - 1);
      setClickedObjects(new Set());
      speakText(scenes[currentScene - 1].narration_text);
    }
  };

  const getAnimationClass = (animation: string) => {
    switch (animation) {
      case "bounce":
        return "animate-bounce";
      case "spin":
        return "animate-spin";
      case "pulse":
        return "animate-pulse";
      case "shake":
        return "animate-shake";
      default:
        return "";
    }
  };

  if (scenes.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex items-center justify-center">
        <p className="text-2xl">Loading story...</p>
      </div>
    );
  }

  const scene = scenes[currentScene];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <Button
            variant="ghost"
            onClick={() => navigate("/activities")}
            className="text-lg"
          >
            <ArrowLeft className="mr-2 h-5 w-5" />
            🏠 Back
          </Button>
          
          <Button
            variant="outline"
            onClick={() => {
              setSoundEnabled(!soundEnabled);
              if (soundEnabled) {
                window.speechSynthesis.cancel();
              }
            }}
            className="text-lg"
          >
            {soundEnabled ? <Volume2 className="h-6 w-6" /> : <VolumeX className="h-6 w-6" />}
          </Button>
        </div>

        {/* Story Scene Card */}
        <Card className="border-4 border-purple-300 shadow-2xl bg-white/90 backdrop-blur-sm overflow-hidden">
          <div className="h-4 bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400" />
          
          {/* Narration Text */}
          <div className="p-6 bg-gradient-to-r from-purple-100 to-pink-100 text-center">
            <p className="text-3xl font-bold text-purple-900">
              {scene.narration_text}
            </p>
          </div>

          {/* Interactive Scene */}
          <div className="relative aspect-video bg-gradient-to-br from-blue-100 to-green-100">
            {/* Background Image */}
            <img 
              src={scene.image_url} 
              alt="Story scene"
              className="w-full h-full object-cover"
            />
            
            {/* Interactive Objects */}
            {scene.objects.map((object) => (
              <button
                key={object.id}
                id={`object-${object.id}`}
                onClick={() => handleObjectClick(object)}
                className={`absolute cursor-pointer transition-all duration-300 ${
                  animatingObject === object.id ? getAnimationClass(object.animation) : ""
                } ${
                  clickedObjects.has(object.id) 
                    ? "opacity-60 scale-90" 
                    : "hover:scale-125 hover:z-10"
                }`}
                style={{
                  left: `${object.x}%`,
                  top: `${object.y}%`,
                  width: `${object.width}%`,
                  height: `${object.height}%`,
                }}
              >
                <div className="relative w-full h-full">
                  {/* Pulsing indicator for unclicked objects */}
                  {!clickedObjects.has(object.id) && (
                    <div className="absolute inset-0 bg-yellow-400/40 rounded-full animate-ping" />
                  )}
                  
                  {/* Object Emoji */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-6xl drop-shadow-2xl">
                      {object.emoji}
                    </span>
                  </div>
                  
                  {/* Checkmark for clicked objects */}
                  {clickedObjects.has(object.id) && (
                    <div className="absolute -top-2 -right-2 bg-green-500 rounded-full p-1">
                      <span className="text-2xl">✓</span>
                    </div>
                  )}
                </div>
              </button>
            ))}
          </div>

          {/* Progress and Navigation */}
          <div className="p-6 space-y-4">
            {/* Progress Bar */}
            <div className="flex items-center gap-2">
              {scenes.map((_, index) => (
                <div
                  key={index}
                  className={`h-3 flex-1 rounded-full transition-all ${
                    index === currentScene
                      ? "bg-gradient-to-r from-purple-500 to-pink-500 scale-110"
                      : index < currentScene
                      ? "bg-green-500"
                      : "bg-gray-300"
                  }`}
                />
              ))}
            </div>

            {/* Objects Found Counter */}
            <div className="text-center text-2xl font-bold text-purple-600">
              Found: {clickedObjects.size} / {scene.objects.length} 
              {clickedObjects.size === scene.objects.length && " 🌟 All Found!"}
            </div>

            {/* Navigation Buttons */}
            <div className="grid grid-cols-2 gap-4">
              <Button
                size="lg"
                variant="outline"
                onClick={previousScene}
                disabled={currentScene === 0}
                className="text-xl py-6 border-4 font-bold"
              >
                ⬅️ Previous
              </Button>
              <Button
                size="lg"
                onClick={nextScene}
                className="text-xl py-6 bg-gradient-to-r from-green-400 to-blue-500 font-bold"
              >
                {currentScene === scenes.length - 1 ? "🎉 Finish" : "Next ➡️"}
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
