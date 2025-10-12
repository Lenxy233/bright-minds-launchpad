import { useEffect, useRef, useState } from "react";
import { Canvas as FabricCanvas, Circle, Rect, FabricImage } from "fabric";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Eraser, Download, CheckCircle, XCircle } from "lucide-react";
import { toast } from "sonner";
import { Progress } from "@/components/ui/progress";

// Import all alphabet recognition worksheets
import letterA from "@/assets/alphabet-recognition/letter-a.jpg";
import letterB from "@/assets/alphabet-recognition/letter-b.jpg";
import letterC from "@/assets/alphabet-recognition/letter-c.jpg";
import letterD from "@/assets/alphabet-recognition/letter-d.jpg";
import letterE from "@/assets/alphabet-recognition/letter-e.jpg";
import letterF from "@/assets/alphabet-recognition/letter-f.jpg";
import letterG from "@/assets/alphabet-recognition/letter-g.jpg";
import letterH from "@/assets/alphabet-recognition/letter-h.jpg";
import letterI from "@/assets/alphabet-recognition/letter-i.jpg";
import letterJ from "@/assets/alphabet-recognition/letter-j.jpg";
import letterK from "@/assets/alphabet-recognition/letter-k.jpg";
import letterL from "@/assets/alphabet-recognition/letter-l.jpg";
import letterM from "@/assets/alphabet-recognition/letter-m.jpg";
import letterN from "@/assets/alphabet-recognition/letter-n.jpg";
import letterO from "@/assets/alphabet-recognition/letter-o.jpg";
import letterP from "@/assets/alphabet-recognition/letter-p.jpg";
import letterQ from "@/assets/alphabet-recognition/letter-q.jpg";
import letterR from "@/assets/alphabet-recognition/letter-r.jpg";
import letterS from "@/assets/alphabet-recognition/letter-s.jpg";
import letterT from "@/assets/alphabet-recognition/letter-t.jpg";
import letterU from "@/assets/alphabet-recognition/letter-u.jpg";
import letterV from "@/assets/alphabet-recognition/letter-v.jpg";
import letterW from "@/assets/alphabet-recognition/letter-w.jpg";
import letterX from "@/assets/alphabet-recognition/letter-x.jpg";
import letterY from "@/assets/alphabet-recognition/letter-y.jpg";
import letterZ from "@/assets/alphabet-recognition/letter-z.jpg";

