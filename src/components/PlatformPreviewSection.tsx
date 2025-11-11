import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowRight, Sparkles, Wand2, MessageCircle, Gamepad2, BookOpen, Palette, Brain } from "lucide-react";

interface PlatformPreviewSectionProps {
  onPurchase: () => void;
}

const PlatformPreviewSection = ({ onPurchase }: PlatformPreviewSectionProps) => {
  const platformFeatures = [
    {
      icon: Wand2,
      title: "AI Story Generator",
      description: "Create personalized stories with AI - kids choose characters, themes, and watch their imagination come to life!",
      features: ["Custom story creation", "AI-powered illustrations", "Interactive storytelling"]
    },
    {
      icon: MessageCircle,
      title: "AI Learning Tutor",
      description: "24/7 AI assistant that helps with homework, answers questions, and provides personalized learning support.",
      features: ["Instant homework help", "Explains concepts clearly", "Adapts to learning pace"]
    },
    {
      icon: Gamepad2,
      title: "Educational Games",
      description: "Fun interactive games teaching alphabet, numbers, emotions, geography, and more through play.",
      features: ["Drag-and-drop activities", "Puzzle challenges", "Progress tracking"]
    },
    {
      icon: BookOpen,
      title: "Interactive Stories",
      description: "Engaging story books with audio narration, animations, and interactive elements for immersive reading.",
      features: ["Audio narration", "Animated pages", "Reading comprehension"]
    },
    {
      icon: Palette,
      title: "Creative Activities",
      description: "Drawing, coloring, and art activities that encourage creativity and fine motor skills development.",
      features: ["Digital coloring", "Drawing canvas", "Creative challenges"]
    },
    {
      icon: Brain,
      title: "Curriculum Lessons",
      description: "Structured lessons covering kindergarten curriculum - math, language, science, and social skills.",
      features: ["Age-appropriate content", "Step-by-step lessons", "Parent dashboard"]
    }
  ];

  return (
    <section className="py-16 px-4 relative">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-100 to-pink-100 px-6 py-2 rounded-full mb-4">
            <Sparkles className="w-5 h-5 text-purple-600" />
            <span className="text-purple-800 font-semibold">Live Platform Preview</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
            See The Magic In Action! ✨
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Get instant access to our interactive kids learning platform with hundreds of engaging activities
          </p>
        </div>

        {/* Hero Platform Card */}
        <Card className="bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 p-8 md:p-12 border-4 border-purple-200 shadow-2xl mb-12">
          <div className="text-center mb-8">
            <h3 className="text-3xl md:text-4xl font-bold text-purple-800 mb-4">
              🚀 AI-Powered Content Creation Platform
            </h3>
            <p className="text-gray-700 text-lg max-w-3xl mx-auto">
              Create unlimited personalized content with AI! Generate stories, get tutoring help, 
              and create custom games - all powered by cutting-edge AI technology.
            </p>
          </div>

          {/* Main Features Showcase */}
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            {/* AI Story Generator */}
            <div className="bg-white rounded-xl p-6 border-2 border-purple-200 hover:shadow-xl transition-all">
              <div className="bg-gradient-to-br from-purple-400 to-pink-400 rounded-lg p-4 mb-4 flex items-center justify-center">
                <Wand2 className="w-12 h-12 text-white" />
              </div>
              <h4 className="text-xl font-bold text-gray-800 mb-2">🎨 AI Story Creator</h4>
              <p className="text-gray-600 mb-4">
                Kids create personalized stories with AI! Choose characters, settings, and themes - 
                the AI generates unique illustrated stories instantly.
              </p>
              <div className="space-y-2 text-sm text-gray-700">
                <div className="flex items-start gap-2">
                  <span className="text-green-500">✓</span>
                  <span>Generate custom stories with AI</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-green-500">✓</span>
                  <span>AI-generated illustrations</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-green-500">✓</span>
                  <span>Save & share creations</span>
                </div>
              </div>
            </div>

            {/* AI Tutor */}
            <div className="bg-white rounded-xl p-6 border-2 border-purple-200 hover:shadow-xl transition-all">
              <div className="bg-gradient-to-br from-blue-400 to-cyan-400 rounded-lg p-4 mb-4 flex items-center justify-center">
                <MessageCircle className="w-12 h-12 text-white" />
              </div>
              <h4 className="text-xl font-bold text-gray-800 mb-2">🤖 AI Learning Tutor</h4>
              <p className="text-gray-600 mb-4">
                24/7 AI assistant that helps with homework, explains concepts, and provides 
                personalized learning support for every child.
              </p>
              <div className="space-y-2 text-sm text-gray-700">
                <div className="flex items-start gap-2">
                  <span className="text-green-500">✓</span>
                  <span>Instant homework help</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-green-500">✓</span>
                  <span>Explains difficult concepts</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-green-500">✓</span>
                  <span>Adapts to learning style</span>
                </div>
              </div>
            </div>

            {/* AI Game Creator */}
            <div className="bg-white rounded-xl p-6 border-2 border-purple-200 hover:shadow-xl transition-all">
              <div className="bg-gradient-to-br from-orange-400 to-red-400 rounded-lg p-4 mb-4 flex items-center justify-center">
                <Gamepad2 className="w-12 h-12 text-white" />
              </div>
              <h4 className="text-xl font-bold text-gray-800 mb-2">🎮 AI Game Creator</h4>
              <p className="text-gray-600 mb-4">
                Generate custom educational games instantly with AI! Create quiz games, matching 
                activities, and puzzles tailored to any topic or skill level.
              </p>
              <div className="space-y-2 text-sm text-gray-700">
                <div className="flex items-start gap-2">
                  <span className="text-green-500">✓</span>
                  <span>Generate games on any topic</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-green-500">✓</span>
                  <span>Multiple game types (quiz, matching, puzzles)</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-green-500">✓</span>
                  <span>Adjustable difficulty & age levels</span>
                </div>
              </div>
            </div>
          </div>

          {/* Additional Features */}
          <div className="bg-white rounded-xl p-6 mb-6">
            <h4 className="text-xl font-bold text-gray-800 mb-4 text-center">Plus So Much More:</h4>
            <div className="grid md:grid-cols-3 gap-4 text-sm">
              <div className="flex items-start gap-2">
                <span className="text-xl">📚</span>
                <div>
                  <p className="font-semibold text-gray-800">Interactive Story Books</p>
                  <p className="text-gray-600">Audio narration & animations</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-xl">🎨</span>
                <div>
                  <p className="font-semibold text-gray-800">Drawing & Coloring</p>
                  <p className="text-gray-600">Digital art activities</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-xl">📊</span>
                <div>
                  <p className="font-semibold text-gray-800">Curriculum Lessons</p>
                  <p className="text-gray-600">Structured learning path</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-xl">👨‍👩‍👧</span>
                <div>
                  <p className="font-semibold text-gray-800">Parent Dashboard</p>
                  <p className="text-gray-600">Track progress & achievements</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-xl">📄</span>
                <div>
                  <p className="font-semibold text-gray-800">Printable Worksheets</p>
                  <p className="text-gray-600">200+ downloadable activities</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-xl">🌍</span>
                <div>
                  <p className="font-semibold text-gray-800">Multi-Language</p>
                  <p className="text-gray-600">Learn in your language</p>
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
              🎯 Get Full Platform Access - Only $39
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
            <p className="text-gray-600 mt-4">✨ Instant access to everything • Works on any device • Cancel anytime</p>
          </div>
        </Card>

        {/* All Features Grid */}
        <div className="mb-12">
          <h3 className="text-2xl font-bold text-gray-800 text-center mb-8">
            🌟 Everything Included in Your Platform
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
            🎉 Join 10,000+ Happy Parents & Teachers!
          </p>
          <p className="text-gray-600 text-lg">
            Start your child's learning journey today with instant access to all resources
          </p>
        </div>
      </div>
    </section>
  );
};

export default PlatformPreviewSection;
