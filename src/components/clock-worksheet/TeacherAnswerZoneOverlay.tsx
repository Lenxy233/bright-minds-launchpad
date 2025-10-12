import { Trash2 } from "lucide-react";

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

interface TeacherAnswerZoneOverlayProps {
  answerZones: AnswerZone[];
  isPlacingZone: boolean;
  onImageClick: (e: React.MouseEvent<HTMLDivElement>) => void;
  onDeleteZone: (zoneId: string) => void;
  imageWidth: number;
  imageHeight: number;
}

export const TeacherAnswerZoneOverlay = ({
  answerZones,
  isPlacingZone,
  onImageClick,
  onDeleteZone,
  imageWidth,
  imageHeight,
}: TeacherAnswerZoneOverlayProps) => {
  return (
    <div
      className={`absolute inset-0 z-20 ${isPlacingZone ? 'cursor-crosshair' : ''}`}
      onClick={onImageClick}
      style={{ width: imageWidth, height: imageHeight }}
    >
      {answerZones.map((zone) => (
        <div
          key={zone.id}
          className="absolute border-2 border-dashed border-amber-500 bg-amber-500/20 rounded flex items-center justify-center group hover:bg-amber-500/30 transition-colors"
          style={{
            left: `${zone.x_position}%`,
            top: `${zone.y_position}%`,
            width: `${zone.width}%`,
            height: `${zone.height}%`,
          }}
        >
          <span className="text-xs font-bold text-amber-900">#{zone.order_index + 1}</span>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDeleteZone(zone.id);
            }}
            className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <Trash2 className="w-3 h-3" />
          </button>
        </div>
      ))}
    </div>
  );
};
