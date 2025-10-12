import { Input } from "@/components/ui/input";
import { CheckCircle, XCircle } from "lucide-react";

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

interface StudentAnswerZonesProps {
  answerZones: AnswerZone[];
  userAnswers: Record<string, string>;
  checkedAnswers: Record<string, boolean>;
  onAnswerChange: (zoneId: string, value: string) => void;
  imageWidth: number;
  imageHeight: number;
}

export const StudentAnswerZones = ({
  answerZones,
  userAnswers,
  checkedAnswers,
  onAnswerChange,
  imageWidth,
  imageHeight,
}: StudentAnswerZonesProps) => {
  return (
    <div className="relative" style={{ width: imageWidth, height: imageHeight }}>
      {answerZones.map((zone) => {
        const isCorrect = checkedAnswers[zone.id];
        const hasAnswer = userAnswers[zone.id]?.trim();

        return (
          <div
            key={zone.id}
            className="absolute"
            style={{
              left: `${zone.x_position}%`,
              top: `${zone.y_position}%`,
              width: `${zone.width}%`,
              height: `${zone.height}%`,
            }}
          >
            <div className="relative h-full">
              <Input
                value={userAnswers[zone.id] || ""}
                onChange={(e) => onAnswerChange(zone.id, e.target.value)}
                placeholder=""
                className={`h-full text-center text-sm font-semibold ${
                  isCorrect === true
                    ? "border-2 border-green-500 bg-green-50"
                    : isCorrect === false
                    ? "border-2 border-red-500 bg-red-50"
                    : "border-none bg-transparent"
                }`}
              />
              {isCorrect === true && (
                <CheckCircle className="absolute -right-6 top-1/2 -translate-y-1/2 w-5 h-5 text-green-600" />
              )}
              {isCorrect === false && (
                <XCircle className="absolute -right-6 top-1/2 -translate-y-1/2 w-5 h-5 text-red-600" />
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};
