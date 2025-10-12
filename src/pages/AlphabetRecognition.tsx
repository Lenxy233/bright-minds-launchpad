import { useEffect, useRef, useState } from "react";
import { Canvas as FabricCanvas, Rect, FabricImage } from "fabric";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Eraser, Download, CheckCircle, XCircle, Eye, EyeOff, MousePointer2, Hand } from "lucide-react";
import { toast } from "sonner";
import { Progress } from "@/components/ui/progress";

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

// Define correct regions for each worksheet (approximate coordinates)
// Each region represents an item with the correct letter
const alphabetWorksheets = [
  { 
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
  },
  { 
    letter: "B", 
    image: letterB, 
    theme: "Bee",
    correctRegions: [
      { x: 100, y: 200, width: 150, height: 150 },
      { x: 350, y: 200, width: 150, height: 150 },
      { x: 600, y: 200, width: 150, height: 150 },
      { x: 100, y: 450, width: 150, height: 150 },
      { x: 350, y: 450, width: 150, height: 150 },
    ],
    totalItems: 8
  },
  { 
    letter: "C", 
    image: letterC, 
    theme: "Car",
    correctRegions: [
      { x: 100, y: 200, width: 150, height: 150 },
      { x: 350, y: 200, width: 150, height: 150 },
      { x: 600, y: 200, width: 150, height: 150 },
      { x: 100, y: 450, width: 150, height: 150 },
      { x: 350, y: 450, width: 150, height: 150 },
    ],
    totalItems: 8
  },
  { 
    letter: "D", 
    image: letterD, 
    theme: "Dinosaur",
    correctRegions: [
      { x: 100, y: 200, width: 150, height: 150 },
      { x: 350, y: 200, width: 150, height: 150 },
      { x: 600, y: 200, width: 150, height: 150 },
      { x: 100, y: 450, width: 150, height: 150 },
      { x: 350, y: 450, width: 150, height: 150 },
    ],
    totalItems: 8
  },
  { 
    letter: "E", 
    image: letterE, 
    theme: "Elephant",
    correctRegions: [
      { x: 100, y: 200, width: 150, height: 150 },
      { x: 350, y: 200, width: 150, height: 150 },
      { x: 600, y: 200, width: 150, height: 150 },
      { x: 100, y: 450, width: 150, height: 150 },
      { x: 350, y: 450, width: 150, height: 150 },
    ],
    totalItems: 8
  },
  { 
    letter: "F", 
    image: letterF, 
    theme: "Fish",
    correctRegions: [
      { x: 100, y: 200, width: 150, height: 150 },
      { x: 350, y: 200, width: 150, height: 150 },
      { x: 600, y: 200, width: 150, height: 150 },
      { x: 100, y: 450, width: 150, height: 150 },
      { x: 350, y: 450, width: 150, height: 150 },
    ],
    totalItems: 8
  },
  { 
    letter: "G", 
    image: letterG, 
    theme: "Girl",
    correctRegions: [
      { x: 100, y: 200, width: 150, height: 150 },
      { x: 350, y: 200, width: 150, height: 150 },
      { x: 600, y: 200, width: 150, height: 150 },
      { x: 100, y: 450, width: 150, height: 150 },
      { x: 350, y: 450, width: 150, height: 150 },
    ],
    totalItems: 8
  },
  { 
    letter: "H", 
    image: letterH, 
    theme: "Hat",
    correctRegions: [
      { x: 100, y: 200, width: 150, height: 150 },
      { x: 350, y: 200, width: 150, height: 150 },
      { x: 600, y: 200, width: 150, height: 150 },
      { x: 100, y: 450, width: 150, height: 150 },
      { x: 350, y: 450, width: 150, height: 150 },
    ],
    totalItems: 8
  },
  { 
    letter: "I", 
    image: letterI, 
    theme: "Ice cream",
    correctRegions: [
      { x: 100, y: 200, width: 150, height: 150 },
      { x: 350, y: 200, width: 150, height: 150 },
      { x: 600, y: 200, width: 150, height: 150 },
      { x: 100, y: 450, width: 150, height: 150 },
      { x: 350, y: 450, width: 150, height: 150 },
    ],
    totalItems: 8
  },
  { 
    letter: "J", 
    image: letterJ, 
    theme: "Jet",
    correctRegions: [
      { x: 100, y: 200, width: 150, height: 150 },
      { x: 350, y: 200, width: 150, height: 150 },
      { x: 600, y: 200, width: 150, height: 150 },
      { x: 100, y: 450, width: 150, height: 150 },
      { x: 350, y: 450, width: 150, height: 150 },
    ],
    totalItems: 8
  },
  { 
    letter: "K", 
    image: letterK, 
    theme: "Kitten",
    correctRegions: [
      { x: 100, y: 200, width: 150, height: 150 },
      { x: 350, y: 200, width: 150, height: 150 },
      { x: 600, y: 200, width: 150, height: 150 },
      { x: 100, y: 450, width: 150, height: 150 },
      { x: 350, y: 450, width: 150, height: 150 },
    ],
    totalItems: 8
  },
  { 
    letter: "L", 
    image: letterL, 
    theme: "Lemon",
    correctRegions: [
      { x: 100, y: 200, width: 150, height: 150 },
      { x: 350, y: 200, width: 150, height: 150 },
      { x: 600, y: 200, width: 150, height: 150 },
      { x: 100, y: 450, width: 150, height: 150 },
      { x: 350, y: 450, width: 150, height: 150 },
    ],
    totalItems: 8
  },
  { 
    letter: "M", 
    image: letterM, 
    theme: "Moon",
    correctRegions: [
      { x: 100, y: 200, width: 150, height: 150 },
      { x: 350, y: 200, width: 150, height: 150 },
      { x: 600, y: 200, width: 150, height: 150 },
      { x: 100, y: 450, width: 150, height: 150 },
      { x: 350, y: 450, width: 150, height: 150 },
    ],
    totalItems: 8
  },
  { 
    letter: "N", 
    image: letterN, 
    theme: "Nest",
    correctRegions: [
      { x: 100, y: 200, width: 150, height: 150 },
      { x: 350, y: 200, width: 150, height: 150 },
      { x: 600, y: 200, width: 150, height: 150 },
      { x: 100, y: 450, width: 150, height: 150 },
      { x: 350, y: 450, width: 150, height: 150 },
    ],
    totalItems: 8
  },
  { 
    letter: "O", 
    image: letterO, 
    theme: "Octopus",
    correctRegions: [
      { x: 100, y: 200, width: 150, height: 150 },
      { x: 350, y: 200, width: 150, height: 150 },
      { x: 600, y: 200, width: 150, height: 150 },
      { x: 100, y: 450, width: 150, height: 150 },
      { x: 350, y: 450, width: 150, height: 150 },
    ],
    totalItems: 8
  },
  { 
    letter: "P", 
    image: letterP, 
    theme: "Pig",
    correctRegions: [
      { x: 100, y: 200, width: 150, height: 150 },
      { x: 350, y: 200, width: 150, height: 150 },
      { x: 600, y: 200, width: 150, height: 150 },
      { x: 100, y: 450, width: 150, height: 150 },
      { x: 350, y: 450, width: 150, height: 150 },
    ],
    totalItems: 8
  },
  { 
    letter: "Q", 
    image: letterQ, 
    theme: "Queen",
    correctRegions: [
      { x: 100, y: 200, width: 150, height: 150 },
      { x: 350, y: 200, width: 150, height: 150 },
      { x: 600, y: 200, width: 150, height: 150 },
      { x: 100, y: 450, width: 150, height: 150 },
      { x: 350, y: 450, width: 150, height: 150 },
    ],
    totalItems: 8
  },
  { 
    letter: "R", 
    image: letterR, 
    theme: "Rainbow",
    correctRegions: [
      { x: 100, y: 200, width: 150, height: 150 },
      { x: 350, y: 200, width: 150, height: 150 },
      { x: 600, y: 200, width: 150, height: 150 },
      { x: 100, y: 450, width: 150, height: 150 },
      { x: 350, y: 450, width: 150, height: 150 },
    ],
    totalItems: 8
  },
  { 
    letter: "S", 
    image: letterS, 
    theme: "Sun",
    correctRegions: [
      { x: 100, y: 200, width: 150, height: 150 },
      { x: 350, y: 200, width: 150, height: 150 },
      { x: 600, y: 200, width: 150, height: 150 },
      { x: 100, y: 450, width: 150, height: 150 },
      { x: 350, y: 450, width: 150, height: 150 },
    ],
    totalItems: 8
  },
  { 
    letter: "T", 
    image: letterT, 
    theme: "Turtle",
    correctRegions: [
      { x: 100, y: 200, width: 150, height: 150 },
      { x: 350, y: 200, width: 150, height: 150 },
      { x: 600, y: 200, width: 150, height: 150 },
      { x: 100, y: 450, width: 150, height: 150 },
      { x: 350, y: 450, width: 150, height: 150 },
    ],
    totalItems: 8
  },
  { 
    letter: "U", 
    image: letterU, 
    theme: "Umbrella",
    correctRegions: [
      { x: 100, y: 200, width: 150, height: 150 },
      { x: 350, y: 200, width: 150, height: 150 },
      { x: 600, y: 200, width: 150, height: 150 },
      { x: 100, y: 450, width: 150, height: 150 },
      { x: 350, y: 450, width: 150, height: 150 },
    ],
    totalItems: 8
  },
  { 
    letter: "V", 
    image: letterV, 
    theme: "Violin",
    correctRegions: [
      { x: 100, y: 200, width: 150, height: 150 },
      { x: 350, y: 200, width: 150, height: 150 },
      { x: 600, y: 200, width: 150, height: 150 },
      { x: 100, y: 450, width: 150, height: 150 },
      { x: 350, y: 450, width: 150, height: 150 },
    ],
    totalItems: 8
  },
  { 
    letter: "W", 
    image: letterW, 
    theme: "Watermelon",
    correctRegions: [
      { x: 100, y: 200, width: 150, height: 150 },
      { x: 350, y: 200, width: 150, height: 150 },
      { x: 600, y: 200, width: 150, height: 150 },
      { x: 100, y: 450, width: 150, height: 150 },
      { x: 350, y: 450, width: 150, height: 150 },
    ],
    totalItems: 8
  },
  { 
    letter: "X", 
    image: letterX, 
    theme: "Xylophone",
    correctRegions: [
      { x: 100, y: 200, width: 150, height: 150 },
      { x: 350, y: 200, width: 150, height: 150 },
      { x: 600, y: 200, width: 150, height: 150 },
      { x: 100, y: 450, width: 150, height: 150 },
      { x: 350, y: 450, width: 150, height: 150 },
    ],
    totalItems: 8
  },
  { 
    letter: "Y", 
    image: letterY, 
    theme: "Yarn",
    correctRegions: [
      { x: 100, y: 200, width: 150, height: 150 },
      { x: 350, y: 200, width: 150, height: 150 },
      { x: 600, y: 200, width: 150, height: 150 },
      { x: 100, y: 450, width: 150, height: 150 },
      { x: 350, y: 450, width: 150, height: 150 },
    ],
    totalItems: 8
  },
  { 
    letter: "Z", 
    image: letterZ, 
    theme: "Zebra",
    correctRegions: [
      { x: 100, y: 200, width: 150, height: 150 },
      { x: 350, y: 200, width: 150, height: 150 },
      { x: 600, y: 200, width: 150, height: 150 },
      { x: 100, y: 450, width: 150, height: 150 },
      { x: 350, y: 450, width: 150, height: 150 },
    ],
    totalItems: 8
  },
];

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

  // Manual selection mode state
  const [manualMode, setManualMode] = useState(false);
  const [manualRegions, setManualRegions] = useState<{ x: number; y: number; width: number; height: number; }[]>([]);
  const drawStartRef = useRef<{ x: number; y: number } | null>(null);
  const tempRectRef = useRef<Rect | null>(null);

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

      // Load saved manual regions for this worksheet (by letter)
      try {
        const storageKey = `alphabet-recognition-regions-${currentWorksheet.letter}`;
        const saved = localStorage.getItem(storageKey);
        setManualRegions(saved ? JSON.parse(saved) : []);
      } catch (err) {
        console.error('Failed to load manual regions', err);
        setManualRegions([]);
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
    // Use manual regions if available, otherwise fallback to predefined regions
    const regionsToCheck = manualRegions.length > 0 ? manualRegions : currentWorksheet.correctRegions;
    
    for (let i = 0; i < regionsToCheck.length; i++) {
      const region = regionsToCheck[i];
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

  const saveManualRegions = () => {
    try {
      const storageKey = `alphabet-recognition-regions-${currentWorksheet.letter}`;
      localStorage.setItem(storageKey, JSON.stringify(manualRegions));
      toast.success(`Saved ${manualRegions.length} answer regions for letter ${currentWorksheet.letter}!`);
    } catch (err) {
      console.error('Failed to save manual regions', err);
      toast.error('Failed to save regions');
    }
  };

  const clearManualRegions = () => {
    setManualRegions([]);
    try {
      const storageKey = `alphabet-recognition-regions-${currentWorksheet.letter}`;
      localStorage.removeItem(storageKey);
      toast.success('Cleared all manual regions!');
    } catch (err) {
      console.error('Failed to clear manual regions', err);
    }
  };

  useEffect(() => {
    if (!fabricCanvas) return;

    const handleMouseDown = (e: any) => {
      const pointer = fabricCanvas.getPointer(e.e);

      if (manualMode) {
        // Manual mode: start drawing a rectangle
        drawStartRef.current = { x: pointer.x, y: pointer.y };
        const rect = new Rect({
          left: pointer.x,
          top: pointer.y,
          width: 0,
          height: 0,
          fill: 'rgba(34, 197, 94, 0.3)',
          stroke: '#22c55e',
          strokeWidth: 2,
          selectable: false,
          evented: false,
        });
        tempRectRef.current = rect;
        fabricCanvas.add(rect);
        fabricCanvas.renderAll();
      } else {
        // Play mode: check answer
        const { isCorrect, regionIndex } = checkIfCorrect(pointer.x, pointer.y);
        
        let fillColor = activeColor;
        let feedbackMessage = "";
        
        const regionsToCheck = manualRegions.length > 0 ? manualRegions : currentWorksheet.correctRegions;
        
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

        if (coloredRegions.size + 1 === regionsToCheck.length && isCorrect && !coloredRegions.has(regionIndex)) {
          setTimeout(() => {
            toast.success("🎉 Excellent! You found all the correct " + currentWorksheet.theme + "s!");
          }, 500);
        }
      }
    };

    const handleMouseMove = (e: any) => {
      if (!manualMode || !drawStartRef.current || !tempRectRef.current) return;
      
      const pointer = fabricCanvas.getPointer(e.e);
      const startX = drawStartRef.current.x;
      const startY = drawStartRef.current.y;
      
      const width = pointer.x - startX;
      const height = pointer.y - startY;
      
      tempRectRef.current.set({
        left: width > 0 ? startX : pointer.x,
        top: height > 0 ? startY : pointer.y,
        width: Math.abs(width),
        height: Math.abs(height),
      });
      fabricCanvas.renderAll();
    };

    const handleMouseUp = (e: any) => {
      if (!manualMode || !drawStartRef.current || !tempRectRef.current) return;
      
      const pointer = fabricCanvas.getPointer(e.e);
      const startX = drawStartRef.current.x;
      const startY = drawStartRef.current.y;
      
      const width = Math.abs(pointer.x - startX);
      const height = Math.abs(pointer.y - startY);
      
      if (width > 10 && height > 10) {
        const newRegion = {
          x: Math.min(startX, pointer.x),
          y: Math.min(startY, pointer.y),
          width,
          height,
        };
        setManualRegions(prev => [...prev, newRegion]);
        toast.success('Answer region added!');
      } else {
        fabricCanvas.remove(tempRectRef.current);
      }
      
      drawStartRef.current = null;
      tempRectRef.current = null;
      fabricCanvas.renderAll();
    };

    fabricCanvas.on("mouse:down", handleMouseDown);
    fabricCanvas.on("mouse:move", handleMouseMove);
    fabricCanvas.on("mouse:up", handleMouseUp);

    return () => {
      fabricCanvas.off("mouse:down", handleMouseDown);
      fabricCanvas.off("mouse:move", handleMouseMove);
      fabricCanvas.off("mouse:up", handleMouseUp);
    };
  }, [fabricCanvas, activeColor, coloredRegions, correctCount, manualMode, manualRegions]);

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
      // Show correct regions
      currentWorksheet.correctRegions.forEach((region, index) => {
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
      // Hide correct regions
      const hints = fabricCanvas.getObjects().filter((obj: any) => obj.name?.startsWith('hint-'));
      hints.forEach((obj) => fabricCanvas.remove(obj));
      fabricCanvas.renderAll();
      toast.info("Hiding correct regions!");
    }
    
    setShowCorrectRegions(!showCorrectRegions);
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
            </div>

            <div className="flex gap-2">
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

          <div className="space-y-4 mb-6">
            <div className="bg-secondary/50 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold text-foreground">Progress</h3>
                <span className="text-sm text-muted-foreground">
                  {coloredRegions.size} / {currentWorksheet.correctRegions.length} correct items found
                </span>
              </div>
              <Progress 
                value={(coloredRegions.size / currentWorksheet.correctRegions.length) * 100} 
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

          <div className="flex flex-col items-center gap-4">
            <div className="border-4 border-primary/20 rounded-xl overflow-hidden shadow-xl">
              <canvas ref={canvasRef} />
            </div>

            <div className="flex flex-wrap gap-2">
              <Button 
                onClick={() => setManualMode(!manualMode)} 
                variant={manualMode ? "default" : "outline"} 
                size="sm"
              >
                {manualMode ? (
                  <><MousePointer2 className="w-4 h-4 mr-2" />Manual Mode (Click & Drag)</>
                ) : (
                  <><Hand className="w-4 h-4 mr-2" />Play Mode</>
                )}
              </Button>
              {manualMode && (
                <>
                  <Button onClick={saveManualRegions} variant="default" size="sm">
                    Save Regions ({manualRegions.length})
                  </Button>
                  <Button onClick={clearManualRegions} variant="destructive" size="sm">
                    Clear Regions
                  </Button>
                </>
              )}
              {!manualMode && (
                <>
                  <Button onClick={handleClear} variant="outline" size="sm">
                    <Eraser className="w-4 h-4 mr-2" />
                    Clear
                  </Button>
                  <Button onClick={toggleCorrectRegions} variant="outline" size="sm">
                    {showCorrectRegions ? (
                      <><EyeOff className="w-4 h-4 mr-2" />Hide Hints</>
                    ) : (
                      <><Eye className="w-4 h-4 mr-2" />Show Hints</>
                    )}
                  </Button>
                </>
              )}
              <Button onClick={handleDownload} variant="default" size="sm">
                <Download className="w-4 h-4 mr-2" />
                Download
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AlphabetRecognition;
