import { useEffect, useRef, useState } from "react";
import { Canvas as FabricCanvas, Circle, FabricImage } from "fabric";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Eraser, Download } from "lucide-react";
import { toast } from "sonner";

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

const alphabetWorksheets = [
  { letter: "A", image: letterA, theme: "Apple" },
  { letter: "B", image: letterB, theme: "Bee" },
  { letter: "C", image: letterC, theme: "Car" },
  { letter: "D", image: letterD, theme: "Dinosaur" },
  { letter: "E", image: letterE, theme: "Elephant" },
  { letter: "F", image: letterF, theme: "Fish" },
  { letter: "G", image: letterG, theme: "Girl" },
  { letter: "H", image: letterH, theme: "Hat" },
  { letter: "I", image: letterI, theme: "Ice cream" },
  { letter: "J", image: letterJ, theme: "Jet" },
  { letter: "K", image: letterK, theme: "Kitten" },
  { letter: "L", image: letterL, theme: "Lemon" },
  { letter: "M", image: letterM, theme: "Moon" },
  { letter: "N", image: letterN, theme: "Nest" },
  { letter: "O", image: letterO, theme: "Octopus" },
  { letter: "P", image: letterP, theme: "Pig" },
  { letter: "Q", image: letterQ, theme: "Queen" },
  { letter: "R", image: letterR, theme: "Rainbow" },
  { letter: "S", image: letterS, theme: "Sun" },
  { letter: "T", image: letterT, theme: "Turtle" },
  { letter: "U", image: letterU, theme: "Umbrella" },
  { letter: "V", image: letterV, theme: "Violin" },
  { letter: "W", image: letterW, theme: "Watermelon" },
  { letter: "X", image: letterX, theme: "Xylophone" },
  { letter: "Y", image: letterY, theme: "Yarn" },
  { letter: "Z", image: letterZ, theme: "Zebra" },
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

  useEffect(() => {
    if (!fabricCanvas) return;

    const handleMouseDown = (e: any) => {
      if (!isDrawing) return;
      
      const pointer = fabricCanvas.getPointer(e.e);
      const circle = new Circle({
        left: pointer.x,
        top: pointer.y,
        radius: 25,
        fill: activeColor,
        opacity: 0.7,
        selectable: true,
      });
      fabricCanvas.add(circle);
    };

    fabricCanvas.on("mouse:down", handleMouseDown);

    return () => {
      fabricCanvas.off("mouse:down", handleMouseDown);
    };
  }, [fabricCanvas, activeColor, isDrawing]);

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const handleNext = () => {
    if (currentIndex < alphabetWorksheets.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handleClear = () => {
    if (!fabricCanvas) return;
    const objects = fabricCanvas.getObjects().filter((obj) => obj.type === "circle");
    objects.forEach((obj) => fabricCanvas.remove(obj));
    fabricCanvas.renderAll();
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

          <div className="flex flex-wrap gap-4 mb-6">
            <div className="flex gap-2">
              <span className="font-semibold text-foreground">Choose Color:</span>
              {colors.map((color) => (
                <button
                  key={color.value}
                  onClick={() => setActiveColor(color.value)}
                  className={`w-10 h-10 rounded-full border-4 transition-transform hover:scale-110 ${
                    activeColor === color.value ? "border-foreground scale-110" : "border-transparent"
                  }`}
                  style={{ backgroundColor: color.value }}
                  title={color.name}
                />
              ))}
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
