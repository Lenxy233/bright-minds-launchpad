import { useEffect, useRef, useState } from "react";
import { Canvas as FabricCanvas, PencilBrush, FabricImage } from "fabric";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Download, Eraser, Pencil, RotateCcw, ChevronLeft, ChevronRight, Home } from "lucide-react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

// Import worksheet images
import cover from "@/assets/number-practice-1-20/cover.jpg";
import page1Intro from "@/assets/number-practice-1-20/page-1-intro.jpg";
import page1Count from "@/assets/number-practice-1-20/page-1-count.jpg";
import page1Trace from "@/assets/number-practice-1-20/page-1-trace.jpg";
import page1Find from "@/assets/number-practice-1-20/page-1-find.jpg";
import page2Intro from "@/assets/number-practice-1-20/page-2-intro.jpg";
import page2Count from "@/assets/number-practice-1-20/page-2-count.jpg";
import page2Trace from "@/assets/number-practice-1-20/page-2-trace.jpg";
import page2Find from "@/assets/number-practice-1-20/page-2-find.jpg";
import page3Intro from "@/assets/number-practice-1-20/page-3-intro.jpg";
import page3Count from "@/assets/number-practice-1-20/page-3-count.jpg";
import page3Trace from "@/assets/number-practice-1-20/page-3-trace.jpg";
import page3Find from "@/assets/number-practice-1-20/page-3-find.jpg";
import page4Intro from "@/assets/number-practice-1-20/page-4-intro.jpg";
import page4Count from "@/assets/number-practice-1-20/page-4-count.jpg";
import page4Trace from "@/assets/number-practice-1-20/page-4-trace.jpg";
import page4Find from "@/assets/number-practice-1-20/page-4-find.jpg";
import page5Intro from "@/assets/number-practice-1-20/page-5-intro.jpg";
import page5Count from "@/assets/number-practice-1-20/page-5-count.jpg";
import page5Trace from "@/assets/number-practice-1-20/page-5-trace.jpg";
import page5Find from "@/assets/number-practice-1-20/page-5-find.jpg";
import page8Intro from "@/assets/number-practice-1-20/page-8-intro.jpg";
import page10Intro from "@/assets/number-practice-1-20/page-10-intro.jpg";
import page11Intro from "@/assets/number-practice-1-20/page-11-intro.jpg";

const worksheets = [
  { title: "Cover Page", image: cover },
  { title: "Number 1 - Introduction", image: page1Intro },
  { title: "Number 1 - Count", image: page1Count },
  { title: "Number 1 - Trace", image: page1Trace },
  { title: "Number 1 - Find", image: page1Find },
  { title: "Number 2 - Introduction", image: page2Intro },
  { title: "Number 2 - Count", image: page2Count },
  { title: "Number 2 - Trace", image: page2Trace },
  { title: "Number 2 - Find", image: page2Find },
  { title: "Number 3 - Introduction", image: page3Intro },
  { title: "Number 3 - Count", image: page3Count },
  { title: "Number 3 - Trace", image: page3Trace },
  { title: "Number 3 - Find", image: page3Find },
  { title: "Number 4 - Introduction", image: page4Intro },
  { title: "Number 4 - Count", image: page4Count },
  { title: "Number 4 - Trace", image: page4Trace },
  { title: "Number 4 - Find", image: page4Find },
  { title: "Number 5 - Introduction", image: page5Intro },
  { title: "Number 5 - Count", image: page5Count },
  { title: "Number 5 - Trace", image: page5Trace },
  { title: "Number 5 - Find", image: page5Find },
  { title: "Number 8 - Introduction", image: page8Intro },
  { title: "Number 10 - Introduction", image: page10Intro },
  { title: "Number 11 - Introduction", image: page11Intro },
];

