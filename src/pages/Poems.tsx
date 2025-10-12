import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Heart, Star, Smile } from "lucide-react";
import { Link } from "react-router-dom";

interface Poem {
  id: number;
  title: string;
  content: string[];
  theme: string;
  icon: string;
}

const poems: Poem[] = [
  {
    id: 1,
    title: "Feelings Are Like Colors",
    content: [
      "Happy is yellow, bright and sunny,",
      "Making jokes that are quite funny.",
      "Sad is blue, like rain that falls,",
      "It's okay to cry when sadness calls.",
      "",
      "Angry is red, like a burning flame,",
      "But we can cool down, it's not a shame.",
      "Calm is green, like grass so still,",
      "Breathing deeply helps us chill."
    ],
    theme: "emotions",
    icon: "🎨"
  },
  {
    id: 2,
    title: "Kindness Is Magic",
    content: [
      "A smile to share, a hand to hold,",
      "Kindness is better than silver or gold.",
      "Help a friend when they are down,",
      "Turn their frown into a crown.",
      "",
      "Share your toys, say 'please' and 'thank you',",
      "These little things mean so much, it's true.",
      "Kindness grows like flowers bright,",
      "Spreading love and pure delight."
    ],
    theme: "kindness",
    icon: "✨"
  },
  {
    id: 3,
    title: "I Am Special",
    content: [
      "I am special, one of a kind,",
      "With a wonderful heart and an amazing mind.",
      "I can learn and I can grow,",
      "There's so much that I can know.",
      "",
      "I make mistakes, and that's okay,",
      "I'll try again another day.",
      "I am brave, I am strong,",
      "I am special all day long!"
    ],
    theme: "self-worth",
    icon: "⭐"
  },
  {
    id: 4,
    title: "Friends Are Treasures",
    content: [
      "Friends are treasures, oh so bright,",
      "They make the world feel just right.",
      "We play together, laugh and share,",
      "Friends show us they truly care.",
      "",
      "When I'm sad, they understand,",
      "They offer me a helping hand.",
      "Friends make life a joyful song,",
      "With friends beside me, I belong."
    ],
    theme: "friendship",
    icon: "🤝"
  },
  {
    id: 5,
    title: "Taking Turns",
    content: [
      "Taking turns is how we play,",
      "Everyone gets a turn today.",
      "Wait with patience, one by one,",
      "Taking turns is so much fun!",
      "",
      "When we share and wait our turn,",
      "Important lessons we will learn.",
      "Playing fair makes friendships grow,",
      "Taking turns, now we all know!"
    ],
    theme: "cooperation",
    icon: "🎈"
  },
  {
    id: 6,
    title: "Brave Little Heart",
    content: [
      "When I feel scared or all alone,",
      "I remember how much I've grown.",
      "I take a breath, I count to three,",
      "Being brave is inside of me.",
      "",
      "I can face what's new and strange,",
      "I'm brave enough to try and change.",
      "Step by step, I'll find my way,",
      "My brave little heart will save the day."
    ],
    theme: "courage",
    icon: "🦁"
  }
];

