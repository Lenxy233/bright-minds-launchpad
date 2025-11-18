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
            <Route path="/story-books" element={<ProtectedRoute requirePurchase><StoryBooks /></ProtectedRoute>} />
            <Route path="/story-books/:id" element={<ProtectedRoute requirePurchase><StoryBookReader /></ProtectedRoute>} />
            <Route path="/story-books/upload" element={<ProtectedRoute><StoryBookUpload /></ProtectedRoute>} />
            <Route path="/story-books/batch-upload" element={<ProtectedRoute><BatchStoryUpload /></ProtectedRoute>} />
            <Route path="/parent-dashboard" element={<ProtectedRoute requirePurchase><ParentDashboard /></ProtectedRoute>} />
            <Route path="/puzzle" element={<ProtectedRoute requirePurchase><Puzzle /></ProtectedRoute>} />
            <Route path="/puzzle-admin" element={<ProtectedRoute><PuzzleAdmin /></ProtectedRoute>} />
            <Route path="/scissors-cutting" element={<ProtectedRoute requirePurchase><ScissorsCutting /></ProtectedRoute>} />
            <Route path="/alphabet-tracing" element={<ProtectedRoute requirePurchase><AlphabetTracing /></ProtectedRoute>} />
            <Route path="/alphabet-az-tracing" element={<ProtectedRoute requirePurchase><AlphabetAZTracing /></ProtectedRoute>} />
            <Route path="/numbers-tracing" element={<ProtectedRoute requirePurchase><NumbersTracing /></ProtectedRoute>} />
            <Route path="/fruit-drawing" element={<ProtectedRoute requirePurchase><FruitDrawing /></ProtectedRoute>} />
            <Route path="/alphabet-recognition" element={<ProtectedRoute requirePurchase><AlphabetRecognition /></ProtectedRoute>} />
            <Route path="/number-practice" element={<ProtectedRoute requirePurchase><NumberPractice /></ProtectedRoute>} />
            <Route path="/counting-worksheets" element={<ProtectedRoute requirePurchase><CountingWorksheets /></ProtectedRoute>} />
            <Route path="/addition-dots" element={<ProtectedRoute requirePurchase><AdditionWithDots /></ProtectedRoute>} />
            <Route path="/subtraction-numberline" element={<ProtectedRoute requirePurchase><SubtractionNumberLine /></ProtectedRoute>} />
            <Route path="/clock-faces" element={<ProtectedRoute requirePurchase><ClockFaces /></ProtectedRoute>} />
            <Route path="/poems" element={<ProtectedRoute requirePurchase><Poems /></ProtectedRoute>} />
          <Route path="/feelings-emotions" element={<ProtectedRoute requirePurchase><FeelingsEmotions /></ProtectedRoute>} />
          <Route path="/emotion-matching" element={<ProtectedRoute requirePurchase><EmotionMatching /></ProtectedRoute>} />
          <Route path="/emotion-scenarios" element={<ProtectedRoute requirePurchase><EmotionScenarios /></ProtectedRoute>} />
          <Route path="/friendship-activities" element={<ProtectedRoute requirePurchase><FriendshipActivities /></ProtectedRoute>} />
          <Route path="/where-is-thomas" element={<ProtectedRoute requirePurchase><WhereIsThomas /></ProtectedRoute>} />
            <Route path="/activities" element={<ProtectedRoute requirePurchase><Activities /></ProtectedRoute>} />
            <Route path="/activity-builder" element={<ProtectedRoute><ActivityBuilder /></ProtectedRoute>} />
            <Route path="/activity-builder/:id" element={<ProtectedRoute><ActivityBuilder /></ProtectedRoute>} />
            <Route path="/activity-player/:id" element={<ProtectedRoute requirePurchase><ActivityPlayer /></ProtectedRoute>} />
            <Route path="/interactive-story/:id" element={<ProtectedRoute requirePurchase><InteractiveStory /></ProtectedRoute>} />
            <Route path="/ai-story-creator" element={<ProtectedRoute requirePurchase><AIStoryCreator /></ProtectedRoute>} />
            <Route path="/game-creator" element={<ProtectedRoute><GameCreator /></ProtectedRoute>} />
            <Route path="/games/:id" element={<ProtectedRoute requirePurchase><GamePlayer /></ProtectedRoute>} />
            <Route path="/games-library" element={<ProtectedRoute requirePurchase><GamesLibrary /></ProtectedRoute>} />
            <Route path="/white-label-admin" element={<ProtectedRoute><WhiteLabelAdmin /></ProtectedRoute>} />
            <Route path="/plr-license" element={<PLRLicense />} />
            <Route path="/video-learning" element={<ProtectedRoute requirePurchase><VideoLearning /></ProtectedRoute>} />
            <Route path="/video-learning-admin" element={<ProtectedRoute><VideoLearningAdmin /></ProtectedRoute>} />
            <Route path="/curriculum-lesson-admin" element={<ProtectedRoute><CurriculumLessonAdmin /></ProtectedRoute>} />
            <Route path="/curriculum-lesson/:lessonId" element={<ProtectedRoute requirePurchase><CurriculumLessonPlayer /></ProtectedRoute>} />
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
