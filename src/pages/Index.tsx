
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
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { useState } from "react";

const Index = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [processing, setProcessing] = useState(false);

  const handlePurchase = async () => {
    if (processing) return;
    
    setProcessing(true);
    try {
      const { data, error } = await supabase.functions.invoke('create-checkout-session', {
        body: {
          email: user?.email || '',
          userId: user?.id || '',
          bundleType: 'bma-bundle'
        }
      });

      if (error) throw error;

      if (data?.url) {
        window.location.href = data.url;
      }
    } catch (error: any) {
      console.error('Error creating checkout session:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to start checkout process",
        variant: "destructive",
      });
    } finally {
      setProcessing(false);
    }
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
