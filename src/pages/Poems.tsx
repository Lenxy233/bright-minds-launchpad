import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Heart, Brain, Lightbulb, HelpCircle } from "lucide-react";
import { Link } from "react-router-dom";

interface Riddle {
  id: number;
  question: string;
  answer: string;
  icon: string;
}

const riddles: Riddle[] = [
  {
    id: 1,
    question: "What has a ring but no finger?",
    answer: "A telephone",
    icon: "📞"
  },
  {
    id: 2,
    question: "I have a neck but no head. What am I?",
    answer: "A bottle",
    icon: "🍾"
  },
  {
    id: 3,
    question: "I show you places to go, but I'm not a GPS. What am I?",
    answer: "A map",
    icon: "🗺️"
  },
  {
    id: 4,
    question: "What has a head and a tail but no body?",
    answer: "A coin",
    icon: "🪙"
  },
  {
    id: 5,
    question: "I'm tall when I'm young, and I'm short when I'm old. What am I?",
    answer: "A candle",
    icon: "🕯️"
  },
  {
    id: 6,
    question: "The more you take, the more you leave behind. What am I?",
    answer: "Footsteps",
    icon: "👣"
  },
  {
    id: 7,
    question: "What goes up but never comes down?",
    answer: "Your age",
    icon: "🎂"
  },
  {
    id: 8,
    question: "What has a face and two hands but no arms or legs?",
    answer: "A clock",
    icon: "🕐"
  },
  {
    id: 9,
    question: "What has to be broken before you can use it?",
    answer: "An egg",
    icon: "🥚"
  },
  {
    id: 10,
    question: "What is full of holes but still holds water?",
    answer: "A sponge",
    icon: "🧽"
  },
  {
    id: 11,
    question: "What has eyes but can't see?",
    answer: "A potato",
    icon: "🥔"
  },
  {
    id: 12,
    question: "I have days and months, I help you plan, but I'm not a clock. What am I?",
    answer: "A calendar",
    icon: "📅"
  },
  {
    id: 13,
    question: "I'm colorful and used for drawing, I'm not a paintbrush. What am I?",
    answer: "Crayons",
    icon: "🖍️"
  },
  {
    id: 14,
    question: "I reflect what you show, but I'm not a TV. What am I?",
    answer: "A mirror",
    icon: "🪞"
  },
  {
    id: 15,
    question: "I'm colorful and bright, I appear after a rain, but I'm not the sun. What am I?",
    answer: "A rainbow",
    icon: "🌈"
  },
  {
    id: 16,
    question: "What has a thumb and four fingers but is not alive?",
    answer: "A glove",
    icon: "🧤"
  },
  {
    id: 17,
    question: "What starts with an E and only has one letter in it?",
    answer: "An envelope",
    icon: "✉️"
  },
  {
    id: 18,
    question: "What has a heart that doesn't beat?",
    answer: "An artichoke",
    icon: "🫒"
  },
  {
    id: 19,
    question: "What has keys but can't open doors?",
    answer: "A computer",
    icon: "⌨️"
  },
  {
    id: 20,
    question: "What has words but never speaks?",
    answer: "Books",
    icon: "📚"
  },
  {
    id: 21,
    question: "What gets wetter as it dries?",
    answer: "A towel",
    icon: "🧻"
  },
  {
    id: 22,
    question: "What has four legs but can't walk?",
    answer: "A table",
    icon: "🪑"
  },
  {
    id: 23,
    question: "What has one eye but cannot see?",
    answer: "A needle",
    icon: "🪡"
  },
  {
    id: 24,
    question: "I stretch but am not a rope. What am I?",
    answer: "A rubber band",
    icon: "🔴"
  },
  {
    id: 25,
    question: "I have two wheels, and you pedal to move me. What am I?",
    answer: "A bicycle",
    icon: "🚲"
  },
  {
    id: 26,
    question: "What comes down but never goes up?",
    answer: "Rain",
    icon: "🌧️"
  },
  {
    id: 27,
    question: "I help you get clean and bubbly in the bath. What am I?",
    answer: "Soap",
    icon: "🧼"
  },
  {
    id: 28,
    question: "I swim in water, but I'm not a duck. What am I?",
    answer: "A fish",
    icon: "🐠"
  },
  {
    id: 29,
    question: "I help you clean your teeth, but I'm not a toothbrush. What am I?",
    answer: "Toothpaste",
    icon: "🦷"
  },
  {
    id: 30,
    question: "I'm soft and fluffy, and you rest your head on me at night. What am I?",
    answer: "A pillow",
    icon: "🛏️"
  },
  {
    id: 31,
    question: "I start as a caterpillar and transform into something colorful that flies. What am I?",
    answer: "A butterfly",
    icon: "🦋"
  },
  {
    id: 32,
    question: "I make noise when you hit me, but I'm not a bell. What am I?",
    answer: "A drum",
    icon: "🥁"
  },
  {
    id: 33,
    question: "I'm long, have many cars, and travel on train tracks. What am I?",
    answer: "A train",
    icon: "🚂"
  },
  {
    id: 34,
    question: "I have eight legs, I weave a web, but I'm not a beetle. What am I?",
    answer: "A spider",
    icon: "🕷️"
  },
  {
    id: 35,
    question: "I'm round and float in the air, I pop when touched. What am I?",
    answer: "A balloon",
    icon: "🎈"
  },
  {
    id: 36,
    question: "You sleep on me, but I'm not a chair. What am I?",
    answer: "A bed",
    icon: "🛌"
  },
  {
    id: 37,
    question: "I'm slow and carry my home. What am I?",
    answer: "A snail",
    icon: "🐌"
  },
  {
    id: 38,
    question: "I'm contagious but not a cold, I show happiness when I unfold. What am I?",
    answer: "A smile",
    icon: "😊"
  }
];

