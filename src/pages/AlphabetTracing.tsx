import { useState, useEffect, useRef } from "react";
import { Canvas as FabricCanvas, PencilBrush, Image as FabricImage } from "fabric";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Eraser, Palette, RotateCcw, Download } from "lucide-react";
import { useNavigate } from "react-router-dom";
import confetti from "canvas-confetti";

import pageA from "@/assets/alphabet/page-a.jpg";
import pageB from "@/assets/alphabet/page-b.jpg";
import pageC from "@/assets/alphabet/page-c.jpg";
import pageD from "@/assets/alphabet/page-d.jpg";
import pageE from "@/assets/alphabet/page-e.jpg";
import pageF from "@/assets/alphabet/page-f.jpg";

const worksheets = [
  { id: 1, image: pageA, title: "A - Ant", letter: "A" },
  { id: 2, image: pageB, title: "B - Butterfly", letter: "B" },
  { id: 3, image: pageC, title: "C - Cat", letter: "C" },
  { id: 4, image: pageD, title: "D - Dog", letter: "D" },
  { id: 5, image: pageE, title: "E - Elephant", letter: "E" },
  { id: 6, image: pageF, title: "F - Fish", letter: "F" }
];

const AlphabetTracing = () => {
  const navigate = useNavigate();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [fabricCanvas, setFabricCanvas] = useState<FabricCanvas | null>(null);
  const [currentWorksheet, setCurrentWorksheet] = useState(0);
  const [brushColor, setBrushColor] = useState("#FF1493");
  const [isErasing, setIsErasing] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState("");

  const colors = [
    { name: "Pink", value: "#FF1493" },
    { name: "Blue", value: "#4169E1" },
    { name: "Green", value: "#32CD32" },
    { name: "Orange", value: "#FF8C00" },
    { name: "Purple", value: "#9370DB" },
    { name: "Red", value: "#DC143C" },
    { name: "Yellow", value: "#FFD700" },
    { name: "Brown", value: "#8B4513" }
  ];

  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = new FabricCanvas(canvasRef.current, {
      width: Math.min(800, window.innerWidth - 40),
      height: 600,
      backgroundColor: "#ffffff",
      isDrawingMode: true,
    });

    const brush = new PencilBrush(canvas);
    brush.color = brushColor;
    brush.width = 8;
    canvas.freeDrawingBrush = brush;

    setFabricCanvas(canvas);
    loadWorksheet(canvas, 0);

    return () => {
      canvas.dispose();
    };
  }, []);

  const loadWorksheet = (canvas: FabricCanvas, index: number) => {
    canvas.clear();
    canvas.backgroundColor = "#ffffff";

    FabricImage.fromURL(worksheets[index].image, {
      crossOrigin: "anonymous",
    }).then((img) => {
      const canvasWidth = canvas.width || 800;
      const canvasHeight = canvas.height || 600;
      
      const scale = Math.min(
        canvasWidth / (img.width || 1),
        canvasHeight / (img.height || 1)
      ) * 0.95;

      img.scale(scale);
      img.set({
        left: (canvasWidth - (img.width || 0) * scale) / 2,
        top: (canvasHeight - (img.height || 0) * scale) / 2,
        selectable: false,
        evented: false,
      });

      canvas.add(img);
      canvas.sendObjectToBack(img);
      canvas.renderAll();
    });
  };

  useEffect(() => {
    if (!fabricCanvas) return;

    const brush = fabricCanvas.freeDrawingBrush;
    if (brush instanceof PencilBrush) {
      if (isErasing) {
        brush.color = "#ffffff";
        brush.width = 20;
      } else {
        brush.color = brushColor;
        brush.width = 8;
      }
    }
  }, [brushColor, isErasing, fabricCanvas]);

  const handleClear = () => {
    if (!fabricCanvas) return;
    loadWorksheet(fabricCanvas, currentWorksheet);
  };

  const handleNextWorksheet = () => {
    if (!fabricCanvas) return;
    const nextIndex = (currentWorksheet + 1) % worksheets.length;
    setCurrentWorksheet(nextIndex);
    loadWorksheet(fabricCanvas, nextIndex);
  };

  const handlePrevWorksheet = () => {
    if (!fabricCanvas) return;
    const prevIndex = (currentWorksheet - 1 + worksheets.length) % worksheets.length;
    setCurrentWorksheet(prevIndex);
    loadWorksheet(fabricCanvas, prevIndex);
  };

  const handleCelebrate = () => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    });
    
    setFeedbackMessage("🌟 Great job! Keep practicing!");
    setTimeout(() => setFeedbackMessage(""), 3000);
  };

  const handleDownload = () => {
    if (!fabricCanvas) return;
    const dataURL = fabricCanvas.toDataURL({
      format: 'png',
      quality: 1,
      multiplier: 2
    });
    const link = document.createElement('a');
    link.download = `alphabet-${worksheets[currentWorksheet].letter}.png`;
    link.href = dataURL;
    link.click();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 via-pink-100 to-blue-100 p-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <Button
            onClick={() => navigate("/learning-app")}
            variant="outline"
            className="gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </Button>
          <h1 className="text-3xl md:text-4xl font-bold text-center bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            🎨 Alphabet Tracing & Coloring
          </h1>
          <div className="w-20" />
        </div>

        <div className="bg-white rounded-2xl shadow-2xl p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-gray-800">
              {worksheets[currentWorksheet].title}
            </h2>
            <div className="flex gap-2">
              <Button
                onClick={handlePrevWorksheet}
                variant="outline"
                size="sm"
              >
                ← Previous
              </Button>
              <Button
                onClick={handleNextWorksheet}
                variant="outline"
                size="sm"
              >
                Next →
              </Button>
            </div>
          </div>

          <div className="relative border-4 border-purple-200 rounded-xl overflow-hidden mb-4">
            <canvas ref={canvasRef} className="max-w-full" />
            {feedbackMessage && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/20 backdrop-blur-sm pointer-events-none animate-fade-in animate-scale-in">
                <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-8 py-4 rounded-2xl text-2xl font-bold shadow-2xl">
                  {feedbackMessage}
                </div>
              </div>
            )}
          </div>

          <div className="space-y-4">
            <div className="flex flex-wrap gap-2 items-center">
              <span className="text-sm font-semibold text-gray-700">Colors:</span>
              {colors.map((color) => (
                <button
                  key={color.value}
                  onClick={() => {
                    setBrushColor(color.value);
                    setIsErasing(false);
                  }}
                  className={`w-10 h-10 rounded-full border-4 transition-all hover:scale-110 ${
                    brushColor === color.value && !isErasing
                      ? "border-gray-800 scale-110"
                      : "border-gray-300"
                  }`}
                  style={{ backgroundColor: color.value }}
                  title={color.name}
                />
              ))}
            </div>

            <div className="flex flex-wrap gap-2">
              <Button
                onClick={() => setIsErasing(!isErasing)}
                variant={isErasing ? "default" : "outline"}
                className="gap-2"
              >
                <Eraser className="w-4 h-4" />
                Eraser
              </Button>
              <Button
                onClick={handleClear}
                variant="outline"
                className="gap-2"
              >
                <RotateCcw className="w-4 h-4" />
                Clear
              </Button>
              <Button
                onClick={handleCelebrate}
                className="gap-2 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
              >
                <Palette className="w-4 h-4" />
                I'm Done!
              </Button>
              <Button
                onClick={handleDownload}
                variant="outline"
                className="gap-2"
              >
                <Download className="w-4 h-4" />
                Download
              </Button>
            </div>
          </div>
        </div>

        <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 text-center">
          <p className="text-lg text-gray-700">
            ✏️ Trace the letters and color the pictures! Practice makes perfect! 🌈
          </p>
        </div>
      </div>
    </div>
  );
};

export default AlphabetTracing;
