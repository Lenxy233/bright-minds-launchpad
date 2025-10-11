import { useState, useEffect, useRef } from "react";
import { Canvas as FabricCanvas, PencilBrush, Image as FabricImage } from "fabric";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { ArrowLeft, Eraser, Palette, RotateCcw, Download, Paintbrush, Droplet } from "lucide-react";
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
  const [toolMode, setToolMode] = useState<"draw" | "fill">("draw");
  const [brushSize, setBrushSize] = useState(8);
  const coloringCanvasRef = useRef<HTMLCanvasElement>(null);
  const [coloringContext, setColoringContext] = useState<CanvasRenderingContext2D | null>(null);

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
    if (!canvasRef.current || !coloringCanvasRef.current) return;

    const canvas = new FabricCanvas(canvasRef.current, {
      width: Math.min(800, window.innerWidth - 40),
      height: 600,
      backgroundColor: "transparent",
      isDrawingMode: true,
    });

    const brush = new PencilBrush(canvas);
    brush.color = brushColor;
    brush.width = brushSize;
    canvas.freeDrawingBrush = brush;

    setFabricCanvas(canvas);

    const colorCanvas = coloringCanvasRef.current;
    colorCanvas.width = canvas.width || 800;
    colorCanvas.height = canvas.height || 600;
    const ctx = colorCanvas.getContext("2d", { willReadFrequently: true });
    setColoringContext(ctx);

    loadWorksheet(canvas, colorCanvas, 0);

    return () => {
      canvas.dispose();
    };
  }, []);

  const loadWorksheet = (canvas: FabricCanvas, colorCanvas: HTMLCanvasElement, index: number) => {
    canvas.clear();
    
    const ctx = colorCanvas.getContext("2d");
    if (ctx) {
      ctx.clearRect(0, 0, colorCanvas.width, colorCanvas.height);
    }

    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = worksheets[index].image;
    img.onload = () => {
      const canvasWidth = canvas.width || 800;
      const canvasHeight = canvas.height || 600;
      
      const scale = Math.min(
        canvasWidth / img.width,
        canvasHeight / img.height
      ) * 0.95;

      const scaledWidth = img.width * scale;
      const scaledHeight = img.height * scale;
      const left = (canvasWidth - scaledWidth) / 2;
      const top = (canvasHeight - scaledHeight) / 2;

      if (ctx) {
        ctx.drawImage(img, left, top, scaledWidth, scaledHeight);
      }
    };
  };

  useEffect(() => {
    if (!fabricCanvas) return;

    const brush = fabricCanvas.freeDrawingBrush;
    if (brush instanceof PencilBrush) {
      if (isErasing) {
        brush.color = "rgba(0,0,0,0)";
        brush.width = 20;
      } else {
        brush.color = brushColor;
        brush.width = brushSize;
      }
    }
  }, [brushColor, isErasing, fabricCanvas, brushSize]);

  const floodFill = (x: number, y: number, fillColor: string) => {
    if (!coloringContext || !coloringCanvasRef.current) return;

    const canvas = coloringCanvasRef.current;
    const ctx = coloringContext;
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const pixels = imageData.data;

    const startPos = (Math.floor(y) * canvas.width + Math.floor(x)) * 4;
    const startR = pixels[startPos];
    const startG = pixels[startPos + 1];
    const startB = pixels[startPos + 2];
    const startA = pixels[startPos + 3];

    const fillRGB = hexToRgb(fillColor);
    if (!fillRGB) return;

    if (startR === fillRGB.r && startG === fillRGB.g && startB === fillRGB.b) return;

    const stack: [number, number][] = [[Math.floor(x), Math.floor(y)]];
    const visited = new Set<string>();

    while (stack.length > 0) {
      const [cx, cy] = stack.pop()!;
      const key = `${cx},${cy}`;
      
      if (visited.has(key) || cx < 0 || cx >= canvas.width || cy < 0 || cy >= canvas.height) {
        continue;
      }

      visited.add(key);
      const pos = (cy * canvas.width + cx) * 4;

      if (
        pixels[pos] === startR &&
        pixels[pos + 1] === startG &&
        pixels[pos + 2] === startB &&
        pixels[pos + 3] === startA
      ) {
        pixels[pos] = fillRGB.r;
        pixels[pos + 1] = fillRGB.g;
        pixels[pos + 2] = fillRGB.b;
        pixels[pos + 3] = 255;

        stack.push([cx + 1, cy]);
        stack.push([cx - 1, cy]);
        stack.push([cx, cy + 1]);
        stack.push([cx, cy - 1]);
      }
    }

    ctx.putImageData(imageData, 0, 0);
  };

  const hexToRgb = (hex: string) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : null;
  };

  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (toolMode !== "fill" || !coloringCanvasRef.current) return;

    const rect = coloringCanvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    floodFill(x, y, brushColor);
  };

  const handleClear = () => {
    if (!fabricCanvas || !coloringCanvasRef.current) return;
    loadWorksheet(fabricCanvas, coloringCanvasRef.current, currentWorksheet);
  };

  const handleNextWorksheet = () => {
    if (!fabricCanvas || !coloringCanvasRef.current) return;
    const nextIndex = (currentWorksheet + 1) % worksheets.length;
    setCurrentWorksheet(nextIndex);
    loadWorksheet(fabricCanvas, coloringCanvasRef.current, nextIndex);
  };

  const handlePrevWorksheet = () => {
    if (!fabricCanvas || !coloringCanvasRef.current) return;
    const prevIndex = (currentWorksheet - 1 + worksheets.length) % worksheets.length;
    setCurrentWorksheet(prevIndex);
    loadWorksheet(fabricCanvas, coloringCanvasRef.current, prevIndex);
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
    if (!fabricCanvas || !coloringCanvasRef.current) return;
    
    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = coloringCanvasRef.current.width;
    tempCanvas.height = coloringCanvasRef.current.height;
    const tempCtx = tempCanvas.getContext('2d');
    
    if (tempCtx) {
      tempCtx.drawImage(coloringCanvasRef.current, 0, 0);
      tempCtx.drawImage(fabricCanvas.getElement(), 0, 0);
    }
    
    const dataURL = tempCanvas.toDataURL('png', 1);
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
            <canvas 
              ref={coloringCanvasRef} 
              className="absolute inset-0" 
              onClick={handleCanvasClick}
              style={{ cursor: toolMode === "fill" ? "crosshair" : "default" }}
            />
            <canvas 
              ref={canvasRef} 
              className="relative pointer-events-none" 
              style={{ pointerEvents: toolMode === "draw" ? "auto" : "none" }}
            />
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
              <span className="text-sm font-semibold text-gray-700">Tool:</span>
              <Button
                onClick={() => setToolMode("draw")}
                variant={toolMode === "draw" ? "default" : "outline"}
                size="sm"
                className="gap-2"
              >
                <Paintbrush className="w-4 h-4" />
                Draw
              </Button>
              <Button
                onClick={() => setToolMode("fill")}
                variant={toolMode === "fill" ? "default" : "outline"}
                size="sm"
                className="gap-2"
              >
                <Droplet className="w-4 h-4" />
                Fill
              </Button>
            </div>

            {toolMode === "draw" && (
              <div className="flex items-center gap-4">
                <span className="text-sm font-semibold text-gray-700">Brush Size:</span>
                <Slider
                  value={[brushSize]}
                  onValueChange={(value) => setBrushSize(value[0])}
                  min={2}
                  max={30}
                  step={2}
                  className="w-48"
                />
                <span className="text-sm text-gray-600">{brushSize}px</span>
              </div>
            )}

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
