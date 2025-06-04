
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const DataProtectionPolicy = () => {
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
              Data Protection Policy
            </CardTitle>
          </CardHeader>
          <CardContent className="prose prose-lg max-w-none">
            <div className="space-y-6">
              <p className="text-gray-700 leading-relaxed">
                At Bright Minds Academy, we are dedicated to ensuring your data is handled responsibly. This Data Protection Policy outlines how we collect, manage, and protect your personal data in accordance with data privacy laws such as the EU General Data Protection Regulation (GDPR).
              </p>

              <section>
                <h2 className="text-2xl font-bold text-purple-700 mb-4">WHY WE COLLECT DATA</h2>
                <p className="text-gray-700 mb-4">We collect personal data to:</p>
                
                <ul className="list-disc ml-8 space-y-2 text-gray-700">
                  <li>Provide access to our learning platforms and services</li>
                  <li>Process transactions and manage subscriptions</li>
                  <li>Communicate with our users about updates, support, and promotions</li>
                  <li>Improve our services and user experience</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-purple-700 mb-4">WHAT WE COLLECT</h2>
                <p className="text-gray-700">
                  Information may include names, contact details, payment information, IP addresses, browser details, and usage activity on our platform.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-purple-700 mb-4">DATA HANDLING PRINCIPLES</h2>
                <p className="text-gray-700 mb-4">All personal data is:</p>
                
                <ul className="list-disc ml-8 space-y-2 text-gray-700">
                  <li>Collected lawfully and with user consent</li>
                  <li>Used solely for the purpose it was collected</li>
                  <li>Stored securely and accessed only by authorized personnel</li>
                  <li>Not retained longer than necessary</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-purple-700 mb-4">USER RIGHTS UNDER GDPR</h2>
                <p className="text-gray-700 mb-4">As a user, you have the right to:</p>
                
                <ul className="list-disc ml-8 space-y-2 text-gray-700">
                  <li>Access your personal data</li>
                  <li>Request corrections or deletions</li>
                  <li>Restrict or object to data processing</li>
                  <li>Withdraw consent at any time</li>
                  <li>Lodge complaints with a data protection authority</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-purple-700 mb-4">INTERNATIONAL DATA TRANSFERS</h2>
                <p className="text-gray-700">
                  If data is transferred outside the EU/EEA, we ensure it is protected by adequate safeguards.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-purple-700 mb-4">DATA SECURITY MEASURES</h2>
                <p className="text-gray-700">
                  Bright Minds Academy implements encryption, secure storage, and access control systems to prevent unauthorized access, loss, or misuse of your data.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-purple-700 mb-4">CONTACT FOR DATA ISSUES</h2>
                <p className="text-gray-700">
                  If you have questions or concerns regarding your data, reach out to:
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

export default DataProtectionPolicy;
