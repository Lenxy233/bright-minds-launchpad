import { useTranslation } from "react-i18next";

const AmazonKDPSection = () => {
  const { t } = useTranslation();
  return (
    <section className="py-20 px-4 bg-gradient-to-r from-cyan-100/60 via-blue-100/60 to-teal-100/60 backdrop-blur-sm relative">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-16">
          <h3 className="text-4xl font-bold mb-4 bg-gradient-to-r from-cyan-600 via-blue-600 to-teal-600 bg-clip-text text-transparent">
            {t('amazonKdp.title')}
          </h3>
          <p className="text-xl text-gray-700 bg-white/50 backdrop-blur-sm rounded-2xl p-4 inline-block shadow-lg">
            {t('amazonKdp.subtitle')}
          </p>
        </div>

        <div className="bg-white/70 backdrop-blur-sm rounded-3xl p-8 shadow-xl border-4 border-dashed border-cyan-300">
          <div className="text-center mb-8">
            <h4 className="text-2xl font-bold mb-4 bg-gradient-to-r from-blue-600 via-cyan-600 to-teal-600 bg-clip-text text-transparent">
              {t('amazonKdp.heading')}
            </h4>
            <p className="text-lg text-gray-700 bg-gradient-to-r from-cyan-100 to-blue-100 rounded-2xl p-4 inline-block shadow-lg">
              {t('amazonKdp.quality')}
            </p>
          </div>
          
          <div className="flex justify-center">
            <div className="bg-gradient-to-br from-cyan-200 via-blue-200 to-teal-200 rounded-3xl p-8 shadow-2xl border-4 border-dashed border-cyan-300 transform hover:scale-105 transition-all duration-300 max-w-md">
              <img 
                src="/lovable-uploads/6d9ca897-8497-44f2-bd2a-09c3cc1eb7d9.png" 
                alt="Amazon KDP book covers featuring 'Plastic-Free the Way to Be!' and 'The Deep Dive Detectives' - professional children's book designs" 
                className="w-full h-auto rounded-2xl shadow-lg transform hover:scale-110 transition-transform duration-300 cursor-pointer"
              />
              <div className="mt-4 text-center">
                <div className="bg-gradient-to-r from-cyan-400 to-blue-400 text-white font-bold text-sm px-4 py-2 rounded-full shadow-lg inline-block border-2 border-white">
                  {t('amazonKdp.badge')}
                </div>
              </div>
            </div>
          </div>

          <div className="text-center mt-8">
            <p className="text-gray-600 text-lg bg-cyan-100 rounded-2xl p-4 inline-block shadow-lg border-2 border-cyan-300" dangerouslySetInnerHTML={{ __html: t('amazonKdp.perfect') }} />
          </div>
        </div>
      </div>
    </section>
  );
};

export default AmazonKDPSection;
