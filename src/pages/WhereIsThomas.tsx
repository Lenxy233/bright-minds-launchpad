import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft, Globe, MapPin, Users, Languages, Utensils, Coins, Shirt, MessageCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import thomasCharacter from "@/assets/geography/thomas-character.jpg";
import franceEiffel from "@/assets/geography/france-eiffel.jpg";
import chinaWall from "@/assets/geography/china-wall.jpg";
import usaLiberty from "@/assets/geography/usa-liberty.jpg";
import egyptPyramids from "@/assets/geography/egypt-pyramids.jpg";
import ukBigBen from "@/assets/geography/uk-bigben.jpg";
import indiaTajMahal from "@/assets/geography/india-tajmahal.jpg";
import australiaOpera from "@/assets/geography/australia-opera.jpg";
import brazilChrist from "@/assets/geography/brazil-christ.jpg";

type Country = {
  name: string;
  flag: string;
  language: string;
  capital: string;
  landmark: string;
  landmarkImage: string;
  funFact: string;
  greeting: string;
  people: string;
  color: string;
  food: string;
  currency: string;
  clothing: string;
  introduction: string;
};

const WhereIsThomas = () => {
  const navigate = useNavigate();
  const [selectedCountry, setSelectedCountry] = useState<Country | null>(null);
  const [showThomas, setShowThomas] = useState(true);

  const countries: Country[] = [
    {
      name: "France",
      flag: "🇫🇷",
      language: "French",
      capital: "Paris",
      landmark: "Eiffel Tower",
      landmarkImage: franceEiffel,
      funFact: "France is famous for croissants and the Eiffel Tower!",
      greeting: "Bonjour! (Hello!)",
      people: "French people love art, food, and culture",
      color: "from-blue-400 to-red-400",
      food: "Croissants, Baguettes, and Cheese 🥐",
      currency: "Euro (€)",
      clothing: "Berets and Striped Shirts",
      introduction: "Je m'appelle... (My name is...)"
    },
    {
      name: "China",
      flag: "🇨🇳",
      language: "Mandarin Chinese",
      capital: "Beijing",
      landmark: "Great Wall of China",
      landmarkImage: chinaWall,
      funFact: "The Great Wall is so long, it can be seen from space!",
      greeting: "Nǐ hǎo! (Hello!)",
      people: "Chinese people celebrate with dragons and lanterns",
      color: "from-red-400 to-yellow-400",
      food: "Dumplings, Noodles, and Rice 🥟",
      currency: "Yuan (¥)",
      clothing: "Traditional Cheongsam and Hanfu",
      introduction: "Wǒ jiào... (I am called...)"
    },
    {
      name: "United States",
      flag: "🇺🇸",
      language: "English",
      capital: "Washington D.C.",
      landmark: "Statue of Liberty",
      landmarkImage: usaLiberty,
      funFact: "The Statue of Liberty was a gift from France!",
      greeting: "Hello!",
      people: "Americans love baseball and hamburgers",
      color: "from-blue-500 to-red-500",
      food: "Hamburgers, Hot Dogs, and Apple Pie 🍔",
      currency: "US Dollar ($)",
      clothing: "Jeans and Cowboy Hats",
      introduction: "My name is... Nice to meet you!"
    },
    {
      name: "Egypt",
      flag: "🇪🇬",
      language: "Arabic",
      capital: "Cairo",
      landmark: "The Pyramids",
      landmarkImage: egyptPyramids,
      funFact: "The pyramids were built over 4,500 years ago!",
      greeting: "Marhaba! (Hello!)",
      people: "Ancient Egyptians built amazing pyramids and temples",
      color: "from-yellow-400 to-orange-500",
      food: "Falafel, Koshari, and Pita Bread 🥙",
      currency: "Egyptian Pound (E£)",
      clothing: "Galabeya Robes",
      introduction: "Ana ismi... (My name is...)"
    },
    {
      name: "United Kingdom",
      flag: "🇬🇧",
      language: "English",
      capital: "London",
      landmark: "Big Ben",
      landmarkImage: ukBigBen,
      funFact: "Big Ben is actually the name of the bell, not the tower!",
      greeting: "Hello!",
      people: "British people love tea and have a royal family",
      color: "from-blue-600 to-red-600",
      food: "Fish and Chips, Tea, and Scones 🫖",
      currency: "British Pound (£)",
      clothing: "Tartan Kilts and Bowler Hats",
      introduction: "I'm... Lovely to meet you!"
    },
    {
      name: "India",
      flag: "🇮🇳",
      language: "Hindi",
      capital: "New Delhi",
      landmark: "Taj Mahal",
      landmarkImage: indiaTajMahal,
      funFact: "The Taj Mahal is made of beautiful white marble!",
      greeting: "Namaste! (Hello!)",
      people: "Indian people celebrate colorful festivals like Holi",
      color: "from-orange-500 to-green-500",
      food: "Curry, Naan Bread, and Samosas 🍛",
      currency: "Indian Rupee (₹)",
      clothing: "Colorful Saris and Turbans",
      introduction: "Mera naam... hai (My name is...)"
    },
    {
      name: "Australia",
      flag: "🇦🇺",
      language: "English",
      capital: "Canberra",
      landmark: "Sydney Opera House",
      landmarkImage: australiaOpera,
      funFact: "Australia has kangaroos and koalas!",
      greeting: "G'day! (Hello!)",
      people: "Australians love beaches and surfing",
      color: "from-blue-400 to-yellow-400",
      food: "Meat Pies, Vegemite, and Tim Tams 🥧",
      currency: "Australian Dollar ($)",
      clothing: "Cork Hats and Outback Gear",
      introduction: "I'm... G'day mate!"
    },
    {
      name: "Brazil",
      flag: "🇧🇷",
      language: "Portuguese",
      capital: "Brasília",
      landmark: "Christ the Redeemer",
      landmarkImage: brazilChrist,
      funFact: "Brazil has the biggest rainforest in the world!",
      greeting: "Olá! (Hello!)",
      people: "Brazilians love soccer and carnival celebrations",
      color: "from-green-500 to-yellow-500",
      food: "Feijoada, Açaí Bowls, and Brigadeiro 🍲",
      currency: "Brazilian Real (R$)",
      clothing: "Colorful Carnival Costumes",
      introduction: "Meu nome é... (My name is...)"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-green-50 to-yellow-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-blue-100 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              onClick={() => navigate("/learning-app")}
              className="gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Learning
            </Button>
            <div className="flex items-center gap-2">
              <Globe className="w-8 h-8 text-blue-600" />
              <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
                Where in the World is Thomas?
              </h1>
            </div>
            <div className="w-32" />
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Thomas Introduction */}
        {showThomas && !selectedCountry && (
          <div className="max-w-4xl mx-auto mb-8 text-center animate-in fade-in slide-in-from-top">
            <Card className="p-8 bg-gradient-to-r from-blue-100 to-green-100 border-4 border-blue-300">
              <img
                src={thomasCharacter}
                alt="Thomas the Explorer"
                className="w-32 h-32 mx-auto mb-4 rounded-full border-4 border-white shadow-lg"
              />
              <h2 className="text-3xl font-bold text-gray-800 mb-4">
                Hi! I'm Thomas the Explorer! 🗺️
              </h2>
              <p className="text-xl text-gray-700 mb-6">
                I love traveling around the world! Let's explore different countries together.
                Click on a country below to learn about the people, language, and famous places!
              </p>
              <Button
                onClick={() => setShowThomas(false)}
                className="bg-gradient-to-r from-blue-500 to-green-500 hover:from-blue-600 hover:to-green-600"
                size="lg"
              >
                Let's Explore! 🌍
              </Button>
            </Card>
          </div>
        )}

        {/* Country Selection Grid */}
        {!selectedCountry && !showThomas && (
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-center mb-8 text-gray-800">
              Choose a Country to Visit!
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {countries.map((country, index) => (
                <Card
                  key={index}
                  onClick={() => setSelectedCountry(country)}
                  className={`cursor-pointer hover:scale-105 transition-all duration-300 p-6 bg-gradient-to-br ${country.color} border-4 border-white shadow-xl hover:shadow-2xl`}
                >
                  <div className="text-center">
                    <div className="text-6xl mb-3">{country.flag}</div>
                    <h3 className="text-xl font-bold text-white drop-shadow-lg">
                      {country.name}
                    </h3>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Country Details */}
        {selectedCountry && (
          <div className="max-w-6xl mx-auto animate-in fade-in slide-in-from-right">
            <Button
              onClick={() => setSelectedCountry(null)}
              className="mb-6"
              variant="outline"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Map
            </Button>

            <Card className="p-8 bg-white/90 backdrop-blur-sm border-4 border-blue-200">
              {/* Header */}
              <div className="text-center mb-8">
                <div className="text-8xl mb-4">{selectedCountry.flag}</div>
                <h2 className="text-4xl font-bold text-gray-800 mb-2">
                  Welcome to {selectedCountry.name}!
                </h2>
                <p className="text-2xl text-primary font-semibold">
                  {selectedCountry.greeting}
                </p>
              </div>

              {/* Landmark Image */}
              <div className="mb-8">
                <img
                  src={selectedCountry.landmarkImage}
                  alt={selectedCountry.landmark}
                  className="w-full h-64 object-cover rounded-xl shadow-lg"
                />
              </div>

              {/* Information Grid */}
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                <Card className="p-6 bg-blue-50 border-2 border-blue-200">
                  <div className="flex items-start gap-3">
                    <MapPin className="w-8 h-8 text-blue-600 flex-shrink-0" />
                    <div>
                      <h3 className="font-bold text-lg mb-2 text-gray-800">Capital City</h3>
                      <p className="text-gray-700 text-xl">{selectedCountry.capital}</p>
                    </div>
                  </div>
                </Card>

                <Card className="p-6 bg-green-50 border-2 border-green-200">
                  <div className="flex items-start gap-3">
                    <Languages className="w-8 h-8 text-green-600 flex-shrink-0" />
                    <div>
                      <h3 className="font-bold text-lg mb-2 text-gray-800">Language</h3>
                      <p className="text-gray-700 text-xl">{selectedCountry.language}</p>
                    </div>
                  </div>
                </Card>

                <Card className="p-6 bg-purple-50 border-2 border-purple-200">
                  <div className="flex items-start gap-3">
                    <Globe className="w-8 h-8 text-purple-600 flex-shrink-0" />
                    <div>
                      <h3 className="font-bold text-lg mb-2 text-gray-800">Monument</h3>
                      <p className="text-gray-700 text-xl">{selectedCountry.landmark}</p>
                    </div>
                  </div>
                </Card>

                <Card className="p-6 bg-pink-50 border-2 border-pink-200">
                  <div className="flex items-start gap-3">
                    <Utensils className="w-8 h-8 text-pink-600 flex-shrink-0" />
                    <div>
                      <h3 className="font-bold text-lg mb-2 text-gray-800">Traditional Food</h3>
                      <p className="text-gray-700 text-xl">{selectedCountry.food}</p>
                    </div>
                  </div>
                </Card>

                <Card className="p-6 bg-yellow-50 border-2 border-yellow-200">
                  <div className="flex items-start gap-3">
                    <Coins className="w-8 h-8 text-yellow-600 flex-shrink-0" />
                    <div>
                      <h3 className="font-bold text-lg mb-2 text-gray-800">Currency</h3>
                      <p className="text-gray-700 text-xl">{selectedCountry.currency}</p>
                    </div>
                  </div>
                </Card>

                <Card className="p-6 bg-indigo-50 border-2 border-indigo-200">
                  <div className="flex items-start gap-3">
                    <Shirt className="w-8 h-8 text-indigo-600 flex-shrink-0" />
                    <div>
                      <h3 className="font-bold text-lg mb-2 text-gray-800">Traditional Clothing</h3>
                      <p className="text-gray-700 text-xl">{selectedCountry.clothing}</p>
                    </div>
                  </div>
                </Card>

                <Card className="p-6 bg-teal-50 border-2 border-teal-200 md:col-span-2 lg:col-span-3">
                  <div className="flex items-start gap-3">
                    <MessageCircle className="w-8 h-8 text-teal-600 flex-shrink-0" />
                    <div>
                      <h3 className="font-bold text-lg mb-2 text-gray-800">How to Introduce Yourself</h3>
                      <p className="text-gray-700 text-xl">{selectedCountry.introduction}</p>
                    </div>
                  </div>
                </Card>
              </div>

              {/* Fun Fact */}
              <Card className="p-6 bg-gradient-to-r from-yellow-100 to-pink-100 border-4 border-yellow-300">
                <div className="flex items-center gap-3">
                  <span className="text-4xl">✨</span>
                  <div>
                    <h3 className="font-bold text-xl mb-2 text-gray-800">Fun Fact!</h3>
                    <p className="text-gray-700 text-lg">{selectedCountry.funFact}</p>
                  </div>
                </div>
              </Card>
            </Card>
          </div>
        )}
      </main>
    </div>
  );
};

export default WhereIsThomas;
