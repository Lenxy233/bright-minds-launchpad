import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Download, Eraser, Palette, Paintbrush, Droplet } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Slider } from "@/components/ui/slider";

import letterA from "@/assets/alphabet-az/letter-a.jpg";
import letterB from "@/assets/alphabet-az/letter-b.jpg";
import letterC from "@/assets/alphabet-az/letter-c.jpg";
import letterD from "@/assets/alphabet-az/letter-d.jpg";
import letterE from "@/assets/alphabet-az/letter-e.jpg";
import letterF from "@/assets/alphabet-az/letter-f.jpg";
import letterG from "@/assets/alphabet-az/letter-g.jpg";
import letterH from "@/assets/alphabet-az/letter-h.jpg";
import letterI from "@/assets/alphabet-az/letter-i.jpg";
import letterJ from "@/assets/alphabet-az/letter-j.jpg";
import letterK from "@/assets/alphabet-az/letter-k.jpg";
import letterL from "@/assets/alphabet-az/letter-l.jpg";
import letterM from "@/assets/alphabet-az/letter-m.jpg";
import letterN from "@/assets/alphabet-az/letter-n.jpg";
import letterO from "@/assets/alphabet-az/letter-o.jpg";
import letterP from "@/assets/alphabet-az/letter-p.jpg";
import letterQ from "@/assets/alphabet-az/letter-q.jpg";
import letterR from "@/assets/alphabet-az/letter-r.jpg";
import letterS from "@/assets/alphabet-az/letter-s.jpg";
import letterT from "@/assets/alphabet-az/letter-t.jpg";
import letterU from "@/assets/alphabet-az/letter-u.jpg";
import letterV from "@/assets/alphabet-az/letter-v.jpg";
import letterW from "@/assets/alphabet-az/letter-w.jpg";
import letterX from "@/assets/alphabet-az/letter-x.jpg";
import letterY from "@/assets/alphabet-az/letter-y.jpg";
import letterZ from "@/assets/alphabet-az/letter-z.jpg";

