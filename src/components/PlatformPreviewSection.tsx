import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowRight, Sparkles, Wand2, MessageCircle, Gamepad2, BookOpen, Palette, Brain } from "lucide-react";
import { useTranslation } from "react-i18next";

interface PlatformPreviewSectionProps {
  onPurchase: () => void;
}

const PlatformPreviewSection = ({ onPurchase }: PlatformPreviewSectionProps) => {
  const { t } = useTranslation();
  const platformFeatures = [
    {
      icon: Wand2,
      title: t('platform.grid.story.title'),
      description: t('platform.grid.story.description'),
      features: [
        t('platform.grid.story.f1'),
        t('platform.grid.story.f2'),
        t('platform.grid.story.f3')
      ]
    },
    {
      icon: MessageCircle,
      title: t('platform.grid.tutor.title'),
      description: t('platform.grid.tutor.description'),
      features: [
        t('platform.grid.tutor.f1'),
        t('platform.grid.tutor.f2'),
        t('platform.grid.tutor.f3')
      ]
    },
    {
      icon: Gamepad2,
      title: t('platform.grid.games.title'),
      description: t('platform.grid.games.description'),
      features: [
        t('platform.grid.games.f1'),
        t('platform.grid.games.f2'),
        t('platform.grid.games.f3')
      ]
    },
    {
      icon: BookOpen,
      title: t('platform.grid.stories.title'),
      description: t('platform.grid.stories.description'),
      features: [
        t('platform.grid.stories.f1'),
        t('platform.grid.stories.f2'),
        t('platform.grid.stories.f3')
      ]
    },
    {
      icon: Palette,
      title: t('platform.grid.creative.title'),
      description: t('platform.grid.creative.description'),
      features: [
        t('platform.grid.creative.f1'),
        t('platform.grid.creative.f2'),
        t('platform.grid.creative.f3')
      ]
    },
    {
      icon: Brain,
      title: t('platform.grid.curriculum.title'),
      description: t('platform.grid.curriculum.description'),
      features: [
        t('platform.grid.curriculum.f1'),
        t('platform.grid.curriculum.f2'),
        t('platform.grid.curriculum.f3')
      ]
    }
  ];

  return (
    <section className="py-16 px-4 relative">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-100 to-pink-100 px-6 py-2 rounded-full mb-4">
            <Sparkles className="w-5 h-5 text-purple-600" />
            <span className="text-purple-800 font-semibold">{t('platform.badge')}</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
            {t('platform.title')}
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            {t('platform.subtitle')}
          </p>
        </div>

        {/* Hero Platform Card */}
        <Card className="bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 p-8 md:p-12 border-4 border-purple-200 shadow-2xl mb-12">
          <div className="text-center mb-8">
            <h3 className="text-3xl md:text-4xl font-bold text-purple-800 mb-4">
              {t('platform.aiTitle')}
            </h3>
            <p className="text-gray-700 text-lg max-w-3xl mx-auto">
              {t('platform.aiSubtitle')}
            </p>
          </div>

          {/* Main Features Showcase */}
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            {/* AI Story Generator */}
            <div className="bg-white rounded-xl p-6 border-2 border-purple-200 hover:shadow-xl transition-all">
              <div className="bg-gradient-to-br from-purple-400 to-pink-400 rounded-lg p-4 mb-4 flex items-center justify-center">
                <Wand2 className="w-12 h-12 text-white" />
              </div>
              <h4 className="text-xl font-bold text-gray-800 mb-2">{t('platform.storyTitle')}</h4>
              <p className="text-gray-600 mb-4">
                {t('platform.storyDesc')}
              </p>
              <div className="space-y-2 text-sm text-gray-700">
                <div className="flex items-start gap-2">
                  <span className="text-green-500">✓</span>
                  <span>{t('platform.main.story.b1')}</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-green-500">✓</span>
                  <span>{t('platform.main.story.b2')}</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-green-500">✓</span>
                  <span>{t('platform.main.story.b3')}</span>
                </div>
              </div>
            </div>

            {/* AI Tutor */}
            <div className="bg-white rounded-xl p-6 border-2 border-purple-200 hover:shadow-xl transition-all">
              <div className="bg-gradient-to-br from-blue-400 to-cyan-400 rounded-lg p-4 mb-4 flex items-center justify-center">
                <MessageCircle className="w-12 h-12 text-white" />
              </div>
              <h4 className="text-xl font-bold text-gray-800 mb-2">{t('platform.tutorTitle')}</h4>
              <p className="text-gray-600 mb-4">
                {t('platform.tutorDesc')}
              </p>
              <div className="space-y-2 text-sm text-gray-700">
                <div className="flex items-start gap-2">
                  <span className="text-green-500">✓</span>
                  <span>{t('platform.main.tutor.b1')}</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-green-500">✓</span>
                  <span>{t('platform.main.tutor.b2')}</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-green-500">✓</span>
                  <span>{t('platform.main.tutor.b3')}</span>
                </div>
              </div>
            </div>

            {/* AI Game Creator */}
            <div className="bg-white rounded-xl p-6 border-2 border-purple-200 hover:shadow-xl transition-all">
              <div className="bg-gradient-to-br from-orange-400 to-red-400 rounded-lg p-4 mb-4 flex items-center justify-center">
                <Gamepad2 className="w-12 h-12 text-white" />
              </div>
              <h4 className="text-xl font-bold text-gray-800 mb-2">{t('platform.gameTitle')}</h4>
              <p className="text-gray-600 mb-4">
                {t('platform.gameDesc')}
              </p>
              <div className="space-y-2 text-sm text-gray-700">
                <div className="flex items-start gap-2">
                  <span className="text-green-500">✓</span>
                  <span>{t('platform.main.game.b1')}</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-green-500">✓</span>
                  <span>{t('platform.main.game.b2')}</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-green-500">✓</span>
                  <span>{t('platform.main.game.b3')}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Additional Features */}
          <div className="bg-white rounded-xl p-6 mb-6">
            <h4 className="text-xl font-bold text-gray-800 mb-4 text-center">{t('platform.moreTitle')}</h4>
            <div className="grid md:grid-cols-3 gap-4 text-sm">
              <div className="flex items-start gap-2">
                <span className="text-xl">📚</span>
                <div>
                  <p className="font-semibold text-gray-800">{t('platform.storyBooks')}</p>
                  <p className="text-gray-600">{t('platform.storyBooksDesc')}</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-xl">🎨</span>
                <div>
                  <p className="font-semibold text-gray-800">{t('platform.drawing')}</p>
                  <p className="text-gray-600">{t('platform.drawingDesc')}</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-xl">📊</span>
                <div>
                  <p className="font-semibold text-gray-800">{t('platform.curriculum')}</p>
                  <p className="text-gray-600">{t('platform.curriculumDesc')}</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-xl">👨‍👩‍👧</span>
                <div>
                  <p className="font-semibold text-gray-800">{t('platform.parentDash')}</p>
                  <p className="text-gray-600">{t('platform.parentDashDesc')}</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-xl">📄</span>
                <div>
                  <p className="font-semibold text-gray-800">{t('platform.worksheets')}</p>
                  <p className="text-gray-600">{t('platform.worksheetsDesc')}</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-xl">🌍</span>
                <div>
                  <p className="font-semibold text-gray-800">{t('platform.multiLang')}</p>
                  <p className="text-gray-600">{t('platform.multiLangDesc')}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="text-center">
            <Button 
              onClick={onPurchase}
              size="lg"
              className="bg-gradient-to-r from-orange-400 to-pink-500 hover:from-orange-500 hover:to-pink-600 text-white font-bold text-lg px-8 py-6 rounded-full shadow-lg hover:shadow-xl transition-all"
            >
              {t('platform.ctaButton')}
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
            <p className="text-gray-600 mt-4">{t('platform.instant')}</p>
          </div>
        </Card>

        {/* All Features Grid */}
        <div className="mb-12">
          <h3 className="text-2xl font-bold text-gray-800 text-center mb-8">
            {t('platform.allTitle')}
          </h3>
          <div className="grid md:grid-cols-3 gap-6">
            {platformFeatures.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Card 
                  key={index}
                  className="bg-white p-6 hover:shadow-xl transition-all hover:-translate-y-1 border-2 border-purple-100"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className="bg-gradient-to-br from-purple-400 to-pink-400 p-3 rounded-lg">
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <h4 className="font-bold text-gray-800 text-lg">{feature.title}</h4>
                  </div>
                  <p className="text-gray-600 mb-4">{feature.description}</p>
                  <div className="space-y-1">
                    {feature.features.map((item, idx) => (
                      <div key={idx} className="flex items-start gap-2 text-sm text-gray-700">
                        <span className="text-green-500 text-xs">✓</span>
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Trust Banner */}
        <div className="mt-12 text-center bg-gradient-to-r from-green-50 to-blue-50 rounded-2xl p-8 border-2 border-green-200">
          <p className="text-2xl font-bold text-gray-800 mb-2">
            {t('platform.trustTitle')}
          </p>
          <p className="text-gray-600 text-lg">
            {t('platform.trustSubtitle')}
          </p>
        </div>
      </div>
    </section>
  );
};

export default PlatformPreviewSection;
