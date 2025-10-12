import { useEffect, useRef, useState } from "react";
import { Canvas as FabricCanvas, PencilBrush, FabricImage } from "fabric";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Download, Eraser, Pencil, RotateCcw, ChevronLeft, ChevronRight, Home } from "lucide-react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

// Import worksheet images
import page1 from "@/assets/counting-worksheets/page-1.jpg";
import page2 from "@/assets/counting-worksheets/page-2.jpg";
import page3 from "@/assets/counting-worksheets/page-3.jpg";
import page4 from "@/assets/counting-worksheets/page-4.jpg";
import page5 from "@/assets/counting-worksheets/page-5.jpg";
import page6 from "@/assets/counting-worksheets/page-6.jpg";
import page7 from "@/assets/counting-worksheets/page-7.jpg";
import page8 from "@/assets/counting-worksheets/page-8.jpg";
import page9 from "@/assets/counting-worksheets/page-9.jpg";
import page10 from "@/assets/counting-worksheets/page-10.jpg";
import page11 from "@/assets/counting-worksheets/page-11.jpg";
import page12 from "@/assets/counting-worksheets/page-12.jpg";
import page13 from "@/assets/counting-worksheets/page-13.jpg";
import page14 from "@/assets/counting-worksheets/page-14.jpg";
import page15 from "@/assets/counting-worksheets/page-15.jpg";
import page16 from "@/assets/counting-worksheets/page-16.jpg";
import page17 from "@/assets/counting-worksheets/page-17.jpg";
import page18 from "@/assets/counting-worksheets/page-18.jpg";
import page19 from "@/assets/counting-worksheets/page-19.jpg";

const worksheets = [
  { title: "Fish - Ten Frames", image: page1 },
  { title: "Umbrella - Ten Frames", image: page2 },
  { title: "Snowflakes - Ten Frames", image: page3 },
  { title: "Halloween Pumpkin - Ten Frames", image: page4 },
  { title: "Halloween Ghost - Ten Frames", image: page5 },
  { title: "Christmas Ornaments - Ten Frames", image: page6 },
  { title: "Christmas Gingerbread - Ten Frames", image: page7 },
  { title: "Christmas Stockings - Ten Frames", image: page8 },
  { title: "Christmas Reindeer - Ten Frames", image: page9 },
  { title: "Christmas Tree - Ten Frames", image: page10 },
  { title: "Spring Flower - Ten Frames", image: page11 },
  { title: "Spring Butterfly - Ten Frames", image: page12 },
  { title: "Easter Bunny - Ten Frames", image: page13 },
  { title: "Easter Egg - Ten Frames", image: page14 },
  { title: "School Apple - Ten Frames", image: page15 },
  { title: "School Crayon - Ten Frames", image: page16 },
  { title: "Transportation Bus - Ten Frames", image: page17 },
  { title: "Transportation Car - Ten Frames", image: page18 },
  { title: "Sports Ball - Ten Frames", image: page19 },
];

const CountingWorksheets = () => {
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
    link.download = `counting-worksheet-${currentIndex + 1}.png`;
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
              Ten Frames Counting
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
                <li>• Color the ten frames to match numbers</li>
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

export default CountingWorksheets;