// Define correct regions for each worksheet (approximate coordinates)
// Each region represents an item with the correct letter
const alphabetWorksheets = [
  { 
    letter: "A", 
    image: letterA, 
    theme: "Apple",
    correctRegions: [
      { x: 100, y: 200, width: 150, height: 150 },
      { x: 350, y: 200, width: 150, height: 150 },
      { x: 600, y: 200, width: 150, height: 150 },
      { x: 100, y: 450, width: 150, height: 150 },
      { x: 350, y: 450, width: 150, height: 150 },
    ],
    totalItems: 8
  },
  { 
    letter: "B", 
    image: letterB, 
    theme: "Bee",
    correctRegions: [
      { x: 100, y: 200, width: 150, height: 150 },
      { x: 350, y: 200, width: 150, height: 150 },
      { x: 600, y: 200, width: 150, height: 150 },
      { x: 100, y: 450, width: 150, height: 150 },
      { x: 350, y: 450, width: 150, height: 150 },
    ],
    totalItems: 8
  },
  { 
    letter: "C", 
    image: letterC, 
    theme: "Car",
    correctRegions: [
      { x: 100, y: 200, width: 150, height: 150 },
      { x: 350, y: 200, width: 150, height: 150 },
      { x: 600, y: 200, width: 150, height: 150 },
      { x: 100, y: 450, width: 150, height: 150 },
      { x: 350, y: 450, width: 150, height: 150 },
    ],
    totalItems: 8
  },
  { 
    letter: "D", 
    image: letterD, 
    theme: "Dinosaur",
    correctRegions: [
      { x: 100, y: 200, width: 150, height: 150 },
      { x: 350, y: 200, width: 150, height: 150 },
      { x: 600, y: 200, width: 150, height: 150 },
      { x: 100, y: 450, width: 150, height: 150 },
      { x: 350, y: 450, width: 150, height: 150 },
    ],
    totalItems: 8
  },
  { 
    letter: "E", 
    image: letterE, 
    theme: "Elephant",
    correctRegions: [
      { x: 100, y: 200, width: 150, height: 150 },
      { x: 350, y: 200, width: 150, height: 150 },
      { x: 600, y: 200, width: 150, height: 150 },
      { x: 100, y: 450, width: 150, height: 150 },
      { x: 350, y: 450, width: 150, height: 150 },
    ],
    totalItems: 8
  },
  { 
    letter: "F", 
    image: letterF, 
    theme: "Fish",
    correctRegions: [
      { x: 100, y: 200, width: 150, height: 150 },
      { x: 350, y: 200, width: 150, height: 150 },
      { x: 600, y: 200, width: 150, height: 150 },
      { x: 100, y: 450, width: 150, height: 150 },
      { x: 350, y: 450, width: 150, height: 150 },
    ],
    totalItems: 8
  },
  { 
    letter: "G", 
    image: letterG, 
    theme: "Girl",
    correctRegions: [
      { x: 100, y: 200, width: 150, height: 150 },
      { x: 350, y: 200, width: 150, height: 150 },
      { x: 600, y: 200, width: 150, height: 150 },
      { x: 100, y: 450, width: 150, height: 150 },
      { x: 350, y: 450, width: 150, height: 150 },
    ],
    totalItems: 8
  },
  { 
    letter: "H", 
    image: letterH, 
    theme: "Hat",
    correctRegions: [
      { x: 100, y: 200, width: 150, height: 150 },
      { x: 350, y: 200, width: 150, height: 150 },
      { x: 600, y: 200, width: 150, height: 150 },
      { x: 100, y: 450, width: 150, height: 150 },
      { x: 350, y: 450, width: 150, height: 150 },
    ],
    totalItems: 8
  },
  { 
    letter: "I", 
    image: letterI, 
    theme: "Ice cream",
    correctRegions: [
      { x: 100, y: 200, width: 150, height: 150 },
      { x: 350, y: 200, width: 150, height: 150 },
      { x: 600, y: 200, width: 150, height: 150 },
      { x: 100, y: 450, width: 150, height: 150 },
      { x: 350, y: 450, width: 150, height: 150 },
    ],
    totalItems: 8
  },
  { 
    letter: "J", 
    image: letterJ, 
    theme: "Jet",
    correctRegions: [
      { x: 100, y: 200, width: 150, height: 150 },
      { x: 350, y: 200, width: 150, height: 150 },
      { x: 600, y: 200, width: 150, height: 150 },
      { x: 100, y: 450, width: 150, height: 150 },
      { x: 350, y: 450, width: 150, height: 150 },
    ],
    totalItems: 8
  },
  { 
    letter: "K", 
    image: letterK, 
    theme: "Kitten",
    correctRegions: [
      { x: 100, y: 200, width: 150, height: 150 },
      { x: 350, y: 200, width: 150, height: 150 },
      { x: 600, y: 200, width: 150, height: 150 },
      { x: 100, y: 450, width: 150, height: 150 },
      { x: 350, y: 450, width: 150, height: 150 },
    ],
    totalItems: 8
  },
  { 
    letter: "L", 
    image: letterL, 
    theme: "Lemon",
    correctRegions: [
      { x: 100, y: 200, width: 150, height: 150 },
      { x: 350, y: 200, width: 150, height: 150 },
      { x: 600, y: 200, width: 150, height: 150 },
      { x: 100, y: 450, width: 150, height: 150 },
      { x: 350, y: 450, width: 150, height: 150 },
    ],
    totalItems: 8
  },
  { 
    letter: "M", 
    image: letterM, 
    theme: "Moon",
    correctRegions: [
      { x: 100, y: 200, width: 150, height: 150 },
      { x: 350, y: 200, width: 150, height: 150 },
      { x: 600, y: 200, width: 150, height: 150 },
      { x: 100, y: 450, width: 150, height: 150 },
      { x: 350, y: 450, width: 150, height: 150 },
    ],
    totalItems: 8
  },
  { 
    letter: "N", 
    image: letterN, 
    theme: "Nest",
    correctRegions: [
      { x: 100, y: 200, width: 150, height: 150 },
      { x: 350, y: 200, width: 150, height: 150 },
      { x: 600, y: 200, width: 150, height: 150 },
      { x: 100, y: 450, width: 150, height: 150 },
      { x: 350, y: 450, width: 150, height: 150 },
    ],
    totalItems: 8
  },
  { 
    letter: "O", 
    image: letterO, 
    theme: "Octopus",
    correctRegions: [
      { x: 100, y: 200, width: 150, height: 150 },
      { x: 350, y: 200, width: 150, height: 150 },
      { x: 600, y: 200, width: 150, height: 150 },
      { x: 100, y: 450, width: 150, height: 150 },
      { x: 350, y: 450, width: 150, height: 150 },
    ],
    totalItems: 8
  },
  { 
    letter: "P", 
    image: letterP, 
    theme: "Pig",
    correctRegions: [
      { x: 100, y: 200, width: 150, height: 150 },
      { x: 350, y: 200, width: 150, height: 150 },
      { x: 600, y: 200, width: 150, height: 150 },
      { x: 100, y: 450, width: 150, height: 150 },
      { x: 350, y: 450, width: 150, height: 150 },
    ],
    totalItems: 8
  },
  { 
    letter: "Q", 
    image: letterQ, 
    theme: "Queen",
    correctRegions: [
      { x: 100, y: 200, width: 150, height: 150 },
      { x: 350, y: 200, width: 150, height: 150 },
      { x: 600, y: 200, width: 150, height: 150 },
      { x: 100, y: 450, width: 150, height: 150 },
      { x: 350, y: 450, width: 150, height: 150 },
    ],
    totalItems: 8
  },
  { 
    letter: "R", 
    image: letterR, 
    theme: "Rainbow",
    correctRegions: [
      { x: 100, y: 200, width: 150, height: 150 },
      { x: 350, y: 200, width: 150, height: 150 },
      { x: 600, y: 200, width: 150, height: 150 },
      { x: 100, y: 450, width: 150, height: 150 },
      { x: 350, y: 450, width: 150, height: 150 },
    ],
    totalItems: 8
  },
  { 
    letter: "S", 
    image: letterS, 
    theme: "Sun",
    correctRegions: [
      { x: 100, y: 200, width: 150, height: 150 },
      { x: 350, y: 200, width: 150, height: 150 },
      { x: 600, y: 200, width: 150, height: 150 },
      { x: 100, y: 450, width: 150, height: 150 },
      { x: 350, y: 450, width: 150, height: 150 },
    ],
    totalItems: 8
  },
  { 
    letter: "T", 
    image: letterT, 
    theme: "Turtle",
    correctRegions: [
      { x: 100, y: 200, width: 150, height: 150 },
      { x: 350, y: 200, width: 150, height: 150 },
      { x: 600, y: 200, width: 150, height: 150 },
      { x: 100, y: 450, width: 150, height: 150 },
      { x: 350, y: 450, width: 150, height: 150 },
    ],
    totalItems: 8
  },
  { 
    letter: "U", 
    image: letterU, 
    theme: "Umbrella",
    correctRegions: [
      { x: 100, y: 200, width: 150, height: 150 },
      { x: 350, y: 200, width: 150, height: 150 },
      { x: 600, y: 200, width: 150, height: 150 },
      { x: 100, y: 450, width: 150, height: 150 },
      { x: 350, y: 450, width: 150, height: 150 },
    ],
    totalItems: 8
  },
  { 
    letter: "V", 
    image: letterV, 
    theme: "Violin",
    correctRegions: [
      { x: 100, y: 200, width: 150, height: 150 },
      { x: 350, y: 200, width: 150, height: 150 },
      { x: 600, y: 200, width: 150, height: 150 },
      { x: 100, y: 450, width: 150, height: 150 },
      { x: 350, y: 450, width: 150, height: 150 },
    ],
    totalItems: 8
  },
  { 
    letter: "W", 
    image: letterW, 
    theme: "Watermelon",
    correctRegions: [
      { x: 100, y: 200, width: 150, height: 150 },
      { x: 350, y: 200, width: 150, height: 150 },
      { x: 600, y: 200, width: 150, height: 150 },
      { x: 100, y: 450, width: 150, height: 150 },
      { x: 350, y: 450, width: 150, height: 150 },
    ],
    totalItems: 8
  },
  { 
    letter: "X", 
    image: letterX, 
    theme: "Xylophone",
    correctRegions: [
      { x: 100, y: 200, width: 150, height: 150 },
      { x: 350, y: 200, width: 150, height: 150 },
      { x: 600, y: 200, width: 150, height: 150 },
      { x: 100, y: 450, width: 150, height: 150 },
      { x: 350, y: 450, width: 150, height: 150 },
    ],
    totalItems: 8
  },
  { 
    letter: "Y", 
    image: letterY, 
    theme: "Yarn",
    correctRegions: [
      { x: 100, y: 200, width: 150, height: 150 },
      { x: 350, y: 200, width: 150, height: 150 },
      { x: 600, y: 200, width: 150, height: 150 },
      { x: 100, y: 450, width: 150, height: 150 },
      { x: 350, y: 450, width: 150, height: 150 },
    ],
    totalItems: 8
  },
  { 
    letter: "Z", 
    image: letterZ, 
    theme: "Zebra",
    correctRegions: [
      { x: 100, y: 200, width: 150, height: 150 },
      { x: 350, y: 200, width: 150, height: 150 },
      { x: 600, y: 200, width: 150, height: 150 },
      { x: 100, y: 450, width: 150, height: 150 },
      { x: 350, y: 450, width: 150, height: 150 },
    ],
    totalItems: 8
  },
];

