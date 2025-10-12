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
  isPlacingZone: boolean;
  onPlacingZoneChange: (placing: boolean) => void;
  onImageClick: (e: React.MouseEvent<HTMLDivElement>) => void;
}

export const AnswerZoneManager = ({
  pageNumber,
  answerZones,
  onZonesUpdate,
  imageWidth,
  imageHeight,
  isPlacingZone,
  onPlacingZoneChange,
  onImageClick,
}: AnswerZoneManagerProps) => {
  const [editingZone, setEditingZone] = useState<string | null>(null);
  const [editAnswer, setEditAnswer] = useState("");

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
          onClick={() => onPlacingZoneChange(!isPlacingZone)}
          variant={isPlacingZone ? "default" : "outline"}
          className="flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          {isPlacingZone ? "Click on image to place" : "Add Answer Zone"}
        </Button>
      </div>

      <p className="text-sm text-muted-foreground">
        {isPlacingZone ? "Click anywhere on the worksheet to place an answer box" : `${answerZones.length} answer zones created`}
      </p>

      <div className="space-y-2 max-h-60 overflow-y-auto">
        {answerZones.map((zone) => (
          <div key={zone.id} className="flex items-center gap-2 p-2 bg-muted rounded">
            <span className="text-sm font-semibold min-w-[30px]">#{zone.order_index + 1}</span>
            {editingZone === zone.id ? (
              <>
                <Input
                  value={editAnswer}
                  onChange={(e) => setEditAnswer(e.target.value)}
                  placeholder="e.g., 3:00"
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
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => handleDeleteZone(zone.id)}
                >
                  <Trash2 className="w-3 h-3" />
                </Button>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
