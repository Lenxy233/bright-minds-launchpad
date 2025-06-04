
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const Legal = () => {
  const location = useLocation();

  useEffect(() => {
    // Extract the hash from the URL and scroll to that section
    if (location.hash) {
      const element = document.getElementById(location.hash.substring(1));
      if (element) {
        element.scrollIntoView({ behavior: 'instant', block: 'start' });
      }
    }
  }, [location]);

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

        {/* Navigation Header */}
        <Card className="bg-white/90 backdrop-blur-sm shadow-xl border-2 border-purple-200 mb-8">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-4">
              Legal Policies
            </CardTitle>
            <div className="flex flex-wrap justify-center gap-4">
              <Link 
                to="/legal#privacy-policy" 
                className="bg-purple-100 hover:bg-purple-200 text-purple-700 px-4 py-2 rounded-lg font-medium transition-colors"
              >
                Privacy Policy
              </Link>
              <Link 
                to="/legal#data-protection-policy" 
                className="bg-purple-100 hover:bg-purple-200 text-purple-700 px-4 py-2 rounded-lg font-medium transition-colors"
              >
                Data Protection Policy
              </Link>
              <Link 
                to="/legal#terms-and-conditions" 
                className="bg-purple-100 hover:bg-purple-200 text-purple-700 px-4 py-2 rounded-lg font-medium transition-colors"
              >
                Terms & Conditions
              </Link>
              <Link 
                to="/legal#earnings-disclaimer" 
                className="bg-purple-100 hover:bg-purple-200 text-purple-700 px-4 py-2 rounded-lg font-medium transition-colors"
              >
                Earnings Disclaimer
              </Link>
              <Link 
                to="/legal#refund-policy" 
                className="bg-purple-100 hover:bg-purple-200 text-purple-700 px-4 py-2 rounded-lg font-medium transition-colors"
              >
                Refund Policy
              </Link>
            </div>
          </CardHeader>
        </Card>

        {/* Privacy Policy Section */}
        <Card id="privacy-policy" className="bg-white/90 backdrop-blur-sm shadow-xl border-2 border-purple-200 mb-8">
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

        {/* Data Protection Policy Section */}
        <Card id="data-protection-policy" className="bg-white/90 backdrop-blur-sm shadow-xl border-2 border-purple-200 mb-8">
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

        {/* Terms & Conditions Section */}
        <Card id="terms-and-conditions" className="bg-white/90 backdrop-blur-sm shadow-xl border-2 border-purple-200 mb-8">
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

        {/* Earnings Disclaimer Section */}
        <Card id="earnings-disclaimer" className="bg-white/90 backdrop-blur-sm shadow-xl border-2 border-purple-200 mb-8">
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

        {/* Refund Policy Section */}
        <Card id="refund-policy" className="bg-white/90 backdrop-blur-sm shadow-xl border-2 border-purple-200 mb-8">
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

export default Legal;