const colors = [
  { name: "Red", value: "#FF6B6B" },
  { name: "Blue", value: "#4ECDC4" },
  { name: "Green", value: "#95E77D" },
  { name: "Yellow", value: "#FFE66D" },
  { name: "Purple", value: "#BB6BD9" },
  { name: "Orange", value: "#FFA500" },
  { name: "Pink", value: "#FFB6C1" },
];

const AlphabetRecognition = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [fabricCanvas, setFabricCanvas] = useState<FabricCanvas | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [activeColor, setActiveColor] = useState(colors[0].value);
  const [isDrawing, setIsDrawing] = useState(true);
  const [correctCount, setCorrectCount] = useState(0);
  const [incorrectCount, setIncorrectCount] = useState(0);
  const [coloredRegions, setColoredRegions] = useState<Set<number>>(new Set());

  const currentWorksheet = alphabetWorksheets[currentIndex];

  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = new FabricCanvas(canvasRef.current, {
      width: 850,
      height: 1100,
      backgroundColor: "#ffffff",
    });

    setFabricCanvas(canvas);

    return () => {
      canvas.dispose();
    };
  }, []);

  useEffect(() => {
    if (!fabricCanvas) return;
    loadWorksheet();
    setCorrectCount(0);
    setIncorrectCount(0);
    setColoredRegions(new Set());
  }, [fabricCanvas, currentIndex]);

  const loadWorksheet = async () => {
    if (!fabricCanvas) return;

    fabricCanvas.clear();
    
    FabricImage.fromURL(currentWorksheet.image).then((img) => {
      const scaleX = fabricCanvas.width! / img.width!;
      const scaleY = fabricCanvas.height! / img.height!;
      
      img.set({
        scaleX,
        scaleY,
        left: 0,
        top: 0,
      });
      
      fabricCanvas.backgroundImage = img;
      fabricCanvas.renderAll();
    });
  };

  const checkIfCorrect = (x: number, y: number): { isCorrect: boolean; regionIndex: number } => {
    for (let i = 0; i < currentWorksheet.correctRegions.length; i++) {
      const region = currentWorksheet.correctRegions[i];
      if (
        x >= region.x &&
        x <= region.x + region.width &&
        y >= region.y &&
        y <= region.y + region.height
      ) {
        return { isCorrect: true, regionIndex: i };
      }
    }
    return { isCorrect: false, regionIndex: -1 };
  };

  useEffect(() => {
    if (!fabricCanvas) return;

    const handleMouseDown = (e: any) => {
      if (!isDrawing) return;
      
      const pointer = fabricCanvas.getPointer(e.e);
      const { isCorrect, regionIndex } = checkIfCorrect(pointer.x, pointer.y);
      
      let circleColor = activeColor;
      let feedbackMessage = "";
      
      if (isCorrect && !coloredRegions.has(regionIndex)) {
        // Correct answer - first time coloring this region
        circleColor = "#22c55e"; // green
        setCorrectCount(prev => prev + 1);
        setColoredRegions(prev => new Set(prev).add(regionIndex));
        feedbackMessage = "✓ Correct! That has letter " + currentWorksheet.letter;
        toast.success(feedbackMessage);
      } else if (isCorrect && coloredRegions.has(regionIndex)) {
        // Already colored this correct region
        circleColor = "#22c55e"; // green
        feedbackMessage = "Already colored!";
      } else {
        // Incorrect answer
        circleColor = "#ef4444"; // red
        setIncorrectCount(prev => prev + 1);
        feedbackMessage = "✗ Wrong! That doesn't have letter " + currentWorksheet.letter;
        toast.error(feedbackMessage);
      }
      
      const circle = new Circle({
        left: pointer.x,
        top: pointer.y,
        radius: 25,
        fill: circleColor,
        opacity: 0.7,
        selectable: true,
        stroke: circleColor === "#22c55e" ? "#16a34a" : "#dc2626",
        strokeWidth: 2,
      });
      fabricCanvas.add(circle);

      // Check if all correct regions are colored
      if (coloredRegions.size + 1 === currentWorksheet.correctRegions.length && isCorrect && !coloredRegions.has(regionIndex)) {
        setTimeout(() => {
          toast.success("🎉 Excellent! You found all the correct " + currentWorksheet.theme + "s!");
        }, 500);
      }
    };

    fabricCanvas.on("mouse:down", handleMouseDown);

    return () => {
      fabricCanvas.off("mouse:down", handleMouseDown);
    };
  }, [fabricCanvas, activeColor, isDrawing, coloredRegions, correctCount]);

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setCorrectCount(0);
      setIncorrectCount(0);
      setColoredRegions(new Set());
    }
  };

  const handleNext = () => {
    if (currentIndex < alphabetWorksheets.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setCorrectCount(0);
      setIncorrectCount(0);
      setColoredRegions(new Set());
    }
  };

  const handleClear = () => {
    if (!fabricCanvas) return;
    const objects = fabricCanvas.getObjects().filter((obj) => obj.type === "circle");
    objects.forEach((obj) => fabricCanvas.remove(obj));
    fabricCanvas.renderAll();
    setCorrectCount(0);
    setIncorrectCount(0);
    setColoredRegions(new Set());
    toast.success("Cleared all colors!");
  };

  const handleDownload = () => {
    if (!fabricCanvas) return;
    const dataURL = fabricCanvas.toDataURL({
      format: "png",
      quality: 1,
      multiplier: 1,
    });
    const link = document.createElement("a");
    link.download = `alphabet-recognition-${currentWorksheet.letter}.png`;
    link.href = dataURL;
    link.click();
    toast.success("Downloaded worksheet!");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 via-background to-secondary/10 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            🎨 Alphabet Recognition
          </h1>
          <p className="text-xl text-muted-foreground">
            Click to color all the {currentWorksheet.theme}s with letter {currentWorksheet.letter}!
          </p>
        </div>

        <div className="bg-card rounded-2xl shadow-2xl p-6 mb-6">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
            <div className="flex items-center gap-4">
              <h2 className="text-2xl font-bold text-foreground">
                Letter {currentWorksheet.letter} - {currentWorksheet.theme}
              </h2>
              <span className="text-muted-foreground">
                ({currentIndex + 1} / {alphabetWorksheets.length})
              </span>
            </div>

            <div className="flex gap-2">
              <Button
                onClick={handlePrevious}
                disabled={currentIndex === 0}
                variant="outline"
                size="sm"
              >
                <ChevronLeft className="w-4 h-4" />
                Previous
              </Button>
              <Button
                onClick={handleNext}
                disabled={currentIndex === alphabetWorksheets.length - 1}
                variant="outline"
                size="sm"
              >
                Next
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>

          <div className="space-y-4 mb-6">
            <div className="bg-secondary/50 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold text-foreground">Progress</h3>
                <span className="text-sm text-muted-foreground">
                  {coloredRegions.size} / {currentWorksheet.correctRegions.length} correct items found
                </span>
              </div>
              <Progress 
                value={(coloredRegions.size / currentWorksheet.correctRegions.length) * 100} 
                className="h-3"
              />
              <div className="flex gap-4 mt-3 text-sm">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span className="text-foreground">Correct: <strong>{correctCount}</strong></span>
                </div>
                <div className="flex items-center gap-2">
                  <XCircle className="w-4 h-4 text-red-600" />
                  <span className="text-foreground">Incorrect: <strong>{incorrectCount}</strong></span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col items-center gap-4">
            <div className="border-4 border-primary/20 rounded-xl overflow-hidden shadow-xl">
              <canvas ref={canvasRef} />
            </div>

            <div className="flex gap-2">
              <Button onClick={handleClear} variant="outline" size="sm">
                <Eraser className="w-4 h-4 mr-2" />
                Clear Colors
              </Button>
              <Button onClick={handleDownload} variant="default" size="sm">
                <Download className="w-4 h-4 mr-2" />
                Download
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AlphabetRecognition;
