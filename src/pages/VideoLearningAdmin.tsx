import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Upload, Plus, Trash2 } from "lucide-react";

interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswer: number;
}

const VideoLearningAdmin = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [uploading, setUploading] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [duration, setDuration] = useState("");
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [videoUrl, setVideoUrl] = useState("");
  const [isPublished, setIsPublished] = useState(false);
  const [questions, setQuestions] = useState<QuizQuestion[]>([
    { question: "", options: ["", "", "", ""], correctAnswer: 0 }
  ]);

  const addQuestion = () => {
    setQuestions([...questions, { question: "", options: ["", "", "", ""], correctAnswer: 0 }]);
  };

  const removeQuestion = (index: number) => {
    setQuestions(questions.filter((_, i) => i !== index));
  };

  const updateQuestion = (index: number, field: keyof QuizQuestion, value: any) => {
    const updated = [...questions];
    updated[index] = { ...updated[index], [field]: value };
    setQuestions(updated);
  };

  const updateOption = (questionIndex: number, optionIndex: number, value: string) => {
    const updated = [...questions];
    updated[questionIndex].options[optionIndex] = value;
    setQuestions(updated);
  };

  const handleVideoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 50 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Video must be less than 50MB",
        variant: "destructive"
      });
      return;
    }

    setVideoFile(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setUploading(true);

    try {
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      
      if (authError) {
        console.error("Auth error:", authError);
        throw new Error("Authentication error: " + authError.message);
      }
      
      if (!user) {
        console.error("No user found");
        throw new Error("You must be logged in to upload videos");
      }

      console.log("User authenticated:", user.id);

      let finalVideoUrl = videoUrl;

      if (videoFile) {
        console.log("Uploading video file:", videoFile.name);
        const fileExt = videoFile.name.split('.').pop();
        const fileName = `${crypto.randomUUID()}.${fileExt}`;
        const { error: uploadError } = await supabase.storage
          .from('videos')
          .upload(fileName, videoFile);

        if (uploadError) {
          console.error("Storage upload error:", uploadError);
          throw uploadError;
        }
        
        console.log("Video uploaded successfully:", fileName);

        const { data: { publicUrl } } = supabase.storage
          .from('videos')
          .getPublicUrl(fileName);
        
        finalVideoUrl = publicUrl;
      }

      if (!finalVideoUrl) {
        throw new Error("Please provide either a video file or URL");
      }

      console.log("Inserting video lesson:", { title, video_url: finalVideoUrl });
      
      const { data: lesson, error: lessonError } = await supabase
        .from('video_lessons')
        .insert({
          title,
          description,
          video_url: finalVideoUrl,
          duration,
          is_published: isPublished,
          created_by: user.id
        })
        .select()
        .single();

      if (lessonError) {
        console.error("Lesson insert error:", lessonError);
        throw lessonError;
      }
      
      console.log("Video lesson created:", lesson.id);

      const questionsToInsert = questions
        .filter(q => q.question.trim())
        .map((q, index) => ({
          video_lesson_id: lesson.id,
          question: q.question,
          options: q.options,
          correct_answer: q.correctAnswer,
          order_index: index
        }));

      if (questionsToInsert.length > 0) {
        const { error: quizError } = await supabase
          .from('quiz_questions')
          .insert(questionsToInsert);

        if (quizError) throw quizError;
      }

      toast({
        title: "Success!",
        description: "Video lesson created successfully"
      });

      navigate('/video-learning');
    } catch (error: any) {
      console.error("Upload error:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to upload video",
        variant: "destructive"
      });
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-secondary/5 to-accent/5 p-4 md:p-8">
      <div className="container mx-auto max-w-4xl">
        <Button onClick={() => navigate('/video-learning')} variant="outline" className="mb-6">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Video Learning
        </Button>

        <Card>
          <CardHeader>
            <CardTitle>Upload Video Lesson</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="title">Title *</Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="duration">Duration (e.g., "5 min")</Label>
                <Input
                  id="duration"
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="video-file">Upload Video File (max 50MB)</Label>
                <Input
                  id="video-file"
                  type="file"
                  accept="video/*"
                  onChange={handleVideoUpload}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="video-url">Or Video URL (YouTube embed URL)</Label>
                <Input
                  id="video-url"
                  type="url"
                  value={videoUrl}
                  onChange={(e) => setVideoUrl(e.target.value)}
                  placeholder="https://www.youtube.com/embed/..."
                />
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="published"
                  checked={isPublished}
                  onCheckedChange={setIsPublished}
                />
                <Label htmlFor="published">Publish immediately</Label>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label className="text-lg font-semibold">Quiz Questions</Label>
                  <Button type="button" onClick={addQuestion} variant="outline" size="sm">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Question
                  </Button>
                </div>

                {questions.map((q, qIndex) => (
                  <Card key={qIndex} className="p-4">
                    <div className="space-y-4">
                      <div className="flex items-start justify-between">
                        <Label>Question {qIndex + 1}</Label>
                        {questions.length > 1 && (
                          <Button
                            type="button"
                            onClick={() => removeQuestion(qIndex)}
                            variant="ghost"
                            size="sm"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                      
                      <Input
                        value={q.question}
                        onChange={(e) => updateQuestion(qIndex, 'question', e.target.value)}
                        placeholder="Enter question"
                      />

                      <div className="space-y-2">
                        <Label>Options</Label>
                        {q.options.map((option, oIndex) => (
                          <div key={oIndex} className="flex items-center gap-2">
                            <Input
                              value={option}
                              onChange={(e) => updateOption(qIndex, oIndex, e.target.value)}
                              placeholder={`Option ${oIndex + 1}`}
                            />
                            <Switch
                              checked={q.correctAnswer === oIndex}
                              onCheckedChange={(checked) => {
                                if (checked) {
                                  updateQuestion(qIndex, 'correctAnswer', oIndex);
                                }
                              }}
                            />
                            <Label className="text-sm">Correct</Label>
                          </div>
                        ))}
                      </div>
                    </div>
                  </Card>
                ))}
              </div>

              <Button type="submit" disabled={uploading} className="w-full" size="lg">
                <Upload className="w-4 h-4 mr-2" />
                {uploading ? "Uploading..." : "Create Video Lesson"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default VideoLearningAdmin;