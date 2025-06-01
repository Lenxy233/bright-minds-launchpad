
import { Card, CardContent } from "@/components/ui/card";
import { BookOpen, Brain, Gamepad2, Video, Palette, Lightbulb, Rocket, DollarSign } from "lucide-react";

const ProductsSection = () => {
  const products = [
    { icon: BookOpen, title: "200 Ready-Made Illustrated Stories", description: "Professionally crafted stories ready for publishing" },
    { icon: Brain, title: "50+ Brain-Boosting Riddles", description: "Engaging puzzles to enhance critical thinking" },
    { icon: Gamepad2, title: "10+ Interactive Puzzles", description: "Fun digital puzzles for learning" },
    { icon: Video, title: "Animated Videos", description: "High-quality educational video content" },
    { icon: Palette, title: "Build-Your-Own Book Template", description: "Customizable templates for creating unique books" },
    { icon: Brain, title: "Kindergarten Curriculum Resources", description: "Complete curriculum materials for early learners" },
    { icon: Lightbulb, title: "600 AI Prompts for ChatGPT & MidJourney", description: "AI-powered content creation tools" },
    { icon: Gamepad2, title: "10+ No-Code Online Games", description: "Ready-to-use educational games" },
    { icon: Rocket, title: "40+ Simple Home Science Experiments", description: "Hands-on learning activities" },
    { icon: Video, title: "Editable Animated YouTube Videos", description: "Kid-friendly content for YouTube channels" },
    { icon: Rocket, title: "Introduction to Robotics", description: "STEM education resources" },
    { icon: DollarSign, title: "PLR Rights Included", description: "Commercial license to sell products" }
  ];

  return (
    <section className="py-20 px-4 bg-gradient-to-r from-blue-100/60 via-purple-100/60 to-pink-100/60 backdrop-blur-sm relative">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-16">
          <h3 className="text-4xl font-bold mb-4 bg-gradient-to-r from-pink-600 via-purple-600 to-blue-600 bg-clip-text text-transparent">
            🎨 What's Included in Your Fun Bundle 🎪
          </h3>
          <p className="text-xl text-gray-700 bg-white/50 backdrop-blur-sm rounded-2xl p-4 inline-block shadow-lg">✨ Everything you need to launch your educational products business! 🚀</p>
        </div>

        <div className="w-full mb-16">
          <img 
            src="/lovable-uploads/ea30b98c-47a6-4347-b9b6-39ffdce1a6b7.png" 
            alt="Educational bundle overview" 
            className="w-full h-auto object-contain rounded-3xl shadow-2xl max-h-96 border-4 border-gradient-to-r from-pink-300 to-purple-300"
          />
        </div>

        {/* Product Preview Section */}
        <div className="mb-16 bg-white/70 backdrop-blur-sm rounded-3xl p-8 shadow-xl border-4 border-dashed border-purple-300">
          <div className="text-center mb-8">
            <h4 className="text-3xl font-bold mb-4 bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent">
              🌟 Sneak Peak of what the package entails 🎀
            </h4>
            <p className="text-lg text-gray-700 bg-gradient-to-r from-pink-100 to-purple-100 rounded-2xl p-4 inline-block shadow-lg">
              Get a glimpse of the amazing content and designs your customers will love! 💕
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div className="bg-gradient-to-br from-pink-200 via-purple-200 to-blue-200 rounded-3xl p-6 shadow-2xl border-4 border-dashed border-pink-300 transform hover:scale-105 transition-all duration-300">
              <img 
                src="/lovable-uploads/b8e1d193-75c4-4a39-acb6-8eeadf659c61.png" 
                alt="Scissors cutting skill activities and educational materials" 
                className="w-full h-auto rounded-2xl shadow-lg"
              />
              <div className="mt-4 text-center">
                <div className="bg-gradient-to-r from-pink-400 to-purple-400 text-white font-bold text-lg px-4 py-2 rounded-full shadow-lg inline-block border-2 border-white">
                  ✂️ Scissors Cutting Skill ✂️
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-purple-200 via-blue-200 to-green-200 rounded-3xl p-6 shadow-2xl border-4 border-dashed border-blue-300 transform hover:scale-105 transition-all duration-300">
              <img 
                src="/lovable-uploads/0cc9d733-7771-46ef-97e1-3c3208a21a21.png" 
                alt="Colouring books design templates and illustrations for kids" 
                className="w-full h-auto rounded-2xl shadow-lg"
              />
              <div className="mt-4 text-center">
                <div className="bg-gradient-to-r from-blue-400 to-green-400 text-white font-bold text-lg px-4 py-2 rounded-full shadow-lg inline-block border-2 border-white">
                  🎨 Colouring Books Design 🖍️
                </div>
              </div>
            </div>
          </div>
          
          <div className="text-center mt-8">
            <p className="text-gray-600 text-lg bg-yellow-100 rounded-2xl p-4 inline-block shadow-lg border-2 border-yellow-300">
              🎨 <strong>Plus hundreds more</strong> activities, stories, games, and educational materials! 🌈
            </p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product, index) => (
            <Card key={index} className="border-0 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 bg-gradient-to-br from-white/90 to-purple-50/90 backdrop-blur-sm rounded-3xl border-4 border-dashed border-purple-200 hover:border-pink-300">
              <CardContent className="p-6">
                <div className="flex items-start space-x-4">
                  <div className={`p-3 rounded-2xl shadow-lg ${
                    index % 6 === 0 ? 'bg-gradient-to-r from-pink-200 to-purple-200' :
                    index % 6 === 1 ? 'bg-gradient-to-r from-blue-200 to-green-200' :
                    index % 6 === 2 ? 'bg-gradient-to-r from-green-200 to-yellow-200' :
                    index % 6 === 3 ? 'bg-gradient-to-r from-yellow-200 to-orange-200' :
                    index % 6 === 4 ? 'bg-gradient-to-r from-orange-200 to-red-200' :
                    'bg-gradient-to-r from-purple-200 to-pink-200'
                  }`}>
                    <product.icon className="w-6 h-6 text-purple-700" />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-800 mb-2 text-lg">{product.title}</h4>
                    <p className="text-gray-600 text-sm">{product.description}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProductsSection;
