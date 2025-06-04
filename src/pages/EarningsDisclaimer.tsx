
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const EarningsDisclaimer = () => {
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
              Earnings Disclaimer
            </CardTitle>
          </CardHeader>
          <CardContent className="prose prose-lg max-w-none">
            <div className="space-y-6">
              <p className="text-gray-700 leading-relaxed">
                At Bright Minds Academy, our goal is to empower learners and creators with high-quality educational content. However, we make no promises or guarantees about financial earnings or outcomes related to using our products.
              </p>

              <section>
                <h2 className="text-2xl font-bold text-purple-700 mb-4">No Earnings Guarantees</h2>
                <p className="text-gray-700">
                  While we may showcase examples of success or testimonials from users, these should not be seen as typical or promised results. Success depends on your unique circumstances, including your dedication, effort, and how you use the content provided.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-purple-700 mb-4">Educational Purpose Only</h2>
                <p className="text-gray-700">
                  All of our materials are intended for educational and informational purposes. Nothing we offer is intended as financial, business, or legal advice. You should always consult with a professional if you're unsure how our products may apply to your situation.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-purple-700 mb-4">Your Responsibility</h2>
                <p className="text-gray-700">
                  By purchasing and using our products, you acknowledge that you understand there is no guarantee of financial gain. Any decisions or actions you take are your own responsibility.
                </p>
              </section>

              <section>
                <p className="text-gray-700">
                  If you have any questions, reach us at:
                </p>
                <p className="text-gray-700 mt-2">
                  📧{" "}
                  <a href="mailto:support@brightmindsacademy.de" className="text-purple-600 hover:text-purple-800 underline">
                    support@brightmindsacademy.de
                  </a>
                </p>
              </section>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default EarningsDisclaimer;
