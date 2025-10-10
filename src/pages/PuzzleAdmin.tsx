import { useState, useEffect, useRef } from "react";
import { Canvas as FabricCanvas, Rect } from "fabric";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Upload, Save, Trash2 } from "lucide-react";

interface AnswerZone {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  correctAnswer: string;
  orderIndex: number;
  rect?: Rect;
}

export default function PuzzleAdmin() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const [fabricCanvas, setFabricCanvas] = useState<FabricCanvas | null>(null);
  const [puzzleImage, setPuzzleImage] = useState<string>("");
  const [puzzleTitle, setPuzzleTitle] = useState("");
  const [puzzleDescription, setPuzzleDescription] = useState("");
  const [answerZones, setAnswerZones] = useState<AnswerZone[]>([]);
  const [selectedZone, setSelectedZone] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (!canvasRef.current || fabricCanvas) return;

    const canvas = new FabricCanvas(canvasRef.current, {
      width: 800,
      height: 600,
      backgroundColor: "#f0f0f0",
    });

    setFabricCanvas(canvas);

    return () => {
      canvas.dispose();
    };
  }, []);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !fabricCanvas) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      const img = new Image();
      img.onload = async () => {
        fabricCanvas.clear();
        fabricCanvas.setDimensions({ width: img.width, height: img.height });
        
        const { FabricImage } = await import("fabric");
        const fabricImg = await FabricImage.fromURL(event.target?.result as string);
        fabricCanvas.backgroundImage = fabricImg;
        fabricCanvas.renderAll();
        
        setPuzzleImage(event.target?.result as string);
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  const addAnswerBox = () => {
    if (!fabricCanvas) return;

    const rect = new Rect({
      left: 100,
      top: 100,
      fill: "rgba(255, 0, 0, 0.3)",
      stroke: "red",
      strokeWidth: 2,
      width: 150,
      height: 40,
    });

    const zoneId = `zone-${Date.now()}`;
    const newZone: AnswerZone = {
      id: zoneId,
      x: rect.left!,
      y: rect.top!,
      width: rect.width!,
      height: rect.height!,
      correctAnswer: "",
      orderIndex: answerZones.length,
      rect,
    };

    rect.on("modified", () => {
      setAnswerZones((zones) =>
        zones.map((z) =>
          z.id === zoneId
            ? {
                ...z,
                x: rect.left!,
                y: rect.top!,
                width: rect.width! * (rect.scaleX || 1),
                height: rect.height! * (rect.scaleY || 1),
              }
            : z
        )
      );
    });

    rect.on("selected", () => {
      setSelectedZone(zoneId);
    });

    fabricCanvas.add(rect);
    setAnswerZones([...answerZones, newZone]);
    setSelectedZone(zoneId);
  };

  const updateZoneAnswer = (zoneId: string, answer: string) => {
    setAnswerZones((zones) =>
      zones.map((z) => (z.id === zoneId ? { ...z, correctAnswer: answer } : z))
    );
  };

  const deleteZone = (zoneId: string) => {
    const zone = answerZones.find((z) => z.id === zoneId);
    if (zone?.rect && fabricCanvas) {
      fabricCanvas.remove(zone.rect);
    }
    setAnswerZones((zones) => zones.filter((z) => z.id !== zoneId));
    setSelectedZone(null);
  };

  const savePuzzle = async () => {
    if (!puzzleImage || !puzzleTitle || answerZones.length === 0) {
      toast({
        title: "Missing information",
        description: "Please add title, image, and at least one answer box",
        variant: "destructive",
      });
      return;
    }

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to create puzzles",
        variant: "destructive",
      });
      return;
    }

    try {
      // Upload image to storage
      const file = imageInputRef.current?.files?.[0];
      if (!file) return;

      const fileExt = file.name.split(".").pop();
      const fileName = `${Date.now()}.${fileExt}`;
      const { error: uploadError } = await supabase.storage
        .from("puzzle-images")
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from("puzzle-images")
        .getPublicUrl(fileName);

      // Create puzzle
      const { data: puzzle, error: puzzleError } = await supabase
        .from("puzzles")
        .insert({
          title: puzzleTitle,
          description: puzzleDescription,
          image_url: publicUrl,
          created_by: user.id,
        })
        .select()
        .single();

      if (puzzleError) throw puzzleError;

      // Create answer zones
      const zones = answerZones.map((zone) => ({
        puzzle_id: puzzle.id,
        x_position: zone.x,
        y_position: zone.y,
        width: zone.width,
        height: zone.height,
        correct_answer: zone.correctAnswer,
        order_index: zone.orderIndex,
      }));

      const { error: zonesError } = await supabase
        .from("puzzle_answer_zones")
        .insert(zones);

      if (zonesError) throw zonesError;

      toast({
        title: "Success!",
        description: "Puzzle created successfully",
      });

      // Reset form
      setPuzzleTitle("");
      setPuzzleDescription("");
      setPuzzleImage("");
      setAnswerZones([]);
      fabricCanvas?.clear();
    } catch (error) {
      console.error("Error saving puzzle:", error);
      toast({
        title: "Error",
        description: "Failed to save puzzle",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Puzzle Admin</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card className="p-4">
            <div className="mb-4">
              <input
                ref={imageInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
              <Button onClick={() => imageInputRef.current?.click()}>
                <Upload className="mr-2 h-4 w-4" />
                Upload Puzzle Image
              </Button>
            </div>

            <div className="border rounded-lg overflow-auto">
              <canvas ref={canvasRef} />
            </div>

            <div className="mt-4 flex gap-2">
              <Button onClick={addAnswerBox}>Add Answer Box</Button>
              <Button onClick={savePuzzle} variant="default">
                <Save className="mr-2 h-4 w-4" />
                Save Puzzle
              </Button>
            </div>
          </Card>
        </div>

        <div>
          <Card className="p-4">
            <h2 className="text-xl font-semibold mb-4">Puzzle Details</h2>

            <div className="space-y-4">
              <div>
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={puzzleTitle}
                  onChange={(e) => setPuzzleTitle(e.target.value)}
                  placeholder="Puzzle title"
                />
              </div>

              <div>
                <Label htmlFor="description">Description</Label>
                <Input
                  id="description"
                  value={puzzleDescription}
                  onChange={(e) => setPuzzleDescription(e.target.value)}
                  placeholder="Optional description"
                />
              </div>
            </div>

            <h3 className="text-lg font-semibold mt-6 mb-3">Answer Boxes</h3>
            <div className="space-y-3">
              {answerZones.map((zone) => (
                <Card
                  key={zone.id}
                  className={`p-3 ${
                    selectedZone === zone.id ? "ring-2 ring-primary" : ""
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">
                      Box {zone.orderIndex + 1}
                    </span>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => deleteZone(zone.id)}
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                  <Input
                    placeholder="Correct answer"
                    value={zone.correctAnswer}
                    onChange={(e) => updateZoneAnswer(zone.id, e.target.value)}
                  />
                </Card>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
