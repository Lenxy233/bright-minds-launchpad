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
}

export default function InteractiveStory() {
  const [animals, setAnimals] = useState<Animal[]>([
    { id: "camel", name: "Camel", imageUrl: camelImage, correctHabitat: "desert", x: 50, y: 300, placed: false },
    { id: "elephant", name: "Elephant", imageUrl: elephantImage, correctHabitat: "forest", x: 50, y: 500, placed: false },
  ]);
  const [draggedAnimal, setDraggedAnimal] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    drawScene();
  }, [animals]);

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

      // Draw drop zones with labels
      ctx.strokeStyle = "rgba(255, 255, 255, 0.8)";
      ctx.lineWidth = 4;
      ctx.setLineDash([15, 10]);
      
      // Forest zone (left half)
      ctx.strokeRect(50, 50, 500, 600);
      ctx.fillStyle = "white";
      ctx.shadowColor = "rgba(0, 0, 0, 0.5)";
      ctx.shadowBlur = 10;
      ctx.font = "bold 32px Arial";
      ctx.fillText("🌳 FOREST", 200, 100);
      
      // Desert zone (right half)
      ctx.strokeRect(600, 50, 500, 600);
      ctx.fillText("🏜️ DESERT", 750, 100);
      
      ctx.setLineDash([]);
      ctx.shadowBlur = 0;

      // Draw animals
      animals.forEach((animal) => {
        const img = new Image();
        img.src = animal.imageUrl;
        img.onload = () => {
          if (!animal.placed) {
            // Draw shadow
            ctx.fillStyle = "rgba(0, 0, 0, 0.3)";
            ctx.beginPath();
            ctx.ellipse(animal.x + 60, animal.y + 130, 50, 15, 0, 0, Math.PI * 2);
            ctx.fill();

            // Draw animal
            ctx.drawImage(img, animal.x, animal.y, 120, 120);
            
            // Draw animal name with background
            ctx.fillStyle = "rgba(0, 0, 0, 0.6)";
            ctx.fillRect(animal.x, animal.y - 35, 120, 30);
            ctx.fillStyle = "white";
            ctx.font = "bold 18px Arial";
            ctx.textAlign = "center";
            ctx.fillText(animal.name, animal.x + 60, animal.y - 12);
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

    const clickedAnimal = animals.find(
      (animal) =>
        !animal.placed &&
        x >= animal.x &&
        x <= animal.x + 120 &&
        y >= animal.y &&
        y <= animal.y + 120
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
    const x = e.clientX - rect.left - 60;
    const y = e.clientY - rect.top - 60;

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
      
      const utterance = new SpeechSynthesisUtterance(
        `Great job! ${animal.name} lives in the ${animal.correctHabitat}!`
      );
      window.speechSynthesis.speak(utterance);
      
      toast.success(`Correct! ${animal.name} belongs in the ${animal.correctHabitat}! 🎉`);
      
      // Check if all animals placed
      if (animals.filter((a) => !a.placed).length === 1) {
        setTimeout(() => {
          toast.success("🎊 Amazing! You matched all the animals correctly!");
        }, 1000);
      }
    } else if (inForestZone || inDesertZone) {
      toast.error(`Oops! Try again. ${animal.name} doesn't live there.`);
      
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
    setAnimals([
      { id: "camel", name: "Camel", imageUrl: camelImage, correctHabitat: "desert", x: 50, y: 300, placed: false },
      { id: "elephant", name: "Elephant", imageUrl: elephantImage, correctHabitat: "forest", x: 50, y: 500, placed: false },
    ]);
    setScore(0);
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

        <div className="bg-white rounded-lg shadow-2xl p-6 mb-6">
          <p className="text-xl text-center mb-6 font-medium text-gray-700">
            🎯 Drag each animal to its correct habitat! Forest on the left, Desert on the right.
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
      </div>
    </div>
  );
}
