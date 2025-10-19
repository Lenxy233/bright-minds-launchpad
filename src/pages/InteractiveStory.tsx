import { useEffect, useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import confetti from "canvas-confetti";
import { toast } from "sonner";
import horseImage from "@/assets/habitats/horse.png";
import beeImage from "@/assets/habitats/bee.png";
import fishImage from "@/assets/habitats/fish.png";
import birdImage from "@/assets/habitats/bird.png";
import dogImage from "@/assets/habitats/dog.png";

interface Animal {
  id: string;
  name: string;
  imageUrl: string;
  correctHabitat: { x: number; y: number; width: number; height: number };
  x: number;
  y: number;
  placed: boolean;
  correctMessage: string;
  incorrectMessage: string;
  habitatName: string;
}

const allAnimals: Animal[] = [
  {
    id: "horse",
    name: "Horse",
    imageUrl: horseImage,
    correctHabitat: { x: 0, y: 0, width: 400, height: 400 },
    x: 100,
    y: 500,
    placed: false,
    correctMessage: "Great! Horses live in stables!",
    incorrectMessage: "Not quite! Horses live in stables with hay and shelter.",
    habitatName: "stable"
  },
  {
    id: "bee",
    name: "Bee",
    imageUrl: beeImage,
    correctHabitat: { x: 400, y: 0, width: 400, height: 400 },
    x: 300,
    y: 500,
    placed: false,
    correctMessage: "Amazing! Bees live in beehives!",
    incorrectMessage: "Try again! Bees make honey in beehives.",
    habitatName: "beehive"
  },
  {
    id: "fish",
    name: "Fish",
    imageUrl: fishImage,
    correctHabitat: { x: 800, y: 0, width: 400, height: 400 },
    x: 500,
    y: 500,
    placed: false,
    correctMessage: "Perfect! Fish swim in the ocean!",
    incorrectMessage: "Oops! Fish need water to live in the ocean.",
    habitatName: "ocean"
  },
  {
    id: "bird",
    name: "Bird",
    imageUrl: birdImage,
    correctHabitat: { x: 0, y: 400, width: 600, height: 400 },
    x: 700,
    y: 500,
    placed: false,
    correctMessage: "Wonderful! Birds nest in bird boxes!",
    incorrectMessage: "Not there! Birds like cozy nest boxes in trees.",
    habitatName: "nest box"
  },
  {
    id: "dog",
    name: "Dog",
    imageUrl: dogImage,
    correctHabitat: { x: 600, y: 400, width: 600, height: 400 },
    x: 900,
    y: 500,
    placed: false,
    correctMessage: "Excellent! Dogs sleep in dog houses!",
    incorrectMessage: "Try somewhere else! Dogs have special houses.",
    habitatName: "dog house"
  }
];

export default function InteractiveStory() {
  const [currentAnimalIndex, setCurrentAnimalIndex] = useState(0);
  const [animals, setAnimals] = useState<Animal[]>([allAnimals[0]]);
  const [draggedAnimal, setDraggedAnimal] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (gameStarted) {
      drawScene();
    }
  }, [animals, gameStarted]);

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
        "Welcome kids! Let's help these animals find their homes! Where does the " + animals[0].name.toLowerCase() + " live?"
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

    // Draw habitat grid (2x3 grid of habitats)
    const habitats = [
      { name: "Stable", img: "/lovable-uploads/create_an_animated_image_for_a_stable.jpg", x: 0, y: 0, width: 400 },
      { name: "Beehive", img: "/lovable-uploads/create_an_animated_image_of_the_beehive.jpg", x: 400, y: 0, width: 400 },
      { name: "Ocean", img: "/lovable-uploads/create_an_animated_image_of_the_deap_sea.jpg", x: 800, y: 0, width: 400 },
      { name: "Nest Box", img: "/lovable-uploads/create_an_animated_image_for_a_birds_nestbox.jpg", x: 0, y: 400, width: 600 },
      { name: "Dog House", img: "/lovable-uploads/Untitled_design_8.png", x: 600, y: 400, width: 600 }
    ];

    habitats.forEach(habitat => {
      const img = new Image();
      img.src = habitat.img;
      img.onload = () => {
        const height = 400;
        ctx.drawImage(img, habitat.x, habitat.y, habitat.width, height);
        
        // Draw habitat labels
        ctx.fillStyle = "rgba(255, 255, 255, 0.9)";
        ctx.fillRect(habitat.x + 10, habitat.y + 10, 150, 40);
        ctx.fillStyle = "black";
        ctx.font = "bold 20px Arial";
        ctx.fillText(habitat.name, habitat.x + 20, habitat.y + 37);
      };
    });

    // Draw animals
    animals.forEach((animal) => {
      const img = new Image();
      img.src = animal.imageUrl;
      img.onload = () => {
        if (!animal.placed) {
          const animalSize = 200;
          
          // Draw shadow
          ctx.fillStyle = "rgba(0, 0, 0, 0.25)";
          ctx.beginPath();
          ctx.ellipse(animal.x + animalSize/2, animal.y + animalSize + 10, animalSize/2.5, 30, 0, 0, Math.PI * 2);
          ctx.fill();

          // Draw animal
          ctx.drawImage(img, animal.x, animal.y, animalSize, animalSize);
          
          // Draw animal name
          const nameWidth = animalSize;
          ctx.fillStyle = "rgba(0, 0, 0, 0.8)";
          ctx.fillRect(animal.x, animal.y - 50, nameWidth, 45);
          ctx.fillStyle = "white";
          ctx.font = "bold 28px Arial";
          ctx.textAlign = "center";
          ctx.fillText(animal.name, animal.x + animalSize/2, animal.y - 15);
        }
      };
    });
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const animalSize = 200;
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
    const animalSize = 200;
    const x = e.clientX - rect.left - animalSize/2;
    const y = e.clientY - rect.top - animalSize/2;

    setAnimals((prevAnimals) =>
      prevAnimals.map((animal) =>
        animal.id === draggedAnimal ? { ...animal, x, y } : animal
      )
    );
  };

  const handleMouseUp = () => {
    if (!draggedAnimal) return;

    const animal = animals.find((a) => a.id === draggedAnimal);
    if (!animal) return;

    const animalSize = 200;
    const centerX = animal.x + animalSize / 2;
    const centerY = animal.y + animalSize / 2;

    // Check if animal is in correct habitat
    const isCorrect =
      centerX >= animal.correctHabitat.x &&
      centerX <= animal.correctHabitat.x + animal.correctHabitat.width &&
      centerY >= animal.correctHabitat.y &&
      centerY <= animal.correctHabitat.y + animal.correctHabitat.height;

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
      setAnimals((prevAnimals) =>
        prevAnimals.map((a) =>
          a.id === draggedAnimal ? { ...a, placed: true } : a
        )
      );

      // Add next animal after a delay
      setTimeout(() => {
        if (currentAnimalIndex < allAnimals.length - 1) {
          const nextIndex = currentAnimalIndex + 1;
          setCurrentAnimalIndex(nextIndex);
          setAnimals((prev) => [...prev, allAnimals[nextIndex]]);

          const nextAnimal = allAnimals[nextIndex];
          const nextSpeech = new SpeechSynthesisUtterance(
            `Great job! Now, where does the ${nextAnimal.name.toLowerCase()} live?`
          );
          nextSpeech.rate = 0.9;
          nextSpeech.pitch = 1.1;
          window.speechSynthesis.speak(nextSpeech);
        } else {
          const finalSpeech = new SpeechSynthesisUtterance(
            "Fantastic! You helped all the animals find their homes!"
          );
          finalSpeech.rate = 0.9;
          finalSpeech.pitch = 1.1;
          window.speechSynthesis.speak(finalSpeech);
          
          toast.success("🎉 You completed the game!");
        }
      }, 2000);
    } else {
      toast.error(animal.incorrectMessage);
      
      const speech = new SpeechSynthesisUtterance(animal.incorrectMessage);
      speech.rate = 0.9;
      speech.pitch = 1.0;
      window.speechSynthesis.speak(speech);
    }

    setDraggedAnimal(null);
  };

  const resetGame = () => {
    window.speechSynthesis.cancel();
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    setCurrentAnimalIndex(0);
    setAnimals([allAnimals[0]]);
    setScore(0);
    setGameStarted(false);
    setDraggedAnimal(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-200 to-green-200 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold text-primary mb-4">
            Match Animals to Their Homes! 🏡
          </h1>
          <p className="text-2xl text-secondary-foreground mb-4">
            Drag each animal to where it lives
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
