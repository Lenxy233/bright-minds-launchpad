
import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import PlatformPreviewSection from "@/components/PlatformPreviewSection";
import ProductsSection from "@/components/ProductsSection";
import AmazonKDPSection from "@/components/AmazonKDPSection";
import VideoSection from "@/components/VideoSection";
import ScienceActivitiesSection from "@/components/ScienceActivitiesSection";
import BenefitsSection from "@/components/BenefitsSection";
import ReviewsSection from "@/components/ReviewsSection";
import FAQSection from "@/components/FAQSection";
import CTASection from "@/components/CTASection";
import Footer from "@/components/Footer";
import PurchaseNotifications from "@/components/PurchaseNotifications";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const handlePurchase = () => {
    // Navigate to payment page where email is required
    navigate('/new-product-launch');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 via-purple-100 via-blue-100 via-green-100 to-yellow-100 relative overflow-hidden">
      {/* Playful floating elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 left-10 w-8 h-8 bg-gradient-to-r from-pink-400 to-red-400 rounded-full animate-bounce opacity-60"></div>
        <div className="absolute top-40 right-20 w-6 h-6 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full animate-pulse opacity-60"></div>
        <div className="absolute top-60 left-1/4 w-10 h-10 bg-gradient-to-r from-green-400 to-teal-400 rounded-full animate-bounce delay-300 opacity-60"></div>
        <div className="absolute bottom-40 right-1/4 w-12 h-12 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full animate-pulse delay-700 opacity-60"></div>
        <div className="absolute bottom-20 left-1/3 w-7 h-7 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full animate-bounce delay-500 opacity-60"></div>
      </div>

      <Header onPurchase={handlePurchase} />
      <HeroSection onPurchase={handlePurchase} />
      <PlatformPreviewSection onPurchase={handlePurchase} />
      <ProductsSection />
      <AmazonKDPSection />
      <VideoSection />
      <ScienceActivitiesSection />
      <BenefitsSection />
      <ReviewsSection />
      <FAQSection />
      <CTASection onPurchase={handlePurchase} />
      <Footer />

      {/* Purchase Notifications */}
      <PurchaseNotifications />
    </div>
  );
};

export default Index;
