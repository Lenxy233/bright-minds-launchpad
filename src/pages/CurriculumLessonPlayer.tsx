import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft } from "lucide-react";

interface Lesson {
  id: string;
  title: string;
  description: string;
  category: string;
  content_type: string;
  content_data: any;
}

const CurriculumLessonPlayer = () => {
  const { lessonId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLesson();
  }, [lessonId]);

  const fetchLesson = async () => {
    if (!lessonId) return;

    const { data, error } = await supabase
      .from("curriculum_lessons")
      .select("*")
      .eq("id", lessonId)
      .single();

    if (error) {
      toast({ title: "Error loading lesson", variant: "destructive" });
      navigate("/learning-app");
      return;
    }

    setLesson(data);
    setLoading(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/5 via-secondary/5 to-accent/5 flex items-center justify-center">
        <p className="text-lg">Loading lesson...</p>
      </div>
    );
  }

  if (!lesson) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/5 via-secondary/5 to-accent/5 flex items-center justify-center">
        <p className="text-lg">Lesson not found</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-secondary/5 to-accent/5 p-4 md:p-8">
      <div className="container mx-auto max-w-4xl">
        <Button onClick={() => navigate(-1)} variant="ghost" className="mb-6">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>

        <Card>
          <CardHeader>
            <div className="flex items-start justify-between">
              <div>
                <CardTitle className="text-3xl mb-2">{lesson.title}</CardTitle>
                <p className="text-sm text-muted-foreground">{lesson.category}</p>
              </div>
              <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-sm">
                {lesson.content_type}
              </span>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {lesson.description && (
              <div>
                <h3 className="font-semibold mb-2">Description</h3>
                <p className="text-muted-foreground">{lesson.description}</p>
              </div>
            )}

            {lesson.content_data.instructions && (
              <div>
                <h3 className="font-semibold mb-2">Instructions</h3>
                <div className="bg-accent/5 p-4 rounded-lg">
                  <p className="whitespace-pre-wrap">{lesson.content_data.instructions}</p>
                </div>
              </div>
            )}

            {lesson.content_data.text && (
              <div>
                <h3 className="font-semibold mb-2">Content</h3>
                <div className="prose max-w-none">
                  <p className="whitespace-pre-wrap">{lesson.content_data.text}</p>
                </div>
              </div>
            )}

            {lesson.content_data.videoUrl && (
              <div>
                <h3 className="font-semibold mb-2">Video</h3>
                <video 
                  src={lesson.content_data.videoUrl} 
                  controls 
                  className="w-full rounded-lg"
                />
              </div>
            )}

            {lesson.content_data.imageUrl && (
              <div>
                <h3 className="font-semibold mb-2">Worksheet</h3>
                <img 
                  src={lesson.content_data.imageUrl} 
                  alt={lesson.title}
                  className="w-full rounded-lg"
                />
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CurriculumLessonPlayer;