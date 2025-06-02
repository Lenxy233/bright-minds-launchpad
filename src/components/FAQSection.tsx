import { Card, CardContent } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { HelpCircle, Mail, Shield, Sparkles, Gift } from "lucide-react";

const FAQSection = () => {
  const faqs = [
    {
      id: "bundle",
      icon: <Sparkles className="w-5 h-5 text-purple-600" />,
      question: "What is the BMA Activity Bundle?",
      answer: (
        <div className="space-y-4">
          <p className="text-gray-700">
            The Bright Minds Academy Activity Bundle is a comprehensive resource designed to help you create, customize, and even sell beautiful children's books and educational materials.
          </p>
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-4">
            <p className="font-semibold text-gray-800 mb-3">The bundle includes:</p>
            <ul className="space-y-2 text-gray-700">
              <li className="flex items-start">
                <span className="text-blue-500 mr-2">✨</span>
                600 AI prompts for story and illustration ideas
              </li>
              <li className="flex items-start">
                <span className="text-green-500 mr-2">📚</span>
                Over 200 ready-made children's stories
              </li>
              <li className="flex items-start">
                <span className="text-purple-500 mr-2">🎨</span>
                A "Build-Your-Book" Canva template
              </li>
              <li className="flex items-start">
                <span className="text-orange-500 mr-2">🎯</span>
                More than 1,000 creative and curriculum-based resources
              </li>
              <li className="flex items-start">
                <span className="text-pink-500 mr-2">🎥</span>
                Animated Videos to start your Youtube Channel
              </li>
            </ul>
          </div>
          <p className="text-gray-700 font-medium">
            This is ideal for parents, educators, and content creators looking to produce professional and engaging children's books and activity packs.
          </p>
        </div>
      )
    },
    {
      id: "license",
      icon: <Shield className="w-5 h-5 text-green-600" />,
      question: "What kind of license is included?",
      answer: (
        <div className="space-y-4">
          <p className="text-gray-700">
            This product includes a PLR (Private Label Rights) License. This license allows you to:
          </p>
          <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-lg p-4">
            <ul className="space-y-2 text-gray-700">
              <li className="flex items-start">
                <span className="text-green-500 mr-2">✅</span>
                Use the content for your personal or client projects
              </li>
              <li className="flex items-start">
                <span className="text-blue-500 mr-2">💰</span>
                Customize and sell your books on platforms such as Amazon KDP, Etsy, and others
              </li>
              <li className="flex items-start">
                <span className="text-purple-500 mr-2">🏷️</span>
                Rebrand and publish under your own name
              </li>
            </ul>
          </div>
          <p className="text-gray-700 font-medium">
            It provides full creative freedom and potential for monetization.
          </p>
        </div>
      )
    },
    {
      id: "guarantee",
      icon: <Shield className="w-5 h-5 text-blue-600" />,
      question: "Do you offer a money-back guarantee?",
      answer: (
        <div className="space-y-4">
          <p className="text-gray-700">
            Yes, we offer a <strong>30-day money-back guarantee</strong> if there is a technical issue with the product that we are unable to resolve.
          </p>
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded">
            <p className="font-semibold text-gray-800 mb-2">Please note, refunds are not granted for the following reasons:</p>
            <ul className="space-y-1 text-gray-700 text-sm">
              <li>• Changing your mind</li>
              <li>• Disliking the product</li>
              <li>• Inability to use editing software</li>
            </ul>
          </div>
          <p className="text-gray-700">
            All product features and requirements are clearly stated on the sales page.
          </p>
          <p className="text-gray-700">
            To request a refund, email us at{" "}
            <a href="mailto:support@brightmindsacademy.com" className="text-blue-600 hover:underline">
              support@brightmindsacademy.com
            </a>
            . Please do not open disputes through PayPal or your card provider, as this can delay the refund process.
          </p>
        </div>
      )
    },
    {
      id: "upgrades",
      icon: <Gift className="w-5 h-5 text-orange-600" />,
      question: "Are there any additional upgrades available?",
      answer: (
        <div className="space-y-4">
          <p className="text-gray-700">
            Yes. After purchasing the main bundle, you will have the option to upgrade to the{" "}
            <strong>Expansion Pack</strong>, which offers additional content, unique templates, and new niche resources to further enhance your creative library.
          </p>
        </div>
      )
    },
    {
      id: "support",
      icon: <Mail className="w-5 h-5 text-red-600" />,
      question: "How do I contact customer support?",
      answer: (
        <div className="space-y-4">
          <p className="text-gray-700">
            For any assistance or questions, please contact our support team at{" "}
            <a href="mailto:support@brightmindsacademy.com" className="text-blue-600 hover:underline font-medium">
              support@brightmindsacademy.com
            </a>
            . We are always happy to help.
          </p>
        </div>
      )
    }
  ];

  return (
    <section className="py-20 px-4 bg-gradient-to-r from-blue-100/60 via-purple-100/60 to-pink-100/60 backdrop-blur-sm relative">
      <div className="container mx-auto max-w-4xl">
        <div className="text-center mb-16">
          <h3 className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
            🤔 Frequently Asked Questions 💭
          </h3>
          <p className="text-xl text-gray-700 bg-white/50 backdrop-blur-sm rounded-2xl p-4 inline-block shadow-lg">
            Everything you need to know about the Bright Minds Academy Bundle! ✨
          </p>
        </div>

        <Card className="bg-white/80 backdrop-blur-sm shadow-xl border-2 border-purple-200">
          <CardContent className="p-6">
            <Accordion type="single" collapsible className="w-full">
              {faqs.map((faq) => (
                <AccordionItem key={faq.id} value={faq.id} className="border-b border-gray-200">
                  <AccordionTrigger className="text-left hover:no-underline group">
                    <div className="flex items-center gap-3">
                      {faq.icon}
                      <span className="text-lg font-semibold text-gray-800 group-hover:text-purple-600 transition-colors">
                        {faq.question}
                      </span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="pt-4 pb-6">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </CardContent>
        </Card>

        <div className="text-center mt-12">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 inline-block shadow-xl border-4 border-dashed border-blue-400">
            <HelpCircle className="w-12 h-12 text-blue-600 mx-auto mb-4" />
            <p className="text-lg font-bold text-gray-800 mb-2">
              Still have questions? 🤗
            </p>
            <p className="text-gray-600 mb-4">
              Our friendly support team is here to help you succeed!
            </p>
            <a 
              href="mailto:support@brightmindsacademy.com"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white px-6 py-3 rounded-full font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg"
            >
              <Mail className="w-4 h-4" />
              Contact Support ✨
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FAQSection;
