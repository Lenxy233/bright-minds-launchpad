import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { useRewards } from "@/hooks/useRewards";
import { CheckCircle2, XCircle, Award } from "lucide-react";
import { Progress } from "@/components/ui/progress";

interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswer: number;
}

interface VideoLesson {
  id: string;
  title: string;
  description: string;
  videoUrl: string;
  duration: string;
  quiz: QuizQuestion[];
}

const videoLessons: VideoLesson[] = [
  {
    id: "counting-basics",
    title: "Counting 1-10",
    description: "Learn to count from 1 to 10 with fun animations!",
    videoUrl: "https://www.youtube.com/embed/DR-cfDsHCGA",
    duration: "5 min",
    quiz: [
      {
        question: "What comes after number 5?",
        options: ["4", "6", "7", "8"],
        correctAnswer: 1
      },
      {
        question: "How many fingers do you have on one hand?",
        options: ["3", "4", "5", "6"],
        correctAnswer: 2
      },
      {
        question: "What is 2 + 3?",
        options: ["4", "5", "6", "7"],
        correctAnswer: 1
      }
    ]
  },
  {
    id: "alphabet-song",
    title: "ABC Song",
    description: "Sing along and learn the alphabet!",
    videoUrl: "https://www.youtube.com/embed/75p-N9YKqNo",
    duration: "3 min",
    quiz: [
      {
        question: "What is the first letter of the alphabet?",
        options: ["B", "A", "C", "D"],
        correctAnswer: 1
      },
      {
        question: "Which letter comes after M?",
        options: ["L", "N", "O", "P"],
        correctAnswer: 1
      },
      {
        question: "How many letters are in the alphabet?",
        options: ["24", "25", "26", "27"],
        correctAnswer: 2
      }
    ]
  },
  {
    id: "colors-shapes",
    title: "Colors & Shapes",
    description: "Discover colors and shapes around us!",
    videoUrl: "https://www.youtube.com/embed/oAQubtm-IPg",
    duration: "6 min",
    quiz: [
      {
        question: "What color is the sun?",
        options: ["Blue", "Green", "Yellow", "Red"],
        correctAnswer: 2
      },
      {
        question: "How many sides does a triangle have?",
        options: ["2", "3", "4", "5"],
        correctAnswer: 1
      },
      {
        question: "What shape is a ball?",
        options: ["Square", "Triangle", "Circle", "Rectangle"],
        correctAnswer: 2
      }
    ]
  }
];

const VideoLearning = () => {
  const [selectedLesson, setSelectedLesson] = useState<VideoLesson | null>(null);
  const [showQuiz, setShowQuiz] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>([]);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [score, setScore] = useState(0);
  const [kidProfile, setKidProfile] = useState<any>(null);
  const { awardPoints } = useRewards();

  useEffect(() => {
    // Load kid profile from session storage
    const savedProfile = sessionStorage.getItem('kidProfile');
    if (savedProfile) {
      setKidProfile(JSON.parse(savedProfile));
    }
  }, []);

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
              <h1 className="text-3xl font-bold mb-2">{selectedLesson.title}</h1>
              <p className="text-muted-foreground mb-4">{selectedLesson.description}</p>
              <p className="text-sm text-muted-foreground mb-6">Duration: {selectedLesson.duration}</p>
              
              <Button onClick={handleStartQuiz} size="lg" className="w-full">
                Take the Quiz ({selectedLesson.quiz.length} questions)
              </Button>
            </div>
          </Card>
        </div>
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
          <p className="text-xl text-muted-foreground">
            Watch videos and test your knowledge with fun quizzes!
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {videoLessons.map((lesson) => (
            <Card key={lesson.id} className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer" onClick={() => setSelectedLesson(lesson)}>
              <div className="aspect-video w-full bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center">
                <div className="w-16 h-16 rounded-full bg-background/80 flex items-center justify-center">
                  <div className="w-0 h-0 border-t-8 border-t-transparent border-l-12 border-l-primary border-b-8 border-b-transparent ml-1" />
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold mb-2">{lesson.title}</h3>
                <p className="text-sm text-muted-foreground mb-4">{lesson.description}</p>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">{lesson.duration}</span>
                  <span className="text-xs text-muted-foreground">{lesson.quiz.length} quiz questions</span>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default VideoLearning;