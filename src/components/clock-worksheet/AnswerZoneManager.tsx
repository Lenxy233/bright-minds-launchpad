import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Trash2, Plus } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

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

interface AnswerZoneManagerProps {
  pageNumber: number;
  answerZones: AnswerZone[];
  onZonesUpdate: () => void;
  imageWidth: number;
  imageHeight: number;
}

export const AnswerZoneManager = ({
  pageNumber,
  answerZones,
  onZonesUpdate,
  imageWidth,
  imageHeight,
}: AnswerZoneManagerProps) => {
  const [isPlacingZone, setIsPlacingZone] = useState(false);
  const [editingZone, setEditingZone] = useState<string | null>(null);
  const [editAnswer, setEditAnswer] = useState("");

  const handleImageClick = async (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isPlacingZone) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;

    const { error } = await supabase.from("clock_worksheet_answer_zones").insert({
      page_number: pageNumber,
      x_position: x,
      y_position: y,
      width: 15,
      height: 8,
      order_index: answerZones.length,
      correct_answer: "",
    });

    if (error) {
      toast.error("Failed to create answer zone");
      console.error(error);
    } else {
      toast.success("Answer zone created");
      onZonesUpdate();
      setIsPlacingZone(false);
    }
  };

  const handleDeleteZone = async (zoneId: string) => {
    const { error } = await supabase
      .from("clock_worksheet_answer_zones")
      .delete()
      .eq("id", zoneId);

    if (error) {
      toast.error("Failed to delete answer zone");
    } else {
      toast.success("Answer zone deleted");
      onZonesUpdate();
    }
  };

  const handleUpdateAnswer = async (zoneId: string) => {
    const { error } = await supabase
      .from("clock_worksheet_answer_zones")
      .update({ correct_answer: editAnswer })
      .eq("id", zoneId);

    if (error) {
      toast.error("Failed to update answer");
    } else {
      toast.success("Answer updated");
      setEditingZone(null);
      onZonesUpdate();
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <Button
          onClick={() => setIsPlacingZone(!isPlacingZone)}
          variant={isPlacingZone ? "default" : "outline"}
          className="flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          {isPlacingZone ? "Click on image to place" : "Add Answer Zone"}
        </Button>
      </div>

      <div
        className="relative cursor-crosshair"
        onClick={handleImageClick}
        style={{ width: imageWidth, height: imageHeight }}
      >
        {answerZones.map((zone) => (
          <div
            key={zone.id}
            className="absolute border-2 border-dashed border-primary bg-primary/10 rounded flex items-center justify-center group hover:bg-primary/20 transition-colors"
            style={{
              left: `${zone.x_position}%`,
              top: `${zone.y_position}%`,
              width: `${zone.width}%`,
              height: `${zone.height}%`,
            }}
          >
            <span className="text-xs font-bold text-primary">{zone.order_index + 1}</span>
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleDeleteZone(zone.id);
              }}
              className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <Trash2 className="w-3 h-3" />
            </button>
          </div>
        ))}
      </div>

      <div className="space-y-2 max-h-60 overflow-y-auto">
        {answerZones.map((zone) => (
          <div key={zone.id} className="flex items-center gap-2 p-2 bg-muted rounded">
            <span className="text-sm font-semibold min-w-[30px]">#{zone.order_index + 1}</span>
            {editingZone === zone.id ? (
              <>
                <Input
                  value={editAnswer}
                  onChange={(e) => setEditAnswer(e.target.value)}
                  placeholder="Correct answer"
                  className="flex-1"
                />
                <Button size="sm" onClick={() => handleUpdateAnswer(zone.id)}>
                  Save
                </Button>
                <Button size="sm" variant="outline" onClick={() => setEditingZone(null)}>
                  Cancel
                </Button>
              </>
            ) : (
              <>
                <span className="flex-1 text-sm">
                  {zone.correct_answer || <span className="text-muted-foreground">No answer set</span>}
                </span>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    setEditingZone(zone.id);
                    setEditAnswer(zone.correct_answer);
                  }}
                >
                  Edit
                </Button>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
