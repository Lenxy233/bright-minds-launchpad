import { useState, useEffect, useRef } from "react";
import { Canvas as FabricCanvas, PencilBrush, Image as FabricImage } from "fabric";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Eraser, Palette, RotateCcw, Download, Paintbrush, Pencil } from "lucide-react";
import { useNavigate } from "react-router-dom";
import confetti from "canvas-confetti";
import { Slider } from "@/components/ui/slider";

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
  const coloringCanvasRef = useRef<HTMLCanvasElement>(null);
  const [fabricCanvas, setFabricCanvas] = useState<FabricCanvas | null>(null);
  const [currentWorksheet, setCurrentWorksheet] = useState(0);
  const [brushColor, setBrushColor] = useState("#FF1493");
  const [isErasing, setIsErasing] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState("");
  const [mode, setMode] = useState<"coloring" | "tracing">("coloring");
  const [brushSize, setBrushSize] = useState(5);
  const coloringCtxRef = useRef<CanvasRenderingContext2D | null>(null);
  const backgroundImageRef = useRef<HTMLImageElement | null>(null);

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

    const width = Math.min(800, window.innerWidth - 40);
    const height = 600;

    // Setup tracing canvas
    const canvas = new FabricCanvas(canvasRef.current, {
      width,
      height,
      backgroundColor: "transparent",
      isDrawingMode: true,
      selection: false,
    });

    const brush = new PencilBrush(canvas);
    brush.color = brushColor;
    brush.width = brushSize;
    canvas.freeDrawingBrush = brush;

    setFabricCanvas(canvas);

    // Setup coloring canvas
    const coloringCanvas = coloringCanvasRef.current;
    coloringCanvas.width = width;
    coloringCanvas.height = height;
    const ctx = coloringCanvas.getContext("2d", { willReadFrequently: true });
    if (ctx) {
      ctx.imageSmoothingEnabled = false;
    }
    coloringCtxRef.current = ctx;

    loadWorksheet(canvas, 0);

    return () => {
      canvas.dispose();
    };
  }, []);

  const loadWorksheet = (canvas: FabricCanvas, index: number) => {
    canvas.clear();
    canvas.backgroundColor = "transparent";

    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = worksheets[index].image;
    
    img.onload = () => {
      backgroundImageRef.current = img;
      
      const canvasWidth = canvas.width || 800;
      const canvasHeight = canvas.height || 600;
      
      const scale = Math.min(
        canvasWidth / img.width,
        canvasHeight / img.height
      ) * 0.95;

      // Draw on coloring canvas
      if (coloringCtxRef.current && coloringCanvasRef.current) {
        coloringCtxRef.current.clearRect(0, 0, coloringCanvasRef.current.width, coloringCanvasRef.current.height);
        coloringCtxRef.current.fillStyle = "#ffffff";
        coloringCtxRef.current.fillRect(0, 0, coloringCanvasRef.current.width, coloringCanvasRef.current.height);
        
        const left = (canvasWidth - img.width * scale) / 2;
        const top = (canvasHeight - img.height * scale) / 2;
        
        coloringCtxRef.current.drawImage(
          img,
          left,
          top,
          img.width * scale,
          img.height * scale
        );
      }
    };
  };

  useEffect(() => {
    if (!fabricCanvas) return;

    fabricCanvas.isDrawingMode = mode === "tracing";

    const brush = fabricCanvas.freeDrawingBrush;
    if (brush instanceof PencilBrush) {
      if (isErasing) {
        brush.color = "#ffffff";
        brush.width = brushSize * 2;
      } else {
        brush.color = brushColor;
        brush.width = brushSize;
      }
    }
  }, [brushColor, isErasing, fabricCanvas, mode, brushSize]);

  const floodFill = (x: number, y: number, fillColor: string) => {
    if (!coloringCtxRef.current || !coloringCanvasRef.current) return;

    const ctx = coloringCtxRef.current;
    const canvas = coloringCanvasRef.current;
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const pixels = imageData.data;

    const targetColor = getPixelColor(pixels, x, y, canvas.width);
    const fillRgb = hexToRgb(fillColor);

    if (colorsMatch(targetColor, fillRgb)) return;

    const stack: [number, number][] = [[x, y]];
    const visited = new Set<string>();

    while (stack.length > 0) {
      const [px, py] = stack.pop()!;
      const key = `${px},${py}`;

      if (visited.has(key)) continue;
      if (px < 0 || px >= canvas.width || py < 0 || py >= canvas.height) continue;

      const currentColor = getPixelColor(pixels, px, py, canvas.width);
      if (!colorsMatch(currentColor, targetColor)) continue;

      visited.add(key);
      setPixelColor(pixels, px, py, canvas.width, fillRgb);

      stack.push([px + 1, py], [px - 1, py], [px, py + 1], [px, py - 1]);
    }

    ctx.putImageData(imageData, 0, 0);
  };

  const getPixelColor = (pixels: Uint8ClampedArray, x: number, y: number, width: number) => {
    const index = (y * width + x) * 4;
    return [pixels[index], pixels[index + 1], pixels[index + 2], pixels[index + 3]];
  };

  const setPixelColor = (pixels: Uint8ClampedArray, x: number, y: number, width: number, color: number[]) => {
    const index = (y * width + x) * 4;
    pixels[index] = color[0];
    pixels[index + 1] = color[1];
    pixels[index + 2] = color[2];
    pixels[index + 3] = 255;
  };

  const colorsMatch = (c1: number[], c2: number[]) => {
    return c1[0] === c2[0] && c1[1] === c2[1] && c1[2] === c2[2] && c1[3] === c2[3];
  };

  const hexToRgb = (hex: string): number[] => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? [
      parseInt(result[1], 16),
      parseInt(result[2], 16),
      parseInt(result[3], 16)
    ] : [0, 0, 0];
  };

  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (mode !== "coloring" || !coloringCanvasRef.current) return;

    const rect = coloringCanvasRef.current.getBoundingClientRect();
    const x = Math.floor(e.clientX - rect.left);
    const y = Math.floor(e.clientY - rect.top);

    floodFill(x, y, brushColor);
  };

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
    <div className="min-h-screen bg-gradient-to-br from-purple-100 via-pink-100 to-blue-100 p-2 md:p-4">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-3">
          <Button
            onClick={() => navigate("/learning-app")}
            variant="outline"
            size="sm"
            className="gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </Button>
          <h1 className="text-xl md:text-3xl font-bold text-center bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            🎨 Alphabet Tracing & Coloring
          </h1>
          <div className="w-16 md:w-20" />
        </div>

        <div className="bg-white rounded-xl shadow-lg p-3 md:p-4 mb-3">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-lg md:text-xl font-bold text-gray-800">
              {worksheets[currentWorksheet].title}
            </h2>
            <div className="flex gap-1">
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

          <div className="relative border-2 border-purple-200 rounded-lg overflow-hidden mb-3 inline-block">
            <canvas 
              ref={coloringCanvasRef} 
              className="block max-w-full"
              onClick={handleCanvasClick}
              style={{ 
                cursor: mode === "coloring" ? "crosshair" : "default",
                display: "block"
              }}
            />
            <canvas 
              ref={canvasRef} 
              className="absolute top-0 left-0 max-w-full"
              style={{ 
                pointerEvents: mode === "tracing" ? "auto" : "none",
                display: "block"
              }}
            />
            {feedbackMessage && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/20 backdrop-blur-sm pointer-events-none animate-fade-in animate-scale-in">
                <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-xl text-xl font-bold shadow-xl">
                  {feedbackMessage}
                </div>
              </div>
            )}
          </div>

          <div className="space-y-2">
            <div className="flex flex-wrap gap-2 items-center">
              <Button
                onClick={() => setMode("coloring")}
                variant={mode === "coloring" ? "default" : "outline"}
                className="gap-2"
              >
                <Palette className="w-4 h-4" />
                Coloring Mode
              </Button>
              <Button
                onClick={() => setMode("tracing")}
                variant={mode === "tracing" ? "default" : "outline"}
                className="gap-2"
              >
                <Pencil className="w-4 h-4" />
                Tracing Mode
              </Button>
            </div>

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

            {mode === "tracing" && (
              <div className="flex items-center gap-2 p-2 bg-purple-50 rounded-lg">
                <Paintbrush className="w-4 h-4 text-purple-600" />
                <span className="text-xs font-semibold text-gray-700">Size:</span>
                <Slider
                  value={[brushSize]}
                  onValueChange={(value) => setBrushSize(value[0])}
                  min={2}
                  max={20}
                  step={1}
                  className="flex-1 max-w-[150px]"
                />
                <span className="text-xs font-semibold text-gray-700 min-w-[35px]">{brushSize}px</span>
              </div>
            )}

            <div className="flex flex-wrap gap-1.5">
              {mode === "tracing" && (
                <Button
                  onClick={() => setIsErasing(!isErasing)}
                  variant={isErasing ? "default" : "outline"}
                  className="gap-2"
                >
                  <Eraser className="w-4 h-4" />
                  Eraser
                </Button>
              )}
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

        <div className="bg-white/80 backdrop-blur-sm rounded-lg p-3 text-center">
          <p className="text-sm md:text-base text-gray-700">
            {mode === "coloring" 
              ? "🎨 Click on any section to fill it with color! Switch to Tracing Mode to practice writing." 
              : "✏️ Trace the letters with your brush! Adjust the brush size for better control."}
          </p>
        </div>
      </div>
    </div>
  );
};

export default AlphabetTracing;
