import { useEffect, useRef, useState } from "react";
import { Canvas as FabricCanvas, PencilBrush, FabricImage } from "fabric";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Download, Eraser, Pencil, RotateCcw, ChevronLeft, ChevronRight, Home, Check, X } from "lucide-react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

// Import worksheet images
import page1 from "@/assets/addition-dots/page-1.jpg";
import page2 from "@/assets/addition-dots/page-2.jpg";
import page3 from "@/assets/addition-dots/page-3.jpg";
import page4 from "@/assets/addition-dots/page-4.jpg";
import page5 from "@/assets/addition-dots/page-5.jpg";
import page6 from "@/assets/addition-dots/page-6.jpg";
import page7 from "@/assets/addition-dots/page-7.jpg";
import page8 from "@/assets/addition-dots/page-8.jpg";
import page9 from "@/assets/addition-dots/page-9.jpg";
import page10 from "@/assets/addition-dots/page-10.jpg";
import page11 from "@/assets/addition-dots/page-11.jpg";
import page12 from "@/assets/addition-dots/page-12.jpg";
import page13 from "@/assets/addition-dots/page-13.jpg";
import page14 from "@/assets/addition-dots/page-14.jpg";
import page15 from "@/assets/addition-dots/page-15.jpg";

// Problem definitions for each worksheet
const worksheets = [
  { 
    title: "Addition Practice 1", 
    image: page1,
    problems: [
      { q: "3 + 2", a: 5 },
      { q: "6 + 1", a: 7 },
      { q: "4 + 2", a: 6 },
      { q: "4 + 4", a: 8 },
      { q: "5 + 3", a: 8 },
      { q: "8 + 2", a: 10 },
      { q: "2 + 6", a: 8 },
      { q: "7 + 5", a: 12 },
      { q: "9 + 3", a: 12 },
      { q: "1 + 7", a: 8 },
      { q: "5 + 4", a: 9 },
      { q: "2 + 1", a: 3 },
    ]
  },
  { 
    title: "Addition Practice 2", 
    image: page2,
    problems: [
      { q: "2 + 1", a: 3 },
      { q: "4 + 5", a: 9 },
      { q: "7 + 3", a: 10 },
      { q: "1 + 9", a: 10 },
      { q: "3 + 6", a: 9 },
      { q: "8 + 7", a: 15 },
      { q: "4 + 1", a: 5 },
      { q: "5 + 5", a: 10 },
      { q: "3 + 2", a: 5 },
      { q: "5 + 2", a: 7 },
      { q: "6 + 4", a: 10 },
      { q: "1 + 3", a: 4 },
    ]
  },
  { 
    title: "Addition Practice 3", 
    image: page3,
    problems: [
      { q: "5 + 4", a: 9 },
      { q: "6 + 2", a: 8 },
      { q: "8 + 1", a: 9 },
      { q: "4 + 7", a: 11 },
      { q: "5 + 6", a: 11 },
      { q: "7 + 7", a: 14 },
      { q: "1 + 0", a: 1 },
      { q: "3 + 8", a: 11 },
      { q: "0 + 9", a: 9 },
      { q: "6 + 6", a: 12 },
      { q: "7 + 1", a: 8 },
      { q: "4 + 9", a: 13 },
    ]
  },
  { 
    title: "Addition Practice 4", 
    image: page4,
    problems: [
      { q: "9 + 1", a: 10 },
      { q: "8 + 3", a: 11 },
      { q: "2 + 6", a: 8 },
      { q: "1 + 6", a: 7 },
      { q: "9 + 7", a: 16 },
      { q: "7 + 3", a: 10 },
      { q: "8 + 0", a: 8 },
      { q: "3 + 6", a: 9 },
      { q: "0 + 9", a: 9 },
      { q: "7 + 4", a: 11 },
      { q: "1 + 4", a: 5 },
      { q: "8 + 5", a: 13 },
    ]
  },
  { 
    title: "Addition Practice 5", 
    image: page5,
    problems: [
      { q: "1 + 2", a: 3 },
      { q: "3 + 0", a: 3 },
      { q: "4 + 6", a: 10 },
      { q: "0 + 5", a: 5 },
      { q: "9 + 1", a: 10 },
      { q: "4 + 1", a: 5 },
      { q: "1 + 3", a: 4 },
      { q: "9 + 4", a: 13 },
      { q: "1 + 3", a: 4 },
      { q: "2 + 6", a: 8 },
      { q: "2 + 2", a: 4 },
      { q: "7 + 1", a: 8 },
    ]
  },
  { 
    title: "Addition Practice 6", 
    image: page6,
    problems: [
      { q: "0 + 0", a: 0 },
      { q: "0 + 6", a: 6 },
      { q: "1 + 9", a: 10 },
      { q: "4 + 0", a: 4 },
      { q: "0 + 5", a: 5 },
      { q: "2 + 0", a: 2 },
      { q: "9 + 0", a: 9 },
      { q: "0 + 3", a: 3 },
      { q: "8 + 0", a: 8 },
      { q: "10 + 0", a: 10 },
      { q: "0 + 7", a: 7 },
      { q: "1 + 0", a: 1 },
    ]
  },
  { 
    title: "Addition Practice 7", 
    image: page7,
    problems: [
      { q: "1 + 1", a: 2 },
      { q: "2 + 1", a: 3 },
      { q: "1 + 6", a: 7 },
      { q: "4 + 1", a: 5 },
      { q: "1 + 5", a: 6 },
      { q: "6 + 1", a: 7 },
      { q: "1 + 7", a: 8 },
      { q: "8 + 1", a: 9 },
      { q: "9 + 1", a: 10 },
      { q: "1 + 3", a: 4 },
      { q: "1 + 6", a: 7 },
      { q: "1 + 8", a: 9 },
    ]
  },
  { 
    title: "Addition Practice 8", 
    image: page8,
    problems: [
      { q: "2 + 2", a: 4 },
      { q: "2 + 4", a: 6 },
      { q: "2 + 5", a: 7 },
      { q: "2 + 7", a: 9 },
      { q: "2 + 3", a: 5 },
      { q: "2 + 6", a: 8 },
      { q: "2 + 8", a: 10 },
      { q: "2 + 9", a: 11 },
      { q: "7 + 2", a: 9 },
      { q: "4 + 2", a: 6 },
      { q: "6 + 2", a: 8 },
      { q: "5 + 2", a: 7 },
    ]
  },
  { 
    title: "Addition Practice 9", 
    image: page9,
    problems: [
      { q: "3 + 3", a: 6 },
      { q: "3 + 4", a: 7 },
      { q: "3 + 9", a: 12 },
      { q: "3 + 5", a: 8 },
      { q: "3 + 1", a: 4 },
      { q: "3 + 2", a: 5 },
      { q: "3 + 7", a: 10 },
      { q: "3 + 8", a: 11 },
      { q: "5 + 3", a: 8 },
      { q: "8 + 3", a: 11 },
      { q: "9 + 3", a: 12 },
      { q: "6 + 3", a: 9 },
    ]
  },
  { 
    title: "Addition Practice 10", 
    image: page10,
    problems: [
      { q: "4 + 4", a: 8 },
      { q: "4 + 5", a: 9 },
      { q: "4 + 6", a: 10 },
      { q: "4 + 7", a: 11 },
      { q: "4 + 3", a: 7 },
      { q: "4 + 2", a: 6 },
      { q: "4 + 8", a: 12 },
      { q: "4 + 9", a: 13 },
      { q: "6 + 4", a: 10 },
      { q: "7 + 4", a: 11 },
      { q: "5 + 4", a: 9 },
      { q: "9 + 4", a: 13 },
    ]
  },
  { 
    title: "Addition Practice 11", 
    image: page11,
    problems: [
      { q: "5 + 5", a: 10 },
      { q: "5 + 6", a: 11 },
      { q: "5 + 7", a: 12 },
      { q: "5 + 8", a: 13 },
      { q: "5 + 2", a: 7 },
      { q: "5 + 3", a: 8 },
      { q: "5 + 9", a: 14 },
      { q: "5 + 1", a: 6 },
      { q: "7 + 5", a: 12 },
      { q: "8 + 5", a: 13 },
      { q: "9 + 5", a: 14 },
      { q: "6 + 5", a: 11 },
    ]
  },
  { 
    title: "Addition Practice 12", 
    image: page12,
    problems: [
      { q: "6 + 6", a: 12 },
      { q: "6 + 7", a: 13 },
      { q: "6 + 8", a: 14 },
      { q: "6 + 9", a: 15 },
      { q: "6 + 2", a: 8 },
      { q: "6 + 3", a: 9 },
      { q: "6 + 4", a: 10 },
      { q: "6 + 5", a: 11 },
      { q: "7 + 6", a: 13 },
      { q: "8 + 6", a: 14 },
      { q: "9 + 6", a: 15 },
      { q: "2 + 6", a: 8 },
    ]
  },
  { 
    title: "Addition Practice 13", 
    image: page13,
    problems: [
      { q: "7 + 7", a: 14 },
      { q: "7 + 8", a: 15 },
      { q: "7 + 9", a: 16 },
      { q: "7 + 2", a: 9 },
      { q: "7 + 3", a: 10 },
      { q: "7 + 4", a: 11 },
      { q: "7 + 5", a: 12 },
      { q: "7 + 6", a: 13 },
      { q: "8 + 7", a: 15 },
      { q: "9 + 7", a: 16 },
      { q: "2 + 7", a: 9 },
      { q: "3 + 7", a: 10 },
    ]
  },
  { 
    title: "Addition Practice 14", 
    image: page14,
    problems: [
      { q: "8 + 8", a: 16 },
      { q: "8 + 9", a: 17 },
      { q: "8 + 2", a: 10 },
      { q: "8 + 3", a: 11 },
      { q: "8 + 4", a: 12 },
      { q: "8 + 5", a: 13 },
      { q: "8 + 6", a: 14 },
      { q: "8 + 7", a: 15 },
      { q: "9 + 8", a: 17 },
      { q: "2 + 8", a: 10 },
      { q: "3 + 8", a: 11 },
      { q: "4 + 8", a: 12 },
    ]
  },
  { 
    title: "Addition Practice 15", 
    image: page15,
    problems: [
      { q: "9 + 9", a: 18 },
      { q: "9 + 2", a: 11 },
      { q: "9 + 3", a: 12 },
      { q: "9 + 4", a: 13 },
      { q: "9 + 5", a: 14 },
      { q: "9 + 6", a: 15 },
      { q: "9 + 7", a: 16 },
      { q: "9 + 8", a: 17 },
      { q: "2 + 9", a: 11 },
      { q: "3 + 9", a: 12 },
      { q: "4 + 9", a: 13 },
      { q: "5 + 9", a: 14 },
    ]
  },
];

const AdditionWithDots = () => {
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
    link.download = `addition-worksheet-${currentIndex + 1}.png`;
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
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-red-50 to-pink-50 p-4">
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
              Addition with Dots
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
                <li>• Draw dots to help solve problems</li>
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

export default AdditionWithDots;
