
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Package } from "lucide-react";
import FileDownloadList from "@/components/FileDownloadList";

interface Purchase {
  id: string;
  bundle_type: string;
  amount: number;
  status: string;
  purchased_at: string;
  includes_ai_prompts?: boolean;
}

interface PurchasesCardProps {
  purchases: Purchase[];
}

const PurchasesCard = ({ purchases }: PurchasesCardProps) => {
  const getBundleName = (bundleType: string) => {
    switch (bundleType) {
      case 'kids-curriculum':
        return 'Kids Curriculum Bundle';
      case 'video-bundle':
        return 'Video Bundle';
      case 'animation-video':
        return 'Animation Video Bundle';
      case 'bma-bundle':
        return 'BMA Bundle';
      default:
        return bundleType;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-500';
      case 'pending':
        return 'bg-yellow-500';
      case 'failed':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  return (
    <Card className="bg-white/90 backdrop-blur-sm shadow-xl border-2 border-purple-200 lg:col-span-2">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Package className="w-5 h-5" />
          Your Purchases
        </CardTitle>
        <CardDescription>
          {purchases.length === 0 ? "No purchases yet" : `${purchases.length} purchase(s)`}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {purchases.length === 0 ? (
          <div className="text-center py-8">
            <Package className="w-16 h-16 mx-auto text-gray-400 mb-4" />
            <p className="text-gray-600">No purchases found</p>
            <p className="text-sm text-gray-500 mt-2">
              Visit our <a href="/" className="text-purple-600 hover:underline">homepage</a> to explore our bundles
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {purchases.map((purchase) => (
              <div key={purchase.id} className="border rounded-lg p-4 bg-white">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-semibold">{getBundleName(purchase.bundle_type)}</h3>
                  <Badge className={getStatusColor(purchase.status)}>
                    {purchase.status}
                  </Badge>
                </div>
                <div className="text-sm text-gray-600 space-y-1">
                  <p>Amount: ${(purchase.amount / 100).toFixed(2)}</p>
                  <p>Purchased: {new Date(purchase.purchased_at).toLocaleDateString()}</p>
                </div>
                <FileDownloadList 
                  bundleType={purchase.bundle_type} 
                  purchaseStatus={purchase.status}
                  includesAiPrompts={purchase.includes_ai_prompts}
                />
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default PurchasesCard;
