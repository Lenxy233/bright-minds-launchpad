import { Card, CardContent } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { HelpCircle, Mail, Shield, Sparkles, Gift } from "lucide-react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

const FAQSection = () => {
  const { t } = useTranslation();
  const questionsRaw = t('faqSection.questions', { returnObjects: true }) as unknown;
  const questions = Array.isArray(questionsRaw) ? (questionsRaw as Array<{ question: string; answer: string }>) : [];
  
  const icons = [
    <Sparkles className="w-5 h-5 text-purple-600" />,
    <Shield className="w-5 h-5 text-green-600" />,
    <HelpCircle className="w-5 h-5 text-blue-600" />,
    <Gift className="w-5 h-5 text-orange-600" />,
    <Mail className="w-5 h-5 text-red-600" />,
    <Shield className="w-5 h-5 text-pink-600" />
  ];

  const faqs = questions.map((q, index) => ({
    id: `faq-${index}`,
    icon: icons[index % icons.length],
    question: q.question,
    answer: q.answer
  }));

  return (
    <section className="py-20 px-4 bg-gradient-to-r from-blue-100/60 via-purple-100/60 to-pink-100/60 backdrop-blur-sm relative">
      <div className="container mx-auto max-w-4xl">
        <div className="text-center mb-16">
          <h3 className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
            {t('faqSection.title')}
          </h3>
          <p className="text-xl text-gray-700 bg-white/50 backdrop-blur-sm rounded-2xl p-4 inline-block shadow-lg">
            {t('faqSection.subtitle')}
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
                    <p className="text-gray-700">{faq.answer}</p>
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
              {t('faqSection.stillQuestions')}
            </p>
            <p className="text-gray-600 mb-4">
              {t('faqSection.supportText')}
            </p>
            <a 
              href="mailto:support@brightmindsacademy.com"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white px-6 py-3 rounded-full font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg"
            >
              <Mail className="w-4 h-4" />
              {t('faqSection.contactSupport')}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FAQSection;
