import { useEffect, useRef, useState } from "react";
import { Canvas as FabricCanvas, Line, Image as FabricImage } from "fabric";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Scissors, Eraser, RotateCcw, Download, ChevronLeft, ChevronRight, PartyPopper } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Link } from "react-router-dom";
import confetti from "canvas-confetti";
import worksheet1 from "@/assets/scissors/worksheet-1.jpg";
import worksheet2 from "@/assets/scissors/worksheet-2.jpg";
import worksheet3 from "@/assets/scissors/worksheet-3.jpg";
import worksheet4 from "@/assets/scissors/worksheet-4.jpg";

const worksheets = [
  { id: 1, image: worksheet1, title: "Straight Lines" },
  { id: 2, image: worksheet2, title: "Zigzag Patterns" },
  { id: 3, image: worksheet3, title: "Curved Lines" },
  { id: 4, image: worksheet4, title: "Complex Shapes" }
];

const ScissorsCutting = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [fabricCanvas, setFabricCanvas] = useState<FabricCanvas | null>(null);
  const [isCutting, setIsCutting] = useState(false);
  const [currentWorksheet, setCurrentWorksheet] = useState(0);
  const { toast } = useToast();
  const isDrawingRef = useRef(false);
  const lastPosRef = useRef<{ x: number; y: number } | null>(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = new FabricCanvas(canvasRef.current, {
      width: 800,
      height: 600,
      backgroundColor: "#ffffff",
    });

    setFabricCanvas(canvas);
    loadWorksheet(canvas, 0);

    return () => {
      canvas.dispose();
    };
  }, []);

  const loadWorksheet = (canvas: FabricCanvas, index: number) => {
    canvas.clear();
    canvas.backgroundColor = "#ffffff";

    const img = new Image();
    img.onload = () => {
      const fabricImg = new FabricImage(img);
      
      // Scale image to fit canvas
      const scale = Math.min(
        canvas.width! / img.width,
        canvas.height! / img.height
      );
      
      fabricImg.scale(scale);
      fabricImg.set({
        left: (canvas.width! - img.width * scale) / 2,
        top: (canvas.height! - img.height * scale) / 2,
        selectable: false,
        evented: false
      });
      
      canvas.add(fabricImg);
      canvas.sendObjectToBack(fabricImg);
      canvas.renderAll();
    };
    img.src = worksheets[index].image;
  };

  const handleCutToggle = () => {
    if (!fabricCanvas) return;
    
    const newCuttingState = !isCutting;
    setIsCutting(newCuttingState);

    if (newCuttingState) {
      fabricCanvas.selection = false;
      fabricCanvas.forEachObject((obj) => {
        obj.selectable = false;
      });

      fabricCanvas.on("mouse:down", handleMouseDown);
      fabricCanvas.on("mouse:move", handleMouseMove);
      fabricCanvas.on("mouse:up", handleMouseUp);
      
      toast({
        title: "✂️ Cutting Mode Active",
        description: "Click and drag to cut along the lines!",
      });
    } else {
      fabricCanvas.off("mouse:down", handleMouseDown);
      fabricCanvas.off("mouse:move", handleMouseMove);
      fabricCanvas.off("mouse:up", handleMouseUp);
      isDrawingRef.current = false;
      lastPosRef.current = null;
    }
  };

  const handleMouseDown = (e: any) => {
    if (!fabricCanvas) return;
    isDrawingRef.current = true;
    const pointer = fabricCanvas.getPointer(e.e);
    lastPosRef.current = { x: pointer.x, y: pointer.y };
  };

  const handleMouseMove = (e: any) => {
    if (!fabricCanvas || !isDrawingRef.current || !lastPosRef.current) return;

    const pointer = fabricCanvas.getPointer(e.e);
    
    const line = new Line(
      [lastPosRef.current.x, lastPosRef.current.y, pointer.x, pointer.y],
      {
        stroke: "rgba(255, 255, 255, 0.9)",
        strokeWidth: 8,
        selectable: false,
        evented: false,
        strokeLineCap: "round"
      }
    );

    fabricCanvas.add(line);
    lastPosRef.current = { x: pointer.x, y: pointer.y };
    fabricCanvas.renderAll();
  };

  const handleMouseUp = () => {
    isDrawingRef.current = false;
    lastPosRef.current = null;
  };

  const handleClear = () => {
    if (!fabricCanvas) return;
    
    // Remove all cutting lines but keep the background image
    const objects = fabricCanvas.getObjects();
    objects.forEach((obj) => {
      if (obj.type === "line") {
        fabricCanvas.remove(obj);
      }
    });
    
    fabricCanvas.renderAll();
    toast({
      title: "Cleared!",
      description: "All cuts have been removed.",
    });
  };

  const handleReset = () => {
    if (!fabricCanvas) return;
    loadWorksheet(fabricCanvas, currentWorksheet);
    setIsCutting(false);
    toast({
      title: "Reset!",
      description: "Worksheet has been reset.",
    });
  };

  const handleCelebrate = () => {
    if (!fabricCanvas) return;

    const objects = fabricCanvas.getObjects();
    const lines = objects.filter((obj) => obj.type === "line");

    if (lines.length === 0) {
      return;
    }

    // Trigger confetti celebration
    const duration = 3000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

    function randomInRange(min: number, max: number) {
      return Math.random() * (max - min) + min;
    }

    const interval: any = setInterval(function() {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      const particleCount = 50 * (timeLeft / duration);

      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 }
      });
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 }
      });
    }, 250);
  };

  const handleDownload = () => {
    if (!fabricCanvas) return;
    
    const dataURL = fabricCanvas.toDataURL({
      format: "png",
      quality: 1.0,
      multiplier: 1,
    });
    
    const link = document.createElement("a");
    link.download = `scissor-practice-${worksheets[currentWorksheet].title}.png`;
    link.href = dataURL;
    link.click();
    
    toast({
      title: "Downloaded!",
      description: "Your cutting practice has been saved.",
    });
  };

  const handlePrevWorksheet = () => {
    const newIndex = currentWorksheet > 0 ? currentWorksheet - 1 : worksheets.length - 1;
    setCurrentWorksheet(newIndex);
    if (fabricCanvas) {
      loadWorksheet(fabricCanvas, newIndex);
      setIsCutting(false);
    }
  };

  const handleNextWorksheet = () => {
    const newIndex = currentWorksheet < worksheets.length - 1 ? currentWorksheet + 1 : 0;
    setCurrentWorksheet(newIndex);
    if (fabricCanvas) {
      loadWorksheet(fabricCanvas, newIndex);
      setIsCutting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 p-4">
      <div className="max-w-6xl mx-auto">
        <div className="mb-6">
          <Link 
            to="/learning-app" 
            className="text-purple-600 hover:text-purple-700 font-semibold flex items-center gap-2"
          >
            ← Back to Learning Platform
          </Link>
        </div>

        <Card className="p-6 bg-white/90 backdrop-blur-sm shadow-xl">
          <div className="mb-6">
            <h1 className="text-4xl font-bold text-gray-800 mb-2 flex items-center gap-3">
              <Scissors className="w-10 h-10 text-pink-600" />
              ✂️ Scissors Cutting Practice
            </h1>
            <p className="text-gray-600 text-lg">
              Practice your cutting skills! Click "Start Cutting" and drag along the lines.
            </p>
          </div>

          {/* Worksheet Navigation */}
          <div className="mb-4 flex items-center justify-between">
            <Button onClick={handlePrevWorksheet} variant="outline" size="sm">
              <ChevronLeft className="w-4 h-4 mr-1" />
              Previous
            </Button>
            <div className="text-center">
              <p className="font-semibold text-lg">{worksheets[currentWorksheet].title}</p>
              <p className="text-sm text-gray-500">
                Worksheet {currentWorksheet + 1} of {worksheets.length}
              </p>
            </div>
            <Button onClick={handleNextWorksheet} variant="outline" size="sm">
              Next
              <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          </div>

          {/* Toolbar */}
          <div className="mb-4 flex gap-2 flex-wrap">
            <Button
              onClick={handleCutToggle}
              variant={isCutting ? "default" : "outline"}
              className={isCutting ? "bg-pink-600 hover:bg-pink-700" : ""}
            >
              <Scissors className="w-4 h-4 mr-2" />
              {isCutting ? "Stop Cutting" : "Start Cutting"}
            </Button>
            <Button 
              onClick={handleCelebrate}
              className="bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-white"
            >
              <PartyPopper className="w-4 h-4 mr-2" />
              I'm Done! 🎉
            </Button>
            <Button onClick={handleClear} variant="outline">
              <Eraser className="w-4 h-4 mr-2" />
              Clear Cuts
            </Button>
            <Button onClick={handleReset} variant="outline">
              <RotateCcw className="w-4 h-4 mr-2" />
              Reset
            </Button>
            <Button onClick={handleDownload} variant="outline">
              <Download className="w-4 h-4 mr-2" />
              Save
            </Button>
          </div>

          {/* Canvas */}
          <div className="border-4 border-purple-200 rounded-lg shadow-lg overflow-hidden bg-white">
            <canvas ref={canvasRef} className="max-w-full" />
          </div>

          {/* Instructions */}
          <div className="mt-6 p-4 bg-blue-50 rounded-lg border-2 border-blue-200">
            <h3 className="font-bold text-blue-800 mb-2">📝 Instructions:</h3>
            <ol className="list-decimal list-inside space-y-1 text-blue-700">
              <li>Click "Start Cutting" to activate the scissors</li>
              <li>Click and drag along the dotted lines to cut</li>
              <li>When you're done, click "I'm Done!" to celebrate! 🎉</li>
              <li>Use "Clear Cuts" to erase your cuts and try again</li>
              <li>Click "Save" to download your completed worksheet</li>
              <li>Navigate between different worksheets using the arrows</li>
            </ol>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default ScissorsCutting;
