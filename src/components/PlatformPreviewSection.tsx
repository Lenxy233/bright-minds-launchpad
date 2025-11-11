import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowRight, BookOpen, Brain, Gamepad2, Sparkles } from "lucide-react";

interface PlatformPreviewSectionProps {
  onPurchase: () => void;
}

const PlatformPreviewSection = ({ onPurchase }: PlatformPreviewSectionProps) => {
  const features = [
    {
      icon: BookOpen,
      title: "Interactive Lessons",
      image: "/lovable-uploads/183b1358-a653-4eca-a1e9-bf9dc5a80101.png",
      description: "Engaging curriculum-based activities"
    },
    {
      icon: Brain,
      title: "AI-Powered Learning",
      image: "/lovable-uploads/39ffc0e5-e1bf-4850-9007-9b5ea749c08e.png",
      description: "Personalized educational experience"
    },
    {
      icon: Gamepad2,
      title: "Fun Games & Activities",
      image: "/lovable-uploads/4867bb56-b6bd-4d14-a909-681ab6214b9c.png",
      description: "Learning through play and exploration"
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
        <Card className="bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 p-8 md:p-12 border-4 border-purple-200 shadow-2xl mb-8">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <h3 className="text-3xl font-bold text-purple-800 mb-4">
                Interactive Learning Platform 🎓
              </h3>
              <p className="text-gray-700 text-lg mb-6">
                Your kids will love exploring our beautifully designed learning activities! 
                From alphabet tracing to math games, emotion recognition to storytelling - 
                everything is included and ready to use immediately after purchase.
              </p>
              <ul className="space-y-3 mb-6">
                <li className="flex items-start gap-2">
                  <span className="text-2xl">📚</span>
                  <span className="text-gray-700">Hundreds of printable worksheets & activities</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-2xl">🎮</span>
                  <span className="text-gray-700">Interactive games and puzzles</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-2xl">🤖</span>
                  <span className="text-gray-700">AI tutor for personalized help</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-2xl">📊</span>
                  <span className="text-gray-700">Track progress with parent dashboard</span>
                </li>
              </ul>
              <Button 
                onClick={onPurchase}
                size="lg"
                className="bg-gradient-to-r from-orange-400 to-pink-500 hover:from-orange-500 hover:to-pink-600 text-white font-bold text-lg px-8 py-6 rounded-full shadow-lg hover:shadow-xl transition-all"
              >
                Get Instant Access Now
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <img 
                src="/lovable-uploads/183b1358-a653-4eca-a1e9-bf9dc5a80101.png" 
                alt="Learning activity example"
                className="rounded-lg shadow-lg w-full h-auto transform hover:scale-105 transition-transform"
              />
              <img 
                src="/lovable-uploads/39ffc0e5-e1bf-4850-9007-9b5ea749c08e.png" 
                alt="Interactive game example"
                className="rounded-lg shadow-lg w-full h-auto transform hover:scale-105 transition-transform"
              />
              <img 
                src="/lovable-uploads/4867bb56-b6bd-4d14-a909-681ab6214b9c.png" 
                alt="Worksheet example"
                className="rounded-lg shadow-lg w-full h-auto transform hover:scale-105 transition-transform"
              />
              <img 
                src="/lovable-uploads/48ebe3e4-7806-452b-be6f-5e676cbd833d.png" 
                alt="Story activity example"
                className="rounded-lg shadow-lg w-full h-auto transform hover:scale-105 transition-transform"
              />
            </div>
          </div>
        </Card>

        {/* Feature Cards */}
        <div className="grid md:grid-cols-3 gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <Card 
                key={index}
                className="bg-white p-6 hover:shadow-xl transition-shadow border-2 border-purple-100"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="bg-gradient-to-br from-purple-400 to-pink-400 p-3 rounded-lg">
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <h4 className="font-bold text-gray-800 text-lg">{feature.title}</h4>
                </div>
                <img 
                  src={feature.image} 
                  alt={feature.title}
                  className="rounded-lg mb-3 w-full h-40 object-cover"
                />
                <p className="text-gray-600">{feature.description}</p>
              </Card>
            );
          })}
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
