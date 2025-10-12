import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Canvas as FabricCanvas, PencilBrush } from "fabric";
import { Eraser, Pencil, Undo, Trash2, Download, ChevronLeft, ChevronRight, Save, CheckCircle } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

// Import clock worksheet images
import page1 from "@/assets/clocks/page-1.jpg";
import page2 from "@/assets/clocks/page-2.jpg";
import page3 from "@/assets/clocks/page-3.jpg";
import page4 from "@/assets/clocks/page-4.jpg";
import page5 from "@/assets/clocks/page-5.jpg";

const worksheets = [page1, page2, page3, page4, page5];

// Number of clocks on each worksheet page
const clockCounts = [9, 12, 12, 12, 10];

const ClockFaces = () => {
  const { user } = useAuth();
  const [currentPage, setCurrentPage] = useState(0);
  const [activeTool, setActiveTool] = useState<"pencil" | "eraser">("pencil");
  const [activeColor, setActiveColor] = useState("#FF6B6B");
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [fabricCanvas, setFabricCanvas] = useState<FabricCanvas | null>(null);
  const [userAnswers, setUserAnswers] = useState<Record<number, string>>({});
  const [correctAnswers, setCorrectAnswers] = useState<Record<number, string>>({});
  const [checkedAnswers, setCheckedAnswers] = useState<Record<number, boolean | null>>({});
  const [isSaving, setIsSaving] = useState(false);

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
      backgroundColor: "transparent",
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
    fabricCanvas.backgroundColor = "transparent";
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
  };

  const handleResetAnswers = () => {
    setUserAnswers({});
    toast.success("Student answers cleared!");
  };

  const handleCorrectAnswerChange = (index: number, value: string) => {
    setCorrectAnswers((prev) => ({ ...prev, [index]: value }));
  };

  const handleResetCorrectAnswers = () => {
    setCorrectAnswers({});
    toast.success("Correct answers cleared!");
  };

  // Load saved answers from database
  const loadAnswers = async () => {
    if (!user) return;

    // Load student answers
    const { data: studentData, error: studentError } = await supabase
      .from("clock_worksheet_answers")
      .select("*")
      .eq("user_id", user.id)
      .eq("page_number", currentPage);

    if (studentError) {
      console.error("Error loading student answers:", studentError);
    }

    const studentAnswers: Record<number, string> = {};
    studentData?.forEach((row) => {
      if (row.student_answer) studentAnswers[row.clock_index] = row.student_answer;
    });

    setUserAnswers(studentAnswers);

    // Load global correct answers
    const { data: correctData, error: correctError } = await supabase
      .from("clock_worksheet_correct_answers")
      .select("*")
      .eq("page_number", currentPage);

    if (correctError) {
      console.error("Error loading correct answers:", correctError);
    }

    const correctAns: Record<number, string> = {};
    correctData?.forEach((row) => {
      correctAns[row.clock_index] = row.correct_answer;
    });

    setCorrectAnswers(correctAns);
    setCheckedAnswers({});
  };

  // Save answers to database
  const saveAnswers = async () => {
    if (!user) {
      toast.error("Please log in to save your answers");
      return;
    }

    setIsSaving(true);
    const allClocks = clockCounts[currentPage];

    // Save student answers
    for (let i = 0; i < allClocks; i++) {
      const studentAns = userAnswers[i] || null;

      if (studentAns) {
        const { error } = await supabase
          .from("clock_worksheet_answers")
          .upsert({
            user_id: user.id,
            page_number: currentPage,
            clock_index: i,
            student_answer: studentAns,
          }, {
            onConflict: "user_id,page_number,clock_index"
          });

        if (error) {
          console.error("Error saving student answer:", error);
          toast.error("Failed to save student answers");
          setIsSaving(false);
          return;
        }
      }
    }

    // Save correct answers globally
    for (let i = 0; i < allClocks; i++) {
      const correctAns = correctAnswers[i] || null;

      if (correctAns) {
        const { error } = await supabase
          .from("clock_worksheet_correct_answers")
          .upsert({
            page_number: currentPage,
            clock_index: i,
            correct_answer: correctAns,
            created_by: user.id,
          }, {
            onConflict: "page_number,clock_index"
          });

        if (error) {
          console.error("Error saving correct answer:", error);
          toast.error("Failed to save correct answers");
          setIsSaving(false);
          return;
        }
      }
    }

    setIsSaving(false);
    toast.success("Answers saved successfully!");
  };

  // Check student answers against correct answers
  const handleCheckAnswers = () => {
    const results: Record<number, boolean | null> = {};
    let correctCount = 0;
    let totalChecked = 0;

    Object.keys(userAnswers).forEach((key) => {
      const index = parseInt(key);
      const studentAns = userAnswers[index]?.trim().toLowerCase();
      const correctAns = correctAnswers[index]?.trim().toLowerCase();

      if (studentAns && correctAns) {
        const isCorrect = studentAns === correctAns;
        results[index] = isCorrect;
        if (isCorrect) correctCount++;
        totalChecked++;
      }
    });

    setCheckedAnswers(results);
    
    if (totalChecked > 0) {
      toast.success(`Score: ${correctCount}/${totalChecked} correct!`);
    } else {
      toast.info("Please fill in both student and correct answers to check");
    }
  };

  // Load answers when page changes
  useEffect(() => {
    if (user) {
      loadAnswers();
    }
  }, [currentPage, user]);

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
                <Button 
                  variant="default" 
                  onClick={saveAnswers} 
                  disabled={isSaving || !user}
                  className="flex items-center gap-2"
                >
                  <Save className="w-4 h-4" />
                  {isSaving ? "Saving..." : "Save Answers"}
                </Button>
              </div>

              {/* Canvas */}
              <div className="relative border-4 border-gray-200 rounded-xl overflow-hidden bg-white">
                <div
                  className="absolute inset-0 bg-cover bg-center bg-no-repeat pointer-events-none"
                  style={{ backgroundImage: `url(${worksheets[currentPage]})` }}
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

            {/* Correct Answers (Teacher View) */}
            <div className="bg-amber-50 rounded-2xl shadow-xl p-6 mb-6 border-2 border-amber-200">
              <h3 className="text-lg font-bold text-amber-900 mb-2">✏️ Correct Answers</h3>
              <p className="text-sm text-amber-700 mb-4">Teacher: Enter the correct time for each clock</p>
              <div className="grid grid-cols-2 gap-x-4 gap-y-3 mb-4">
                {Array.from({ length: clockCounts[currentPage] }).map((_, index) => (
                  <div key={index} className="flex flex-col">
                    <label className="text-xs font-semibold text-amber-800 mb-1">
                      Clock {index + 1}
                    </label>
                    <input
                      type="text"
                      value={correctAnswers[index] || ""}
                      onChange={(e) => handleCorrectAnswerChange(index, e.target.value)}
                      placeholder="e.g., 3:00"
                      className="w-full px-2 py-1.5 border-2 border-amber-300 rounded-lg text-center text-sm font-semibold bg-white focus:border-amber-500 focus:outline-none"
                    />
                  </div>
                ))}
              </div>

              <div className="flex gap-2">
                <Button onClick={handleResetCorrectAnswers} variant="outline" className="flex-1">
                  Clear Correct Answers
                </Button>
              </div>
            </div>

            {/* Student Answer Sheet */}
            <div className="bg-white rounded-2xl shadow-xl p-6">
              <h3 className="text-lg font-bold text-gray-800 mb-2">📝 Student Answers</h3>
              <p className="text-sm text-gray-600 mb-4">Student: Write your answers here</p>
              <div className="grid grid-cols-2 gap-x-4 gap-y-3 mb-4">
                {Array.from({ length: clockCounts[currentPage] }).map((_, index) => (
                  <div key={index} className="flex flex-col relative">
                    <label className="text-xs font-semibold text-gray-700 mb-1">
                      Clock {index + 1}
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        value={userAnswers[index] || ""}
                        onChange={(e) => handleAnswerChange(index, e.target.value)}
                        placeholder="e.g., 3:00"
                        className={`w-full px-2 py-1.5 border-2 rounded-lg text-center text-sm font-semibold focus:outline-none ${
                          checkedAnswers[index] === true
                            ? "border-green-500 bg-green-50"
                            : checkedAnswers[index] === false
                            ? "border-red-500 bg-red-50"
                            : "border-gray-300 focus:border-primary"
                        }`}
                      />
                      {checkedAnswers[index] === true && (
                        <CheckCircle className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-green-600" />
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex gap-2">
                <Button onClick={handleResetAnswers} variant="outline" className="flex-1">
                  Clear Answers
                </Button>
                <Button onClick={handleCheckAnswers} variant="default" className="flex-1">
                  <CheckCircle className="w-4 h-4 mr-1" />
                  Check
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
