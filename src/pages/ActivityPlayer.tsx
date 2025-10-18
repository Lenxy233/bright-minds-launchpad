import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, CheckCircle2, XCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import confetti from "canvas-confetti";

interface Activity {
  id: string;
  title: string;
  description: string;
  activity_type: string;
}

interface ActivityItem {
  id: string;
  content: any;
  correct_answer: string | null;
  order_index: number;
}

export default function ActivityPlayer() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [activity, setActivity] = useState<Activity | null>(null);
  const [items, setItems] = useState<ActivityItem[]>([]);
  const [userAnswers, setUserAnswers] = useState<Record<string, any>>({});
  const [showResults, setShowResults] = useState(false);
  const [score, setScore] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadActivity();
  }, [id]);

  const loadActivity = async () => {
    if (!id) return;

    try {
      const { data: activityData, error: activityError } = await supabase
        .from("activities")
        .select("*")
        .eq("id", id)
        .single();

      if (activityError) throw activityError;
      setActivity(activityData);

      const { data: itemsData, error: itemsError } = await supabase
        .from("activity_items")
        .select("*")
        .eq("activity_id", id)
        .order("order_index");

      if (itemsError) throw itemsError;
      setItems(itemsData || []);
    } catch (error) {
      console.error("Error loading activity:", error);
      toast.error("Failed to load activity");
    } finally {
      setLoading(false);
    }
  };

  const handleAnswer = (itemId: string, answer: any) => {
    setUserAnswers({ ...userAnswers, [itemId]: answer });
  };

  const checkAnswers = async () => {
    let correct = 0;
    const total = items.length;

    items.forEach((item) => {
      const userAnswer = userAnswers[item.id];
      if (activity?.activity_type === "matching") {
        if (userAnswer === item.content.match) correct++;
      } else if (activity?.activity_type === "true-false") {
        if (String(userAnswer) === item.correct_answer) correct++;
      } else if (activity?.activity_type === "quiz") {
        if (userAnswer === item.content.content) correct++;
      } else if (activity?.activity_type === "drag-drop") {
        if (userAnswer === item.correct_answer) correct++;
      } else if (activity?.activity_type === "tap-find") {
        if (String(userAnswer) === item.correct_answer) correct++;
      } else if (activity?.activity_type === "fill-blanks") {
        if (userAnswer === item.correct_answer) correct++;
      }
    });

    const finalScore = Math.round((correct / total) * 100);
    setScore(finalScore);
    setShowResults(true);

    if (finalScore >= 70) {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
    }

    if (user && id) {
      try {
        await supabase.from("activity_responses").insert({
          activity_id: id,
          user_id: user.id,
          responses: userAnswers,
          score: finalScore,
          completed: true
        });
      } catch (error) {
        console.error("Error saving response:", error);
      }
    }
  };

  const isAnswerCorrect = (itemId: string) => {
    const item = items.find(i => i.id === itemId);
    const userAnswer = userAnswers[itemId];
    
    if (activity?.activity_type === "matching") {
      return userAnswer === item?.content.match;
    } else if (activity?.activity_type === "true-false") {
      return String(userAnswer) === item?.correct_answer;
    } else if (activity?.activity_type === "quiz") {
      return userAnswer === item?.content.content;
    } else if (activity?.activity_type === "drag-drop") {
      return userAnswer === item?.correct_answer;
    } else if (activity?.activity_type === "tap-find") {
      return String(userAnswer) === item?.correct_answer;
    } else if (activity?.activity_type === "fill-blanks") {
      return userAnswer === item?.correct_answer;
    }
    return false;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background to-muted flex items-center justify-center">
        <p>Loading activity...</p>
      </div>
    );
  }

  if (!activity) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background to-muted flex items-center justify-center">
        <Card>
          <CardContent className="p-6">
            <p>Activity not found</p>
            <Button onClick={() => navigate("/activities")} className="mt-4">
              Back to Activities
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const getActivityEmoji = (type: string) => {
    const emojis: Record<string, string> = {
      "matching": "🔗",
      "drag-drop": "🎯",
      "quiz": "❓",
      "tap-find": "👆",
      "true-false": "✓✗",
      "fill-blanks": "📝"
    };
    return emojis[type] || "🎮";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 p-4">
      <div className="max-w-4xl mx-auto">
        <Button
          variant="ghost"
          onClick={() => navigate("/activities")}
          className="mb-4 text-lg"
        >
          <ArrowLeft className="mr-2 h-5 w-5" />
          🏠 Back
        </Button>

        <Card className="border-4 border-purple-300 shadow-2xl bg-white/90 backdrop-blur-sm overflow-hidden">
          <div className="h-4 bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400" />
          <CardHeader className="text-center pb-4">
            <div className="text-7xl mb-4 animate-scale-in">
              {getActivityEmoji(activity.activity_type)}
            </div>
            <CardTitle className="text-4xl font-bold mb-2">{activity.title}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {!showResults ? (
              <>
                {activity.activity_type === "matching" && (
                  <div className="space-y-6">
                    <div className="text-center text-2xl font-bold text-purple-600 mb-4">
                      👉 Match them together! 👈
                    </div>
                    {items.map((item, index) => (
                      <div key={item.id} className="grid grid-cols-2 gap-4 items-center animate-fade-in">
                        <div className="p-6 bg-gradient-to-br from-blue-200 to-blue-300 rounded-2xl text-center text-2xl font-bold shadow-lg transform hover:scale-105 transition-transform">
                          {item.content.content}
                        </div>
                        <input
                          type="text"
                          className="p-6 border-4 border-purple-300 rounded-2xl text-center text-2xl font-bold focus:border-pink-400 focus:ring-4 focus:ring-pink-200 transition-all"
                          placeholder="✏️ Type here..."
                          value={userAnswers[item.id] || ""}
                          onChange={(e) => handleAnswer(item.id, e.target.value)}
                        />
                      </div>
                    ))}
                  </div>
                )}

                {activity.activity_type === "true-false" && (
                  <div className="space-y-6">
                    <div className="text-center text-2xl font-bold text-purple-600 mb-4">
                      ✓ True or ✗ False? 
                    </div>
                    {items.map((item, index) => (
                      <Card key={item.id} className="border-4 border-purple-200 overflow-hidden animate-fade-in">
                        <CardContent className="p-6">
                          <p className="text-2xl font-bold text-center mb-6 text-gray-800">
                            {item.content.content}
                          </p>
                          <div className="grid grid-cols-2 gap-4">
                            <Button
                              size="lg"
                              variant={userAnswers[item.id] === true ? "default" : "outline"}
                              onClick={() => handleAnswer(item.id, true)}
                              className={`text-2xl py-8 font-bold ${
                                userAnswers[item.id] === true
                                  ? "bg-gradient-to-br from-green-400 to-green-600 scale-110"
                                  : "hover:bg-green-100 border-4"
                              } transition-all`}
                            >
                              ✓ True
                            </Button>
                            <Button
                              size="lg"
                              variant={userAnswers[item.id] === false ? "default" : "outline"}
                              onClick={() => handleAnswer(item.id, false)}
                              className={`text-2xl py-8 font-bold ${
                                userAnswers[item.id] === false
                                  ? "bg-gradient-to-br from-red-400 to-red-600 scale-110"
                                  : "hover:bg-red-100 border-4"
                              } transition-all`}
                            >
                              ✗ False
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}

                {activity.activity_type === "quiz" && (
                  <div className="space-y-6">
                    <div className="text-center text-2xl font-bold text-purple-600 mb-4">
                      ❓ Pick the right answer! 👆
                    </div>
                    {items.map((item, index) => (
                      <Card key={item.id} className="border-4 border-purple-200 overflow-hidden animate-fade-in">
                        <div className="bg-gradient-to-r from-purple-400 to-pink-400 p-4">
                          <p className="text-2xl font-bold text-center text-white">
                            {item.content.content}
                          </p>
                        </div>
                        <CardContent className="p-6">
                          <div className="grid gap-3">
                            {item.content.options?.map((option: string, idx: number) => (
                              <Button
                                key={idx}
                                size="lg"
                                variant={userAnswers[item.id] === option ? "default" : "outline"}
                                onClick={() => handleAnswer(item.id, option)}
                                className={`text-xl py-6 justify-start font-bold ${
                                  userAnswers[item.id] === option
                                    ? "bg-gradient-to-r from-green-400 to-blue-500 scale-105 shadow-lg"
                                    : "hover:bg-purple-100 border-4"
                                } transition-all`}
                              >
                                <span className="text-2xl mr-3">{["🅰️", "🅱️", "©️", "🅳"][idx]}</span>
                                {option}
                              </Button>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}

                {activity.activity_type === "drag-drop" && (
                  <div className="space-y-6">
                    <div className="text-center text-2xl font-bold text-purple-600 mb-4">
                      🎯 Drag to the right place! (or tap to select)
                    </div>
                    {items.map((item) => (
                      <Card key={item.id} className="border-4 border-purple-200 overflow-hidden animate-fade-in">
                        <CardContent className="p-6">
                          <div className="text-3xl text-center font-bold mb-4 p-4 bg-gradient-to-br from-yellow-200 to-orange-200 rounded-xl">
                            {item.content.content}
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <Button
                              size="lg"
                              variant={userAnswers[item.id] === "fruit" ? "default" : "outline"}
                              onClick={() => handleAnswer(item.id, "fruit")}
                              className={`text-xl py-6 font-bold ${
                                userAnswers[item.id] === "fruit"
                                  ? "bg-gradient-to-br from-red-400 to-pink-500 scale-105"
                                  : "hover:bg-red-100 border-4"
                              } transition-all`}
                            >
                              🍎 Fruit
                            </Button>
                            <Button
                              size="lg"
                              variant={userAnswers[item.id] === "vegetable" ? "default" : "outline"}
                              onClick={() => handleAnswer(item.id, "vegetable")}
                              className={`text-xl py-6 font-bold ${
                                userAnswers[item.id] === "vegetable"
                                  ? "bg-gradient-to-br from-green-400 to-green-600 scale-105"
                                  : "hover:bg-green-100 border-4"
                              } transition-all`}
                            >
                              🥕 Vegetable
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}

                {activity.activity_type === "tap-find" && (
                  <div className="space-y-6">
                    <div className="text-center text-2xl font-bold text-purple-600 mb-4">
                      👆 Tap on all the Circles! 
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                      {items.map((item) => (
                        <Button
                          key={item.id}
                          size="lg"
                          onClick={() => handleAnswer(item.id, !userAnswers[item.id])}
                          className={`aspect-square text-5xl py-12 font-bold border-4 animate-fade-in ${
                            userAnswers[item.id]
                              ? "bg-gradient-to-br from-green-400 to-green-600 scale-110 shadow-2xl"
                              : "bg-white hover:bg-yellow-100 border-purple-300"
                          } transition-all`}
                        >
                          {item.content.content === "Circle" ? "⭕" : 
                           item.content.content === "Square" ? "⬜" : "🔺"}
                        </Button>
                      ))}
                    </div>
                  </div>
                )}

                {activity.activity_type === "fill-blanks" && (
                  <div className="space-y-6">
                    <div className="text-center text-2xl font-bold text-purple-600 mb-4">
                      ✏️ Fill in the missing word! 📝
                    </div>
                    {items.map((item) => (
                      <Card key={item.id} className="border-4 border-purple-200 overflow-hidden animate-fade-in">
                        <CardContent className="p-6">
                          <p className="text-2xl font-bold text-center mb-6 text-gray-800">
                            {item.content.content}
                          </p>
                          <input
                            type="text"
                            className="w-full p-6 border-4 border-purple-300 rounded-2xl text-center text-2xl font-bold focus:border-pink-400 focus:ring-4 focus:ring-pink-200 transition-all"
                            placeholder="✏️ Type the word..."
                            value={userAnswers[item.id] || ""}
                            onChange={(e) => handleAnswer(item.id, e.target.value.toLowerCase())}
                          />
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}

                <Button
                  onClick={checkAnswers}
                  disabled={Object.keys(userAnswers).length !== items.length}
                  size="lg"
                  className="w-full text-2xl py-8 bg-gradient-to-r from-green-400 via-blue-500 to-purple-600 hover:from-green-500 hover:via-blue-600 hover:to-purple-700 shadow-2xl transform hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                >
                  ✨ Check My Answers! 🎯
                </Button>
              </>
            ) : (
              <div className="space-y-6 animate-fade-in">
                <Card className="bg-gradient-to-br from-yellow-200 via-pink-200 to-purple-200 border-4 border-yellow-400 overflow-hidden shadow-2xl">
                  <CardContent className="p-8 text-center">
                    <div className="text-8xl mb-4 animate-bounce">
                      {score >= 90 ? "🌟" : score >= 70 ? "🎉" : "💪"}
                    </div>
                    <h2 className="text-5xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600">
                      {score >= 90 ? "Amazing!" : score >= 70 ? "Great Job!" : "Good Try!"}
                    </h2>
                    <div className="text-6xl font-bold mb-2">
                      {score}%
                    </div>
                    <p className="text-2xl font-bold text-gray-700">
                      {score >= 90 ? "You're a superstar! ⭐" : score >= 70 ? "Keep it up! 🚀" : "Practice makes perfect! 📚"}
                    </p>
                  </CardContent>
                </Card>

                <div className="space-y-3">
                  {items.map((item) => (
                    <div
                      key={item.id}
                      className={`flex items-center gap-4 p-5 rounded-2xl border-4 ${
                        isAnswerCorrect(item.id)
                          ? "bg-green-100 border-green-400"
                          : "bg-red-100 border-red-400"
                      } transition-all animate-fade-in`}
                    >
                      {isAnswerCorrect(item.id) ? (
                        <div className="text-4xl">✅</div>
                      ) : (
                        <div className="text-4xl">❌</div>
                      )}
                      <span className="text-xl font-bold flex-1">{item.content.content}</span>
                    </div>
                  ))}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <Button
                    size="lg"
                    variant="outline"
                    onClick={() => {
                      setShowResults(false);
                      setUserAnswers({});
                      setScore(0);
                    }}
                    className="text-xl py-6 border-4 border-blue-400 hover:bg-blue-100 font-bold"
                  >
                    🔄 Try Again
                  </Button>
                  <Button
                    size="lg"
                    onClick={() => navigate("/activities")}
                    className="text-xl py-6 bg-gradient-to-r from-purple-400 to-pink-500 font-bold"
                  >
                    🏠 More Games
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}