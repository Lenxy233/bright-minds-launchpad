
import { Button } from "@/components/ui/button";
import { Instagram, Facebook, Youtube, Heart } from "lucide-react";
import { Link } from "react-router-dom";

const Footer = () => {
  const handleSocialClick = (platform: string) => {
    const socialUrls = {
      instagram: "https://instagram.com/brightmindsacademy",
      facebook: "https://facebook.com/brightmindsacademy", 
      youtube: "https://youtube.com/@brightmindsacademy"
    };
    
    window.open(socialUrls[platform as keyof typeof socialUrls], '_blank');
  };

  return (
    <footer className="bg-gradient-to-r from-purple-900 via-blue-900 to-green-900 text-white py-12 px-4">
      <div className="container mx-auto text-center">
        <div className="flex items-center justify-center space-x-2 mb-4">
          <div className="w-8 h-8 flex items-center justify-center bg-gradient-to-r from-pink-400 to-purple-400 rounded-full p-1 shadow-lg">
            <img 
              src="/lovable-uploads/69fc66c6-3b7b-4fa2-9348-5adcf71e90ee.png" 
              alt="Bright Minds Academy Logo" 
              className="w-6 h-6 object-contain"
            />
          </div>
          <h4 className="text-xl font-bold bg-gradient-to-r from-yellow-300 to-pink-300 bg-clip-text text-transparent">Bright Minds Academy</h4>
          <Heart className="w-6 h-6 text-red-400 animate-pulse" />
        </div>
        
        <div className="flex justify-center space-x-4 mb-6">
          <Button
            onClick={() => handleSocialClick('instagram')}
            variant="outline"
            size="icon"
            className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 border-0 text-white hover:text-white transition-all duration-300 transform hover:scale-110 shadow-lg rounded-full"
          >
            <Instagram className="w-5 h-5" />
          </Button>
          <Button
            onClick={() => handleSocialClick('facebook')}
            variant="outline"
            size="icon"
            className="bg-blue-600 hover:bg-blue-700 border-0 text-white hover:text-white transition-all duration-300 transform hover:scale-110 shadow-lg rounded-full"
          >
            <Facebook className="w-5 h-5" />
          </Button>
          <Button
            onClick={() => handleSocialClick('youtube')}
            variant="outline"
            size="icon"
            className="bg-red-600 hover:bg-red-700 border-0 text-white hover:text-white transition-all duration-300 transform hover:scale-110 shadow-lg rounded-full"
          >
            <Youtube className="w-5 h-5" />
          </Button>
        </div>
        
        <p className="text-gray-300 mb-4 font-semibold">🌟 Empowering the next generation through innovative educational products 🎨</p>
        
        <div className="mb-4 space-y-2">
          <Link 
            to="/legal#privacy-policy" 
            className="text-gray-300 hover:text-white underline text-sm transition-colors block"
          >
            Privacy Policy
          </Link>
          <Link 
            to="/legal#data-protection-policy" 
            className="text-gray-300 hover:text-white underline text-sm transition-colors block"
          >
            Data Protection Policy
          </Link>
          <Link 
            to="/legal#terms-and-conditions" 
            className="text-gray-300 hover:text-white underline text-sm transition-colors block"
          >
            Terms & Conditions
          </Link>
        </div>
        
        <p className="text-sm text-gray-400">© 2024 Bright Minds Academy. All rights reserved. ✨</p>
      </div>
    </footer>
  );
};

export default Footer;
