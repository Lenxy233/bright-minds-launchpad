
import BundleSelector from "./BundleSelector";
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
    return "19.00";
  };

  return (
    <div className="space-y-6">
      <BundleSelector request={request} setRequest={setRequest} />
      <OrderSummary 
        includeAiPrompts={false} 
        calculateTotal={calculateTotal}
        bundlePrice={getBundlePrice()}
      />
      <BundleDetails />
    </div>
  );
};

export default RequestDetailsTab;
