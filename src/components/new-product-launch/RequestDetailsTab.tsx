
import BundleSelector from "./BundleSelector";
import AiPromptsAddon from "./AiPromptsAddon";
import OrderSummary from "./OrderSummary";
import BundleDetails from "./BundleDetails";

interface RequestDetailsTabProps {
  request: string;
  setRequest: (value: string) => void;
  includeAiPrompts: boolean;
  setIncludeAiPrompts: (value: boolean) => void;
  calculateTotal: () => string;
}

const RequestDetailsTab = ({
  request,
  setRequest,
  includeAiPrompts,
  setIncludeAiPrompts,
  calculateTotal,
}: RequestDetailsTabProps) => {
  const getBundlePrice = () => {
    const bundlePrices: { [key: string]: string } = {
      "kids-curriculum": "19.99",
      "video-bundle": "19.99",
      "animation-video": "19.99",
      "bma-bundle": "39.00"
    };
    return request ? bundlePrices[request] || "19.99" : "19.99";
  };

  return (
    <div className="space-y-6">
      <BundleSelector request={request} setRequest={setRequest} />
      <AiPromptsAddon includeAiPrompts={includeAiPrompts} setIncludeAiPrompts={setIncludeAiPrompts} />
      <OrderSummary 
        includeAiPrompts={includeAiPrompts} 
        calculateTotal={calculateTotal}
        bundlePrice={getBundlePrice()}
      />
      <BundleDetails />
    </div>
  );
};

export default RequestDetailsTab;
