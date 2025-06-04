
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const TermsAndConditions = () => {
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
              Terms & Conditions
            </CardTitle>
          </CardHeader>
          <CardContent className="prose prose-lg max-w-none">
            <div className="space-y-6">
              <p className="text-gray-700 leading-relaxed">
                Welcome to Bright Minds Academy! By accessing our website and purchasing our digital educational products, you agree to abide by the terms outlined below.
              </p>

              <section>
                <h2 className="text-2xl font-bold text-purple-700 mb-4">USAGE RIGHTS</h2>
                <p className="text-gray-700">
                  All content provided by Bright Minds Academy is for personal, non-commercial use only. You may not share, redistribute, or modify our materials without express permission. Each purchase grants access to content for one individual or classroom.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-purple-700 mb-4">INTELLECTUAL PROPERTY</h2>
                <p className="text-gray-700">
                  All content, including videos, illustrations, characters, and lesson designs, are the intellectual property of Bright Minds Academy. Unauthorized use or distribution is strictly prohibited and may result in legal action.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-purple-700 mb-4">USER RESPONSIBILITIES</h2>
                <p className="text-gray-700">
                  Users must provide accurate information during purchase and refrain from any actions that disrupt or misuse our services. Any attempt to hack, copy, or resell our materials will lead to immediate termination of access.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-purple-700 mb-4">UPDATES AND MODIFICATIONS</h2>
                <p className="text-gray-700">
                  We may update our content, policies, or terms at any time. Continued use of our services after changes implies acceptance of the updated terms.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-purple-700 mb-4">CONTACT US</h2>
                <p className="text-gray-700">
                  For questions regarding these terms, reach us at:
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

export default TermsAndConditions;
