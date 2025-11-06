import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { useRewards } from "@/hooks/useRewards";
import { CheckCircle2, XCircle, Award, Plus, Pencil, Trash2 } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

interface QuizQuestion {
  id?: string;
  question: string;
  options: string[];
  correctAnswer: number;
}

interface VideoLesson {
  id: string;
  title: string;
  description: string;
  videoUrl: string;
  thumbnailUrl?: string;
  duration: string;
  quiz: QuizQuestion[];
}

const VideoLearning = () => {
  const [selectedLesson, setSelectedLesson] = useState<VideoLesson | null>(null);
  const [showQuiz, setShowQuiz] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>([]);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [score, setScore] = useState(0);
  const [kidProfile, setKidProfile] = useState<any>(null);
  const [videoLessons, setVideoLessons] = useState<VideoLesson[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const { awardPoints } = useRewards();
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    // Load kid profile from session storage
    const savedProfile = sessionStorage.getItem('kidProfile');
    if (savedProfile) {
      setKidProfile(JSON.parse(savedProfile));
    }

    // Check if user is logged in (admin)
    checkAuth();
    
    // Load video lessons
    loadVideoLessons();
  }, []);

  const checkAuth = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    setIsAdmin(!!user);
  };

  const loadVideoLessons = async () => {
    try {
      const { data: lessons, error: lessonsError } = await supabase
        .from('video_lessons')
        .select('*')
        .eq('is_published', true)
        .order('order_index', { ascending: true });

      if (lessonsError) throw lessonsError;

      if (!lessons || lessons.length === 0) {
        setVideoLessons([]);
        return;
      }

      // Load quiz questions for each lesson
      const lessonsWithQuiz = await Promise.all(
        lessons.map(async (lesson) => {
          const { data: questions, error: questionsError } = await supabase
            .from('quiz_questions')
            .select('*')
            .eq('video_lesson_id', lesson.id)
            .order('order_index', { ascending: true });

          if (questionsError) {
            console.error('Error loading quiz questions:', questionsError);
          }

          return {
            id: lesson.id,
            title: lesson.title,
            description: lesson.description || '',
            videoUrl: lesson.video_url,
            thumbnailUrl: lesson.thumbnail_url,
            duration: lesson.duration || '',
            quiz: (questions || []).map(q => ({
              id: q.id,
              question: q.question,
              options: q.options as string[],
              correctAnswer: q.correct_answer
            }))
          };
        })
      );

      setVideoLessons(lessonsWithQuiz);
    } catch (error: any) {
      console.error('Error loading video lessons:', error);
      toast({
        title: "Error",
        description: "Failed to load video lessons",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleStartQuiz = () => {
    setShowQuiz(true);
    setCurrentQuestion(0);
    setSelectedAnswers([]);
    setQuizCompleted(false);
    setScore(0);
  };

  const handleAnswerSelect = (answerIndex: number) => {
    const newAnswers = [...selectedAnswers];
    newAnswers[currentQuestion] = answerIndex;
    setSelectedAnswers(newAnswers);
  };

  const handleNextQuestion = () => {
    if (currentQuestion < (selectedLesson?.quiz.length || 0) - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      completeQuiz();
    }
  };

  const completeQuiz = () => {
    if (!selectedLesson) return;
    
    let correctCount = 0;
    selectedLesson.quiz.forEach((question, index) => {
      if (selectedAnswers[index] === question.correctAnswer) {
        correctCount++;
      }
    });
    
    setScore(correctCount);
    setQuizCompleted(true);
    
    const percentage = (correctCount / selectedLesson.quiz.length) * 100;
    const points = Math.round(percentage / 10);
    
    // Award points only if kid is logged in
    if (kidProfile?.id) {
      awardPoints(kidProfile.id, "video-quiz", selectedLesson.id, points);
    }
  };

  const handleBackToLessons = () => {
    setSelectedLesson(null);
    setShowQuiz(false);
  };

  const handleDelete = async (lessonId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (!confirm('Are you sure you want to delete this video lesson?')) return;

    try {
      const { error } = await supabase
        .from('video_lessons')
        .delete()
        .eq('id', lessonId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Video lesson deleted successfully"
      });

      loadVideoLessons();
    } catch (error: any) {
      console.error('Error deleting video lesson:', error);
      toast({
        title: "Error",
        description: "Failed to delete video lesson",
        variant: "destructive"
      });
    }
  };

  const handleEdit = (lessonId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    navigate(`/video-learning-admin?edit=${lessonId}`);
  };

  if (selectedLesson && showQuiz) {
    const question = selectedLesson.quiz[currentQuestion];
    const progress = ((currentQuestion + 1) / selectedLesson.quiz.length) * 100;

    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/5 via-secondary/5 to-accent/5 p-4 md:p-8">
        <div className="container mx-auto max-w-3xl">
          <Button onClick={handleBackToLessons} variant="outline" className="mb-6">
            ← Back to Lessons
          </Button>

          {!quizCompleted ? (
            <Card className="p-8">
              <div className="mb-6">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium">Question {currentQuestion + 1} of {selectedLesson.quiz.length}</span>
                  <span className="text-sm text-muted-foreground">{Math.round(progress)}%</span>
                </div>
                <Progress value={progress} className="h-2" />
              </div>

              <h2 className="text-2xl font-bold mb-6">{question.question}</h2>

              <RadioGroup value={selectedAnswers[currentQuestion]?.toString() || ""} onValueChange={(value) => handleAnswerSelect(parseInt(value))}>
                <div className="space-y-4">
                  {question.options.map((option, index) => (
                    <div key={index} className="flex items-center space-x-3 p-4 border rounded-lg hover:bg-accent/5 transition-colors">
                      <RadioGroupItem value={index.toString()} id={`option-${index}`} />
                      <Label htmlFor={`option-${index}`} className="flex-1 cursor-pointer text-lg">
                        {option}
                      </Label>
                    </div>
                  ))}
                </div>
              </RadioGroup>

              <Button 
                onClick={handleNextQuestion} 
                disabled={selectedAnswers[currentQuestion] === undefined}
                className="w-full mt-6"
                size="lg"
              >
                {currentQuestion < selectedLesson.quiz.length - 1 ? "Next Question" : "Complete Quiz"}
              </Button>
            </Card>
          ) : (
            <Card className="p-8 text-center">
              <Award className="w-16 h-16 mx-auto mb-4 text-primary" />
              <h2 className="text-3xl font-bold mb-4">Quiz Complete!</h2>
              <p className="text-xl mb-6">
                You scored {score} out of {selectedLesson.quiz.length}
              </p>
              <div className="space-y-4 mb-6">
                {selectedLesson.quiz.map((question, index) => (
                  <div key={index} className="flex items-start gap-3 p-4 border rounded-lg text-left">
                    {selectedAnswers[index] === question.correctAnswer ? (
                      <CheckCircle2 className="w-6 h-6 text-green-500 flex-shrink-0 mt-1" />
                    ) : (
                      <XCircle className="w-6 h-6 text-red-500 flex-shrink-0 mt-1" />
                    )}
                    <div>
                      <p className="font-medium mb-1">{question.question}</p>
                      <p className="text-sm text-muted-foreground">
                        Correct answer: {question.options[question.correctAnswer]}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              <Button onClick={handleBackToLessons} size="lg" className="w-full">
                Back to Lessons
              </Button>
            </Card>
          )}
        </div>
      </div>
    );
  }

  if (selectedLesson) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/5 via-secondary/5 to-accent/5 p-4 md:p-8">
        <div className="container mx-auto max-w-4xl">
          <Button onClick={handleBackToLessons} variant="outline" className="mb-6">
            ← Back to Lessons
          </Button>

          <Card className="overflow-hidden">
            <div className="aspect-video w-full">
              <iframe
                src={selectedLesson.videoUrl}
                className="w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                title={selectedLesson.title}
              />
            </div>
            <div className="p-6">
              <h1 className="text-3xl font-bold mb-2 text-foreground">{selectedLesson.title}</h1>
              <p className="text-foreground/80 mb-4">{selectedLesson.description}</p>
              <p className="text-sm text-foreground/70 mb-6">Duration: {selectedLesson.duration}</p>
              
              <Button onClick={handleStartQuiz} size="lg" className="w-full">
                Take the Quiz ({selectedLesson.quiz.length} questions)
              </Button>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/5 via-secondary/5 to-accent/5 p-4 md:p-8 flex items-center justify-center">
        <p className="text-xl text-foreground/80">Loading video lessons...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-secondary/5 to-accent/5 p-4 md:p-8">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
            Video Learning
          </h1>
          <p className="text-xl text-foreground/80">
            Watch videos and test your knowledge with fun quizzes!
          </p>
          {isAdmin && (
            <Button 
              onClick={() => navigate('/video-learning-admin')}
              className="mt-4"
              size="lg"
            >
              <Plus className="w-4 h-4 mr-2" />
              Upload New Video
            </Button>
          )}
        </div>

        {videoLessons.length === 0 ? (
          <Card className="p-12 text-center">
            <p className="text-xl text-foreground/80 mb-4">No video lessons available yet.</p>
            {isAdmin && (
              <Button onClick={() => navigate('/video-learning-admin')} size="lg">
                <Plus className="w-4 h-4 mr-2" />
                Upload Your First Video
              </Button>
            )}
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {videoLessons.map((lesson) => (
              <Card key={lesson.id} className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer group relative" onClick={() => setSelectedLesson(lesson)}>
                {isAdmin && (
                  <div className="absolute top-2 right-2 z-10 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button
                      variant="secondary"
                      size="icon"
                      onClick={(e) => handleEdit(lesson.id, e)}
                    >
                      <Pencil className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="destructive"
                      size="icon"
                      onClick={(e) => handleDelete(lesson.id, e)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                )}
                <div className="aspect-video w-full bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center relative">
                  {lesson.thumbnailUrl ? (
                    <img 
                      src={lesson.thumbnailUrl} 
                      alt={lesson.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-16 h-16 rounded-full bg-background/80 flex items-center justify-center">
                      <div className="w-0 h-0 border-t-8 border-t-transparent border-l-12 border-l-primary border-b-8 border-b-transparent ml-1" />
                    </div>
                  )}
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-2 text-foreground">{lesson.title}</h3>
                  <p className="text-sm text-foreground/70 mb-4">{lesson.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-foreground/60">{lesson.duration}</span>
                    <span className="text-xs text-foreground/60">{lesson.quiz.length} quiz questions</span>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default VideoLearning;