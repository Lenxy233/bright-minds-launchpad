import { useEffect, useRef, useState } from "react";
import { Canvas as FabricCanvas, PencilBrush, FabricImage } from "fabric";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Download, Eraser, Pencil, RotateCcw, ChevronLeft, ChevronRight, Home, Check, X } from "lucide-react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

// Import worksheet images
import page1 from "@/assets/subtraction-numberline/page-1.jpg";
import page2 from "@/assets/subtraction-numberline/page-2.jpg";
import page3 from "@/assets/subtraction-numberline/page-3.jpg";
import page4 from "@/assets/subtraction-numberline/page-4.jpg";
import page5 from "@/assets/subtraction-numberline/page-5.jpg";
import page6 from "@/assets/subtraction-numberline/page-6.jpg";
import page7 from "@/assets/subtraction-numberline/page-7.jpg";
import page8 from "@/assets/subtraction-numberline/page-8.jpg";
import page9 from "@/assets/subtraction-numberline/page-9.jpg";
import page10 from "@/assets/subtraction-numberline/page-10.jpg";

// Problem definitions for each worksheet
const worksheets = [
  { 
    title: "Subtraction Practice 1", 
    image: page1,
    problems: [
      { q: "3 - 2", a: 1 },
      { q: "4 - 2", a: 2 },
      { q: "5 - 4", a: 1 },
      { q: "6 - 3", a: 3 },
      { q: "8 - 1", a: 7 },
    ]
  },
  { 
    title: "Subtraction Practice 2", 
    image: page2,
    problems: [
      { q: "3 - 2", a: 1 },
      { q: "4 - 2", a: 2 },
      { q: "5 - 4", a: 1 },
      { q: "6 - 3", a: 3 },
      { q: "8 - 1", a: 7 },
    ]
  },
  { 
    title: "Subtraction Practice 3", 
    image: page3,
    problems: [
      { q: "10 - 6", a: 4 },
      { q: "9 - 5", a: 4 },
      { q: "10 - 2", a: 8 },
      { q: "7 - 4", a: 3 },
      { q: "4 - 1", a: 3 },
    ]
  },
  { 
    title: "Subtraction Practice 4", 
    image: page4,
    problems: [
      { q: "10 - 3", a: 7 },
      { q: "7 - 1", a: 6 },
      { q: "9 - 3", a: 6 },
      { q: "8 - 4", a: 4 },
      { q: "6 - 2", a: 4 },
    ]
  },
  { 
    title: "Subtraction Practice 5", 
    image: page5,
    problems: [
      { q: "9 - 6", a: 3 },
      { q: "10 - 5", a: 5 },
      { q: "8 - 4", a: 4 },
      { q: "7 - 3", a: 4 },
      { q: "9 - 2", a: 7 },
    ]
  },
  { 
    title: "Subtraction Practice 6", 
    image: page6,
    problems: [
      { q: "6 - 1", a: 5 },
      { q: "8 - 6", a: 2 },
      { q: "7 - 2", a: 5 },
      { q: "5 - 3", a: 2 },
      { q: "9 - 8", a: 1 },
    ]
  },
  { 
    title: "Subtraction Practice 7", 
    image: page7,
    problems: [
      { q: "10 - 7", a: 3 },
      { q: "8 - 5", a: 3 },
      { q: "5 - 3", a: 2 },
      { q: "7 - 1", a: 6 },
      { q: "6 - 2", a: 4 },
    ]
  },
  { 
    title: "Subtraction Practice 8", 
    image: page8,
    problems: [
      { q: "9 - 4", a: 5 },
      { q: "6 - 3", a: 3 },
      { q: "5 - 1", a: 4 },
      { q: "6 - 5", a: 1 },
      { q: "10 - 4", a: 6 },
    ]
  },
  { 
    title: "Subtraction Practice 9", 
    image: page9,
    problems: [
      { q: "6 - 3", a: 3 },
      { q: "10 - 7", a: 3 },
      { q: "5 - 2", a: 3 },
      { q: "8 - 4", a: 4 },
      { q: "7 - 4", a: 3 },
    ]
  },
  { 
    title: "Subtraction Practice 10", 
    image: page10,
    problems: [
      { q: "7 - 2", a: 5 },
      { q: "9 - 6", a: 3 },
      { q: "6 - 2", a: 4 },
      { q: "2 - 1", a: 1 },
      { q: "3 - 1", a: 2 },
    ]
  },
];

const SubtractionNumberLine = () => {
  const navigate = useNavigate();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [fabricCanvas, setFabricCanvas] = useState<FabricCanvas | null>(null);
  const [activeTool, setActiveTool] = useState<"draw" | "erase">("draw");
  const [brushSize, setBrushSize] = useState(3);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [showResults, setShowResults] = useState(false);

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
      setShowResults(false);
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
    link.download = `subtraction-worksheet-${currentIndex + 1}.png`;
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
      setAnswers({});
    }
  };

  const handleNext = () => {
    if (currentIndex < worksheets.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setAnswers({});
    }
  };

  const handleAnswerChange = (problemIndex: number, value: string) => {
    setAnswers(prev => ({
      ...prev,
      [problemIndex]: value
    }));
  };

  const handleCheckAnswers = () => {
    setShowResults(true);
    const correct = worksheets[currentIndex].problems.filter(
      (problem, idx) => parseInt(answers[idx] || "") === problem.a
    ).length;
    const total = worksheets[currentIndex].problems.length;
    toast.success(`You got ${correct} out of ${total} correct!`);
  };

  const handleResetAnswers = () => {
    setAnswers({});
    setShowResults(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50 p-4">
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
              Subtraction with Number Lines
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

            <div className="bg-white rounded-lg shadow-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-primary">Answer Sheet</h2>
                <div className="flex gap-2">
                  <Button
                    onClick={handleCheckAnswers}
                    variant="default"
                    size="sm"
                    className="gap-2"
                  >
                    <Check className="h-4 w-4" />
                    Check Answers
                  </Button>
                  <Button
                    onClick={handleResetAnswers}
                    variant="outline"
                    size="sm"
                    className="gap-2"
                  >
                    <RotateCcw className="h-4 w-4" />
                    Reset
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-x-8 gap-y-3">
                {worksheets[currentIndex].problems.map((problem, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <span className="text-sm font-medium min-w-[60px]">{problem.q} =</span>
                    <div className="relative flex-1">
                      <Input
                        type="number"
                        value={answers[idx] || ""}
                        onChange={(e) => handleAnswerChange(idx, e.target.value)}
                        className={`h-9 ${
                          showResults
                            ? parseInt(answers[idx] || "") === problem.a
                              ? "border-green-500 bg-green-50"
                              : answers[idx]
                              ? "border-red-500 bg-red-50"
                              : ""
                            : ""
                        }`}
                        placeholder="?"
                      />
                      {showResults && answers[idx] && (
                        <div className="absolute right-2 top-1/2 -translate-y-1/2">
                          {parseInt(answers[idx]) === problem.a ? (
                            <Check className="h-4 w-4 text-green-600" />
                          ) : (
                            <X className="h-4 w-4 text-red-600" />
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
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
                  onClick={() => {
                    setCurrentIndex(index);
                    setAnswers({});
                  }}
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
                <li>• Draw on the number line to show subtraction</li>
                <li>• Type your answers in the boxes</li>
                <li>• Click "Check Answers" to see results</li>
                <li>• Green = correct, Red = incorrect</li>
                <li>• Download your work when done!</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubtractionNumberLine;
