import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import confetti from "canvas-confetti";
import { toast } from "sonner";
import backgroundImage from "@/assets/habitats/forest-desert-split.jpg";
import camelImage from "@/assets/habitats/camel.jpg";
import elephantImage from "@/assets/habitats/elephant.jpg";

interface Animal {
  id: string;
  name: string;
  imageUrl: string;
  correctHabitat: "forest" | "desert";
  x: number;
  y: number;
  placed: boolean;
  correctMessage: string;
  incorrectMessage: string;
  educationalInfo: string;
}

export default function InteractiveStory() {
  const allAnimals: Animal[] = [
    { 
      id: "elephant", 
      name: "Elephant", 
      imageUrl: elephantImage, 
      correctHabitat: "forest", 
      x: 50, 
      y: 500, 
      placed: false,
      correctMessage: "Good job! The elephant lives in the forest.",
      incorrectMessage: "No, that is not right. The elephant does not live in the desert. Let's try again.",
      educationalInfo: "It is mainly herbivore that its main food is plants."
    },
    { 
      id: "camel", 
      name: "Camel", 
      imageUrl: camelImage, 
      correctHabitat: "desert", 
      x: 50, 
      y: 300, 
      placed: false,
      correctMessage: "Excellent! The camel lives in the desert.",
      incorrectMessage: "Oops! The camel does not live in the forest. Try again.",
      educationalInfo: "Camels are adapted to survive in hot, dry conditions with very little water."
    },
  ];

  const [currentAnimalIndex, setCurrentAnimalIndex] = useState(0);
  const [animals, setAnimals] = useState<Animal[]>([allAnimals[0]]);
  const [draggedAnimal, setDraggedAnimal] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    drawScene();
  }, [animals]);

  const startGame = () => {
    // Introduction speech only (no background music for now)
    setTimeout(() => {
      const intro = new SpeechSynthesisUtterance(
        "Hey kids, let's play a fun game! Where does the elephant live?"
      );
      intro.rate = 0.9;
      intro.pitch = 1.1;
      window.speechSynthesis.speak(intro);
    }, 500);
    
    setGameStarted(true);
  };

  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  const drawScene = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw background
    const bg = new Image();
    bg.src = backgroundImage;
    bg.onload = () => {
      ctx.drawImage(bg, 0, 0, canvas.width, canvas.height);

      // Draw animals - larger and bolder, centered in canvas
      animals.forEach((animal) => {
        const img = new Image();
        img.src = animal.imageUrl;
        img.onload = () => {
          if (!animal.placed) {
            const animalSize = 300; // Very large!
            
            // Draw white circle background to make animal stand out
            ctx.fillStyle = "rgba(255, 255, 255, 0.9)";
            ctx.beginPath();
            ctx.arc(animal.x + animalSize/2, animal.y + animalSize/2, animalSize/2 + 10, 0, Math.PI * 2);
            ctx.fill();
            
            // Draw shadow
            ctx.fillStyle = "rgba(0, 0, 0, 0.2)";
            ctx.beginPath();
            ctx.ellipse(animal.x + animalSize/2, animal.y + animalSize + 30, animalSize/2.5, 30, 0, 0, Math.PI * 2);
            ctx.fill();

            // Draw animal
            ctx.drawImage(img, animal.x, animal.y, animalSize, animalSize);
            
            // Draw animal name with background - larger text
            const nameWidth = animalSize;
            ctx.fillStyle = "rgba(0, 0, 0, 0.8)";
            ctx.fillRect(animal.x, animal.y - 60, nameWidth, 50);
            ctx.fillStyle = "white";
            ctx.font = "bold 32px Arial";
            ctx.textAlign = "center";
            ctx.fillText(animal.name, animal.x + animalSize/2, animal.y - 18);
          }
        };
      });
    };
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const animalSize = 300;
    const clickedAnimal = animals.find(
      (animal) =>
        !animal.placed &&
        x >= animal.x &&
        x <= animal.x + animalSize &&
        y >= animal.y &&
        y <= animal.y + animalSize
    );

    if (clickedAnimal) {
      setDraggedAnimal(clickedAnimal.id);
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!draggedAnimal) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const animalSize = 300;
    const x = e.clientX - rect.left - animalSize/2;
    const y = e.clientY - rect.top - animalSize/2;

    setAnimals((prev) =>
      prev.map((animal) =>
        animal.id === draggedAnimal ? { ...animal, x, y } : animal
      )
    );
  };

  const handleMouseUp = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!draggedAnimal) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const animal = animals.find((a) => a.id === draggedAnimal);
    if (!animal) return;

    // Check if dropped in correct zone
    const inForestZone = x >= 50 && x <= 550 && y >= 50 && y <= 650;
    const inDesertZone = x >= 600 && x <= 1100 && y >= 50 && y <= 650;

    let isCorrect = false;
    if (inForestZone && animal.correctHabitat === "forest") {
      isCorrect = true;
    } else if (inDesertZone && animal.correctHabitat === "desert") {
      isCorrect = true;
    }

    if (isCorrect) {
      setAnimals((prev) =>
        prev.map((a) =>
          a.id === draggedAnimal ? { ...a, placed: true } : a
        )
      );
      setScore((prev) => prev + 1);
      
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
      });
      
      const fullMessage = `${animal.correctMessage} ${animal.educationalInfo}`;
      const utterance = new SpeechSynthesisUtterance(fullMessage);
      window.speechSynthesis.speak(utterance);
      
      toast.success(animal.correctMessage);
      
      // Move to next animal
      setTimeout(() => {
        const nextIndex = currentAnimalIndex + 1;
        if (nextIndex < allAnimals.length) {
          setCurrentAnimalIndex(nextIndex);
          setAnimals([allAnimals[nextIndex]]);
          
          setTimeout(() => {
            const nextAnimal = allAnimals[nextIndex];
            const nextIntro = new SpeechSynthesisUtterance(
              `Now, where does the ${nextAnimal.name.toLowerCase()} live?`
            );
            window.speechSynthesis.speak(nextIntro);
          }, 2000);
        } else {
          setTimeout(() => {
            const finalMessage = new SpeechSynthesisUtterance(
              "Amazing! You matched all the animals correctly! Great job!"
            );
            window.speechSynthesis.speak(finalMessage);
            toast.success("🎊 You completed the game!");
          }, 2000);
        }
      }, 3000);
    } else if (inForestZone || inDesertZone) {
      const utterance = new SpeechSynthesisUtterance(animal.incorrectMessage);
      window.speechSynthesis.speak(utterance);
      toast.error("Try again!");
      
      // Reset position
      setAnimals((prev) =>
        prev.map((a) =>
          a.id === draggedAnimal
            ? { ...a, x: 50, y: a.correctHabitat === "desert" ? 300 : 500 }
            : a
        )
      );
    }

    setDraggedAnimal(null);
  };

  const resetGame = () => {
    window.speechSynthesis.cancel();
    setCurrentAnimalIndex(0);
    setAnimals([allAnimals[0]]);
    setScore(0);
    setGameStarted(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-green-50 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6 flex justify-between items-center">
          <h1 className="text-4xl font-bold text-primary">
            🦁 Animal Habitat Match 🌍
          </h1>
          <div className="flex gap-4 items-center">
            <div className="text-2xl font-bold text-primary">
              Score: {score}
            </div>
            <Button onClick={resetGame} variant="outline" size="lg">
              🔄 Reset Game
            </Button>
          </div>
        </div>

        {!gameStarted && (
          <div className="bg-white rounded-lg shadow-2xl p-12 mb-6 text-center">
            <h2 className="text-3xl font-bold mb-4 text-primary">Ready to Play?</h2>
            <p className="text-xl mb-6 text-gray-700">Click start to begin the fun animal habitat game with voice guidance!</p>
            <Button onClick={startGame} size="lg" className="text-2xl py-6 px-12">
              🎮 Start Game
            </Button>
          </div>
        )}

        {gameStarted && (
          <div className="bg-white rounded-lg shadow-2xl p-6 mb-6">
            <p className="text-xl text-center mb-6 font-medium text-gray-700">
              🎯 Listen carefully and drag the animal to where it lives!
            </p>

          <div className="relative">
            <canvas
              ref={canvasRef}
              width={1200}
              height={700}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              className="w-full border-4 border-primary/20 rounded-lg cursor-pointer"
              style={{ cursor: draggedAnimal ? 'grabbing' : 'grab' }}
            />
          </div>

            <div className="mt-6 text-center text-sm text-muted-foreground">
              💡 Tip: Click and drag the animals to the habitat where they naturally live!
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
