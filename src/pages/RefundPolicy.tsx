
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const RefundPolicy = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 via-purple-100 via-blue-100 to-green-100 py-8 px-4">
      <div className="container mx-auto max-w-4xl">
        <div className="mb-8">
          <Link 
            to="/" 
            className="inline-flex items-center gap-2 text-purple-600 hover:text-purple-800 font-medium transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>
        </div>

        <Card className="bg-white/90 backdrop-blur-sm shadow-xl border-2 border-purple-200">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Refund Policy
            </CardTitle>
          </CardHeader>
          <CardContent className="prose prose-lg max-w-none">
            <div className="space-y-6">
              <p className="text-gray-700 leading-relaxed">
                Due to the digital nature of our products, all sales are final. We do not offer refunds once a product has been purchased and delivered.
              </p>

              <p className="text-gray-700 leading-relaxed">
                Please ensure that you've read all product descriptions and details before completing your purchase. If you encounter any technical issues or need help accessing your purchase, contact us immediately at:
              </p>

              <div className="bg-purple-50 p-4 rounded-lg border-l-4 border-purple-400">
                <p className="text-gray-700 mb-2">
                  📧{" "}
                  <a href="mailto:support@brightmindsacademy.de" className="text-purple-600 hover:text-purple-800 underline font-medium">
                    support@brightmindsacademy.de
                  </a>
                </p>
              </div>

              <p className="text-gray-700 leading-relaxed font-medium text-center">
                We're always happy to assist and ensure your experience with Bright Minds Academy is a great one! ✨
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default RefundPolicy;
