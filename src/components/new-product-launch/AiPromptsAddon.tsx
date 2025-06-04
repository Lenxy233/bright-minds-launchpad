
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Plus } from "lucide-react";

interface AiPromptsAddonProps {
  includeAiPrompts: boolean;
  setIncludeAiPrompts: (value: boolean) => void;
}

const AiPromptsAddon = ({ includeAiPrompts, setIncludeAiPrompts }: AiPromptsAddonProps) => {
  return (
    <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg p-6 border-2 border-yellow-200">
      <h3 className="text-xl font-bold text-orange-800 mb-4 flex items-center gap-2">
        <Plus className="w-5 h-5" />
        Optional Add-On
      </h3>
      <div className="flex items-start space-x-3">
        <Checkbox 
          id="ai-prompts" 
          checked={includeAiPrompts}
          onCheckedChange={(checked) => setIncludeAiPrompts(checked === true)}
          className="mt-1"
        />
        <div className="flex-1">
          <Label htmlFor="ai-prompts" className="text-lg font-semibold text-orange-700 cursor-pointer">
            Image Design Style AI Prompts - $1.99
          </Label>
          <p className="text-sm text-gray-600 mt-1">
            Get 200+ professional AI prompts for creating stunning image designs and artwork styles. Perfect for MidJourney, DALL-E, and other AI image generators.
          </p>
          <div className="mt-2 bg-white rounded p-3 border border-orange-200">
            <p className="text-xs text-orange-600 font-medium">✨ What's included:</p>
            <ul className="text-xs text-gray-600 mt-1 space-y-1">
              <li>• 200+ curated AI art prompts</li>
              <li>• Style guides for different art techniques</li>
              <li>• Ready-to-use prompt templates</li>
              <li>• Commercial usage rights included</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AiPromptsAddon;
