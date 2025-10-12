import { useEffect, useRef, useState } from "react";
import { Canvas as FabricCanvas, Rect, FabricImage } from "fabric";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Eraser, Download, CheckCircle, XCircle, Eye, EyeOff, Settings, Save, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Progress } from "@/components/ui/progress";
import answersData from "@/data/alphabet-recognition-answers.json";

// Import all alphabet recognition worksheets
import letterA from "@/assets/alphabet-recognition/letter-a.jpg";
import letterB from "@/assets/alphabet-recognition/letter-b.jpg";
import letterC from "@/assets/alphabet-recognition/letter-c.jpg";
import letterD from "@/assets/alphabet-recognition/letter-d.jpg";
import letterE from "@/assets/alphabet-recognition/letter-e.jpg";
import letterF from "@/assets/alphabet-recognition/letter-f.jpg";
import letterG from "@/assets/alphabet-recognition/letter-g.jpg";
import letterH from "@/assets/alphabet-recognition/letter-h.jpg";
import letterI from "@/assets/alphabet-recognition/letter-i.jpg";
import letterJ from "@/assets/alphabet-recognition/letter-j.jpg";
import letterK from "@/assets/alphabet-recognition/letter-k.jpg";
import letterL from "@/assets/alphabet-recognition/letter-l.jpg";
import letterM from "@/assets/alphabet-recognition/letter-m.jpg";
import letterN from "@/assets/alphabet-recognition/letter-n.jpg";
import letterO from "@/assets/alphabet-recognition/letter-o.jpg";
import letterP from "@/assets/alphabet-recognition/letter-p.jpg";
import letterQ from "@/assets/alphabet-recognition/letter-q.jpg";
import letterR from "@/assets/alphabet-recognition/letter-r.jpg";
import letterS from "@/assets/alphabet-recognition/letter-s.jpg";
import letterT from "@/assets/alphabet-recognition/letter-t.jpg";
import letterU from "@/assets/alphabet-recognition/letter-u.jpg";
import letterV from "@/assets/alphabet-recognition/letter-v.jpg";
import letterW from "@/assets/alphabet-recognition/letter-w.jpg";
import letterX from "@/assets/alphabet-recognition/letter-x.jpg";
import letterY from "@/assets/alphabet-recognition/letter-y.jpg";
import letterZ from "@/assets/alphabet-recognition/letter-z.jpg";

// Load answers from JSON file
const loadAnswersFromJson = () => {
  const worksheets = [];
  const images: Record<string, string> = {
    A: letterA, B: letterB, C: letterC, D: letterD, E: letterE, F: letterF,
    G: letterG, H: letterH, I: letterI, J: letterJ, K: letterK, L: letterL,
    M: letterM, N: letterN, O: letterO, P: letterP, Q: letterQ, R: letterR,
    S: letterS, T: letterT, U: letterU, V: letterV, W: letterW, X: letterX,
    Y: letterY, Z: letterZ
  };

  for (const [letter, data] of Object.entries(answersData)) {
    worksheets.push({
      letter: data.letter,
      image: images[letter as keyof typeof images],
      theme: data.theme,
      correctRegions: data.correctRegions,
      totalItems: data.correctRegions.length
    });
  }
  return worksheets;
};

const alphabetWorksheets = loadAnswersFromJson();

// Fallback data structure (keeping first entry as example)
const exampleWorksheet = { 
    letter: "A", 
    image: letterA, 
    theme: "Apple",
    correctRegions: [
      { x: 100, y: 200, width: 150, height: 150 },
      { x: 350, y: 200, width: 150, height: 150 },
      { x: 600, y: 200, width: 150, height: 150 },
      { x: 100, y: 450, width: 150, height: 150 },
      { x: 350, y: 450, width: 150, height: 150 },
    ],
    totalItems: 8
  };

const colors = [
  { name: "Red", value: "#FF6B6B" },
  { name: "Blue", value: "#4ECDC4" },
  { name: "Green", value: "#95E77D" },
  { name: "Yellow", value: "#FFE66D" },
  { name: "Purple", value: "#BB6BD9" },
  { name: "Orange", value: "#FFA500" },
  { name: "Pink", value: "#FFB6C1" },
];