const NumberPractice = () => {
  const navigate = useNavigate();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [fabricCanvas, setFabricCanvas] = useState<FabricCanvas | null>(null);
  const [activeTool, setActiveTool] = useState<"draw" | "erase">("draw");
  const [brushSize, setBrushSize] = useState(3);
  const [currentIndex, setCurrentIndex] = useState(0);

  const colors = [
    "#FF6B6B", "#4ECDC4", "#45B7D1", "#FFA07A", "#98D8C8",
    "#F7DC6F", "#BB8FCE", "#85C1E2", "#F8B739", "#52BE80",
    "#EC7063", "#AF7AC5", "#5DADE2", "#48C9B0", "#F4D03F",
  ];
  const [selectedColor, setSelectedColor] = useState(colors[0]);

  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = new FabricCanvas(canvasRef.current, {
      isDrawingMode: true,
      width: 850,
      height: 1100,
    });

    const brush = new PencilBrush(canvas);
    brush.color = selectedColor;
    brush.width = brushSize;
    canvas.freeDrawingBrush = brush;

    setFabricCanvas(canvas);

    return () => {
      canvas.dispose();
    };
  }, []);

  useEffect(() => {
    if (fabricCanvas) {
      loadWorksheet(currentIndex);
    }
  }, [fabricCanvas, currentIndex]);

  const loadWorksheet = (index: number) => {
    if (!fabricCanvas) return;

    fabricCanvas.clear();
    fabricCanvas.backgroundColor = "#FFFFFF";
    
    FabricImage.fromURL(worksheets[index].image, {
      crossOrigin: "anonymous",
    }).then((img) => {
      const canvasWidth = 850;
      const canvasHeight = 1100;
      
      fabricCanvas.setDimensions({ width: canvasWidth, height: canvasHeight });

      const scale = Math.min(canvasWidth / img.width!, canvasHeight / img.height!);
      img.scale(scale);
      img.set({
        left: (canvasWidth - img.width! * scale) / 2,
        top: (canvasHeight - img.height! * scale) / 2,
        selectable: false,
        evented: false,
      });

      fabricCanvas.backgroundImage = img;
      fabricCanvas.renderAll();
    }).catch(() => {
      toast.error("Failed to load worksheet");
    });
  };

  useEffect(() => {
    if (!fabricCanvas) return;

    fabricCanvas.isDrawingMode = true;
    const brush = fabricCanvas.freeDrawingBrush as PencilBrush;
    
    if (activeTool === "draw") {
      brush.color = selectedColor;
      brush.width = brushSize;
    } else {
      brush.color = "#FFFFFF";
      brush.width = brushSize * 3;
    }
  }, [activeTool, selectedColor, brushSize, fabricCanvas]);

  const handleColorChange = (color: string) => {
    setSelectedColor(color);
    if (activeTool === "draw") {
      setActiveTool("draw");
    }
  };

  const handleDownload = () => {
    if (!fabricCanvas) return;

    const dataURL = fabricCanvas.toDataURL({
      format: "png",
      quality: 1,
      multiplier: 1,
    });

    const link = document.createElement("a");
    link.download = `number-practice-page-${currentIndex + 1}.png`;
    link.href = dataURL;
    link.click();

    toast.success("Worksheet downloaded!");
  };

  const handleClear = () => {
    if (!fabricCanvas) return;
    loadWorksheet(currentIndex);
    toast.success("Canvas cleared!");
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const handleNext = () => {
    if (currentIndex < worksheets.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 p-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <Button
              onClick={() => navigate("/learning-app")}
              variant="outline"
              size="icon"
              className="rounded-full"
            >
              <Home className="h-5 w-5" />
            </Button>
            <h1 className="text-3xl md:text-4xl font-bold text-primary">
              Number Practice 1-20
            </h1>
          </div>
        </div>

        <div className="grid lg:grid-cols-[1fr,300px] gap-6">
          <div className="space-y-4">
            <div className="bg-white rounded-lg shadow-lg p-4">
              <div className="flex flex-wrap items-center gap-4 mb-4">
                <div className="flex items-center gap-2">
                  <Button
                    onClick={() => setActiveTool("draw")}
                    variant={activeTool === "draw" ? "default" : "outline"}
                    size="sm"
                    className="gap-2"
                  >
                    <Pencil className="h-4 w-4" />
                    Draw
                  </Button>
                  <Button
                    onClick={() => setActiveTool("erase")}
                    variant={activeTool === "erase" ? "default" : "outline"}
                    size="sm"
                    className="gap-2"
                  >
                    <Eraser className="h-4 w-4" />
                    Erase
                  </Button>
                </div>

                <div className="flex-1 min-w-[200px] max-w-[300px]">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium whitespace-nowrap">
                      {activeTool === "draw" ? "Brush" : "Eraser"} Size:
                    </span>
                    <Slider
                      value={[brushSize]}
                      onValueChange={(value) => setBrushSize(value[0])}
                      min={1}
                      max={50}
                      step={1}
                      className="flex-1"
                    />
                    <span className="text-sm font-medium w-8">{brushSize}</span>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button
                    onClick={handleClear}
                    variant="outline"
                    size="sm"
                    className="gap-2"
                  >
                    <RotateCcw className="h-4 w-4" />
                    Clear
                  </Button>
                  <Button
                    onClick={handleDownload}
                    variant="default"
                    size="sm"
                    className="gap-2"
                  >
                    <Download className="h-4 w-4" />
                    Download
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-5 sm:grid-cols-8 md:grid-cols-10 lg:grid-cols-15 gap-2">
                {colors.map((color) => (
                  <button
                    key={color}
                    onClick={() => handleColorChange(color)}
                    className={`w-10 h-10 rounded-lg transition-all hover:scale-110 ${
                      selectedColor === color
                        ? "ring-4 ring-primary ring-offset-2"
                        : "hover:ring-2 hover:ring-gray-300"
                    }`}
                    style={{ backgroundColor: color }}
                    aria-label={`Select ${color}`}
                  />
                ))}
              </div>
            </div>

            <div className="relative bg-gray-50 rounded-lg overflow-hidden flex items-center justify-center">
              <canvas 
                ref={canvasRef} 
                style={{ 
                  cursor: activeTool === "draw" ? "crosshair" : "pointer",
                  touchAction: "none"
                }} 
              />
            </div>

            <div className="flex items-center justify-between bg-white rounded-lg shadow-lg p-4">
              <Button
                onClick={handlePrevious}
                disabled={currentIndex === 0}
                variant="outline"
                className="gap-2"
              >
                <ChevronLeft className="h-5 w-5" />
                Previous
              </Button>
              
              <div className="text-center">
                <p className="text-lg font-semibold">
                  {worksheets[currentIndex].title}
                </p>
                <p className="text-sm text-muted-foreground">
                  Page {currentIndex + 1} of {worksheets.length}
                </p>
              </div>

              <Button
                onClick={handleNext}
                disabled={currentIndex === worksheets.length - 1}
                variant="outline"
                className="gap-2"
              >
                Next
                <ChevronRight className="h-5 w-5" />
              </Button>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold mb-4 text-primary">
              Quick Navigation
            </h2>
            <div className="space-y-2 max-h-[600px] overflow-y-auto">
              {worksheets.map((worksheet, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={`w-full p-3 rounded-lg text-left text-sm transition-all ${
                    currentIndex === index
                      ? "bg-primary text-primary-foreground shadow-lg"
                      : "bg-gray-100 hover:bg-gray-200"
                  }`}
                >
                  {worksheet.title}
                </button>
              ))}
            </div>

            <div className="mt-6 p-4 bg-blue-50 rounded-lg">
              <h3 className="font-semibold text-primary mb-2">How to use:</h3>
              <ul className="text-sm space-y-2">
                <li>• Navigate through worksheets</li>
                <li>• Choose a color from the palette</li>
                <li>• Trace numbers and complete tasks</li>
                <li>• Use the eraser to fix mistakes</li>
                <li>• Download your work when done!</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NumberPractice;
