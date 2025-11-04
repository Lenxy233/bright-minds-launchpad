import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { BookOpen, Sparkles, Loader2, ArrowLeft } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

const AIStoryCreator = () => {
  const [theme, setTheme] = useState("");
  const [ageRange, setAgeRange] = useState("");
  const [lessonFocus, setLessonFocus] = useState("");
  const [numPages, setNumPages] = useState("5");
  const [illustrationStyle, setIllustrationStyle] = useState("watercolor");
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleGenerate = async () => {
    if (!theme || !ageRange) {
      toast({
        title: "Missing Information",
        description: "Please fill in theme and age range",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);

    try {
      const { data, error } = await supabase.functions.invoke("generate-story-with-images", {
        body: {
          theme,
          ageRange,
          lessonFocus,
          numPages: parseInt(numPages),
          illustrationStyle,
        },
      });

      if (error) throw error;

      if (data?.success) {
        toast({
          title: "Story Created!",
          description: `Your story "${data.storyBook.title}" has been generated successfully.`,
        });
        
        // Navigate to the story book reader
        navigate(`/story-book/${data.storyBook.id}`);
      } else {
        throw new Error("Failed to generate story");
      }
    } catch (error) {
      console.error("Error generating story:", error);
      toast({
        title: "Generation Failed",
        description: error instanceof Error ? error.message : "Failed to generate story. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 py-8 px-4">
      <div className="container mx-auto max-w-4xl">
        <div className="mb-8">
          <Link 
            to="/dashboard" 
            className="inline-flex items-center gap-2 text-purple-600 hover:text-purple-700 font-medium"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </Link>
        </div>

        <Card className="border-2 border-purple-200 bg-white/90 backdrop-blur-sm shadow-xl">
          <CardHeader className="text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full mx-auto mb-4 flex items-center justify-center">
              <BookOpen className="w-8 h-8 text-white" />
            </div>
            <CardTitle className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              AI Story Book Creator
            </CardTitle>
            <CardDescription className="text-lg">
              Generate custom educational story books with AI-powered illustrations
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="theme">Story Theme *</Label>
              <Input
                id="theme"
                placeholder="e.g., A brave little robot exploring space"
                value={theme}
                onChange={(e) => setTheme(e.target.value)}
                disabled={isGenerating}
              />
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="ageRange">Age Range *</Label>
                <Select value={ageRange} onValueChange={setAgeRange} disabled={isGenerating}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select age range" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="3-5 years">3-5 years</SelectItem>
                    <SelectItem value="5-7 years">5-7 years</SelectItem>
                    <SelectItem value="7-10 years">7-10 years</SelectItem>
                    <SelectItem value="10-12 years">10-12 years</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="numPages">Number of Pages</Label>
                <Select value={numPages} onValueChange={setNumPages} disabled={isGenerating}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="3">3 pages</SelectItem>
                    <SelectItem value="5">5 pages</SelectItem>
                    <SelectItem value="8">8 pages</SelectItem>
                    <SelectItem value="10">10 pages</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="lessonFocus">Educational Focus (Optional)</Label>
              <Textarea
                id="lessonFocus"
                placeholder="e.g., Teaching about friendship, problem-solving, or counting"
                value={lessonFocus}
                onChange={(e) => setLessonFocus(e.target.value)}
                rows={3}
                disabled={isGenerating}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="illustrationStyle">Illustration Style</Label>
              <Select value={illustrationStyle} onValueChange={setIllustrationStyle} disabled={isGenerating}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="watercolor">Watercolor</SelectItem>
                  <SelectItem value="cartoon">Cartoon</SelectItem>
                  <SelectItem value="realistic">Realistic</SelectItem>
                  <SelectItem value="digital-art">Digital Art</SelectItem>
                  <SelectItem value="hand-drawn">Hand Drawn</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="font-semibold text-blue-900 mb-2">✨ What happens next?</h4>
              <ul className="text-sm text-blue-800 space-y-1 ml-4 list-disc">
                <li>AI generates a complete story based on your theme</li>
                <li>Custom illustrations are created for each page</li>
                <li>Story is saved to your library</li>
                <li>You can edit, export, or share with students</li>
              </ul>
            </div>

            <Button
              onClick={handleGenerate}
              disabled={isGenerating}
              className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white py-6 text-lg"
              size="lg"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Generating Story... (This may take 30-60 seconds)
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5 mr-2" />
                  Generate Story Book
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AIStoryCreator;