const AlphabetRecognition = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [fabricCanvas, setFabricCanvas] = useState<FabricCanvas | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [activeColor, setActiveColor] = useState(colors[0].value);
  const [correctCount, setCorrectCount] = useState(0);
  const [incorrectCount, setIncorrectCount] = useState(0);
  const [coloredRegions, setColoredRegions] = useState<Set<number>>(new Set());
  const [showCorrectRegions, setShowCorrectRegions] = useState(false);
  const offscreenCanvasRef = useRef<HTMLCanvasElement | null>(null);
  
  // Admin mode states
  const [adminMode, setAdminMode] = useState(false);
  const [isDefiningRegion, setIsDefiningRegion] = useState(false);
  const [regionStart, setRegionStart] = useState<{ x: number; y: number } | null>(null);
  const [currentRegions, setCurrentRegions] = useState<Array<{ x: number; y: number; width: number; height: number }>>(
    alphabetWorksheets[currentIndex]?.correctRegions || []
  );

  const currentWorksheet = alphabetWorksheets[currentIndex];

  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = new FabricCanvas(canvasRef.current, {
      width: 850,
      height: 1100,
      backgroundColor: "#ffffff",
    });

    setFabricCanvas(canvas);

    return () => {
      canvas.dispose();
    };
  }, []);

  useEffect(() => {
    if (!fabricCanvas) return;
    loadWorksheet();
    setCorrectCount(0);
    setIncorrectCount(0);
    setColoredRegions(new Set());
    setCurrentRegions(alphabetWorksheets[currentIndex]?.correctRegions || []);
    setShowCorrectRegions(false);
  }, [fabricCanvas, currentIndex]);

  const loadWorksheet = async () => {
    if (!fabricCanvas) return;

    fabricCanvas.clear();
    
    FabricImage.fromURL(currentWorksheet.image).then((img) => {
      const scaleX = fabricCanvas.width! / img.width!;
      const scaleY = fabricCanvas.height! / img.height!;
      
      img.set({
        scaleX,
        scaleY,
        left: 0,
        top: 0,
      });
      
      fabricCanvas.backgroundImage = img;
      fabricCanvas.renderAll();

      // Create offscreen canvas for pixel data
      if (!offscreenCanvasRef.current) {
        offscreenCanvasRef.current = document.createElement('canvas');
      }
      offscreenCanvasRef.current.width = fabricCanvas.width!;
      offscreenCanvasRef.current.height = fabricCanvas.height!;
      const ctx = offscreenCanvasRef.current.getContext('2d');
      if (ctx) {
        const imgElement = img.getElement() as HTMLImageElement;
        ctx.drawImage(imgElement, 0, 0, fabricCanvas.width!, fabricCanvas.height!);
      }
    });
  };

  const floodFill = (startX: number, startY: number, fillColor: string) => {
    if (!fabricCanvas || !offscreenCanvasRef.current) return;

    const ctx = offscreenCanvasRef.current.getContext('2d');
    if (!ctx) return;

    const imageData = ctx.getImageData(0, 0, fabricCanvas.width!, fabricCanvas.height!);
    const pixels = imageData.data;
    const width = imageData.width;
    const height = imageData.height;

    const startPos = (Math.floor(startY) * width + Math.floor(startX)) * 4;
    const startR = pixels[startPos];
    const startG = pixels[startPos + 1];
    const startB = pixels[startPos + 2];

    const fillRgb = hexToRgb(fillColor);
    if (!fillRgb) return;

    const tolerance = 40;
    const visited = new Set<number>();
    const stack: Array<[number, number]> = [[Math.floor(startX), Math.floor(startY)]];

    const colorMatch = (pos: number) => {
      const r = pixels[pos];
      const g = pixels[pos + 1];
      const b = pixels[pos + 2];
      return (
        Math.abs(r - startR) <= tolerance &&
        Math.abs(g - startG) <= tolerance &&
        Math.abs(b - startB) <= tolerance
      );
    };

    while (stack.length > 0) {
      const [x, y] = stack.pop()!;
      const key = y * width + x;

      if (
        x < 0 || x >= width ||
        y < 0 || y >= height ||
        visited.has(key)
      ) continue;

      const pos = key * 4;
      if (!colorMatch(pos)) continue;

      visited.add(key);
      pixels[pos] = fillRgb.r;
      pixels[pos + 1] = fillRgb.g;
      pixels[pos + 2] = fillRgb.b;
      pixels[pos + 3] = 200; // Semi-transparent

      stack.push([x + 1, y], [x - 1, y], [x, y + 1], [x, y - 1]);
    }

    ctx.putImageData(imageData, 0, 0);

    // Convert to fabric image and add as overlay
    FabricImage.fromURL(offscreenCanvasRef.current.toDataURL()).then((img) => {
      img.set({
        left: 0,
        top: 0,
        selectable: false,
        evented: false,
      });
      fabricCanvas.add(img);
      fabricCanvas.renderAll();
    });
  };

  const hexToRgb = (hex: string) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : null;
  };

  const checkIfCorrect = (x: number, y: number): { isCorrect: boolean; regionIndex: number } => {
    for (let i = 0; i < currentRegions.length; i++) {
      const region = currentRegions[i];
      if (
        x >= region.x &&
        x <= region.x + region.width &&
        y >= region.y &&
        y <= region.y + region.height
      ) {
        return { isCorrect: true, regionIndex: i };
      }
    }
    return { isCorrect: false, regionIndex: -1 };
  };

  useEffect(() => {
    if (!fabricCanvas) return;

    const handleMouseDown = (e: any) => {
      const pointer = fabricCanvas.getScenePoint(e.e);
      
      // Admin mode: Define regions
      if (adminMode) {
        setIsDefiningRegion(true);
        setRegionStart(pointer);
        return;
      }

      // Normal mode: Fill colors
      const { isCorrect, regionIndex } = checkIfCorrect(pointer.x, pointer.y);
      
      let fillColor = activeColor;
      let feedbackMessage = "";
      
      if (currentRegions.length === 0) {
        toast.error("No correct regions defined! Enable admin mode to set them.");
        return;
      }
      
      if (isCorrect && !coloredRegions.has(regionIndex)) {
        fillColor = "#22c55e";
        setCorrectCount(prev => prev + 1);
        setColoredRegions(prev => new Set(prev).add(regionIndex));
        feedbackMessage = "✓ Correct! That has letter " + currentWorksheet.letter;
        toast.success(feedbackMessage);
      } else if (isCorrect && coloredRegions.has(regionIndex)) {
        fillColor = "#22c55e";
        feedbackMessage = "Already colored!";
        toast.info(feedbackMessage);
      } else {
        fillColor = "#ef4444";
        setIncorrectCount(prev => prev + 1);
        feedbackMessage = "✗ Wrong! That doesn't have letter " + currentWorksheet.letter;
        toast.error(feedbackMessage);
      }
      
      floodFill(pointer.x, pointer.y, fillColor);

      if (coloredRegions.size + 1 === currentWorksheet.correctRegions.length && isCorrect && !coloredRegions.has(regionIndex)) {
        setTimeout(() => {
          toast.success("🎉 Excellent! You found all the correct " + currentWorksheet.theme + "s!");
        }, 500);
      }
    };

    const handleMouseMove = (e: any) => {
      if (!adminMode || !isDefiningRegion || !regionStart) return;

      const pointer = fabricCanvas.getScenePoint(e.e);
      
      // Remove previous preview rectangle
      const previews = fabricCanvas.getObjects().filter((obj: any) => obj.name === 'region-preview');
      previews.forEach(obj => fabricCanvas.remove(obj));

      // Draw preview rectangle
      const rect = new Rect({
        left: Math.min(regionStart.x, pointer.x),
        top: Math.min(regionStart.y, pointer.y),
        width: Math.abs(pointer.x - regionStart.x),
        height: Math.abs(pointer.y - regionStart.y),
        fill: 'transparent',
        stroke: '#3b82f6',
        strokeWidth: 2,
        selectable: false,
        evented: false,
        name: 'region-preview',
      });
      fabricCanvas.add(rect);
      fabricCanvas.renderAll();
    };

    const handleMouseUp = (e: any) => {
      if (!adminMode || !isDefiningRegion || !regionStart) return;

      const pointer = fabricCanvas.getScenePoint(e.e);
      
      // Remove preview
      const previews = fabricCanvas.getObjects().filter((obj: any) => obj.name === 'region-preview');
      previews.forEach(obj => fabricCanvas.remove(obj));

      // Add new region
      const newRegion = {
        x: Math.round(Math.min(regionStart.x, pointer.x)),
        y: Math.round(Math.min(regionStart.y, pointer.y)),
        width: Math.round(Math.abs(pointer.x - regionStart.x)),
        height: Math.round(Math.abs(pointer.y - regionStart.y)),
      };

      if (newRegion.width > 10 && newRegion.height > 10) {
        setCurrentRegions(prev => [...prev, newRegion]);
        
        // Draw the region
        const rect = new Rect({
          ...newRegion,
          fill: 'rgba(59, 130, 246, 0.2)',
          stroke: '#3b82f6',
          strokeWidth: 2,
          selectable: false,
          evented: false,
          name: `region-${currentRegions.length}`,
        });
        fabricCanvas.add(rect);
        fabricCanvas.renderAll();
        toast.success(`Region ${currentRegions.length + 1} added!`);
      }

      setIsDefiningRegion(false);
      setRegionStart(null);
    };

    fabricCanvas.on("mouse:down", handleMouseDown);
    fabricCanvas.on("mouse:move", handleMouseMove);
    fabricCanvas.on("mouse:up", handleMouseUp);

    return () => {
      fabricCanvas.off("mouse:down", handleMouseDown);
      fabricCanvas.off("mouse:move", handleMouseMove);
      fabricCanvas.off("mouse:up", handleMouseUp);
    };
  }, [fabricCanvas, activeColor, coloredRegions, correctCount, adminMode, isDefiningRegion, regionStart, currentRegions]);

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setCorrectCount(0);
      setIncorrectCount(0);
      setColoredRegions(new Set());
    }
  };

  const handleNext = () => {
    if (currentIndex < alphabetWorksheets.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setCorrectCount(0);
      setIncorrectCount(0);
      setColoredRegions(new Set());
    }
  };

  const handleClear = () => {
    if (!fabricCanvas) return;
    loadWorksheet();
    setCorrectCount(0);
    setIncorrectCount(0);
    setColoredRegions(new Set());
    setShowCorrectRegions(false);
    toast.success("Cleared all colors!");
  };

  const toggleCorrectRegions = () => {
    if (!fabricCanvas) return;
    
    if (!showCorrectRegions) {
      currentRegions.forEach((region, index) => {
        const rect = new Rect({
          left: region.x,
          top: region.y,
          width: region.width,
          height: region.height,
          fill: 'transparent',
          stroke: '#22c55e',
          strokeWidth: 3,
          strokeDashArray: [5, 5],
          selectable: false,
          evented: false,
          name: `hint-${index}`,
        });
        fabricCanvas.add(rect);
      });
      fabricCanvas.renderAll();
      toast.info("Showing correct regions!");
    } else {
      const hints = fabricCanvas.getObjects().filter((obj: any) => obj.name?.startsWith('hint-'));
      hints.forEach((obj) => fabricCanvas.remove(obj));
      fabricCanvas.renderAll();
      toast.info("Hiding correct regions!");
    }
    
    setShowCorrectRegions(!showCorrectRegions);
  };

  const saveRegionsToJson = () => {
    const updatedData = { ...answersData };
    updatedData[currentWorksheet.letter as keyof typeof answersData].correctRegions = currentRegions;
    
    const jsonString = JSON.stringify(updatedData, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'alphabet-recognition-answers.json';
    link.click();
    URL.revokeObjectURL(url);
    
    toast.success(`Saved ${currentRegions.length} regions for letter ${currentWorksheet.letter}!`);
  };

  const clearCurrentRegions = () => {
    setCurrentRegions([]);
    if (fabricCanvas) {
      const regionObjs = fabricCanvas.getObjects().filter((obj: any) => 
        obj.name?.startsWith('region-') || obj.name?.startsWith('hint-')
      );
      regionObjs.forEach(obj => fabricCanvas.remove(obj));
      fabricCanvas.renderAll();
    }
    toast.info("Cleared all regions!");
  };

  const toggleAdminMode = () => {
    setAdminMode(!adminMode);
    if (!adminMode) {
      toast.info("🔧 Admin mode enabled! Click and drag to define correct regions.");
    } else {
      toast.info("Admin mode disabled.");
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
    link.download = `alphabet-recognition-${currentWorksheet.letter}.png`;
    link.href = dataURL;
    link.click();
    toast.success("Downloaded worksheet!");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 via-background to-secondary/10 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            🎨 Alphabet Recognition
          </h1>
          <p className="text-xl text-muted-foreground">
            Click to color all the {currentWorksheet.theme}s with letter {currentWorksheet.letter}!
          </p>
        </div>

        <div className="bg-card rounded-2xl shadow-2xl p-6 mb-6">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
            <div className="flex items-center gap-4">
              <h2 className="text-2xl font-bold text-foreground">
                Letter {currentWorksheet.letter} - {currentWorksheet.theme}
              </h2>
              <span className="text-muted-foreground">
                ({currentIndex + 1} / {alphabetWorksheets.length})
              </span>
              {adminMode && (
                <span className="text-xs bg-blue-500 text-white px-2 py-1 rounded">
                  ADMIN MODE
                </span>
              )}
            </div>

            <div className="flex gap-2">
              <Button
                onClick={toggleAdminMode}
                variant={adminMode ? "default" : "outline"}
                size="sm"
              >
                <Settings className="w-4 h-4" />
              </Button>
              <Button
                onClick={handlePrevious}
                disabled={currentIndex === 0}
                variant="outline"
                size="sm"
              >
                <ChevronLeft className="w-4 h-4" />
                Previous
              </Button>
              <Button
                onClick={handleNext}
                disabled={currentIndex === alphabetWorksheets.length - 1}
                variant="outline"
                size="sm"
              >
                Next
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {!adminMode && (
            <div className="space-y-4 mb-6">
              <div className="bg-secondary/50 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold text-foreground">Progress</h3>
                  <span className="text-sm text-muted-foreground">
                    {coloredRegions.size} / {currentRegions.length} correct items found
                  </span>
                </div>
                <Progress 
                  value={currentRegions.length > 0 ? (coloredRegions.size / currentRegions.length) * 100 : 0} 
                  className="h-3"
                />
                <div className="flex gap-4 mt-3 text-sm">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <span className="text-foreground">Correct: <strong>{correctCount}</strong></span>
                  </div>
                  <div className="flex items-center gap-2">
                    <XCircle className="w-4 h-4 text-red-600" />
                    <span className="text-foreground">Incorrect: <strong>{incorrectCount}</strong></span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {adminMode && (
            <div className="space-y-4 mb-6">
              <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 border-2 border-blue-500">
                <h3 className="font-semibold text-foreground mb-2">Admin Mode Instructions</h3>
                <p className="text-sm text-muted-foreground mb-2">
                  Click and drag to define rectangular regions for correct answers.
                </p>
                <p className="text-sm text-foreground font-medium">
                  Regions defined: <strong>{currentRegions.length}</strong>
                </p>
              </div>
            </div>
          )}

          <div className="flex flex-col items-center gap-4">
            <div className="border-4 border-primary/20 rounded-xl overflow-hidden shadow-xl">
              <canvas ref={canvasRef} />
            </div>

            <div className="flex flex-wrap gap-2">
              {!adminMode ? (
                <>
                  <Button onClick={handleClear} variant="outline" size="sm">
                    <Eraser className="w-4 h-4 mr-2" />
                    Clear
                  </Button>
                  <Button onClick={toggleCorrectRegions} variant="outline" size="sm" disabled={currentRegions.length === 0}>
                    {showCorrectRegions ? (
                      <><EyeOff className="w-4 h-4 mr-2" />Hide Hints</>
                    ) : (
                      <><Eye className="w-4 h-4 mr-2" />Show Hints</>
                    )}
                  </Button>
                  <Button onClick={handleDownload} variant="default" size="sm">
                    <Download className="w-4 h-4 mr-2" />
                    Download
                  </Button>
                </>
              ) : (
                <>
                  <Button onClick={clearCurrentRegions} variant="outline" size="sm">
                    <Trash2 className="w-4 h-4 mr-2" />
                    Clear Regions
                  </Button>
                  <Button onClick={saveRegionsToJson} variant="default" size="sm" disabled={currentRegions.length === 0}>
                    <Save className="w-4 h-4 mr-2" />
                    Save JSON
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AlphabetRecognition;
