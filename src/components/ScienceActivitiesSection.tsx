import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FlaskConical, TestTube, Microscope, Sparkles } from "lucide-react";

const ScienceActivitiesSection = () => {
  const handlePurchase = () => {
    window.open("https://buy.stripe.com/dRm4gz93DdYP5Ew3mLgMw07", "_blank");
  };

  return (
    <section className="py-20 px-4 bg-gradient-to-r from-green-100/60 via-blue-100/60 to-purple-100/60 backdrop-blur-sm relative">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-16">
          <h3 className="text-4xl font-bold mb-4 bg-gradient-to-r from-green-600 via-blue-600 to-purple-600 bg-clip-text text-transparent">
            🧪 Amazing Science Experiments at Home! 🔬
          </h3>
          <p className="text-xl text-gray-700 bg-white/50 backdrop-blur-sm rounded-2xl p-4 inline-block shadow-lg">
            Transform your kitchen into a magical science lab with 40+ simple experiments! ✨
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Image Section */}
          <div className="relative">
            <div className="bg-white/70 backdrop-blur-sm rounded-3xl p-6 shadow-xl border-4 border-dashed border-green-300">
              <img 
                src="/lovable-uploads/7713de76-ba70-4aed-9824-4d21f12d9617.png" 
                alt="Child making green slime science experiment"
                className="w-full h-auto rounded-2xl shadow-lg transform hover:scale-105 transition-all duration-300"
              />
              <div className="absolute -top-4 -right-4 bg-gradient-to-r from-yellow-400 to-orange-400 text-purple-800 font-bold text-sm px-4 py-2 rounded-full shadow-lg animate-bounce">
                🎯 Real Example!
              </div>
            </div>
          </div>

          {/* Content Section */}
          <div className="space-y-6">
            <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-lg border-2 border-green-300">
              <h4 className="text-2xl font-bold text-green-700 mb-4 flex items-center">
                <FlaskConical className="mr-3 text-green-600" />
                Homemade Slime & More! 🌟
              </h4>
              <p className="text-gray-700 text-lg leading-relaxed">
                Watch your child's eyes light up as they create colorful slime, erupting volcanoes, 
                and magical color-changing potions using simple household ingredients! 🎨
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Card className="bg-gradient-to-br from-blue-100 to-blue-200 border-2 border-blue-300 hover:shadow-lg transition-all duration-300">
                <CardContent className="p-4 text-center">
                  <TestTube className="mx-auto mb-2 text-blue-600" size={32} />
                  <p className="font-semibold text-blue-800">40+ Experiments</p>
                  <p className="text-sm text-blue-600">Easy & Safe</p>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-purple-100 to-purple-200 border-2 border-purple-300 hover:shadow-lg transition-all duration-300">
                <CardContent className="p-4 text-center">
                  <Microscope className="mx-auto mb-2 text-purple-600" size={32} />
                  <p className="font-semibold text-purple-800">STEM Learning</p>
                  <p className="text-sm text-purple-600">Hands-On Fun</p>
                </CardContent>
              </Card>
            </div>

            <div className="bg-gradient-to-r from-yellow-100 to-orange-100 rounded-2xl p-6 border-2 border-yellow-300 shadow-lg">
              <h5 className="text-lg font-bold text-orange-700 mb-3 flex items-center">
                <Sparkles className="mr-2 text-yellow-600" />
                What You'll Discover:
              </h5>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-center">
                  <span className="text-green-500 mr-2">🧪</span>
                  Create rainbow slime with different textures
                </li>
                <li className="flex items-center">
                  <span className="text-blue-500 mr-2">💥</span>
                  Make volcanoes erupt with safe ingredients
                </li>
                <li className="flex items-center">
                  <span className="text-purple-500 mr-2">🌈</span>
                  Mix magical color-changing potions
                </li>
                <li className="flex items-center">
                  <span className="text-pink-500 mr-2">✨</span>
                  Learn real science while having fun!
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="text-center mt-12">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 inline-block shadow-xl border-4 border-dashed border-green-400">
            <p className="text-2xl font-bold text-green-700 mb-2">
              🚀 Ready to Start Your Science Adventure? 🚀
            </p>
            <p className="text-gray-600 mb-4">
              Join thousands of families already having fun with science at home!
            </p>
            <Button 
              onClick={handlePurchase}
              size="lg" 
              className="bg-gradient-to-r from-green-500 via-blue-500 to-purple-500 hover:from-green-600 hover:via-blue-600 hover:to-purple-600 text-white text-lg px-8 py-4 rounded-full font-bold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
            >
              <FlaskConical className="mr-2 w-5 h-5" />
              Get Instant Access Now! ✨
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ScienceActivitiesSection;
