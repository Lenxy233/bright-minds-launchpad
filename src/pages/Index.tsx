import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, BookOpen, Brain, Gamepad2, Video, Palette, Lightbulb, Rocket, CheckCircle, ArrowRight, Users, DollarSign, Clock } from "lucide-react";

const Index = () => {
  const handlePurchase = () => {
    // This would integrate with payment processing
    console.log("Purchase button clicked");
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
    { icon: DollarSign, title: "Reseller Rights Included", description: "Commercial license to sell products" }
  ];

  const benefits = [
    "Start your own educational brand with ease",
    "No experience required - everything is ready-made",
    "Sell on popular platforms: Amazon, Etsy, Gumroad, Fiverr",
    "Create your own YouTube educational channel",
    "Commercial rights included - keep 100% profits",
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-purple-100 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg flex items-center justify-center">
              <Brain className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              Bright Minds Academy
            </h1>
          </div>
          <Button onClick={handlePurchase} className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700">
            Get Started Now
          </Button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center max-w-4xl">
          <Badge className="mb-6 bg-gradient-to-r from-purple-100 to-blue-100 text-purple-700 border-purple-200">
            🎉 Limited Time Offer - 97% OFF!
          </Badge>
          <h2 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-purple-600 via-blue-600 to-pink-600 bg-clip-text text-transparent leading-tight">
            Start Your Own Educational Digital Products Brand
          </h2>
          <p className="text-xl text-gray-700 mb-8 leading-relaxed">
            Launch your educational business with our complete bundle of 200+ ready-made digital products. 
            From illustrated storybooks to interactive games - everything you need to succeed!
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <span className="text-3xl line-through text-gray-400">$1,827</span>
                <ArrowRight className="w-6 h-6 text-purple-500" />
                <span className="text-5xl font-bold text-green-600">$47.99</span>
              </div>
              <p className="text-sm text-gray-600">One-time payment • Instant access • Commercial rights included</p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            <Button 
              onClick={handlePurchase} 
              size="lg" 
              className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-lg px-8 py-4 rounded-full shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
            >
              Get Instant Access Now
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
            <div className="flex items-center gap-1 text-yellow-500">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-5 h-5 fill-current" />
              ))}
              <span className="ml-2 text-gray-600 text-sm">Trusted by 10,000+ educators</span>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto">
            <div className="text-center p-4 bg-white/60 rounded-lg backdrop-blur-sm">
              <Clock className="w-8 h-8 text-purple-500 mx-auto mb-2" />
              <p className="font-semibold text-gray-700">Instant Download</p>
            </div>
            <div className="text-center p-4 bg-white/60 rounded-lg backdrop-blur-sm">
              <Users className="w-8 h-8 text-blue-500 mx-auto mb-2" />
              <p className="font-semibold text-gray-700">10,000+ Users</p>
            </div>
            <div className="text-center p-4 bg-white/60 rounded-lg backdrop-blur-sm">
              <DollarSign className="w-8 h-8 text-green-500 mx-auto mb-2" />
              <p className="font-semibold text-gray-700">Commercial Rights</p>
            </div>
            <div className="text-center p-4 bg-white/60 rounded-lg backdrop-blur-sm">
              <CheckCircle className="w-8 h-8 text-pink-500 mx-auto mb-2" />
              <p className="font-semibold text-gray-700">Complete Bundle</p>
            </div>
          </div>
        </div>
      </section>

      {/* What's Included Section */}
      <section className="py-20 px-4 bg-white/40 backdrop-blur-sm">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h3 className="text-4xl font-bold mb-4 bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              What's Included in Your Bundle
            </h3>
            <p className="text-xl text-gray-700">Everything you need to launch your educational products business</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product, index) => (
              <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 bg-white/80 backdrop-blur-sm">
                <CardContent className="p-6">
                  <div className="flex items-start space-x-4">
                    <div className="p-3 bg-gradient-to-r from-purple-100 to-blue-100 rounded-lg">
                      <product.icon className="w-6 h-6 text-purple-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-800 mb-2">{product.title}</h4>
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
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-16">
            <h3 className="text-4xl font-bold mb-4 bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              Why Choose Bright Minds Academy?
            </h3>
            <p className="text-xl text-gray-700">Turn your passion for education into a profitable business</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-6">
              {benefits.map((benefit, index) => (
                <div key={index} className="flex items-start space-x-3">
                  <CheckCircle className="w-6 h-6 text-green-500 mt-1 flex-shrink-0" />
                  <p className="text-gray-700 text-lg">{benefit}</p>
                </div>
              ))}
            </div>
            <div className="bg-gradient-to-br from-purple-100 to-blue-100 rounded-2xl p-8 text-center">
              <h4 className="text-2xl font-bold text-gray-800 mb-6">Start Selling On</h4>
              <div className="grid grid-cols-2 gap-4">
                {platforms.map((platform, index) => (
                  <div key={index} className="bg-white rounded-lg py-4 px-3 shadow-sm hover:shadow-md transition-shadow">
                    <img 
                      src={platform.image} 
                      alt={platform.name} 
                      className="w-full h-12 object-contain"
                    />
                  </div>
                ))}
              </div>
              <p className="text-gray-600 mt-6 text-sm">And many more platforms!</p>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white">
        <div className="container mx-auto text-center max-w-4xl">
          <h3 className="text-4xl font-bold mb-6">
            Ready to Start Your Educational Empire?
          </h3>
          <p className="text-xl mb-8 opacity-90">
            Join thousands of successful entrepreneurs who've launched their educational brands with our proven system.
          </p>
          
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 mb-8">
            <div className="text-center mb-6">
              <span className="text-2xl line-through opacity-60">$1,827</span>
              <span className="text-5xl font-bold ml-4">$47.99</span>
            </div>
            <p className="mb-6 opacity-90">⏰ Limited time offer - Price increases soon!</p>
            <Button 
              onClick={handlePurchase} 
              size="lg" 
              className="bg-white text-purple-600 hover:bg-gray-100 text-lg px-12 py-4 rounded-full font-bold shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
            >
              Get Instant Access - $47.99
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </div>
          
          <p className="text-sm opacity-75">
            30-day money-back guarantee • Instant download • Commercial rights included
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 px-4">
        <div className="container mx-auto text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg flex items-center justify-center">
              <Brain className="w-5 h-5 text-white" />
            </div>
            <h4 className="text-xl font-bold">Bright Minds Academy</h4>
          </div>
          <p className="text-gray-400 mb-4">Empowering the next generation through innovative educational products</p>
          <p className="text-sm text-gray-500">© 2024 Bright Minds Academy. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
