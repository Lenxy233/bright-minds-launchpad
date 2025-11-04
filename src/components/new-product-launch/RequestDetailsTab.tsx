
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
    return "39.00";
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
