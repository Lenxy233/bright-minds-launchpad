
interface OrderSummaryProps {
  includeAiPrompts: boolean;
  calculateTotal: () => string;
}

const OrderSummary = ({ includeAiPrompts, calculateTotal }: OrderSummaryProps) => {
  return (
    <div className="bg-white rounded-lg p-6 border-2 border-purple-200 shadow-sm">
      <h3 className="text-lg font-bold text-purple-800 mb-3">Order Summary</h3>
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span>Bundle Price:</span>
          <span>$19.99</span>
        </div>
        {includeAiPrompts && (
          <div className="flex justify-between text-sm text-orange-600">
            <span>AI Prompts Add-on:</span>
            <span>$1.99</span>
          </div>
        )}
        <div className="border-t pt-2 flex justify-between font-bold text-lg">
          <span>Total:</span>
          <span className="text-purple-600">${calculateTotal()}</span>
        </div>
      </div>
    </div>
  );
};

export default OrderSummary;
