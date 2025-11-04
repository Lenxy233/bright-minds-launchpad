import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { ArrowLeft, Loader2, Gamepad2, Sparkles } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

const GameCreator = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  const [isGenerating, setIsGenerating] = useState(false);

  const [formData, setFormData] = useState({
    gameType: "matching",
    title: "",
    topic: "",
    difficulty: "easy",
    ageRange: "4-6",
    description: "",
  });

  const gameTypes = [
    { value: "matching", label: "Matching Game", description: "Match pairs of related items" },
    { value: "quiz", label: "Quiz", description: "Multiple choice questions" },
    { value: "memory", label: "Memory Cards", description: "Find matching pairs" },
    { value: "sorting", label: "Sorting Game", description: "Sort items into categories" },
    { value: "sequence", label: "Sequence Game", description: "Put items in correct order" },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please log in to create games",
        variant: "destructive",
      });
      navigate("/auth");
      return;
    }

    setIsGenerating(true);

    try {
      const { data, error } = await supabase.functions.invoke("generate-game", {
        body: {
          gameType: formData.gameType,
          topic: formData.topic,
          difficulty: formData.difficulty,
          ageRange: formData.ageRange,
          title: formData.title,
          description: formData.description,
        },
      });

      if (error) throw error;

      toast({
        title: "Game Created! 🎮",
        description: "Your game has been generated successfully!",
      });

      navigate(`/games/${data.game.id}`);
    } catch (error) {
      console.error("Error generating game:", error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to generate game",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
      <header className="bg-white/80 backdrop-blur-sm border-b border-purple-100 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              onClick={() => navigate("/learning-app")}
              className="gap-2"
            >
              <ArrowLeft className="w-5 h-5" />
              Back
            </Button>
            <div className="flex items-center gap-2">
              <Gamepad2 className="w-6 h-6 text-purple-600" />
              <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                AI Game Creator
              </h1>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Create Your Learning Game
            </h2>
            <p className="text-muted-foreground text-lg">
              AI will generate a fun, educational game based on your preferences
            </p>
          </div>

          <Card className="border-2 border-purple-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-purple-600" />
                Game Details
              </CardTitle>
              <CardDescription>
                Tell us what kind of game you want to create
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="gameType">Game Type</Label>
                  <Select
                    value={formData.gameType}
                    onValueChange={(value) =>
                      setFormData({ ...formData, gameType: value })
                    }
                  >
                    <SelectTrigger id="gameType">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {gameTypes.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label} - {type.description}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="title">Game Title</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) =>
                      setFormData({ ...formData, title: e.target.value })
                    }
                    placeholder="e.g., Animal Matching Adventure"
                    required
                    maxLength={100}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="topic">Topic/Subject</Label>
                  <Input
                    id="topic"
                    value={formData.topic}
                    onChange={(e) =>
                      setFormData({ ...formData, topic: e.target.value })
                    }
                    placeholder="e.g., Animals, Numbers, Colors, Shapes"
                    required
                    maxLength={100}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="difficulty">Difficulty</Label>
                    <Select
                      value={formData.difficulty}
                      onValueChange={(value) =>
                        setFormData({ ...formData, difficulty: value })
                      }
                    >
                      <SelectTrigger id="difficulty">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="easy">Easy</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="hard">Hard</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="ageRange">Age Range</Label>
                    <Select
                      value={formData.ageRange}
                      onValueChange={(value) =>
                        setFormData({ ...formData, ageRange: value })
                      }
                    >
                      <SelectTrigger id="ageRange">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="3-4">Ages 3-4</SelectItem>
                        <SelectItem value="4-6">Ages 4-6</SelectItem>
                        <SelectItem value="6-8">Ages 6-8</SelectItem>
                        <SelectItem value="8-10">Ages 8-10</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description (Optional)</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    placeholder="Add any specific requirements or learning goals..."
                    rows={3}
                    maxLength={500}
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                  disabled={isGenerating}
                  size="lg"
                >
                  {isGenerating ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      Generating Game...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-5 h-5 mr-2" />
                      Create Game with AI
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>

          <Card className="mt-6 border-2 border-blue-200 bg-blue-50/50">
            <CardHeader>
              <CardTitle className="text-lg">💡 Tips for Great Games</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm text-muted-foreground">
              <p>• Choose a topic that matches the child's interests</p>
              <p>• Start with easier difficulty and increase gradually</p>
              <p>• Matching games are great for vocabulary building</p>
              <p>• Quiz games help reinforce learning concepts</p>
              <p>• Memory games improve concentration and recall</p>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default GameCreator;