const AlphabetAZTracing = () => {
  const navigate = useNavigate();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const coloringCanvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [context, setContext] = useState<CanvasRenderingContext2D | null>(null);
  const [coloringContext, setColoringContext] = useState<CanvasRenderingContext2D | null>(null);
  const [brushColor, setBrushColor] = useState("#000000");
  const [toolMode, setToolMode] = useState<"draw" | "fill">("draw");
  const [brushSize, setBrushSize] = useState([8]);

  const letters = [
    { letter: "A", image: letterA },
    { letter: "B", image: letterB },
    { letter: "C", image: letterC },
    { letter: "D", image: letterD },
    { letter: "E", image: letterE },
    { letter: "F", image: letterF },
    { letter: "G", image: letterG },
    { letter: "H", image: letterH },
    { letter: "I", image: letterI },
    { letter: "J", image: letterJ },
    { letter: "K", image: letterK },
    { letter: "L", image: letterL },
    { letter: "M", image: letterM },
    { letter: "N", image: letterN },
    { letter: "O", image: letterO },
    { letter: "P", image: letterP },
    { letter: "Q", image: letterQ },
    { letter: "R", image: letterR },
    { letter: "S", image: letterS },
    { letter: "T", image: letterT },
    { letter: "U", image: letterU },
    { letter: "V", image: letterV },
    { letter: "W", image: letterW },
    { letter: "X", image: letterX },
    { letter: "Y", image: letterY },
    { letter: "Z", image: letterZ },
  ];

  const colors = [
    "#000000", "#FF0000", "#00FF00", "#0000FF", "#FFFF00",
    "#FF00FF", "#00FFFF", "#FFA500", "#800080", "#FFC0CB"
  ];

  useEffect(() => {
    if (canvasRef.current && coloringCanvasRef.current) {
      const canvas = canvasRef.current;
      const coloringCanvas = coloringCanvasRef.current;
      const ctx = canvas.getContext("2d", { willReadFrequently: true });
      const coloringCtx = coloringCanvas.getContext("2d", { willReadFrequently: true });
      
      if (ctx && coloringCtx) {
        setContext(ctx);
        setColoringContext(coloringCtx);
        loadLetter(currentIndex, ctx, coloringCtx);
      }
    }
  }, [currentIndex]);

  useEffect(() => {
    if (context) {
      context.strokeStyle = brushColor;
      context.lineWidth = brushSize[0];
      context.lineCap = "round";
      context.lineJoin = "round";
    }
  }, [brushColor, context, brushSize]);

  const loadLetter = (index: number, ctx: CanvasRenderingContext2D, coloringCtx: CanvasRenderingContext2D) => {
    const canvas = canvasRef.current;
    const coloringCanvas = coloringCanvasRef.current;
    if (!canvas || !coloringCanvas) return;

    const img = new Image();
    
    img.src = letters[index].image;
    img.onload = () => {
      const canvasWidth = canvas.width || 800;
      const canvasHeight = canvas.height || 600;
      
      coloringCanvas.width = canvasWidth;
      coloringCanvas.height = canvasHeight;
      canvas.width = canvasWidth;
      canvas.height = canvasHeight;

      const scale = Math.min(canvasWidth / img.width, canvasHeight / img.height);
      const x = (canvasWidth - img.width * scale) / 2;
      const y = (canvasHeight - img.height * scale) / 2;

      coloringCtx.clearRect(0, 0, canvasWidth, canvasHeight);
      coloringCtx.drawImage(img, x, y, img.width * scale, img.height * scale);

      ctx.clearRect(0, 0, canvasWidth, canvasHeight);
    };
  };

  const hexToRgb = (hex: string) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : null;
  };

  const floodFill = (x: number, y: number, fillColor: string) => {
    const coloringCanvas = coloringCanvasRef.current;
    const ctx = coloringContext;
    if (!coloringCanvas || !ctx) return;

    const imageData = ctx.getImageData(0, 0, coloringCanvas.width, coloringCanvas.height);
    const pixels = imageData.data;
    
    const targetColor = {
      r: pixels[((y * coloringCanvas.width) + x) * 4],
      g: pixels[((y * coloringCanvas.width) + x) * 4 + 1],
      b: pixels[((y * coloringCanvas.width) + x) * 4 + 2],
      a: pixels[((y * coloringCanvas.width) + x) * 4 + 3]
    };

    const rgb = hexToRgb(fillColor);
    if (!rgb) return;

    const newColor = { r: rgb.r, g: rgb.g, b: rgb.b, a: 255 };

    if (targetColor.r === newColor.r && 
        targetColor.g === newColor.g && 
        targetColor.b === newColor.b) {
      return;
    }

    const stack = [[x, y]];
    const visited = new Set<string>();

    while (stack.length > 0) {
      const [currentX, currentY] = stack.pop()!;
      const key = `${currentX},${currentY}`;

      if (visited.has(key)) continue;
      if (currentX < 0 || currentX >= coloringCanvas.width || 
          currentY < 0 || currentY >= coloringCanvas.height) continue;

      const index = ((currentY * coloringCanvas.width) + currentX) * 4;
      
      if (pixels[index] === targetColor.r &&
          pixels[index + 1] === targetColor.g &&
          pixels[index + 2] === targetColor.b &&
          pixels[index + 3] === targetColor.a) {
        
        visited.add(key);
        pixels[index] = newColor.r;
        pixels[index + 1] = newColor.g;
        pixels[index + 2] = newColor.b;
        pixels[index + 3] = newColor.a;

        stack.push([currentX + 1, currentY]);
        stack.push([currentX - 1, currentY]);
        stack.push([currentX, currentY + 1]);
        stack.push([currentX, currentY - 1]);
      }
    }

    ctx.putImageData(imageData, 0, 0);
  };

  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (toolMode !== "fill") return;

    const canvas = coloringCanvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = Math.floor(e.clientX - rect.left);
    const y = Math.floor(e.clientY - rect.top);

    floodFill(x, y, brushColor);
  };

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (toolMode === "fill") return;
    setIsDrawing(true);
    draw(e);
  };

  const stopDrawing = () => {
    setIsDrawing(false);
    if (context) {
      context.beginPath();
    }
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing || !context || toolMode === "fill") return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    context.lineTo(x, y);
    context.stroke();
    context.beginPath();
    context.moveTo(x, y);
  };

  const handleClear = () => {
    if (context && coloringContext) {
      loadLetter(currentIndex, context, coloringContext);
      toast.success("Canvas cleared!");
    }
  };

  const handleNextLetter = () => {
    if (currentIndex < letters.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handlePrevLetter = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const handleDownload = () => {
    const canvas = canvasRef.current;
    const coloringCanvas = coloringCanvasRef.current;
    if (!canvas || !coloringCanvas) return;

    const tempCanvas = document.createElement("canvas");
    tempCanvas.width = canvas.width;
    tempCanvas.height = canvas.height;
    const tempCtx = tempCanvas.getContext("2d");

    if (tempCtx) {
      tempCtx.drawImage(coloringCanvas, 0, 0);
      tempCtx.drawImage(canvas, 0, 0);

      tempCanvas.toBlob((blob) => {
        if (blob) {
          const url = URL.createObjectURL(blob);
          const link = document.createElement("a");
          link.download = `letter-${letters[currentIndex].letter}-traced.png`;
          link.href = url;
          link.click();
          URL.revokeObjectURL(url);
          toast.success("Downloaded!");
        }
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <Button
            variant="outline"
            onClick={() => navigate("/learning-app")}
            className="gap-2"
          >
            <ChevronLeft className="w-4 h-4" />
            Back
          </Button>
          <h1 className="text-3xl font-bold text-gray-800">
            A-Z Tracing & Coloring
          </h1>
          <div className="w-24" />
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-gray-800">
              Letter {letters[currentIndex].letter}
            </h2>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="icon"
                onClick={handlePrevLetter}
                disabled={currentIndex === 0}
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <span className="px-4 py-2 bg-gray-100 rounded-lg font-semibold">
                {currentIndex + 1} / {letters.length}
              </span>
              <Button
                variant="outline"
                size="icon"
                onClick={handleNextLetter}
                disabled={currentIndex === letters.length - 1}
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>

          <div className="mb-4">
            <div className="flex flex-wrap gap-3 items-center justify-between">
              <div className="flex gap-2">
                <Button
                  variant={toolMode === "draw" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setToolMode("draw")}
                  className="gap-2"
                >
                  <Paintbrush className="w-4 h-4" />
                  Draw
                </Button>
                <Button
                  variant={toolMode === "fill" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setToolMode("fill")}
                  className="gap-2"
                >
                  <Droplet className="w-4 h-4" />
                  Fill
                </Button>
              </div>

              {toolMode === "draw" && (
                <div className="flex items-center gap-3">
                  <Paintbrush className="w-4 h-4 text-gray-600" />
                  <Slider
                    value={brushSize}
                    onValueChange={setBrushSize}
                    min={2}
                    max={20}
                    step={1}
                    className="w-32"
                  />
                  <span className="text-sm font-medium text-gray-600 w-8">
                    {brushSize[0]}px
                  </span>
                </div>
              )}

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleClear}
                  className="gap-2"
                >
                  <Eraser className="w-4 h-4" />
                  Clear
                </Button>
                <Button
                  variant="default"
                  size="sm"
                  onClick={handleDownload}
                  className="gap-2"
                >
                  <Download className="w-4 h-4" />
                  Download
                </Button>
              </div>
            </div>

            <div className="flex items-center gap-2 mt-4">
              <Palette className="w-5 h-5 text-gray-600" />
              <div className="flex gap-2 flex-wrap">
                {colors.map((color) => (
                  <button
                    key={color}
                    onClick={() => setBrushColor(color)}
                    className={`w-8 h-8 rounded-full border-2 transition-transform hover:scale-110 ${
                      brushColor === color ? "border-gray-800 scale-110" : "border-gray-300"
                    }`}
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
            </div>
          </div>

          <div className="relative bg-gray-50 rounded-lg overflow-hidden" style={{ height: "600px" }}>
            <canvas 
              ref={coloringCanvasRef} 
              className="absolute inset-0" 
              onClick={handleCanvasClick}
              style={{ cursor: toolMode === "fill" ? "crosshair" : "default", pointerEvents: toolMode === "fill" ? "auto" : "none" }}
            />
            <canvas 
              ref={canvasRef} 
              className="relative"
              onMouseDown={startDrawing}
              onMouseUp={stopDrawing}
              onMouseOut={stopDrawing}
              onMouseMove={draw}
              style={{ 
                cursor: toolMode === "draw" ? "crosshair" : "default",
                pointerEvents: toolMode === "draw" ? "auto" : "none"
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AlphabetAZTracing;
