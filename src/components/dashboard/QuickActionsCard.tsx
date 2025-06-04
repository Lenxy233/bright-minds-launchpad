
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const QuickActionsCard = () => {
  return (
    <Card className="mt-6 bg-white/90 backdrop-blur-sm shadow-xl border-2 border-purple-200">
      <CardHeader>
        <CardTitle>Quick Actions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-4">
          <Button asChild className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600">
            <a href="/">Browse More Bundles</a>
          </Button>
          <Button asChild variant="outline">
            <a href="/new-product-launch">New Products</a>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default QuickActionsCard;
