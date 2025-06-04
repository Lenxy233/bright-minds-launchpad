
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const PrivacyPolicy = () => {
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
              Privacy Policy
            </CardTitle>
          </CardHeader>
          <CardContent className="prose prose-lg max-w-none">
            <div className="space-y-6">
              <p className="text-gray-700 leading-relaxed">
                Bright Minds Academy values your privacy and is committed to safeguarding your personal information. This Privacy Policy explains how we collect, use, and protect the data you share with us when using our website. By continuing to browse or use our site, you agree to the practices described below.
              </p>

              <section>
                <h2 className="text-2xl font-bold text-purple-700 mb-4">INFORMATION WE COLLECT</h2>
                <p className="text-gray-700 mb-4">We collect both personal and non-personal information:</p>
                
                <div className="ml-4 space-y-3">
                  <p className="text-gray-700">
                    <strong>Personal Information:</strong> Includes your name, email address, billing address, phone number, and payment details. This is collected when you purchase a product, sign up for our newsletters, or contact us.
                  </p>
                  
                  <p className="text-gray-700">
                    <strong>Non-Personal Information:</strong> Includes browser type, operating system, IP address, and usage data gathered through cookies and web beacons to improve our site and services.
                  </p>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-purple-700 mb-4">COOKIES AND TRACKING</h2>
                <p className="text-gray-700">
                  We use cookies to personalize your experience, track site usage, and remember your preferences. You can disable cookies via your browser settings, but this may affect your ability to use certain features on our site.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-purple-700 mb-4">HOW WE USE YOUR INFORMATION</h2>
                <p className="text-gray-700 mb-4">Bright Minds Academy uses your information to:</p>
                
                <ul className="list-disc ml-8 space-y-2 text-gray-700">
                  <li>Deliver products and services</li>
                  <li>Provide customer support</li>
                  <li>Send relevant updates and promotions</li>
                  <li>Improve our offerings and site experience</li>
                  <li>Comply with legal obligations</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-purple-700 mb-4">SHARING YOUR DATA</h2>
                <p className="text-gray-700">
                  We do not sell or rent your personal information. We may share your data with trusted third-party service providers to process payments, send emails, or analyze site performance—only as necessary and under confidentiality agreements.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-purple-700 mb-4">YOUR RIGHTS</h2>
                <p className="text-gray-700">
                  You may access, update, or delete your personal data at any time by contacting us at{" "}
                  <a href="mailto:support@brightmindsacademy.de" className="text-purple-600 hover:text-purple-800 underline">
                    support@brightmindsacademy.de
                  </a>. You can also opt-out of marketing emails using the unsubscribe link included in our messages.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-purple-700 mb-4">DATA SECURITY</h2>
                <p className="text-gray-700">
                  We use industry-standard encryption and security protocols to protect your information. While no system is completely secure, we work diligently to safeguard your data.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-purple-700 mb-4">CHANGES TO THIS POLICY</h2>
                <p className="text-gray-700">
                  We may update this Privacy Policy periodically. The latest version will always be available on our website, and significant changes will be clearly communicated.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-purple-700 mb-4">CONTACT US</h2>
                <p className="text-gray-700">
                  For questions about this policy, contact us at:
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

export default PrivacyPolicy;
