import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Canvas as FabricCanvas, PencilBrush } from "fabric";
import { Eraser, Pencil, Undo, Redo, Trash2, Download, ChevronLeft, ChevronRight, Check, X } from "lucide-react";
import { toast } from "sonner";

// Import clock worksheet images
import page1 from "@/assets/clocks/page-1.jpg";
import page2 from "@/assets/clocks/page-2.jpg";
import page3 from "@/assets/clocks/page-3.jpg";
import page4 from "@/assets/clocks/page-4.jpg";
import page5 from "@/assets/clocks/page-5.jpg";

const worksheets = [page1, page2, page3, page4, page5];

// Predefined problems for each worksheet (times shown on clocks)
const problems = [
  // Page 1 - 9 clocks
  [
    { question: "Clock 1", answer: "3:00" },
    { question: "Clock 2", answer: "6:00" },
    { question: "Clock 3", answer: "9:00" },
    { question: "Clock 4", answer: "12:00" },
    { question: "Clock 5", answer: "1:00" },
    { question: "Clock 6", answer: "2:00" },
    { question: "Clock 7", answer: "4:00" },
    { question: "Clock 8", answer: "5:00" },
    { question: "Clock 9", answer: "7:00" },
  ],
  // Page 2 - 12 clocks
  [
    { question: "Clock 1", answer: "8:00" },
    { question: "Clock 2", answer: "10:00" },
    { question: "Clock 3", answer: "11:00" },
    { question: "Clock 4", answer: "12:00" },
    { question: "Clock 5", answer: "1:30" },
    { question: "Clock 6", answer: "2:30" },
    { question: "Clock 7", answer: "3:30" },
    { question: "Clock 8", answer: "4:30" },
    { question: "Clock 9", answer: "5:30" },
    { question: "Clock 10", answer: "6:30" },
    { question: "Clock 11", answer: "7:30" },
    { question: "Clock 12", answer: "8:30" },
  ],
  // Page 3 - 12 clocks
  [
    { question: "Clock 1", answer: "9:30" },
    { question: "Clock 2", answer: "10:30" },
    { question: "Clock 3", answer: "11:30" },
    { question: "Clock 4", answer: "12:30" },
    { question: "Clock 5", answer: "1:15" },
    { question: "Clock 6", answer: "2:15" },
    { question: "Clock 7", answer: "3:15" },
    { question: "Clock 8", answer: "4:15" },
    { question: "Clock 9", answer: "5:15" },
    { question: "Clock 10", answer: "6:15" },
    { question: "Clock 11", answer: "7:15" },
    { question: "Clock 12", answer: "8:15" },
  ],
  // Page 4 - 12 clocks
  [
    { question: "Clock 1", answer: "9:15" },
    { question: "Clock 2", answer: "10:15" },
    { question: "Clock 3", answer: "11:15" },
    { question: "Clock 4", answer: "12:15" },
    { question: "Clock 5", answer: "1:45" },
    { question: "Clock 6", answer: "2:45" },
    { question: "Clock 7", answer: "3:45" },
    { question: "Clock 8", answer: "4:45" },
    { question: "Clock 9", answer: "5:45" },
    { question: "Clock 10", answer: "6:45" },
    { question: "Clock 11", answer: "7:45" },
    { question: "Clock 12", answer: "8:45" },
  ],
  // Page 5 - 10 clocks
  [
    { question: "Clock 1", answer: "9:45" },
    { question: "Clock 2", answer: "10:45" },
    { question: "Clock 3", answer: "11:45" },
    { question: "Clock 4", answer: "12:45" },
    { question: "Clock 5", answer: "1:20" },
    { question: "Clock 6", answer: "2:40" },
    { question: "Clock 7", answer: "3:50" },
    { question: "Clock 8", answer: "4:25" },
    { question: "Clock 9", answer: "5:35" },
    { question: "Clock 10", answer: "6:55" },
  ],
];

