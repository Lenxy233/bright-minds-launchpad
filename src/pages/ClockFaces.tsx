import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Canvas as FabricCanvas, PencilBrush } from "fabric";
import { Eraser, Pencil, Undo, Trash2, Download, ChevronLeft, ChevronRight, Save, CheckCircle, Settings } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { AnswerZoneManager } from "@/components/clock-worksheet/AnswerZoneManager";
import { StudentAnswerZones } from "@/components/clock-worksheet/StudentAnswerZones";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Import clock worksheet images
import page1 from "@/assets/clocks/page-1.jpg";
import page2 from "@/assets/clocks/page-2.jpg";
import page3 from "@/assets/clocks/page-3.jpg";
import page4 from "@/assets/clocks/page-4.jpg";
import page5 from "@/assets/clocks/page-5.jpg";

const worksheets = [page1, page2, page3, page4, page5];

interface AnswerZone {
  id: string;
  page_number: number;
  x_position: number;
  y_position: number;
  width: number;
  height: number;
  order_index: number;
  correct_answer: string;
}

const ClockFaces = () => {
  const { user } = useAuth();
  const [currentPage, setCurrentPage] = useState(0);
  const [activeTool, setActiveTool] = useState<"pencil" | "eraser">("pencil");
  const [activeColor, setActiveColor] = useState("#FF6B6B");
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [fabricCanvas, setFabricCanvas] = useState<FabricCanvas | null>(null);
  const [mode, setMode] = useState<"student" | "teacher">("student");
  const [answerZones, setAnswerZones] = useState<AnswerZone[]>([]);
  const [userAnswers, setUserAnswers] = useState<Record<string, string>>({});
  const [checkedAnswers, setCheckedAnswers] = useState<Record<string, boolean>>({});
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

  const handleAnswerChange = (zoneId: string, value: string) => {
    setUserAnswers((prev) => ({ ...prev, [zoneId]: value }));
  };

  const handleResetAnswers = () => {
    setUserAnswers({});
    setCheckedAnswers({});
    toast.success("Student answers cleared!");
  };

  // Load answer zones and student answers
  const loadData = async () => {
    // Load answer zones
    const { data: zonesData, error: zonesError } = await supabase
      .from("clock_worksheet_answer_zones")
      .select("*")
      .eq("page_number", currentPage)
      .order("order_index");

    if (zonesError) {
      console.error("Error loading answer zones:", zonesError);
    } else {
      setAnswerZones(zonesData || []);
    }

    // Load student answers if user is logged in
    if (user) {
      const { data: answersData, error: answersError } = await supabase
        .from("clock_worksheet_answers")
        .select("*")
        .eq("user_id", user.id)
        .eq("page_number", currentPage);

      if (answersError) {
        console.error("Error loading answers:", answersError);
      } else {
        const answers: Record<string, string> = {};
        answersData?.forEach((row) => {
          if (row.answer_zone_id && row.student_answer) {
            answers[row.answer_zone_id] = row.student_answer;
          }
        });
        setUserAnswers(answers);
      }
    }

    setCheckedAnswers({});
  };

  // Save student answers to database
  const saveAnswers = async () => {
    if (!user) {
      toast.error("Please log in to save your answers");
      return;
    }

    setIsSaving(true);

    // Save student answers for each zone
    for (const zone of answerZones) {
      const answer = userAnswers[zone.id];
      
      if (answer) {
        const { error } = await supabase
          .from("clock_worksheet_answers")
          .upsert({
            user_id: user.id,
            page_number: currentPage,
            answer_zone_id: zone.id,
            clock_index: zone.order_index,
            student_answer: answer,
          });

        if (error) {
          console.error("Error saving answer:", error);
          toast.error("Failed to save answers");
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
    const results: Record<string, boolean> = {};
    let correctCount = 0;
    let totalChecked = 0;

    answerZones.forEach((zone) => {
      const studentAns = userAnswers[zone.id]?.trim().toLowerCase();
      const correctAns = zone.correct_answer?.trim().toLowerCase();

      if (studentAns && correctAns) {
        const isCorrect = studentAns === correctAns;
        results[zone.id] = isCorrect;
        if (isCorrect) correctCount++;
        totalChecked++;
      }
    });

    setCheckedAnswers(results);
    
    if (totalChecked > 0) {
      toast.success(`Score: ${correctCount}/${totalChecked} correct!`);
    } else {
      toast.info("Please fill in your answers to check");
    }
  };

  // Load data when page changes
  useEffect(() => {
    loadData();
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

              {/* Canvas and Answer Zones */}
              <div className="relative border-4 border-gray-200 rounded-xl overflow-hidden bg-white">
                <div
                  className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                  style={{ 
                    backgroundImage: `url(${worksheets[currentPage]})`,
                    pointerEvents: mode === "teacher" ? "none" : "auto"
                  }}
                />
                <canvas ref={canvasRef} className="relative" style={{ pointerEvents: mode === "teacher" ? "none" : "auto" }} />
                {mode === "student" && answerZones.length > 0 && (
                  <div className="absolute inset-0">
                    <StudentAnswerZones
                      answerZones={answerZones}
                      userAnswers={userAnswers}
                      checkedAnswers={checkedAnswers}
                      onAnswerChange={handleAnswerChange}
                      imageWidth={800}
                      imageHeight={1000}
                    />
                  </div>
                )}
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

          {/* Right: Mode Switcher & Controls */}
          <div className="lg:w-96">
            {/* Mode Switcher */}
            <div className="bg-white rounded-2xl shadow-xl p-6 mb-6">
              <Tabs value={mode} onValueChange={(v) => setMode(v as "student" | "teacher")}>
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="student">Student Mode</TabsTrigger>
                  <TabsTrigger value="teacher">Teacher Mode</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>

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

            {mode === "teacher" ? (
              /* Teacher Mode: Answer Zone Manager */
              <div className="bg-amber-50 rounded-2xl shadow-xl p-6 border-2 border-amber-200">
                <h3 className="text-lg font-bold text-amber-900 mb-2">
                  <Settings className="inline w-5 h-5 mr-2" />
                  Manage Answer Zones
                </h3>
                <p className="text-sm text-amber-700 mb-4">
                  Click "Add Answer Zone" then click on the worksheet to place answer boxes
                </p>
                <AnswerZoneManager
                  pageNumber={currentPage}
                  answerZones={answerZones}
                  onZonesUpdate={loadData}
                  imageWidth={800}
                  imageHeight={1000}
                />
              </div>
            ) : (
              /* Student Mode: Answer Controls */
              <div className="bg-white rounded-2xl shadow-xl p-6">
                <h3 className="text-lg font-bold text-gray-800 mb-2">📝 Your Answers</h3>
                <p className="text-sm text-gray-600 mb-4">
                  Fill in the answer boxes on the worksheet
                </p>
                <div className="space-y-2 mb-4">
                  <p className="text-sm">
                    <span className="font-semibold">Total questions:</span> {answerZones.length}
                  </p>
                  <p className="text-sm">
                    <span className="font-semibold">Answered:</span>{" "}
                    {Object.keys(userAnswers).filter((k) => userAnswers[k]?.trim()).length}
                  </p>
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
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClockFaces;
