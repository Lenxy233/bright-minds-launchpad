import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, BookOpen, Brain, Gamepad2, Video, Palette, Lightbulb, Rocket, CheckCircle, ArrowRight, Users, DollarSign, Clock, Instagram, Facebook, Youtube, Heart, Sparkles } from "lucide-react";
import CountdownTimer from "@/components/CountdownTimer";

const Index = () => {
  const handlePurchase = () => {
    // This would integrate with payment processing
    console.log("Purchase button clicked");
  };

  const handleSocialClick = (platform: string) => {
    // Replace these URLs with your actual social media accounts
    const socialUrls = {
      instagram: "https://instagram.com/brightmindsacademy",
      facebook: "https://facebook.com/brightmindsacademy", 
      youtube: "https://youtube.com/@brightmindsacademy"
    };
    
    window.open(socialUrls[platform as keyof typeof socialUrls], '_blank');
  };

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

  const benefits = [
    "Start your own educational brand with ease",
    "No experience required - everything is ready-made",
    "Sell on popular platforms: Amazon, Etsy, Gumroad, Fiverr",
    "Create your own YouTube educational channel",
    "PLR rights included - keep 100% profits",
    "Instant download - start immediately"
  ];

  const platforms = [
    { name: "Amazon", image: "/lovable-uploads/39ffc0e5-e1bf-4850-9007-9b5ea749c08e.png" },
    { name: "Etsy", image: "/lovable-uploads/bd50071c-c65b-4a99-b68f-e5f4952d9dc0.png" },
    { name: "Gumroad", image: "/lovable-uploads/7bf380e9-8171-4109-9722-47cd9ee4acb5.png" },
    { name: "Fiverr", image: "/lovable-uploads/5d136223-da36-45ba-9203-4822b9d6d04c.png" },
    { name: "YouTube", image: "/lovable-uploads/7a7b4288-9799-4063-b00e-78a922ef7431.png" },
    { name: "Shopify", image: "/lovable-uploads/e77596f7-8486-4a62-82bf-1e38750b33fc.png" }
  ];

  const reviews = [
    {
      name: "Sarah Johnson",
      role: "Teacher & Mom",
      rating: 5,
      comment: "This bundle is absolutely amazing! I started my own educational products store on Etsy and made my first $500 in just 2 weeks. The stories are beautifully illustrated and the kids love them!"
    },
    {
      name: "Mike Chen",
      role: "Entrepreneur",
      rating: 5,
      comment: "I was skeptical at first, but this bundle exceeded all my expectations. The quality is professional-grade and the PLR rights make it perfect for reselling. Already planning to expand to Amazon!"
    },
    {
      name: "Emily Rodriguez",
      role: "Homeschool Parent",
      rating: 5,
      comment: "Perfect for our homeschool curriculum! The variety of content keeps my kids engaged, and I love that I can customize everything. The science experiments are a huge hit!"
    },
    {
      name: "David Thompson",
      role: "YouTube Creator",
      rating: 5,
      comment: "The animated videos helped me launch my educational YouTube channel. Already have 10K subscribers and growing! The AI prompts are incredibly helpful for content creation."
    },
    {
      name: "Lisa Park",
      role: "Kindergarten Teacher",
      rating: 5,
      comment: "These resources have transformed my classroom! The interactive puzzles and games make learning so much fun. My students' parents are always asking where I get such great materials."
    },
    {
      name: "James Wilson",
      role: "Online Store Owner",
      rating: 5,
      comment: "Best investment I've made for my business! The bundle paid for itself within the first month. The ready-made products save me countless hours of content creation."
    }
  ];

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

      {/* Header */}
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
          <Button onClick={handlePurchase} className="bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 hover:from-pink-600 hover:via-purple-600 hover:to-blue-600 shadow-lg transform hover:scale-105 transition-all duration-300 animate-fade-in">
            Get Started Now ✨
          </Button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4 relative">
        <div className="container mx-auto text-center max-w-4xl">
          <Badge className="mb-6 bg-gradient-to-r from-pink-200 via-purple-200 to-blue-200 text-purple-800 border-purple-300 shadow-lg text-lg px-4 py-2 animate-bounce">
            🎉 Super Fun Limited Time Offer - 97% OFF! 🎊
          </Badge>
          <h2 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-pink-600 via-purple-600 via-blue-600 via-green-600 to-yellow-600 bg-clip-text text-transparent leading-tight">
            Start Your Own Educational Digital Products Brand
          </h2>
          <p className="text-xl text-gray-700 mb-8 leading-relaxed bg-white/40 backdrop-blur-sm rounded-2xl p-6 shadow-lg">
            🌟 Launch your educational business with our complete bundle of 200+ ready-made digital products! 
            From illustrated storybooks to interactive games - everything you need to succeed! 🚀
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
            <div className="text-center bg-gradient-to-r from-green-100 to-blue-100 p-6 rounded-3xl shadow-xl border-4 border-dashed border-green-300">
              <div className="flex items-center justify-center gap-2 mb-2">
                <span className="text-3xl line-through text-red-500 font-semibold">$1,827</span>
                <ArrowRight className="w-6 h-6 text-purple-500 animate-bounce" />
                <span className="text-5xl font-bold text-green-600">$47.99</span>
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
              onClick={handlePurchase} 
              size="lg" 
              className="bg-gradient-to-r from-pink-500 via-purple-500 via-blue-500 to-green-500 hover:from-pink-600 hover:via-purple-600 hover:via-blue-600 hover:to-green-600 text-lg px-8 py-4 rounded-full shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-110 animate-slide-in-right border-4 border-white"
            >
              🎯 Get Instant Access Now 🌟
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

      {/* What's Included Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-blue-100/60 via-purple-100/60 to-pink-100/60 backdrop-blur-sm relative">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h3 className="text-4xl font-bold mb-4 bg-gradient-to-r from-pink-600 via-purple-600 to-blue-600 bg-clip-text text-transparent">
              🎨 What's Included in Your Fun Bundle 🎪
            </h3>
            <p className="text-xl text-gray-700 bg-white/50 backdrop-blur-sm rounded-2xl p-4 inline-block shadow-lg">✨ Everything you need to launch your educational products business! 🚀</p>
          </div>

          {/* Full-width Image */}
          <div className="w-full mb-16">
            <img 
              src="/lovable-uploads/ea30b98c-47a6-4347-b9b6-39ffdce1a6b7.png" 
              alt="Educational bundle overview" 
              className="w-full h-auto object-contain rounded-3xl shadow-2xl max-h-96 border-4 border-gradient-to-r from-pink-300 to-purple-300"
            />
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

      {/* Benefits Section */}
      <section className="py-20 px-4 relative">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-16">
            <h3 className="text-4xl font-bold mb-4 bg-gradient-to-r from-green-600 via-blue-600 to-purple-600 bg-clip-text text-transparent">
              🌟 Why Choose Bright Minds Academy? 🎯
            </h3>
            <p className="text-xl text-gray-700 bg-white/50 backdrop-blur-sm rounded-2xl p-4 inline-block shadow-lg">🚀 Turn your passion for education into a profitable business! 💰</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-6">
              {benefits.map((benefit, index) => (
                <div key={index} className="flex items-start space-x-3 bg-white/60 backdrop-blur-sm rounded-2xl p-4 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 border-2 border-green-200">
                  <CheckCircle className="w-6 h-6 text-green-500 mt-1 flex-shrink-0 animate-pulse" />
                  <p className="text-gray-700 text-lg font-semibold">{benefit}</p>
                </div>
              ))}
            </div>
            <div className="bg-gradient-to-br from-purple-200 via-blue-200 to-green-200 rounded-3xl p-8 text-center shadow-xl border-4 border-dashed border-purple-300">
              <h4 className="text-2xl font-bold text-gray-800 mb-6">🎪 Start Selling On 🌈</h4>
              <div className="grid grid-cols-2 gap-4">
                {platforms.map((platform, index) => (
                  <div key={index} className="bg-white/80 rounded-2xl py-4 px-3 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 border-2 border-purple-200">
                    <img 
                      src={platform.image} 
                      alt={platform.name} 
                      className="w-full h-12 object-contain"
                    />
                  </div>
                ))}
              </div>
              <p className="text-gray-700 mt-6 text-sm font-bold">🎉 And many more platforms! 🌟</p>
            </div>
          </div>
        </div>
      </section>

      {/* Reviews Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-yellow-100/60 via-pink-100/60 to-purple-100/60 backdrop-blur-sm">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h3 className="text-4xl font-bold mb-4 bg-gradient-to-r from-pink-600 via-purple-600 to-blue-600 bg-clip-text text-transparent">
              💖 What Our Amazing Customers Say 🌟
            </h3>
            <p className="text-xl text-gray-700 bg-white/50 backdrop-blur-sm rounded-2xl p-4 inline-block shadow-lg">🎉 Join thousands of successful educators and entrepreneurs! 🚀</p>
            <div className="flex items-center justify-center gap-1 mt-4 bg-yellow-100 rounded-full p-3 inline-flex shadow-lg">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-6 h-6 fill-yellow-400 text-yellow-400 animate-bounce" style={{animationDelay: `${i * 0.1}s`}} />
              ))}
              <span className="ml-2 text-gray-700 font-bold">✨ 4.9/5 from 10,000+ reviews 🎯</span>
            </div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {reviews.map((review, index) => (
              <Card key={index} className="border-0 shadow-xl hover:shadow-2xl transition-all duration-300 bg-gradient-to-br from-white/90 to-yellow-50/90 backdrop-blur-sm rounded-3xl transform hover:scale-105 border-4 border-dashed border-yellow-200">
                <CardContent className="p-6">
                  <div className="flex items-center gap-1 mb-4 justify-center">
                    {[...Array(review.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400 animate-pulse" />
                    ))}
                  </div>
                  <p className="text-gray-700 mb-4 italic font-medium">"{review.comment}"</p>
                  <div className="border-t-2 border-dashed border-purple-200 pt-4">
                    <p className="font-bold text-gray-800">{review.name}</p>
                    <p className="text-sm text-purple-600 font-semibold">{review.role}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-pink-600 via-purple-600 via-blue-600 to-green-600 text-white relative overflow-hidden">
        {/* Playful background elements */}
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
              <span className="text-5xl font-bold ml-4">$47.99</span>
              <Sparkles className="inline-block w-8 h-8 ml-2 text-yellow-300 animate-spin" />
            </div>
            <p className="mb-6 opacity-90 font-bold text-lg">⏰ Limited time offer - Price increases soon! 🎯</p>
            <Button 
              onClick={handlePurchase} 
              size="lg" 
              className="bg-gradient-to-r from-yellow-400 via-orange-400 to-red-400 hover:from-yellow-500 hover:via-orange-500 hover:to-red-500 text-purple-800 hover:text-purple-900 text-lg px-12 py-4 rounded-full font-bold shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-110 animate-slide-in-right border-4 border-white"
            >
              🎯 Get Instant Access - $47.99 ✨
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </div>
          
          <p className="text-sm opacity-75 bg-white/10 backdrop-blur-sm rounded-full px-6 py-2 inline-block">
            🛡️ 30-day money-back guarantee • ⚡ Instant download • 💎 PLR rights included
          </p>
        </div>
      </section>

      {/* Footer */}
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
          
          {/* Social Media Buttons */}
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
          <p className="text-sm text-gray-400">© 2024 Bright Minds Academy. All rights reserved. ✨</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
