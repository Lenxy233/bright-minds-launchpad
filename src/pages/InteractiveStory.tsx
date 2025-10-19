import { useEffect, useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import confetti from "canvas-confetti";
import { toast } from "sonner";
import horseImage from "@/assets/habitats/horse.png";
import beeImage from "@/assets/habitats/bee.png";
import fishImage from "@/assets/habitats/fish.png";
import birdImage from "@/assets/habitats/bird.png";
import dogImage from "@/assets/habitats/dog.png";
import stableImage from "@/assets/habitats/stable.jpg";
import beehiveImage from "@/assets/habitats/beehive.jpg";
import oceanImage from "@/assets/habitats/ocean.jpg";
import nestboxImage from "@/assets/habitats/nestbox.jpg";
import doghouseImage from "@/assets/habitats/doghouse.png";

interface Animal {
  id: string;
  name: string;
  imageUrl: string;
  correctHabitatId: string;
  x: number;
  y: number;
  correctMessage: string;
  incorrectMessage: string;
}

interface Habitat {
  id: string;
  name: string;
  imageUrl: string;
  x: number;
  y: number;
}

interface Connection {
  animalId: string;
  habitatId: string;
  isCorrect: boolean;
}

const allAnimals: Animal[] = [
  {
    id: "horse",
    name: "Horse",
    imageUrl: horseImage,
    correctHabitatId: "stable",
    x: 50,
    y: 80,
    correctMessage: "Great! Horses live in stables!",
    incorrectMessage: "Not quite! Horses live in stables with hay and shelter."
  },
  {
    id: "bee",
    name: "Bee",
    imageUrl: beeImage,
    correctHabitatId: "beehive",
    x: 50,
    y: 200,
    correctMessage: "Amazing! Bees live in beehives!",
    incorrectMessage: "Try again! Bees make honey in beehives."
  },
  {
    id: "fish",
    name: "Fish",
    imageUrl: fishImage,
    correctHabitatId: "ocean",
    x: 50,
    y: 320,
    correctMessage: "Perfect! Fish swim in the ocean!",
    incorrectMessage: "Oops! Fish need water to live in the ocean."
  },
  {
    id: "bird",
    name: "Bird",
    imageUrl: birdImage,
    correctHabitatId: "nestbox",
    x: 50,
    y: 440,
    correctMessage: "Wonderful! Birds nest in bird boxes!",
    incorrectMessage: "Not there! Birds like cozy nest boxes in trees."
  },
  {
    id: "dog",
    name: "Dog",
    imageUrl: dogImage,
    correctHabitatId: "doghouse",
    x: 50,
    y: 560,
    correctMessage: "Excellent! Dogs sleep in dog houses!",
    incorrectMessage: "Try somewhere else! Dogs have special houses."
  }
];

const allHabitats: Habitat[] = [
  { id: "stable", name: "Stable", imageUrl: stableImage, x: 1030, y: 80 },
  { id: "beehive", name: "Beehive", imageUrl: beehiveImage, x: 1030, y: 200 },
  { id: "ocean", name: "Ocean", imageUrl: oceanImage, x: 1030, y: 320 },
  { id: "nestbox", name: "Nest Box", imageUrl: nestboxImage, x: 1030, y: 440 },
  { id: "doghouse", name: "Dog House", imageUrl: doghouseImage, x: 1030, y: 560 }
];

export default function InteractiveStory() {
  const [connections, setConnections] = useState<Connection[]>([]);
  const [score, setScore] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);
  const [drawingFrom, setDrawingFrom] = useState<{ id: string; x: number; y: number } | null>(null);
  const [currentMousePos, setCurrentMousePos] = useState<{ x: number; y: number } | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const imageSize = 120;

  useEffect(() => {
    if (gameStarted) {
      drawScene();
    }
  }, [connections, gameStarted, drawingFrom, currentMousePos]);

  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  const startGame = () => {
    setGameStarted(true);
    
    // Play background music
    try {
      audioRef.current = new Audio('https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3');
      audioRef.current.loop = true;
      audioRef.current.volume = 0.2;
      audioRef.current.play().catch((err) => {
        console.log("Background music couldn't play:", err);
      });
    } catch (err) {
      console.log("Audio error:", err);
    }

    // Introduction speech
    setTimeout(() => {
      const intro = new SpeechSynthesisUtterance(
        "Welcome kids! Draw lines to match each animal with its home!"
      );
      intro.rate = 0.9;
      intro.pitch = 1.1;
      window.speechSynthesis.speak(intro);
    }, 500);
  };

  const drawScene = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw all connections
    connections.forEach((connection) => {
      const animal = allAnimals.find((a) => a.id === connection.animalId);
      const habitat = allHabitats.find((h) => h.id === connection.habitatId);
      if (!animal || !habitat) return;

      ctx.beginPath();
      ctx.moveTo(animal.x + imageSize, animal.y + imageSize / 2);
      ctx.lineTo(habitat.x, habitat.y + imageSize / 2);
      ctx.strokeStyle = connection.isCorrect ? "#22c55e" : "#ef4444";
      ctx.lineWidth = 4;
      ctx.stroke();
    });

    // Draw line being drawn
    if (drawingFrom && currentMousePos) {
      ctx.beginPath();
      ctx.moveTo(drawingFrom.x, drawingFrom.y);
      ctx.lineTo(currentMousePos.x, currentMousePos.y);
      ctx.strokeStyle = "#3b82f6";
      ctx.lineWidth = 3;
      ctx.setLineDash([5, 5]);
      ctx.stroke();
      ctx.setLineDash([]);
    }

    // Draw animals on the left
    allAnimals.forEach((animal) => {
      const img = new Image();
      img.src = animal.imageUrl;
      img.onload = () => {
        // Draw border around animal
        const isConnected = connections.some((c) => c.animalId === animal.id);
        ctx.strokeStyle = isConnected ? "#22c55e" : "#e5e7eb";
        ctx.lineWidth = 3;
        ctx.strokeRect(animal.x, animal.y, imageSize, imageSize);

        ctx.drawImage(img, animal.x, animal.y, imageSize, imageSize);
        
        // Draw animal name below
        ctx.fillStyle = "black";
        ctx.font = "bold 16px Arial";
        ctx.textAlign = "center";
        ctx.fillText(animal.name, animal.x + imageSize / 2, animal.y + imageSize + 20);
      };
    });

    // Draw habitats on the right
    allHabitats.forEach((habitat) => {
      const img = new Image();
      img.src = habitat.imageUrl;
      img.onload = () => {
        // Draw border around habitat
        const isConnected = connections.some((c) => c.habitatId === habitat.id);
        ctx.strokeStyle = isConnected ? "#22c55e" : "#e5e7eb";
        ctx.lineWidth = 3;
        ctx.strokeRect(habitat.x, habitat.y, imageSize, imageSize);

        ctx.drawImage(img, habitat.x, habitat.y, imageSize, imageSize);
        
        // Draw habitat name below
        ctx.fillStyle = "black";
        ctx.font = "bold 16px Arial";
        ctx.textAlign = "center";
        ctx.fillText(habitat.name, habitat.x + imageSize / 2, habitat.y + imageSize + 20);
      };
    });
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Check if clicking on an animal
    const clickedAnimal = allAnimals.find(
      (animal) =>
        x >= animal.x &&
        x <= animal.x + imageSize &&
        y >= animal.y &&
        y <= animal.y + imageSize
    );

    if (clickedAnimal && !connections.some((c) => c.animalId === clickedAnimal.id)) {
      setDrawingFrom({
        id: clickedAnimal.id,
        x: clickedAnimal.x + imageSize,
        y: clickedAnimal.y + imageSize / 2,
      });
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!drawingFrom) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    setCurrentMousePos({ x, y });
  };

  const handleMouseUp = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!drawingFrom) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Check if released on a habitat
    const clickedHabitat = allHabitats.find(
      (habitat) =>
        x >= habitat.x &&
        x <= habitat.x + imageSize &&
        y >= habitat.y &&
        y <= habitat.y + imageSize
    );

    if (clickedHabitat) {
      const animal = allAnimals.find((a) => a.id === drawingFrom.id);
      if (!animal) return;

      const isCorrect = animal.correctHabitatId === clickedHabitat.id;

      // Add connection
      setConnections((prev) => [
        ...prev,
        { animalId: animal.id, habitatId: clickedHabitat.id, isCorrect },
      ]);

      if (isCorrect) {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
        });

        toast.success(animal.correctMessage);

        const speech = new SpeechSynthesisUtterance(animal.correctMessage);
        speech.rate = 0.9;
        speech.pitch = 1.1;
        window.speechSynthesis.speak(speech);

        setScore((prev) => prev + 1);

        // Check if all animals are matched correctly
        if (connections.length + 1 === allAnimals.length && connections.every((c) => c.isCorrect)) {
          setTimeout(() => {
            const finalSpeech = new SpeechSynthesisUtterance(
              "Fantastic! You matched all the animals to their homes!"
            );
            finalSpeech.rate = 0.9;
            finalSpeech.pitch = 1.1;
            window.speechSynthesis.speak(finalSpeech);
            
            toast.success("🎉 You completed the game!");
          }, 1500);
        }
      } else {
        toast.error(animal.incorrectMessage);
        
        const speech = new SpeechSynthesisUtterance(animal.incorrectMessage);
        speech.rate = 0.9;
        speech.pitch = 1.0;
        window.speechSynthesis.speak(speech);
      }
    }

    setDrawingFrom(null);
    setCurrentMousePos(null);
  };

  const resetGame = () => {
    window.speechSynthesis.cancel();
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    setConnections([]);
    setScore(0);
    setGameStarted(false);
    setDrawingFrom(null);
    setCurrentMousePos(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-200 to-green-200 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold text-primary mb-4">
            Match Animals to Their Homes! 🏡
          </h1>
          <p className="text-2xl text-secondary-foreground mb-4">
            Draw lines to match each animal with its home!
          </p>
          <div className="flex justify-center gap-8 items-center">
            <p className="text-3xl font-bold text-primary">Score: {score}/{allAnimals.length}</p>
            <Button onClick={resetGame} variant="outline" size="lg">
              Reset Game
            </Button>
          </div>
        </div>

        {!gameStarted ? (
          <div className="text-center">
            <Button
              onClick={startGame}
              size="lg"
              className="text-2xl px-12 py-8 bg-primary hover:bg-primary/90"
            >
              🎮 Start Game
            </Button>
          </div>
        ) : (
          <div className="flex justify-center">
            <canvas
              ref={canvasRef}
              width={1200}
              height={800}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              className="border-4 border-primary rounded-xl shadow-2xl cursor-pointer bg-white"
            />
          </div>
        )}
      </div>
    </div>
  );
}
