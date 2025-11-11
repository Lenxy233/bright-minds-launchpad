
import { CheckCircle } from "lucide-react";
import { useTranslation } from "react-i18next";

const BenefitsSection = () => {
  const { t } = useTranslation();
  const benefitsRaw = t('benefits.items', { returnObjects: true }) as unknown;
  const benefits = Array.isArray(benefitsRaw) ? (benefitsRaw as string[]) : [];

  const platforms = [
    { name: "Amazon", image: "/lovable-uploads/39ffc0e5-e1bf-4850-9007-9b5ea749c08e.png" },
    { name: "Etsy", image: "/lovable-uploads/bd50071c-c65b-4a99-b68f-e5f4952d9dc0.png" },
    { name: "Gumroad", image: "/lovable-uploads/7bf380e9-8171-4109-9722-47cd9ee4acb5.png" },
    { name: "Fiverr", image: "/lovable-uploads/5d136223-da36-45ba-9203-4822b9d6d04c.png" },
    { name: "YouTube", image: "/lovable-uploads/7a7b4288-9799-4063-b00e-78a922ef7431.png" },
    { name: "Shopify", image: "/lovable-uploads/e77596f7-8486-4a62-82bf-1e38750b33fc.png" }
  ];

  return (
    <section className="py-20 px-4 relative">
      <div className="container mx-auto max-w-4xl">
        <div className="text-center mb-16">
          <h3 className="text-4xl font-bold mb-4 bg-gradient-to-r from-green-600 via-blue-600 to-purple-600 bg-clip-text text-transparent">
            {t('benefits.title')}
          </h3>
          <p className="text-xl text-gray-700 bg-white/50 backdrop-blur-sm rounded-2xl p-4 inline-block shadow-lg">{t('benefits.subtitle')}</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <div className="space-y-6">
            {benefits.map((benefit, index) => (
              <div key={index} className="flex items-start space-x-3 bg-white/60 backdrop-blur-sm rounded-2xl p-4 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 border-2 border-green-200">
                <CheckCircle className="w-6 h-6 text-green-500 mt-1 flex-shrink-0 animate-pulse" />
                <p className="text-gray-700 text-lg font-semibold">{benefit}</p>
              </div>
            ))}
          </div>
          <div className="bg-gradient-to-br from-purple-200 via-blue-200 to-green-200 rounded-3xl p-8 text-center shadow-xl border-4 border-dashed border-purple-300">
            <h4 className="text-2xl font-bold text-gray-800 mb-6">{t('benefits.startSellingOn')}</h4>
            <div className="grid grid-cols-2 gap-4">
              {platforms.map((platform, index) => (
                <div key={index} className="bg-white/80 rounded-2xl py-4 px-3 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 border-2 border-purple-200">
                  <img 
                    src={platform.image} 
                    alt={platform.name} 
                    className="w-full h-12 object-contain"
                  />
                </div>
              ))}
            </div>
            <p className="text-gray-700 mt-6 text-sm font-bold">{t('benefits.morePlatforms')}</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BenefitsSection;
