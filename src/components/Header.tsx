
import { Button } from "@/components/ui/button";
import { Sparkles, User } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useBrandingSettings } from "@/hooks/useBrandingSettings";
import LanguageSwitcher from "./LanguageSwitcher";
import { useTranslation } from "react-i18next";

interface HeaderProps {
  onPurchase: () => void;
}

const Header = ({ onPurchase }: HeaderProps) => {
  const { user } = useAuth();
  const { settings } = useBrandingSettings();
  const { t } = useTranslation();
  
  const platformName = settings?.platform_name || "Bright Minds Academy";
  const logoUrl = settings?.logo_url || "/lovable-uploads/69fc66c6-3b7b-4fa2-9348-5adcf71e90ee.png";

  const scrollToProducts = () => {
    const productsSection = document.querySelector('#products-section');
    if (productsSection) {
      productsSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className="bg-gradient-to-r from-pink-200/80 via-purple-200/80 to-blue-200/80 backdrop-blur-sm border-b border-purple-200 sticky top-0 z-50 shadow-lg">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="w-10 h-10 flex items-center justify-center bg-gradient-to-r from-pink-300 to-purple-300 rounded-full p-1 shadow-lg">
            <img 
              src={logoUrl}
              alt={`${platformName} Logo`}
              className="w-8 h-8 object-contain"
            />
          </div>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-pink-600 via-purple-600 via-blue-600 to-green-600 bg-clip-text text-transparent">
            {platformName}
          </h1>
          <Sparkles className="w-6 h-6 text-yellow-500 animate-pulse" />
        </div>
        
        <div className="flex items-center gap-2 md:gap-4">
          <LanguageSwitcher />
          <Button asChild variant="outline" className="flex items-center gap-2">
            <Link to="/learning-app">
              <Sparkles className="w-4 h-4" />
              <span className="hidden md:inline">{t('auth.kidsLearning', 'Kids Learning')}</span>
            </Link>
          </Button>
          {user && (
            <Button asChild variant="outline" className="flex items-center gap-2">
              <Link to="/dashboard">
                <User className="w-4 h-4" />
                <span className="hidden md:inline">{t('auth.dashboard')}</span>
              </Link>
            </Button>
          )}
          <Button onClick={scrollToProducts} className="bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 hover:from-pink-600 hover:via-purple-600 hover:to-blue-600 shadow-lg transform hover:scale-105 transition-all duration-300 animate-fade-in">
            <span className="hidden md:inline">{t('header.getStarted', 'Get Started Now')} ✨</span>
            <span className="md:hidden">✨</span>
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;
