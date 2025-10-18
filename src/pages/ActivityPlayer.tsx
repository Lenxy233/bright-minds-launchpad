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

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted p-4">
      <div className="max-w-3xl mx-auto">
        <Button
          variant="ghost"
          onClick={() => navigate("/activities")}
          className="mb-4"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Activities
        </Button>

        <Card>
          <CardHeader>
            <CardTitle>{activity.title}</CardTitle>
            {activity.description && (
              <p className="text-sm text-muted-foreground">{activity.description}</p>
            )}
          </CardHeader>
          <CardContent className="space-y-4">
            {!showResults ? (
              <>
                {activity.activity_type === "matching" && (
                  <div className="space-y-4">
                    {items.map((item, index) => (
                      <div key={item.id} className="grid grid-cols-2 gap-4 items-center">
                        <div className="p-4 bg-muted rounded-lg">
                          {item.content.content}
                        </div>
                        <input
                          type="text"
                          className="p-4 border rounded-lg"
                          placeholder="Type the match..."
                          value={userAnswers[item.id] || ""}
                          onChange={(e) => handleAnswer(item.id, e.target.value)}
                        />
                      </div>
                    ))}
                  </div>
                )}

                {activity.activity_type === "true-false" && (
                  <div className="space-y-4">
                    {items.map((item) => (
                      <Card key={item.id}>
                        <CardContent className="p-4">
                          <p className="mb-4">{item.content.content}</p>
                          <div className="flex gap-2">
                            <Button
                              variant={userAnswers[item.id] === true ? "default" : "outline"}
                              onClick={() => handleAnswer(item.id, true)}
                              className="flex-1"
                            >
                              True
                            </Button>
                            <Button
                              variant={userAnswers[item.id] === false ? "default" : "outline"}
                              onClick={() => handleAnswer(item.id, false)}
                              className="flex-1"
                            >
                              False
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}

                {activity.activity_type === "quiz" && (
                  <div className="space-y-4">
                    {items.map((item) => (
                      <Card key={item.id}>
                        <CardContent className="p-4">
                          <p className="font-medium mb-4">{item.content.content}</p>
                          <div className="space-y-2">
                            {item.content.options?.map((option: string, idx: number) => (
                              <Button
                                key={idx}
                                variant={userAnswers[item.id] === option ? "default" : "outline"}
                                onClick={() => handleAnswer(item.id, option)}
                                className="w-full justify-start"
                              >
                                {option}
                              </Button>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}

                <Button
                  onClick={checkAnswers}
                  disabled={Object.keys(userAnswers).length !== items.length}
                  className="w-full"
                >
                  Submit Answers
                </Button>
              </>
            ) : (
              <div className="space-y-4">
                <Card className="bg-primary/10">
                  <CardContent className="p-6 text-center">
                    <h2 className="text-3xl font-bold mb-2">Your Score: {score}%</h2>
                    <p className="text-muted-foreground">
                      {score >= 70 ? "Great job! 🎉" : "Keep practicing!"}
                    </p>
                  </CardContent>
                </Card>

                <div className="space-y-2">
                  {items.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center gap-2 p-3 rounded-lg bg-muted"
                    >
                      {isAnswerCorrect(item.id) ? (
                        <CheckCircle2 className="h-5 w-5 text-green-600" />
                      ) : (
                        <XCircle className="h-5 w-5 text-red-600" />
                      )}
                      <span className="text-sm">{item.content.content}</span>
                    </div>
                  ))}
                </div>

                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setShowResults(false);
                      setUserAnswers({});
                      setScore(0);
                    }}
                    className="flex-1"
                  >
                    Try Again
                  </Button>
                  <Button
                    onClick={() => navigate("/activities")}
                    className="flex-1"
                  >
                    Back to Activities
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