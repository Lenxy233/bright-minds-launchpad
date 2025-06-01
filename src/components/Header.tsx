
import { Button } from "@/components/ui/button";
import { Sparkles } from "lucide-react";

interface HeaderProps {
  onPurchase: () => void;
}

const Header = ({ onPurchase }: HeaderProps) => {
  return (
    <header className="bg-gradient-to-r from-pink-200/80 via-purple-200/80 to-blue-200/80 backdrop-blur-sm border-b border-purple-200 sticky top-0 z-50 shadow-lg">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="w-10 h-10 flex items-center justify-center bg-gradient-to-r from-pink-300 to-purple-300 rounded-full p-1 shadow-lg">
            <img 
              src="/lovable-uploads/69fc66c6-3b7b-4fa2-9348-5adcf71e90ee.png" 
              alt="Bright Minds Academy Logo" 
              className="w-8 h-8 object-contain"
            />
          </div>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-pink-600 via-purple-600 via-blue-600 to-green-600 bg-clip-text text-transparent">
            Bright Minds Academy
          </h1>
          <Sparkles className="w-6 h-6 text-yellow-500 animate-pulse" />
        </div>
        <Button onClick={onPurchase} className="bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 hover:from-pink-600 hover:via-purple-600 hover:to-blue-600 shadow-lg transform hover:scale-105 transition-all duration-300 animate-fade-in">
          Get Started Now ✨
        </Button>
      </div>
    </header>
  );
};

export default Header;
