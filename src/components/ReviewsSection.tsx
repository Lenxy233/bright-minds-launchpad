import { Card, CardContent } from "@/components/ui/card";
import { Star } from "lucide-react";
import { useEffect, useState } from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel";

const ReviewsSection = () => {
  const [api, setApi] = useState<CarouselApi>();

  useEffect(() => {
    if (!api) {
      return;
    }

    const interval = setInterval(() => {
      api.scrollNext();
    }, 3000); // Auto-advance every 3 seconds

    return () => clearInterval(interval);
  }, [api]);

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

        <Carousel
          setApi={setApi}
          opts={{
            align: "start",
            loop: true,
          }}
          className="w-full max-w-5xl mx-auto"
        >
          <CarouselContent className="-ml-2 md:-ml-4">
            {reviews.map((review, index) => (
              <CarouselItem key={index} className="pl-2 md:pl-4 md:basis-1/2 lg:basis-1/3">
                <Card className="border-0 shadow-xl hover:shadow-2xl transition-all duration-300 bg-gradient-to-br from-white/90 to-yellow-50/90 backdrop-blur-sm rounded-3xl transform hover:scale-105 border-4 border-dashed border-yellow-200 h-full">
                  <CardContent className="p-6 flex flex-col h-full">
                    <div className="flex items-center gap-1 mb-4 justify-center">
                      {[...Array(review.rating)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400 animate-pulse" />
                      ))}
                    </div>
                    <p className="text-gray-700 mb-4 italic font-medium flex-grow">"{review.comment}"</p>
                    <div className="border-t-2 border-dashed border-purple-200 pt-4">
                      <p className="font-bold text-gray-800">{review.name}</p>
                      <p className="text-sm text-purple-600 font-semibold">{review.role}</p>
                    </div>
                  </CardContent>
                </Card>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="bg-gradient-to-r from-pink-500 to-purple-500 text-white border-2 border-white shadow-lg hover:shadow-xl" />
          <CarouselNext className="bg-gradient-to-r from-purple-500 to-blue-500 text-white border-2 border-white shadow-lg hover:shadow-xl" />
        </Carousel>
      </div>
    </section>
  );
};

export default ReviewsSection;