const ClockFaces = () => {
  const [currentPage, setCurrentPage] = useState(0);
  const [activeTool, setActiveTool] = useState<"pencil" | "eraser">("pencil");
  const [activeColor, setActiveColor] = useState("#FF6B6B");
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [fabricCanvas, setFabricCanvas] = useState<FabricCanvas | null>(null);
  const [backgroundImage, setBackgroundImage] = useState<string>(worksheets[0]);
  const [userAnswers, setUserAnswers] = useState<Record<number, string>>({});
  const [checkedAnswers, setCheckedAnswers] = useState<Record<number, boolean | null>>({});

  const colors = [
    { name: "Red", value: "#FF6B6B" },
    { name: "Blue", value: "#4ECDC4" },
    { name: "Green", value: "#95E1D3" },
    { name: "Purple", value: "#AA96DA" },
    { name: "Orange", value: "#FCBF49" },
    { name: "Pink", value: "#F38BA0" },
  ];

  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = new FabricCanvas(canvasRef.current, {
      width: 800,
      height: 1000,
      backgroundColor: "#ffffff",
      isDrawingMode: true,
    });

    const brush = new PencilBrush(canvas);
    brush.color = activeColor;
    brush.width = 3;
    canvas.freeDrawingBrush = brush;

    setFabricCanvas(canvas);

    return () => {
      canvas.dispose();
    };
  }, []);

  useEffect(() => {
    if (!fabricCanvas) return;
    setBackgroundImage(worksheets[currentPage]);
  }, [currentPage, fabricCanvas]);

  useEffect(() => {
    if (!fabricCanvas) return;

    if (activeTool === "pencil") {
      fabricCanvas.isDrawingMode = true;
      const brush = new PencilBrush(fabricCanvas);
      brush.color = activeColor;
      brush.width = 3;
      fabricCanvas.freeDrawingBrush = brush;
    } else {
      fabricCanvas.isDrawingMode = true;
      const brush = new PencilBrush(fabricCanvas);
      brush.color = "#ffffff";
      brush.width = 20;
      fabricCanvas.freeDrawingBrush = brush;
    }
  }, [activeTool, activeColor, fabricCanvas]);

  const handleClear = () => {
    if (!fabricCanvas) return;
    fabricCanvas.clear();
    fabricCanvas.backgroundColor = "#ffffff";
    fabricCanvas.renderAll();
    toast.success("Canvas cleared!");
  };

  const handleUndo = () => {
    if (!fabricCanvas) return;
    const objects = fabricCanvas.getObjects();
    if (objects.length > 0) {
      fabricCanvas.remove(objects[objects.length - 1]);
      fabricCanvas.renderAll();
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
    link.download = `clock-worksheet-${currentPage + 1}.png`;
    link.href = dataURL;
    link.click();
    toast.success("Worksheet downloaded!");
  };

  const handlePrevious = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
      handleClear();
    }
  };

  const handleNext = () => {
    if (currentPage < worksheets.length - 1) {
      setCurrentPage(currentPage + 1);
      handleClear();
    }
  };

  const handleAnswerChange = (index: number, value: string) => {
    setUserAnswers((prev) => ({ ...prev, [index]: value }));
    // Clear the check status when user changes answer
    setCheckedAnswers((prev) => ({ ...prev, [index]: null }));
  };

  const handleCheckAnswers = () => {
    const currentProblems = problems[currentPage];
    const newCheckedAnswers: Record<number, boolean> = {};
    let allCorrect = true;

    currentProblems.forEach((problem, index) => {
      const userAnswer = userAnswers[index]?.trim().toLowerCase() || "";
      const correctAnswer = problem.answer.toLowerCase();
      const isCorrect = userAnswer === correctAnswer;
      newCheckedAnswers[index] = isCorrect;
      if (!isCorrect) allCorrect = false;
    });

    setCheckedAnswers(newCheckedAnswers);

    if (allCorrect) {
      toast.success("Perfect! All answers are correct! 🎉");
    } else {
      toast.error("Some answers need correction. Try again!");
    }
  };

  const handleResetAnswers = () => {
    setUserAnswers({});
    setCheckedAnswers({});
    toast.success("Answers reset!");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
            🕐 Clock Reading Practice
          </h1>
          <p className="text-xl text-gray-600">
            Look at each clock and write the time shown
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left: Canvas */}
          <div className="flex-1">
            <div className="bg-white rounded-2xl shadow-xl p-6">
              {/* Color Palette */}
              <div className="mb-4">
                <p className="text-sm font-semibold text-gray-700 mb-2">Choose Color:</p>
                <div className="flex gap-2 flex-wrap">
                  {colors.map((color) => (
                    <button
                      key={color.value}
                      onClick={() => {
                        setActiveColor(color.value);
                        setActiveTool("pencil");
                      }}
                      className={`w-10 h-10 rounded-full border-4 transition-all ${
                        activeColor === color.value && activeTool === "pencil"
                          ? "border-gray-800 scale-110"
                          : "border-gray-300 hover:scale-105"
                      }`}
                      style={{ backgroundColor: color.value }}
                      title={color.name}
                    />
                  ))}
                </div>
              </div>

              {/* Tools */}
              <div className="flex gap-2 mb-4 flex-wrap">
                <Button
                  variant={activeTool === "pencil" ? "default" : "outline"}
                  onClick={() => setActiveTool("pencil")}
                  className="flex items-center gap-2"
                >
                  <Pencil className="w-4 h-4" />
                  Pencil
                </Button>
                <Button
                  variant={activeTool === "eraser" ? "default" : "outline"}
                  onClick={() => setActiveTool("eraser")}
                  className="flex items-center gap-2"
                >
                  <Eraser className="w-4 h-4" />
                  Eraser
                </Button>
                <Button variant="outline" onClick={handleUndo} className="flex items-center gap-2">
                  <Undo className="w-4 h-4" />
                  Undo
                </Button>
                <Button variant="outline" onClick={handleClear} className="flex items-center gap-2">
                  <Trash2 className="w-4 h-4" />
                  Clear
                </Button>
                <Button variant="outline" onClick={handleDownload} className="flex items-center gap-2">
                  <Download className="w-4 h-4" />
                  Download
                </Button>
              </div>

              {/* Canvas */}
              <div className="relative border-4 border-gray-200 rounded-xl overflow-hidden bg-white">
                <div
                  className="absolute inset-0 bg-cover bg-center bg-no-repeat pointer-events-none"
                  style={{ backgroundImage: `url(${backgroundImage})` }}
                />
                <canvas ref={canvasRef} className="relative" />
              </div>

              {/* Navigation */}
              <div className="flex justify-between items-center mt-6">
                <Button
                  onClick={handlePrevious}
                  disabled={currentPage === 0}
                  variant="outline"
                  className="flex items-center gap-2"
                >
                  <ChevronLeft className="w-4 h-4" />
                  Previous
                </Button>
                <span className="text-lg font-semibold text-gray-700">
                  Page {currentPage + 1} of {worksheets.length}
                </span>
                <Button
                  onClick={handleNext}
                  disabled={currentPage === worksheets.length - 1}
                  variant="outline"
                  className="flex items-center gap-2"
                >
                  Next
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Right: Answer Sheet & Quick Navigation */}
          <div className="lg:w-96">
            {/* Quick Navigation */}
            <div className="bg-white rounded-2xl shadow-xl p-6 mb-6">
              <h3 className="text-lg font-bold text-gray-800 mb-3">Quick Navigation</h3>
              <div className="grid grid-cols-5 gap-2">
                {worksheets.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      setCurrentPage(index);
                      handleClear();
                    }}
                    className={`p-3 rounded-lg font-semibold transition-all ${
                      currentPage === index
                        ? "bg-primary text-white"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    {index + 1}
                  </button>
                ))}
              </div>
            </div>

            {/* Answer Sheet */}
            <div className="bg-white rounded-2xl shadow-xl p-6">
              <h3 className="text-lg font-bold text-gray-800 mb-4">Answer Sheet</h3>
              <div className="grid grid-cols-2 gap-x-8 gap-y-3 mb-4">
                {problems[currentPage].map((problem, index) => (
                  <div key={index} className="flex flex-col">
                    <label className="text-sm font-semibold text-gray-700 mb-1">
                      {problem.question}
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        value={userAnswers[index] || ""}
                        onChange={(e) => handleAnswerChange(index, e.target.value)}
                        placeholder="e.g., 3:00"
                        className={`w-full px-3 py-2 border-2 rounded-lg text-center font-semibold ${
                          checkedAnswers[index] === true
                            ? "border-green-500 bg-green-50"
                            : checkedAnswers[index] === false
                            ? "border-red-500 bg-red-50"
                            : "border-gray-300"
                        }`}
                      />
                      {checkedAnswers[index] === true && (
                        <Check className="absolute right-2 top-2.5 w-5 h-5 text-green-600" />
                      )}
                      {checkedAnswers[index] === false && (
                        <X className="absolute right-2 top-2.5 w-5 h-5 text-red-600" />
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex gap-2">
                <Button onClick={handleCheckAnswers} className="flex-1">
                  Check Answers
                </Button>
                <Button onClick={handleResetAnswers} variant="outline">
                  Reset
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClockFaces;
