import { useEffect, useRef, useState } from "react";
import { Canvas as FabricCanvas, PencilBrush, FabricImage } from "fabric";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Download, Eraser, Pencil, RotateCcw, ChevronLeft, ChevronRight, Home } from "lucide-react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

// Import all fruit images
import fruitA from "@/assets/fruits/fruit-a-apple.jpg";
import fruitB from "@/assets/fruits/fruit-b-banana.jpg";
import fruitC from "@/assets/fruits/fruit-c-cherry.jpg";
import fruitD from "@/assets/fruits/fruit-d-dragonfruit.jpg";
import fruitE from "@/assets/fruits/fruit-e-elderberry.jpg";
import fruitF from "@/assets/fruits/fruit-f-fig.jpg";
import fruitG from "@/assets/fruits/fruit-g-guava.jpg";
import fruitH from "@/assets/fruits/fruit-h-hawthorn.jpg";
import fruitI from "@/assets/fruits/fruit-i-itapalm.jpg";
import fruitJ from "@/assets/fruits/fruit-j-jackfruit.jpg";
import fruitK from "@/assets/fruits/fruit-k-kiwi.jpg";
import fruitL from "@/assets/fruits/fruit-l-lemon.jpg";
import fruitM from "@/assets/fruits/fruit-m-mango.jpg";
import fruitN from "@/assets/fruits/fruit-n-nut.jpg";
import fruitO from "@/assets/fruits/fruit-o-orange.jpg";
import fruitP from "@/assets/fruits/fruit-p-pineapple.jpg";
import fruitQ from "@/assets/fruits/fruit-q-quince.jpg";
import fruitR from "@/assets/fruits/fruit-r-raspberry.jpg";
import fruitS from "@/assets/fruits/fruit-s-strawberry.jpg";
import fruitT from "@/assets/fruits/fruit-t-tamarind.jpg";
import fruitU from "@/assets/fruits/fruit-u-ugni.jpg";
import fruitV from "@/assets/fruits/fruit-v-velvetapple.jpg";
import fruitW from "@/assets/fruits/fruit-w-watermelon.jpg";
import fruitX from "@/assets/fruits/fruit-x-ximenia.jpg";
import fruitY from "@/assets/fruits/fruit-y-yumberry.jpg";
import fruitZ from "@/assets/fruits/fruit-z-zapote.jpg";

const fruits = [
  { letter: "A", name: "Apple", image: fruitA },
  { letter: "B", name: "Banana", image: fruitB },
  { letter: "C", name: "Cherry", image: fruitC },
  { letter: "D", name: "Dragon Fruit", image: fruitD },
  { letter: "E", name: "Elderberry", image: fruitE },
  { letter: "F", name: "Fig", image: fruitF },
  { letter: "G", name: "Guava", image: fruitG },
  { letter: "H", name: "Hawthorn", image: fruitH },
  { letter: "I", name: "Ita Palm", image: fruitI },
  { letter: "J", name: "Jackfruit", image: fruitJ },
  { letter: "K", name: "Kiwi", image: fruitK },
  { letter: "L", name: "Lemon", image: fruitL },
  { letter: "M", name: "Mango", image: fruitM },
  { letter: "N", name: "Nut", image: fruitN },
  { letter: "O", name: "Orange", image: fruitO },
  { letter: "P", name: "Pineapple", image: fruitP },
  { letter: "Q", name: "Quince", image: fruitQ },
  { letter: "R", name: "Raspberry", image: fruitR },
  { letter: "S", name: "Strawberry", image: fruitS },
  { letter: "T", name: "Tamarind", image: fruitT },
  { letter: "U", name: "Ugni", image: fruitU },
  { letter: "V", name: "Velvet Apple", image: fruitV },
  { letter: "W", name: "Watermelon", image: fruitW },
  { letter: "X", name: "Ximenia", image: fruitX },
  { letter: "Y", name: "Yumberry", image: fruitY },
  { letter: "Z", name: "Zapote", image: fruitZ },
];

const FruitDrawing = () => {
  const navigate = useNavigate();
  const coloringCanvasRef = useRef<HTMLCanvasElement>(null);
  const [fabricCanvas, setFabricCanvas] = useState<FabricCanvas | null>(null);
  const [activeTool, setActiveTool] = useState<"draw" | "erase">("draw");
  const [brushSize, setBrushSize] = useState(3);
  const [currentFruitIndex, setCurrentFruitIndex] = useState(0);

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
      loadFruit(currentFruitIndex);
    }
  }, [fabricCanvas, currentFruitIndex]);

  const loadFruit = (index: number) => {
    if (!fabricCanvas) return;

    fabricCanvas.clear();
    fabricCanvas.backgroundColor = "#FFFFFF";
    
    FabricImage.fromURL(fruits[index].image, {
      crossOrigin: "anonymous",
    }).then((img) => {
      const canvasWidth = 1200;
      const canvasHeight = 900;
      
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
      toast.error("Failed to load fruit image");
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
    link.download = `fruit-${fruits[currentFruitIndex].name.toLowerCase()}-colored.png`;
    link.href = dataURL;
    link.click();

    toast.success("Fruit drawing downloaded successfully!");
  };

  const handleClear = () => {
    if (!fabricCanvas) return;
    loadFruit(currentFruitIndex);
    toast.success("Canvas cleared!");
  };

  const handlePrevious = () => {
    if (currentFruitIndex > 0) {
      setCurrentFruitIndex(currentFruitIndex - 1);
      toast.success(`${fruits[currentFruitIndex - 1].name}`);
    }
  };

  const handleNext = () => {
    if (currentFruitIndex < fruits.length - 1) {
      setCurrentFruitIndex(currentFruitIndex + 1);
      toast.success(`${fruits[currentFruitIndex + 1].name}`);
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
              Fruit Drawing & Coloring
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
                disabled={currentFruitIndex === 0}
                variant="outline"
                className="gap-2"
              >
                <ChevronLeft className="h-5 w-5" />
                Previous
              </Button>
              
              <div className="text-center">
                <p className="text-lg font-semibold">
                  {fruits[currentFruitIndex].letter} - {fruits[currentFruitIndex].name}
                </p>
                <p className="text-sm text-muted-foreground">
                  {currentFruitIndex + 1} of {fruits.length}
                </p>
              </div>

              <Button
                onClick={handleNext}
                disabled={currentFruitIndex === fruits.length - 1}
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
              All Fruits A-Z
            </h2>
            <div className="grid grid-cols-2 gap-3 max-h-[600px] overflow-y-auto">
              {fruits.map((fruit, index) => (
                <button
                  key={fruit.letter}
                  onClick={() => setCurrentFruitIndex(index)}
                  className={`p-3 rounded-lg text-lg font-bold transition-all ${
                    currentFruitIndex === index
                      ? "bg-primary text-primary-foreground shadow-lg scale-105"
                      : "bg-gray-100 hover:bg-gray-200"
                  }`}
                >
                  {fruit.letter}
                </button>
              ))}
            </div>

            <div className="mt-6 p-4 bg-blue-50 rounded-lg">
              <h3 className="font-semibold text-primary mb-2">How to use:</h3>
              <ul className="text-sm space-y-2">
                <li>• Select a fruit letter from the grid</li>
                <li>• Choose colors from the palette</li>
                <li>• Draw and color the fruit</li>
                <li>• Use the eraser to fix mistakes</li>
                <li>• Download your artwork when done!</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FruitDrawing;