const Poems = () => {
  const [currentPoem, setCurrentPoem] = useState(0);

  const handlePrevious = () => {
    setCurrentPoem((prev) => (prev > 0 ? prev - 1 : poems.length - 1));
  };

  const handleNext = () => {
    setCurrentPoem((prev) => (prev < poems.length - 1 ? prev + 1 : 0));
  };

  const poem = poems[currentPoem];

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 py-8 px-4">
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
            <Heart className="inline w-10 h-10 mr-3 text-red-500" />
            Poems & Rhymes
          </h1>
          <p className="text-xl text-gray-600">
            Beautiful poems about feelings, friendship, and being special
          </p>
        </div>

        {/* Main Poem Card */}
        <Card className="bg-white/90 backdrop-blur-sm shadow-2xl border-4 border-purple-200 mb-6">
          <CardHeader className="text-center bg-gradient-to-r from-purple-100 to-pink-100 border-b-4 border-purple-200">
            <div className="text-6xl mb-4">{poem.icon}</div>
            <CardTitle className="text-3xl font-bold text-purple-800">
              {poem.title}
            </CardTitle>
            <p className="text-sm text-purple-600 capitalize">Theme: {poem.theme}</p>
          </CardHeader>
          <CardContent className="p-8 md:p-12">
            <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-8 border-2 border-purple-200">
              <div className="space-y-4">
                {poem.content.map((line, index) => (
                  <p
                    key={index}
                    className={`text-lg md:text-xl text-gray-700 leading-relaxed ${
                      line === "" ? "h-4" : ""
                    } ${
                      index === 0 || poem.content[index - 1] === ""
                        ? "font-semibold text-purple-800"
                        : ""
                    }`}
                  >
                    {line}
                  </p>
                ))}
              </div>
            </div>

            {/* Decorative Stars */}
            <div className="flex justify-center gap-4 mt-8">
              <Star className="w-8 h-8 text-yellow-400 fill-yellow-400" />
              <Smile className="w-8 h-8 text-pink-400" />
              <Heart className="w-8 h-8 text-red-400 fill-red-400" />
              <Smile className="w-8 h-8 text-blue-400" />
              <Star className="w-8 h-8 text-purple-400 fill-purple-400" />
            </div>
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="flex justify-between items-center mb-6">
          <Button
            onClick={handlePrevious}
            variant="outline"
            size="lg"
            className="flex items-center gap-2 border-2 border-purple-300 hover:bg-purple-100"
          >
            <ChevronLeft className="w-5 h-5" />
            Previous
          </Button>
          
          <div className="text-center">
            <p className="text-lg font-semibold text-gray-700">
              Poem {currentPoem + 1} of {poems.length}
            </p>
          </div>

          <Button
            onClick={handleNext}
            variant="outline"
            size="lg"
            className="flex items-center gap-2 border-2 border-purple-300 hover:bg-purple-100"
          >
            Next
            <ChevronRight className="w-5 h-5" />
          </Button>
        </div>

        {/* Poem Selector Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {poems.map((p, index) => (
            <button
              key={p.id}
              onClick={() => setCurrentPoem(index)}
              className={`p-4 rounded-xl border-2 transition-all ${
                currentPoem === index
                  ? "bg-gradient-to-br from-purple-500 to-pink-500 text-white border-purple-600 shadow-lg scale-105"
                  : "bg-white border-purple-200 hover:border-purple-400 hover:shadow-md"
              }`}
            >
              <div className="text-3xl mb-2">{p.icon}</div>
              <p className={`font-semibold text-sm ${
                currentPoem === index ? "text-white" : "text-gray-700"
              }`}>
                {p.title}
              </p>
            </button>
          ))}
        </div>

        {/* Tips Section */}
        <Card className="mt-8 bg-gradient-to-r from-blue-50 to-purple-50 border-2 border-blue-200">
          <CardHeader>
            <CardTitle className="text-2xl flex items-center gap-2">
              <Smile className="w-6 h-6 text-blue-600" />
              Tips for Parents & Teachers
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3 text-gray-700">
              <li className="flex items-start gap-2">
                <Star className="w-5 h-5 text-yellow-500 fill-yellow-500 mt-1 flex-shrink-0" />
                <span><strong>Read Together:</strong> Read the poems aloud with expression and rhythm</span>
              </li>
              <li className="flex items-start gap-2">
                <Star className="w-5 h-5 text-yellow-500 fill-yellow-500 mt-1 flex-shrink-0" />
                <span><strong>Discuss Feelings:</strong> Talk about the emotions and themes in each poem</span>
              </li>
              <li className="flex items-start gap-2">
                <Star className="w-5 h-5 text-yellow-500 fill-yellow-500 mt-1 flex-shrink-0" />
                <span><strong>Act It Out:</strong> Use gestures and movements to bring the poems to life</span>
              </li>
              <li className="flex items-start gap-2">
                <Star className="w-5 h-5 text-yellow-500 fill-yellow-500 mt-1 flex-shrink-0" />
                <span><strong>Create Your Own:</strong> Encourage children to write their own simple poems</span>
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Poems;
