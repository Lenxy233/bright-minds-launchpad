import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Star, ArrowRight, Clock, Users, DollarSign, CheckCircle, Heart, GraduationCap, Home, ShoppingBag } from "lucide-react";
import CountdownTimer from "@/components/CountdownTimer";

interface HeroSectionProps {
  onPurchase: () => void;
}

const HeroSection = ({ onPurchase }: HeroSectionProps) => {
  const scrollToProducts = () => {
    const productsSection = document.querySelector('#products-section');
    if (productsSection) {
      productsSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="py-20 px-4 relative">
      <div className="container mx-auto text-center max-w-6xl">
        <Badge className="mb-6 bg-gradient-to-r from-pink-200 via-purple-200 to-blue-200 text-purple-800 border-purple-300 shadow-lg text-lg px-4 py-2 animate-bounce">
          🎉 Super Fun Limited Time Offer - 97% OFF! 🎊
        </Badge>
        
        <div className="grid lg:grid-cols-2 gap-12 items-center mb-8">
          <div className="text-left lg:text-left">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-pink-600 via-purple-600 via-blue-600 via-green-600 to-yellow-600 bg-clip-text text-transparent leading-tight">
              Start Your Own Educational Digital Products Brand
            </h2>
            <p className="text-xl text-gray-700 mb-8 leading-relaxed bg-white/40 backdrop-blur-sm rounded-2xl p-6 shadow-lg">
              🌟 Launch your educational business with our complete bundle of 200+ ready-made digital products! 
              From illustrated storybooks to interactive games - everything you need to succeed! 🚀
            </p>
          </div>
          
          <div className="relative">
            <div className="bg-gradient-to-br from-pink-200 via-purple-200 via-blue-200 to-green-200 rounded-3xl p-4 shadow-2xl border-4 border-dashed border-purple-300 transform hover:scale-105 transition-all duration-300">
              <img 
                src="/lovable-uploads/bbbd85ae-7ba7-4c79-a28c-1a6709f8a026.png" 
                alt="Creative child with colorful painted hands - representing educational creativity and fun learning" 
                className="w-full h-auto rounded-2xl shadow-lg"
              />
              <div className="absolute -top-4 -right-4 bg-gradient-to-r from-yellow-400 to-orange-400 text-purple-800 font-bold text-lg px-4 py-2 rounded-full shadow-lg animate-pulse border-2 border-white">
                🎨 Creativity Unleashed! ✨
              </div>
            </div>
          </div>
        </div>

        {/* Target Group Section */}
        <div className="mb-8 bg-white/50 backdrop-blur-sm rounded-3xl p-6 shadow-xl">
          <h3 className="text-2xl font-bold text-gray-800 mb-4">🎯 Perfect For</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-gradient-to-r from-blue-100 to-purple-100 rounded-2xl p-4 border-2 border-blue-200 transform hover:scale-105 transition-all duration-300">
              <GraduationCap className="w-8 h-8 text-blue-600 mx-auto mb-2" />
              <h4 className="font-bold text-gray-800 mb-1">👩‍🏫 Teachers</h4>
              <p className="text-sm text-gray-600">Create engaging classroom materials and supplementary resources</p>
            </div>
            <div className="bg-gradient-to-r from-green-100 to-teal-100 rounded-2xl p-4 border-2 border-green-200 transform hover:scale-105 transition-all duration-300">
              <Home className="w-8 h-8 text-green-600 mx-auto mb-2" />
              <h4 className="font-bold text-gray-800 mb-1">👨‍👩‍👧‍👦 Parents</h4>
              <p className="text-sm text-gray-600">Support your child's learning journey at home with fun activities</p>
            </div>
            <div className="bg-gradient-to-r from-orange-100 to-yellow-100 rounded-2xl p-4 border-2 border-orange-200 transform hover:scale-105 transition-all duration-300">
              <ShoppingBag className="w-8 h-8 text-orange-600 mx-auto mb-2" />
              <h4 className="font-bold text-gray-800 mb-1">📚 Book Sellers</h4>
              <p className="text-sm text-gray-600">Expand your inventory with digital educational products</p>
            </div>
          </div>
        </div>
        
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
          <div className="text-center bg-gradient-to-r from-green-100 to-blue-100 p-6 rounded-3xl shadow-xl border-4 border-dashed border-green-300">
            <div className="flex items-center justify-center gap-2 mb-2">
              <span className="text-3xl line-through text-red-500 font-semibold">$1,827</span>
              <ArrowRight className="w-6 h-6 text-purple-500 animate-bounce" />
              <span className="text-5xl font-bold text-green-600">$39</span>
              <Heart className="w-8 h-8 text-red-500 animate-pulse" />
            </div>
            <p className="text-sm text-gray-600 font-semibold">✨ One-time payment • 🚀 Instant access • 💎 PLR rights included</p>
          </div>
        </div>

        <div className="mb-8 bg-white/50 backdrop-blur-sm rounded-3xl p-6 shadow-xl">
          <CountdownTimer />
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
          <Button 
            onClick={onPurchase} 
            size="lg" 
            className="bg-gradient-to-r from-pink-500 via-purple-500 via-blue-500 to-green-500 hover:from-pink-600 hover:via-purple-600 hover:via-blue-600 hover:to-green-600 text-lg px-8 py-4 rounded-full shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-110 animate-slide-in-right border-4 border-white"
          >
            🎯 Get Instant Access Now ✨
            <ArrowRight className="ml-2 w-5 h-5" />
          </Button>
          <div className="flex items-center gap-1 text-yellow-500 bg-white/60 backdrop-blur-sm rounded-full px-4 py-2 shadow-lg">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-5 h-5 fill-current animate-pulse" style={{animationDelay: `${i * 0.2}s`}} />
            ))}
            <span className="ml-2 text-gray-700 text-sm font-bold">🎉 Trusted by 10,000+ educators</span>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto">
          <div className="text-center p-4 bg-gradient-to-r from-pink-200 to-purple-200 rounded-2xl backdrop-blur-sm shadow-lg transform hover:scale-105 transition-all duration-300 border-2 border-pink-300">
            <Clock className="w-8 h-8 text-purple-600 mx-auto mb-2 animate-spin" />
            <p className="font-bold text-gray-800">⚡ Instant Download</p>
          </div>
          <div className="text-center p-4 bg-gradient-to-r from-blue-200 to-green-200 rounded-2xl backdrop-blur-sm shadow-lg transform hover:scale-105 transition-all duration-300 border-2 border-blue-300">
            <Users className="w-8 h-8 text-blue-600 mx-auto mb-2 animate-bounce" />
            <p className="font-bold text-gray-800">👥 10,000+ Users</p>
          </div>
          <div className="text-center p-4 bg-gradient-to-r from-green-200 to-yellow-200 rounded-2xl backdrop-blur-sm shadow-lg transform hover:scale-105 transition-all duration-300 border-2 border-green-300">
            <DollarSign className="w-8 h-8 text-green-600 mx-auto mb-2 animate-pulse" />
            <p className="font-bold text-gray-800">💰 PLR Rights</p>
          </div>
          <div className="text-center p-4 bg-gradient-to-r from-yellow-200 to-pink-200 rounded-2xl backdrop-blur-sm shadow-lg transform hover:scale-105 transition-all duration-300 border-2 border-yellow-300">
            <CheckCircle className="w-8 h-8 text-pink-600 mx-auto mb-2 animate-bounce" />
            <p className="font-bold text-gray-800">🎁 Complete Bundle</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
