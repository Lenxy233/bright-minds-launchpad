
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";

interface CTASectionProps {
  onPurchase: () => void;
}

const CTASection = ({ onPurchase }: CTASectionProps) => {
  return (
    <section className="py-20 px-4 bg-gradient-to-r from-pink-600 via-purple-600 via-blue-600 to-green-600 text-white relative overflow-hidden">
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-10 left-10 w-20 h-20 bg-yellow-300 rounded-full animate-bounce"></div>
        <div className="absolute bottom-10 right-10 w-16 h-16 bg-pink-300 rounded-full animate-pulse"></div>
        <div className="absolute top-1/2 left-1/4 w-12 h-12 bg-green-300 rounded-full animate-bounce delay-300"></div>
      </div>
      
      <div className="container mx-auto text-center max-w-4xl relative z-10">
        <h3 className="text-4xl font-bold mb-6">
          🚀 Ready to Start Your Educational Empire? 🌟
        </h3>
        <p className="text-xl mb-8 opacity-90">
          🎉 Join thousands of successful entrepreneurs who've launched their educational brands with our proven system! 💫
        </p>
        
        <div className="bg-white/20 backdrop-blur-sm rounded-3xl p-8 mb-8 border-4 border-dashed border-white/40 shadow-2xl">
          <div className="text-center mb-6">
            <span className="text-2xl line-through opacity-60 text-red-200">$1,827</span>
            <span className="text-5xl font-bold ml-4">$25</span>
            <Sparkles className="inline-block w-8 h-8 ml-2 text-yellow-300 animate-spin" />
          </div>
          <p className="mb-6 opacity-90 font-bold text-lg">⏰ Limited time offer - Price increases soon! 🎯</p>
          <Button 
            onClick={onPurchase} 
            size="lg" 
            className="bg-gradient-to-r from-yellow-400 via-orange-400 to-red-400 hover:from-yellow-500 hover:via-orange-500 hover:to-red-500 text-purple-800 hover:text-purple-900 text-lg px-12 py-4 rounded-full font-bold shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-110 animate-slide-in-right border-4 border-white"
          >
            🎯 Get Instant Access - $25 ✨
            <ArrowRight className="ml-2 w-5 h-5" />
          </Button>
        </div>
        
        <p className="text-sm opacity-75 bg-white/10 backdrop-blur-sm rounded-full px-6 py-2 inline-block">
          🛡️ 30-day money-back guarantee • ⚡ Instant download • 💎 PLR rights included
        </p>
      </div>
    </section>
  );
};

export default CTASection;
