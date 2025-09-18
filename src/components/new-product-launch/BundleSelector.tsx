
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface BundleSelectorProps {
  request: string;
  setRequest: (value: string) => void;
}

const BundleSelector = ({ request, setRequest }: BundleSelectorProps) => {
  const bundleOptions = [
    { value: "kids-curriculum", label: "Kids Curriculum Bundle - $19.99" },
    { value: "video-bundle", label: "Video Bundle - $19.99" },
    { value: "animation-video", label: "Animation Video Bundle - $19.99" },
    { value: "bma-bundle", label: "BMA Bundle - $19.99" }
  ];

  return (
    <div className="space-y-2">
      <Label htmlFor="request" className="text-lg font-medium">Choose Your Bundle</Label>
      <Select value={request} onValueChange={setRequest} required>
        <SelectTrigger className="h-12 text-lg">
          <SelectValue placeholder="Select a bundle option" />
        </SelectTrigger>
        <SelectContent>
          {bundleOptions.map((option) => (
            <SelectItem key={option.value} value={option.value} className="text-lg py-3">
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default BundleSelector;
