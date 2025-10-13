import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Heart, Users } from "lucide-react";
import { useNavigate } from "react-router-dom";
import sharingImage from "@/assets/friendship/sharing-toys.jpg";
import helpingImage from "@/assets/friendship/helping-friend.jpg";
import playingImage from "@/assets/friendship/playing-together.jpg";
import listeningImage from "@/assets/friendship/listening-friend.jpg";
import buildingImage from "@/assets/friendship/building-together.jpg";
import comfortingImage from "@/assets/friendship/comforting-friend.jpg";

const FriendshipActivities = () => {
  const navigate = useNavigate();
  const [selectedSkill, setSelectedSkill] = useState<string | null>(null);

  const friendshipSkills = [
    {
      name: "Sharing",
      image: sharingImage,
      color: "from-yellow-400 to-orange-500",
      description: "Good friends share toys and take turns!",
      tips: ["Take turns with toys", "Let others play too", "Share snacks and crayons"]
    },
    {
      name: "Helping",
      image: helpingImage,
      color: "from-green-400 to-teal-500",
      description: "Friends help each other when they need it!",
      tips: ["Help pick up dropped items", "Help with hard tasks", "Offer to help without being asked"]
    },
    {
      name: "Playing Together",
      image: playingImage,
      color: "from-pink-400 to-purple-500",
      description: "Friends have fun playing games together!",
      tips: ["Invite others to play", "Play fair and follow rules", "Everyone gets a turn"]
    },
    {
      name: "Listening",
      image: listeningImage,
      color: "from-blue-400 to-cyan-500",
      description: "Good friends listen when others talk!",
      tips: ["Look at the person talking", "Don't interrupt", "Show you care about what they say"]
    },
    {
      name: "Working Together",
      image: buildingImage,
      color: "from-purple-400 to-pink-500",
      description: "Friends cooperate and build things together!",
      tips: ["Work as a team", "Share ideas", "Help each other succeed"]
    },
    {
      name: "Being Kind",
      image: comfortingImage,
      color: "from-red-400 to-pink-500",
      description: "Friends are kind and caring to each other!",
      tips: ["Give hugs when someone is sad", "Say nice things", "Be gentle and caring"]
    }
  ];

  const activities = [
    { name: "🎨 Draw Pictures Together", icon: "🎨" },
    { name: "⚽ Play Sports", icon: "⚽" },
    { name: "🧩 Do Puzzles", icon: "🧩" },
    { name: "📚 Read Books", icon: "📚" },
    { name: "🎵 Sing Songs", icon: "🎵" },
    { name: "🏃 Run and Play Tag", icon: "🏃" },
    { name: "🏗️ Build with Blocks", icon: "🏗️" },
    { name: "🍪 Bake Cookies", icon: "🍪" },
    { name: "🌳 Explore Nature", icon: "🌳" },
    { name: "🎭 Play Pretend", icon: "🎭" },
    { name: "🎲 Play Board Games", icon: "🎲" },
    { name: "🎪 Put on a Show", icon: "🎪" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 p-4 md:p-8">
      {/* Header */}
      <div className="max-w-6xl mx-auto mb-8">
        <Button
          variant="ghost"
          onClick={() => navigate("/learning-app")}
          className="mb-4"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Learning
        </Button>
        
        <div className="text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Users className="w-12 h-12 text-purple-600 animate-pulse" />
            <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
              Friendship & Activities
            </h1>
            <Heart className="w-12 h-12 text-pink-600 animate-pulse" />
          </div>
          <p className="text-lg md:text-xl text-gray-700">
            Learn how to be a great friend and fun things to do together!
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto space-y-8">
        {/* Friendship Skills Grid */}
        <section>
          <h2 className="text-3xl font-bold text-center mb-6 text-purple-800">
            Ways to Be a Good Friend 🤝
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {friendshipSkills.map((skill) => {
              const isSelected = selectedSkill === skill.name;
              return (
                <Card
                  key={skill.name}
                  className={`cursor-pointer transition-all duration-300 transform hover:scale-105 hover:shadow-2xl ${
                    isSelected ? "ring-4 ring-purple-500 scale-105" : ""
                  }`}
                  onClick={() => setSelectedSkill(isSelected ? null : skill.name)}
                >
                  <CardHeader className="p-0">
                    <div className="relative rounded-t-lg overflow-hidden">
                      <img 
                        src={skill.image} 
                        alt={skill.name}
                        className="w-full h-48 object-cover"
                      />
                      <div className={`absolute bottom-0 left-0 right-0 bg-gradient-to-r ${skill.color} p-4`}>
                        <CardTitle className="text-center text-2xl text-white">{skill.name}</CardTitle>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-4">
                    <CardDescription className="text-gray-700 text-center mb-4 text-base">
                      {skill.description}
                    </CardDescription>
                    {isSelected && (
                      <div className="mt-4 p-4 bg-purple-50 rounded-lg animate-in fade-in slide-in-from-top-2">
                        <p className="font-semibold text-purple-800 mb-2">How to do it:</p>
                        <ul className="space-y-1 text-sm">
                          {skill.tips.map((tip, idx) => (
                            <li key={idx} className="flex items-start gap-2">
                              <span className="text-purple-600">•</span>
                              <span className="text-gray-700">{tip}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </section>

        {/* Fun Activities */}
        <section>
          <h2 className="text-3xl font-bold text-center mb-6 text-purple-800">
            Fun Things to Do with Friends! 🎉
          </h2>
          <Card className="bg-white/90 backdrop-blur-sm shadow-2xl border-4 border-pink-200">
            <CardHeader className="text-center bg-gradient-to-r from-pink-100 to-purple-100 border-b-4 border-pink-200">
              <CardTitle className="text-2xl text-purple-800">
                Activities You Can Do Together
              </CardTitle>
              <CardDescription className="text-lg text-gray-700">
                Click on any activity to see it grow!
              </CardDescription>
            </CardHeader>
            <CardContent className="p-8">
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {activities.map((activity, idx) => (
                  <Button
                    key={idx}
                    className="h-auto py-6 text-base bg-gradient-to-br from-purple-400 to-pink-400 hover:from-purple-500 hover:to-pink-500 hover:scale-110 transition-all duration-300"
                  >
                    <div className="flex flex-col items-center gap-2">
                      <span className="text-4xl">{activity.icon}</span>
                      <span className="font-semibold text-white text-center">{activity.name}</span>
                    </div>
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Friendship Tips */}
        <section>
          <Card className="bg-gradient-to-br from-yellow-50 to-orange-50 border-4 border-yellow-200">
            <CardHeader>
              <CardTitle className="text-2xl text-center text-orange-800">
                💡 Remember These Friendship Tips!
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="p-4 bg-white rounded-lg shadow">
                  <p className="font-semibold text-purple-800 mb-2">✨ Treat others how you want to be treated</p>
                  <p className="text-gray-700">Be kind, fair, and respectful to everyone!</p>
                </div>
                <div className="p-4 bg-white rounded-lg shadow">
                  <p className="font-semibold text-blue-800 mb-2">🤗 Everyone can be a friend</p>
                  <p className="text-gray-700">Don't leave anyone out - include everyone!</p>
                </div>
                <div className="p-4 bg-white rounded-lg shadow">
                  <p className="font-semibold text-green-800 mb-2">💪 Friends help each other</p>
                  <p className="text-gray-700">Be there when your friends need help or support!</p>
                </div>
                <div className="p-4 bg-white rounded-lg shadow">
                  <p className="font-semibold text-pink-800 mb-2">😊 Say sorry when you make mistakes</p>
                  <p className="text-gray-700">Everyone makes mistakes - apologize and make it right!</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>
      </div>
    </div>
  );
};

export default FriendshipActivities;
