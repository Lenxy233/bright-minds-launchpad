import { Card, CardContent } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { HelpCircle, Mail, Shield, Sparkles, Gift } from "lucide-react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

const FAQSection = () => {
  const { t } = useTranslation();
  const faqs = [
    {
      id: "bundle",
      icon: <Sparkles className="w-5 h-5 text-purple-600" />,
      question: t('faqSection.questions.bundle.question'),
      answer: (
        <div className="space-y-4">
          <p className="text-gray-700">
            {t('faqSection.questions.bundle.intro')}
          </p>
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-4">
            <p className="font-semibold text-gray-800 mb-3">{t('faqSection.questions.bundle.listTitle')}</p>
            <ul className="space-y-2 text-gray-700">
              <li className="flex items-start">
                <span className="text-blue-500 mr-2">✨</span>
                {t('faqSection.questions.bundle.list.i1')}
              </li>
              <li className="flex items-start">
                <span className="text-green-500 mr-2">📚</span>
                {t('faqSection.questions.bundle.list.i2')}
              </li>
              <li className="flex items-start">
                <span className="text-purple-500 mr-2">🎨</span>
                {t('faqSection.questions.bundle.list.i3')}
              </li>
              <li className="flex items-start">
                <span className="text-orange-500 mr-2">🎯</span>
                {t('faqSection.questions.bundle.list.i4')}
              </li>
              <li className="flex items-start">
                <span className="text-pink-500 mr-2">🎥</span>
                {t('faqSection.questions.bundle.list.i5')}
              </li>
            </ul>
          </div>
          <p className="text-gray-700 font-medium">
            {t('faqSection.questions.bundle.outro')}
          </p>
        </div>
      )
    },
    {
      id: "license",
      icon: <Shield className="w-5 h-5 text-green-600" />,
      question: t('faqSection.questions.license.question'),
      answer: (
        <div className="space-y-4">
          <p className="text-gray-700">
            {t('faqSection.questions.license.intro')}
          </p>
          <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-lg p-4">
            <ul className="space-y-2 text-gray-700">
              <li className="flex items-start">
                <span className="text-green-500 mr-2">✅</span>
                {t('faqSection.questions.license.items.i1')}
              </li>
              <li className="flex items-start">
                <span className="text-blue-500 mr-2">💰</span>
                {t('faqSection.questions.license.items.i2')}
              </li>
              <li className="flex items-start">
                <span className="text-purple-500 mr-2">🏷️</span>
                {t('faqSection.questions.license.items.i3')}
              </li>
            </ul>
          </div>
          <p className="text-gray-700 font-medium">
            {t('faqSection.questions.license.outro')}
          </p>
        </div>
      )
    },
    {
      id: "guarantee",
      icon: <Shield className="w-5 h-5 text-blue-600" />,
      question: t('faqSection.questions.guarantee.question'),
      answer: (
        <div className="space-y-4">
          <p className="text-gray-700">
            {t('faqSection.questions.guarantee.intro')}
          </p>
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded">
            <p className="font-semibold text-gray-800 mb-2">{t('faqSection.questions.guarantee.noteTitle')}</p>
            <ul className="space-y-1 text-gray-700 text-sm">
              <li>• {t('faqSection.questions.guarantee.notes.n1')}</li>
              <li>• {t('faqSection.questions.guarantee.notes.n2')}</li>
              <li>• {t('faqSection.questions.guarantee.notes.n3')}</li>
            </ul>
          </div>
          <p className="text-gray-700">
            {t('faqSection.questions.guarantee.outro1')}
          </p>
          <p className="text-gray-700">
            {t('faqSection.questions.guarantee.outro2')}
          </p>
        </div>
      )
    },
    {
      id: "upgrades",
      icon: <Gift className="w-5 h-5 text-orange-600" />,
      question: t('faqSection.questions.upgrades.question'),
      answer: (
        <div className="space-y-4">
          <p className="text-gray-700">
            {t('faqSection.questions.upgrades.intro')}
          </p>
        </div>
      )
    },
    {
      id: "support",
      icon: <Mail className="w-5 h-5 text-red-600" />,
      question: t('faqSection.questions.support.question'),
      answer: (
        <div className="space-y-4">
          <p className="text-gray-700">
            {t('faqSection.questions.support.intro')}
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
