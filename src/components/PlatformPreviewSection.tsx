import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowRight, BookOpen, Brain, Gamepad2, Sparkles, Users, Palette, Music, Globe } from "lucide-react";

interface PlatformPreviewSectionProps {
  onPurchase: () => void;
}

const PlatformPreviewSection = ({ onPurchase }: PlatformPreviewSectionProps) => {
  const platformFeatures = [
    {
      icon: BookOpen,
      title: "Alphabet & Letter Recognition",
      image: "/lovable-uploads/012a16e7-1d39-4676-911a-d55fc31ccf4c.png",
      description: "Interactive letter tracing and recognition activities"
    },
    {
      icon: Brain,
      title: "Numbers & Math Practice",
      image: "/lovable-uploads/0cc9d733-7771-46ef-97e1-3c3208a21a21.png",
      description: "Counting, addition, subtraction with visual aids"
    },
    {
      icon: Palette,
      title: "Creative Arts & Drawing",
      image: "/lovable-uploads/5a15895f-5d6a-416c-8430-ed2e5d95e0a5.png",
      description: "Coloring, drawing, and artistic activities"
    },
    {
      icon: Users,
      title: "Emotions & Social Skills",
      image: "/lovable-uploads/5d136223-da36-45ba-9203-4822b9d6d04c.png",
      description: "Understanding feelings and building friendships"
    },
    {
      icon: Gamepad2,
      title: "Interactive Puzzles & Games",
      image: "/lovable-uploads/65f507f9-c4c2-46d8-94c8-ecc830938f3d.png",
      description: "Engaging puzzles and educational games"
    },
    {
      icon: Globe,
      title: "Geography & World Learning",
      image: "/lovable-uploads/69fc66c6-3b7b-4fa2-9348-5adcf71e90ee.png",
      description: "Explore countries and famous landmarks"
    },
    {
      icon: Music,
      title: "Story Books & Reading",
      image: "/lovable-uploads/6d9ca897-8497-44f2-bd2a-09c3cc1eb7d9.png",
      description: "Interactive stories with audio narration"
    },
    {
      icon: Brain,
      title: "Science Activities",
      image: "/lovable-uploads/7713de76-ba70-4aed-9824-4d21f12d9617.png",
      description: "Hands-on experiments and nature exploration"
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

        {/* Main Preview Card */}
        <Card className="bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 p-8 md:p-12 border-4 border-purple-200 shadow-2xl mb-12">
          <div className="text-center mb-8">
            <h3 className="text-3xl md:text-4xl font-bold text-purple-800 mb-4">
              🎓 Full Learning Platform Access
            </h3>
            <p className="text-gray-700 text-lg max-w-3xl mx-auto">
              Get instant access to our complete kids learning platform with hundreds of activities, 
              interactive lessons, games, worksheets, and educational resources - everything your child needs!
            </p>
          </div>

          {/* Screenshot Gallery */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className="space-y-2">
              <img 
                src="/lovable-uploads/012a16e7-1d39-4676-911a-d55fc31ccf4c.png" 
                alt="Alphabet tracing activities"
                className="rounded-lg shadow-lg w-full h-40 object-cover transform hover:scale-105 transition-transform border-2 border-purple-200"
              />
              <p className="text-sm font-semibold text-gray-700 text-center">Alphabet Learning</p>
            </div>
            <div className="space-y-2">
              <img 
                src="/lovable-uploads/0cc9d733-7771-46ef-97e1-3c3208a21a21.png" 
                alt="Math worksheets"
                className="rounded-lg shadow-lg w-full h-40 object-cover transform hover:scale-105 transition-transform border-2 border-purple-200"
              />
              <p className="text-sm font-semibold text-gray-700 text-center">Math Practice</p>
            </div>
            <div className="space-y-2">
              <img 
                src="/lovable-uploads/5d136223-da36-45ba-9203-4822b9d6d04c.png" 
                alt="Emotions learning"
                className="rounded-lg shadow-lg w-full h-40 object-cover transform hover:scale-105 transition-transform border-2 border-purple-200"
              />
              <p className="text-sm font-semibold text-gray-700 text-center">Social Skills</p>
            </div>
            <div className="space-y-2">
              <img 
                src="/lovable-uploads/65f507f9-c4c2-46d8-94c8-ecc830938f3d.png" 
                alt="Interactive games"
                className="rounded-lg shadow-lg w-full h-40 object-cover transform hover:scale-105 transition-transform border-2 border-purple-200"
              />
              <p className="text-sm font-semibold text-gray-700 text-center">Fun Games</p>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 mb-6">
            <h4 className="text-xl font-bold text-gray-800 mb-4 text-center">What You Get:</h4>
            <div className="grid md:grid-cols-2 gap-4">
              <ul className="space-y-2">
                <li className="flex items-start gap-2">
                  <span className="text-xl">✅</span>
                  <span className="text-gray-700">200+ Interactive Worksheets</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-xl">✅</span>
                  <span className="text-gray-700">Educational Games & Puzzles</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-xl">✅</span>
                  <span className="text-gray-700">Story Books with Audio</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-xl">✅</span>
                  <span className="text-gray-700">AI Tutor for Help</span>
                </li>
              </ul>
              <ul className="space-y-2">
                <li className="flex items-start gap-2">
                  <span className="text-xl">✅</span>
                  <span className="text-gray-700">Curriculum-Based Lessons</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-xl">✅</span>
                  <span className="text-gray-700">Parent Progress Dashboard</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-xl">✅</span>
                  <span className="text-gray-700">Printable Resources</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-xl">✅</span>
                  <span className="text-gray-700">Regular New Content Updates</span>
                </li>
              </ul>
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
          </div>
        </Card>

        {/* Activity Categories */}
        <div className="mb-12">
          <h3 className="text-2xl font-bold text-gray-800 text-center mb-8">
            📚 Browse All Activity Categories
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {platformFeatures.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Card 
                  key={index}
                  className="bg-white p-4 hover:shadow-xl transition-all hover:-translate-y-1 border-2 border-purple-100"
                >
                  <img 
                    src={feature.image} 
                    alt={feature.title}
                    className="rounded-lg mb-3 w-full h-32 object-cover"
                  />
                  <div className="flex items-center gap-2 mb-2">
                    <div className="bg-gradient-to-br from-purple-400 to-pink-400 p-2 rounded-lg">
                      <Icon className="w-4 h-4 text-white" />
                    </div>
                    <h4 className="font-bold text-gray-800 text-sm">{feature.title}</h4>
                  </div>
                  <p className="text-gray-600 text-xs">{feature.description}</p>
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
