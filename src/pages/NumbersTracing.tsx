import { useEffect, useRef, useState } from "react";
import { Canvas as FabricCanvas, PencilBrush } from "fabric";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Download, Eraser, Pencil, RotateCcw, ChevronLeft, ChevronRight, Home } from "lucide-react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

// Import all number images
import number1 from "@/assets/numbers/number-1.jpg";
import number2 from "@/assets/numbers/number-2.jpg";
import number3 from "@/assets/numbers/number-3.jpg";
import number4 from "@/assets/numbers/number-4.jpg";
import number5 from "@/assets/numbers/number-5.jpg";
import number6 from "@/assets/numbers/number-6.jpg";
import number7 from "@/assets/numbers/number-7.jpg";
import number8 from "@/assets/numbers/number-8.jpg";
import number9 from "@/assets/numbers/number-9.jpg";
import number10 from "@/assets/numbers/number-10.jpg";

const numbers = [
  { number: "1", image: number1 },
  { number: "2", image: number2 },
  { number: "3", image: number3 },
  { number: "4", image: number4 },
  { number: "5", image: number5 },
  { number: "6", image: number6 },
  { number: "7", image: number7 },
  { number: "8", image: number8 },
  { number: "9", image: number9 },
  { number: "10", image: number10 },
];

const NumbersTracing = () => {
  const navigate = useNavigate();
  const coloringCanvasRef = useRef<HTMLCanvasElement>(null);
  const [fabricCanvas, setFabricCanvas] = useState<FabricCanvas | null>(null);
  const [activeTool, setActiveTool] = useState<"draw" | "erase">("draw");
  const [brushSize, setBrushSize] = useState(3);
  const [currentNumberIndex, setCurrentNumberIndex] = useState(0);

  const colors = [
    "#FF6B6B", "#4ECDC4", "#45B7D1", "#FFA07A", "#98D8C8",
    "#F7DC6F", "#BB8FCE", "#85C1E2", "#F8B739", "#52BE80",
    "#EC7063", "#AF7AC5", "#5DADE2", "#48C9B0", "#F4D03F",
  ];
  const [selectedColor, setSelectedColor] = useState(colors[0]);

  useEffect(() => {
    if (!coloringCanvasRef.current) return;

    const canvas = new FabricCanvas(coloringCanvasRef.current, {
      isDrawingMode: true,
      width: 1200,
      height: 900,
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
      loadNumber(currentNumberIndex);
    }
  }, [fabricCanvas, currentNumberIndex]);

  const loadNumber = (index: number) => {
    if (!fabricCanvas) return;

    fabricCanvas.clear();

    const canvas = fabricCanvas.getElement();
    const coloringCanvas = fabricCanvas;
    
    const img = new Image();
    img.crossOrigin = "anonymous";
    
    img.src = numbers[index].image;
    img.onload = () => {
      const canvasWidth = 1200;
      const canvasHeight = 900;
      
      coloringCanvas.width = canvasWidth;
      coloringCanvas.height = canvasHeight;

      const ctx = canvas.getContext("2d");
      if (ctx) {
        const scale = Math.min(canvasWidth / img.width, canvasHeight / img.height);
        const x = (canvasWidth - img.width * scale) / 2;
        const y = (canvasHeight - img.height * scale) / 2;

        coloringCanvas.backgroundImage = undefined;
        coloringCanvas.backgroundColor = "#FFFFFF";
        ctx.drawImage(img, x, y, img.width * scale, img.height * scale);
        coloringCanvas.renderAll();
      }
    };

    img.onerror = () => {
      toast.error("Failed to load number image");
    };
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
    link.download = `number-${numbers[currentNumberIndex].number}-colored.png`;
    link.href = dataURL;
    link.click();

    toast.success("Number downloaded successfully!");
  };

  const handleClear = () => {
    if (!fabricCanvas) return;
    loadNumber(currentNumberIndex);
    toast.success("Canvas cleared!");
  };

  const handlePrevious = () => {
    if (currentNumberIndex > 0) {
      setCurrentNumberIndex(currentNumberIndex - 1);
      toast.success(`Number ${numbers[currentNumberIndex - 1].number}`);
    }
  };

  const handleNext = () => {
    if (currentNumberIndex < numbers.length - 1) {
      setCurrentNumberIndex(currentNumberIndex + 1);
      toast.success(`Number ${numbers[currentNumberIndex + 1].number}`);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 p-4">
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
              Numbers Tracing & Coloring
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

            <div className="relative bg-gray-50 rounded-lg overflow-hidden flex items-center justify-center" style={{ minHeight: "900px" }}>
              <canvas 
                ref={coloringCanvasRef} 
                className="absolute inset-0" 
                style={{ 
                  cursor: activeTool === "draw" ? "crosshair" : "pointer",
                  touchAction: "none"
                }} 
              />
            </div>

            <div className="flex items-center justify-between bg-white rounded-lg shadow-lg p-4">
              <Button
                onClick={handlePrevious}
                disabled={currentNumberIndex === 0}
                variant="outline"
                className="gap-2"
              >
                <ChevronLeft className="h-5 w-5" />
                Previous
              </Button>
              
              <div className="text-center">
                <p className="text-lg font-semibold">
                  Number {numbers[currentNumberIndex].number}
                </p>
                <p className="text-sm text-muted-foreground">
                  {currentNumberIndex + 1} of {numbers.length}
                </p>
              </div>

              <Button
                onClick={handleNext}
                disabled={currentNumberIndex === numbers.length - 1}
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
              All Numbers
            </h2>
            <div className="grid grid-cols-2 gap-3">
              {numbers.map((num, index) => (
                <button
                  key={num.number}
                  onClick={() => setCurrentNumberIndex(index)}
                  className={`p-4 rounded-lg text-2xl font-bold transition-all ${
                    currentNumberIndex === index
                      ? "bg-primary text-primary-foreground shadow-lg scale-105"
                      : "bg-gray-100 hover:bg-gray-200"
                  }`}
                >
                  {num.number}
                </button>
              ))}
            </div>

            <div className="mt-6 p-4 bg-blue-50 rounded-lg">
              <h3 className="font-semibold text-primary mb-2">How to use:</h3>
              <ul className="text-sm space-y-2">
                <li>• Select a number from the grid</li>
                <li>• Choose a color from the palette</li>
                <li>• Trace over the dotted lines</li>
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

export default NumbersTracing;
