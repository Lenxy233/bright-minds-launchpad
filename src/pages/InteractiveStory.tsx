import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft, Volume2, VolumeX, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import confetti from "canvas-confetti";

interface AnimatedObject {
  id: string;
  emoji: string;
  x: number;
  y: number;
  targetX: number;
  targetY: number;
  size: number;
  rotation: number;
  scale: number;
  soundText: string;
  color: string;
  isMoving: boolean;
  animationType: "bounce" | "float" | "spin" | "wiggle";
}

interface StoryScene {
  id: string;
  narration: string;
  backgroundPrompt: string;
  backgroundImage?: string;
  objects: AnimatedObject[];
}

export default function InteractiveStory() {
  const { id } = useParams();
  const navigate = useNavigate();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameRef = useRef<number>();
  const [currentScene, setCurrentScene] = useState(0);
  const [scenes, setScenes] = useState<StoryScene[]>([]);
  const [clickedObjects, setClickedObjects] = useState<Set<string>>(new Set());
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [loading, setLoading] = useState(true);
  const [generatingImage, setGeneratingImage] = useState(false);

  useEffect(() => {
    initializeStory();
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (scenes.length > 0 && !loading) {
      startAnimation();
      if (soundEnabled) {
        speakText(scenes[currentScene].narration);
      }
    }
  }, [scenes, currentScene, loading]);

  const initializeStory = async () => {
    // Create demo scenes with animated objects
    const demoScenes: StoryScene[] = [
      {
        id: "1",
        narration: "Welcome to the magical farm! Tap the animals to hear their sounds!",
        backgroundPrompt: "A colorful cartoon farm with green grass, blue sky, red barn, and a yellow sun",
        objects: [
          {
            id: "cow",
            emoji: "🐮",
            x: 100,
            y: 200,
            targetX: 150,
            targetY: 200,
            size: 80,
            rotation: 0,
            scale: 1,
            soundText: "Mooooo! I'm a friendly cow!",
            color: "#FFB6C1",
            isMoving: true,
            animationType: "bounce"
          },
          {
            id: "pig",
            emoji: "🐷",
            x: 300,
            y: 350,
            targetX: 350,
            targetY: 350,
            size: 70,
            rotation: 0,
            scale: 1,
            soundText: "Oink oink! Let's play!",
            color: "#FFE4E1",
            isMoving: true,
            animationType: "wiggle"
          },
          {
            id: "chicken",
            emoji: "🐔",
            x: 500,
            y: 300,
            targetX: 550,
            targetY: 280,
            size: 60,
            rotation: 0,
            scale: 1,
            soundText: "Cluck cluck! I love to peck!",
            color: "#FFFACD",
            isMoving: true,
            animationType: "float"
          }
        ]
      },
      {
        id: "2",
        narration: "Look at the colorful fruits dancing in the sunshine!",
        backgroundPrompt: "A bright sunny orchard with trees and a rainbow in the sky",
        objects: [
          {
            id: "apple",
            emoji: "🍎",
            x: 150,
            y: 250,
            targetX: 150,
            targetY: 230,
            size: 70,
            rotation: 0,
            scale: 1,
            soundText: "I'm a juicy red apple!",
            color: "#FFE4E1",
            isMoving: true,
            animationType: "float"
          },
          {
            id: "banana",
            emoji: "🍌",
            x: 350,
            y: 280,
            targetX: 380,
            targetY: 280,
            size: 65,
            rotation: 0,
            scale: 1,
            soundText: "I'm a yellow banana!",
            color: "#FFFACD",
            isMoving: true,
            animationType: "spin"
          },
          {
            id: "orange",
            emoji: "🍊",
            x: 550,
            y: 300,
            targetX: 550,
            targetY: 280,
            size: 70,
            rotation: 0,
            scale: 1,
            soundText: "I'm a sweet orange!",
            color: "#FFE4B5",
            isMoving: true,
            animationType: "bounce"
          }
        ]
      }
    ];

    setScenes(demoScenes);
    
    // Generate background images
    generateSceneBackgrounds(demoScenes);
  };

  const generateSceneBackgrounds = async (scenesToGenerate: StoryScene[]) => {
    setGeneratingImage(true);
    
    for (const scene of scenesToGenerate) {
      try {
        const { data, error } = await supabase.functions.invoke('generate-story-image', {
          body: { 
            prompt: scene.backgroundPrompt,
            width: 1024,
            height: 600
          }
        });

        if (error) throw error;
        
        if (data?.imageUrl) {
          scene.backgroundImage = data.imageUrl;
        }
      } catch (error) {
        console.error('Error generating image:', error);
        toast.error('Failed to generate scene image');
      }
    }

    setGeneratingImage(false);
    setLoading(false);
  };

  const speakText = (text: string) => {
    if (!soundEnabled) return;
    
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.9;
    utterance.pitch = 1.3;
    utterance.volume = 1;
    
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
  };

  const startAnimation = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const scene = scenes[currentScene];
    let animationTime = 0;

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw background
      if (scene.backgroundImage) {
        const img = new Image();
        img.src = scene.backgroundImage;
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      } else {
        // Gradient background while loading
        const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
        gradient.addColorStop(0, '#87CEEB');
        gradient.addColorStop(1, '#90EE90');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }

      animationTime += 0.02;

      // Animate objects
      scene.objects.forEach((obj) => {
        ctx.save();
        
        // Apply animation effects
        let currentX = obj.x;
        let currentY = obj.y;
        let currentRotation = obj.rotation;
        let currentScale = obj.scale;

        switch (obj.animationType) {
          case "bounce":
            currentY = obj.y + Math.sin(animationTime * 3) * 15;
            currentScale = 1 + Math.sin(animationTime * 3) * 0.1;
            break;
          case "float":
            currentY = obj.y + Math.sin(animationTime * 2) * 20;
            currentX = obj.x + Math.cos(animationTime * 2) * 10;
            break;
          case "spin":
            currentRotation = animationTime * 2;
            break;
          case "wiggle":
            currentX = obj.x + Math.sin(animationTime * 5) * 8;
            currentRotation = Math.sin(animationTime * 5) * 0.2;
            break;
        }

        // Smoothly move towards target
        if (obj.isMoving) {
          obj.x += (obj.targetX - obj.x) * 0.05;
          obj.y += (obj.targetY - obj.y) * 0.05;
        }

        // Draw glow for unclicked objects
        if (!clickedObjects.has(obj.id)) {
          ctx.shadowColor = obj.color;
          ctx.shadowBlur = 20 + Math.sin(animationTime * 4) * 10;
        } else {
          ctx.shadowBlur = 0;
        }

        // Transform and draw
        ctx.translate(currentX, currentY);
        ctx.rotate(currentRotation);
        ctx.scale(currentScale, currentScale);
        
        // Draw emoji
        ctx.font = `${obj.size}px Arial`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(obj.emoji, 0, 0);

        // Draw checkmark for clicked objects
        if (clickedObjects.has(obj.id)) {
          ctx.font = '30px Arial';
          ctx.fillText('✅', 20, -20);
        }

        ctx.restore();
      });

      animationFrameRef.current = requestAnimationFrame(animate);
    };

    animate();
  };

  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const scene = scenes[currentScene];
    
    for (const obj of scene.objects) {
      const distance = Math.sqrt((x - obj.x) ** 2 + (y - obj.y) ** 2);
      
      if (distance < obj.size) {
        handleObjectClick(obj);
        break;
      }
    }
  };

  const handleObjectClick = (obj: AnimatedObject) => {
    setClickedObjects(prev => new Set([...prev, obj.id]));
    speakText(obj.soundText);
    
    // Confetti effect
    confetti({
      particleCount: 50,
      spread: 70,
      origin: { 
        x: obj.x / (canvasRef.current?.width || 1),
        y: obj.y / (canvasRef.current?.height || 1)
      },
      colors: [obj.color, '#FFD700', '#FF69B4']
    });

    // Trigger special animation
    obj.scale = 1.3;
    setTimeout(() => {
      obj.scale = 1;
    }, 300);
  };

  const nextScene = () => {
    if (currentScene < scenes.length - 1) {
      setCurrentScene(currentScene + 1);
      setClickedObjects(new Set());
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
    }
  };

  if (loading || generatingImage) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex items-center justify-center">
        <Card className="p-12 text-center">
          <Loader2 className="h-16 w-16 animate-spin mx-auto mb-4 text-purple-600" />
          <p className="text-2xl font-bold">
            {generatingImage ? "✨ Creating magical scenes..." : "Loading story..."}
          </p>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 p-4">
      <div className="max-w-6xl mx-auto">
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

        <Card className="border-4 border-purple-300 shadow-2xl bg-white/90 backdrop-blur-sm overflow-hidden">
          <div className="h-4 bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400" />
          
          {/* Narration */}
          <div className="p-6 bg-gradient-to-r from-purple-100 to-pink-100 text-center">
            <p className="text-3xl font-bold text-purple-900">
              {scenes[currentScene]?.narration}
            </p>
          </div>

          {/* Canvas for animations */}
          <div className="relative">
            <canvas
              ref={canvasRef}
              width={1024}
              height={600}
              onClick={handleCanvasClick}
              className="w-full cursor-pointer"
              style={{ maxHeight: '600px' }}
            />
          </div>

          {/* Controls */}
          <div className="p-6 space-y-4">
            {/* Progress */}
            <div className="flex gap-2">
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

            {/* Found Counter */}
            <div className="text-center text-2xl font-bold text-purple-600">
              Found: {clickedObjects.size} / {scenes[currentScene]?.objects.length || 0}
              {clickedObjects.size === scenes[currentScene]?.objects.length && " 🌟"}
            </div>

            {/* Navigation */}
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
