import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import GlobalAITutor from "@/components/GlobalAITutor";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import NewProductLaunch from "./pages/NewProductLaunch";
import Legal from "./pages/Legal";
import LearningApp from "./pages/LearningApp";
import ParentDashboard from "./pages/ParentDashboard";
import StoryBooks from "./pages/StoryBooks";
import StoryBookReader from "./pages/StoryBookReader";
import StoryBookUpload from "./pages/StoryBookUpload";
import BatchStoryUpload from "./pages/BatchStoryUpload";
import Puzzle from "./pages/Puzzle";
import PuzzleAdmin from "./pages/PuzzleAdmin";
import ScissorsCutting from "./pages/ScissorsCutting";
import AlphabetTracing from "./pages/AlphabetTracing";
import AlphabetAZTracing from "./pages/AlphabetAZTracing";
import NumbersTracing from "./pages/NumbersTracing";
import FruitDrawing from "./pages/FruitDrawing";
import AlphabetRecognition from "./pages/AlphabetRecognition";
import NumberPractice from "./pages/NumberPractice";
import CountingWorksheets from "./pages/CountingWorksheets";
import AdditionWithDots from "./pages/AdditionWithDots";
import SubtractionNumberLine from "./pages/SubtractionNumberLine";
import ClockFaces from "./pages/ClockFaces";
import Poems from "./pages/Poems";
import FeelingsEmotions from "./pages/FeelingsEmotions";
import EmotionMatching from "./pages/EmotionMatching";
import EmotionScenarios from "./pages/EmotionScenarios";
import FriendshipActivities from "./pages/FriendshipActivities";
import WhereIsThomas from "./pages/WhereIsThomas";
import Activities from "./pages/Activities";
import ActivityBuilder from "./pages/ActivityBuilder";
import ActivityPlayer from "./pages/ActivityPlayer";
import InteractiveStory from "./pages/InteractiveStory";
import NotFound from "./pages/NotFound";
import AIStoryCreator from "./pages/AIStoryCreator";
import GameCreator from "./pages/GameCreator";
import GamePlayer from "./pages/GamePlayer";
import GamesLibrary from "./pages/GamesLibrary";
import WhiteLabelAdmin from "./pages/WhiteLabelAdmin";
import PLRLicense from "./pages/PLRLicense";
import VideoLearning from "./pages/VideoLearning";
import VideoLearningAdmin from "./pages/VideoLearningAdmin";
import CurriculumLessonAdmin from "./pages/CurriculumLessonAdmin";
import CurriculumLessonPlayer from "./pages/CurriculumLessonPlayer";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <AuthProvider>
        <BrowserRouter>
          <GlobalAITutor />
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/new-product-launch" element={<NewProductLaunch />} />
            <Route path="/learning-app" element={<LearningApp />} />
            <Route path="/story-books" element={<StoryBooks />} />
            <Route path="/story-books/:id" element={<StoryBookReader />} />
            <Route path="/story-books/upload" element={<StoryBookUpload />} />
            <Route path="/story-books/batch-upload" element={<BatchStoryUpload />} />
            <Route path="/parent-dashboard" element={<ParentDashboard />} />
            <Route path="/puzzle" element={<Puzzle />} />
            <Route path="/puzzle-admin" element={<PuzzleAdmin />} />
            <Route path="/scissors-cutting" element={<ScissorsCutting />} />
            <Route path="/alphabet-tracing" element={<AlphabetTracing />} />
            <Route path="/alphabet-az-tracing" element={<AlphabetAZTracing />} />
            <Route path="/numbers-tracing" element={<NumbersTracing />} />
            <Route path="/fruit-drawing" element={<FruitDrawing />} />
            <Route path="/alphabet-recognition" element={<AlphabetRecognition />} />
            <Route path="/number-practice" element={<NumberPractice />} />
            <Route path="/counting-worksheets" element={<CountingWorksheets />} />
            <Route path="/addition-dots" element={<AdditionWithDots />} />
            <Route path="/subtraction-numberline" element={<SubtractionNumberLine />} />
            <Route path="/clock-faces" element={<ClockFaces />} />
            <Route path="/poems" element={<Poems />} />
          <Route path="/feelings-emotions" element={<FeelingsEmotions />} />
          <Route path="/emotion-matching" element={<EmotionMatching />} />
          <Route path="/emotion-scenarios" element={<EmotionScenarios />} />
          <Route path="/friendship-activities" element={<FriendshipActivities />} />
          <Route path="/where-is-thomas" element={<WhereIsThomas />} />
            <Route path="/activities" element={<Activities />} />
            <Route path="/activity-builder" element={<ActivityBuilder />} />
            <Route path="/activity-builder/:id" element={<ActivityBuilder />} />
            <Route path="/activity-player/:id" element={<ActivityPlayer />} />
            <Route path="/interactive-story/:id" element={<InteractiveStory />} />
            <Route path="/ai-story-creator" element={<AIStoryCreator />} />
            <Route path="/game-creator" element={<GameCreator />} />
            <Route path="/games/:id" element={<GamePlayer />} />
            <Route path="/games-library" element={<GamesLibrary />} />
            <Route path="/white-label-admin" element={<WhiteLabelAdmin />} />
            <Route path="/plr-license" element={<PLRLicense />} />
            <Route path="/video-learning" element={<VideoLearning />} />
            <Route path="/video-learning-admin" element={<ProtectedRoute><VideoLearningAdmin /></ProtectedRoute>} />
            <Route path="/curriculum-lesson-admin" element={<ProtectedRoute><CurriculumLessonAdmin /></ProtectedRoute>} />
            <Route path="/curriculum-lesson/:lessonId" element={<CurriculumLessonPlayer />} />
            <Route path="/legal" element={<Legal />} />
            {/* Redirect old policy routes to the new legal page with anchors */}
            <Route path="/privacy-policy" element={<Legal />} />
            <Route path="/data-protection-policy" element={<Legal />} />
            <Route path="/terms-and-conditions" element={<Legal />} />
            <Route path="/earnings-disclaimer" element={<Legal />} />
            <Route path="/refund-policy" element={<Legal />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