const Poems = () => {
  const [currentRiddle, setCurrentRiddle] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);

  const handlePrevious = () => {
    setCurrentRiddle((prev) => (prev > 0 ? prev - 1 : riddles.length - 1));
    setShowAnswer(false);
  };

  const handleNext = () => {
    setCurrentRiddle((prev) => (prev < riddles.length - 1 ? prev + 1 : 0));
    setShowAnswer(false);
  };

  const handleRevealAnswer = () => {
    setShowAnswer(true);
  };

  const riddle = riddles[currentRiddle];

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-orange-50 to-pink-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <Link 
            to="/learning-app" 
            className="inline-flex items-center gap-2 text-purple-600 hover:text-purple-700 mb-4"
          >
            <ChevronLeft className="w-5 h-5" />
            <span className="font-semibold">Back to Learning</span>
          </Link>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
            <Brain className="inline w-10 h-10 mr-3 text-purple-600" />
            Brain-Boosting Riddles
          </h1>
          <p className="text-xl text-gray-600">
            Test your thinking skills with fun riddles!
          </p>
        </div>

        {/* Main Riddle Card */}
        <Card className="bg-white/90 backdrop-blur-sm shadow-2xl border-4 border-orange-200 mb-6">
          <CardHeader className="text-center bg-gradient-to-r from-yellow-100 to-orange-100 border-b-4 border-orange-200">
            <CardTitle className="text-2xl font-bold text-orange-800 flex items-center justify-center gap-2">
              <HelpCircle className="w-6 h-6" />
              Riddle #{riddle.id}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-8 md:p-12">
            {/* Question */}
            <div className="bg-gradient-to-br from-orange-50 to-yellow-50 rounded-xl p-8 border-2 border-orange-200 mb-6">
              <p className="text-2xl md:text-3xl text-gray-800 leading-relaxed font-semibold text-center">
                {riddle.question}
              </p>
            </div>

            {/* Answer Section */}
            {!showAnswer ? (
              <div className="text-center">
                <Button
                  onClick={handleRevealAnswer}
                  size="lg"
                  className="bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 text-xl px-8 py-6"
                >
                  <Lightbulb className="w-6 h-6 mr-2" />
                  Show Answer
                </Button>
              </div>
            ) : (
              <div className="bg-gradient-to-br from-green-50 to-blue-50 rounded-xl p-8 border-4 border-green-300 animate-in fade-in scale-in">
                <div className="text-center">
                  <div className="text-6xl mb-4 animate-scale-in">{riddle.icon}</div>
                  <p className="text-green-700 font-bold text-lg mb-2">✨ The Answer Is... ✨</p>
                  <p className="text-3xl md:text-4xl text-green-800 font-bold">
                    {riddle.answer}
                  </p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="flex justify-between items-center mb-6">
          <Button
            onClick={handlePrevious}
            variant="outline"
            size="lg"
            className="flex items-center gap-2 border-2 border-orange-300 hover:bg-orange-100"
          >
            <ChevronLeft className="w-5 h-5" />
            Previous
          </Button>
          
          <div className="text-center">
            <p className="text-lg font-semibold text-gray-700">
              Riddle {currentRiddle + 1} of {riddles.length}
            </p>
          </div>

          <Button
            onClick={handleNext}
            variant="outline"
            size="lg"
            className="flex items-center gap-2 border-2 border-orange-300 hover:bg-orange-100"
          >
            Next
            <ChevronRight className="w-5 h-5" />
          </Button>
        </div>

        {/* Riddle Selector Grid */}
        <div className="grid grid-cols-3 md:grid-cols-6 gap-3 mb-8">
          {riddles.map((r, index) => (
            <button
              key={r.id}
              onClick={() => {
                setCurrentRiddle(index);
                setShowAnswer(false);
              }}
              className={`p-3 rounded-xl border-2 transition-all ${
                currentRiddle === index
                  ? "bg-gradient-to-br from-orange-500 to-pink-500 text-white border-orange-600 shadow-lg scale-105"
                  : "bg-white border-orange-200 hover:border-orange-400 hover:shadow-md"
              }`}
            >
              <div className="text-2xl mb-1">{r.icon}</div>
              <p className={`font-semibold text-xs ${
                currentRiddle === index ? "text-white" : "text-gray-700"
              }`}>
                #{r.id}
              </p>
            </button>
          ))}
        </div>

      </div>
    </div>
  );
};

export default Poems;
