import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Upload, Plus, Trash2, Save, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Switch } from "@/components/ui/switch";

interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswer: number;
}

const VideoLearningAdmin = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [duration, setDuration] = useState("");
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [videoUrl, setVideoUrl] = useState("");
  const [isPublished, setIsPublished] = useState(false);
  const [quizQuestions, setQuizQuestions] = useState<QuizQuestion[]>([
    { question: "", options: ["", "", "", ""], correctAnswer: 0 }
  ]);
  const [uploading, setUploading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleVideoUpload = async () => {
    if (!videoFile) {
      toast({
        title: "No file selected",
        description: "Please select a video file to upload",
        variant: "destructive"
      });
      return null;
    }

    const fileExt = videoFile.name.split('.').pop();
    const fileName = `${Math.random()}.${fileExt}`;
    const filePath = `${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('videos')
      .upload(filePath, videoFile);

    if (uploadError) {
      throw uploadError;
    }

    const { data: { publicUrl } } = supabase.storage
      .from('videos')
      .getPublicUrl(filePath);

    return publicUrl;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setUploading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast({
          title: "Authentication required",
          description: "Please log in to upload videos",
          variant: "destructive"
        });
        return;
      }

      let finalVideoUrl = videoUrl;
      
      // If a file was selected, upload it
      if (videoFile) {
        finalVideoUrl = await handleVideoUpload() || "";
      }

      if (!finalVideoUrl) {
        toast({
          title: "Video required",
          description: "Please provide a video URL or upload a video file",
          variant: "destructive"
        });
        return;
      }

      // Insert video lesson
      const { data: videoLesson, error: videoError } = await supabase
        .from('video_lessons')
        .insert({
          title,
          description,
          video_url: finalVideoUrl,
          duration,
          created_by: user.id,
          is_published: isPublished
        })
        .select()
        .single();

      if (videoError) throw videoError;

      // Insert quiz questions
      const validQuestions = quizQuestions.filter(q => q.question.trim() !== '');
      if (validQuestions.length > 0) {
        const questionsToInsert = validQuestions.map((q, index) => ({
          video_lesson_id: videoLesson.id,
          question: q.question,
          options: q.options,
          correct_answer: q.correctAnswer,
          order_index: index
        }));

        const { error: quizError } = await supabase
          .from('quiz_questions')
          .insert(questionsToInsert);

        if (quizError) throw quizError;
      }

      toast({
        title: "Success!",
        description: "Video lesson created successfully"
      });

      // Reset form
      setTitle("");
      setDescription("");
      setDuration("");
      setVideoFile(null);
      setVideoUrl("");
      setIsPublished(false);
      setQuizQuestions([{ question: "", options: ["", "", "", ""], correctAnswer: 0 }]);

    } catch (error: any) {
      console.error('Error creating video lesson:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to create video lesson",
        variant: "destructive"
      });
    } finally {
      setUploading(false);
    }
  };

  const addQuestion = () => {
    setQuizQuestions([...quizQuestions, { question: "", options: ["", "", "", ""], correctAnswer: 0 }]);
  };

  const removeQuestion = (index: number) => {
    setQuizQuestions(quizQuestions.filter((_, i) => i !== index));
  };

  const updateQuestion = (index: number, field: keyof QuizQuestion, value: any) => {
    const updated = [...quizQuestions];
    updated[index] = { ...updated[index], [field]: value };
    setQuizQuestions(updated);
  };

  const updateOption = (questionIndex: number, optionIndex: number, value: string) => {
    const updated = [...quizQuestions];
    updated[questionIndex].options[optionIndex] = value;
    setQuizQuestions(updated);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-secondary/5 to-accent/5 p-4 md:p-8">
      <div className="container mx-auto max-w-4xl">
        <Button onClick={() => navigate(-1)} variant="outline" className="mb-6">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>

        <Card>
          <CardHeader>
            <CardTitle className="text-3xl">Upload Video Lesson</CardTitle>
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
                  placeholder="e.g., Counting 1-10"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Brief description of the video lesson"
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="duration">Duration</Label>
                <Input
                  id="duration"
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                  placeholder="e.g., 5 min"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="videoFile">Upload Video File</Label>
                <Input
                  id="videoFile"
                  type="file"
                  accept="video/*"
                  onChange={(e) => setVideoFile(e.target.files?.[0] || null)}
                />
                <p className="text-sm text-muted-foreground">
                  Max file size: 50MB. Supported formats: MP4, WebM, OGG
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="videoUrl">Or Enter Video URL</Label>
                <Input
                  id="videoUrl"
                  value={videoUrl}
                  onChange={(e) => setVideoUrl(e.target.value)}
                  placeholder="https://youtube.com/embed/..."
                />
                <p className="text-sm text-muted-foreground">
                  Use YouTube embed URL or direct video URL
                </p>
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

                {quizQuestions.map((question, qIndex) => (
                  <Card key={qIndex} className="p-4">
                    <div className="space-y-4">
                      <div className="flex items-start justify-between">
                        <Label>Question {qIndex + 1}</Label>
                        {quizQuestions.length > 1 && (
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
                        value={question.question}
                        onChange={(e) => updateQuestion(qIndex, 'question', e.target.value)}
                        placeholder="Enter your question"
                      />

                      <div className="space-y-2">
                        <Label className="text-sm">Options</Label>
                        {question.options.map((option, oIndex) => (
                          <div key={oIndex} className="flex items-center gap-2">
                            <input
                              type="radio"
                              name={`correct-${qIndex}`}
                              checked={question.correctAnswer === oIndex}
                              onChange={() => updateQuestion(qIndex, 'correctAnswer', oIndex)}
                            />
                            <Input
                              value={option}
                              onChange={(e) => updateOption(qIndex, oIndex, e.target.value)}
                              placeholder={`Option ${oIndex + 1}`}
                            />
                          </div>
                        ))}
                        <p className="text-xs text-muted-foreground">
                          Select the radio button for the correct answer
                        </p>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>

              <Button type="submit" disabled={uploading} className="w-full" size="lg">
                <Save className="w-4 h-4 mr-2" />
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