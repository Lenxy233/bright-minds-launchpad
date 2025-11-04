import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";
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

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/dashboard" element={
              <ProtectedRoute requirePurchase={true}>
                <Dashboard />
              </ProtectedRoute>
            } />
            <Route path="/new-product-launch" element={<NewProductLaunch />} />
            <Route path="/learning-app" element={
              <ProtectedRoute requirePurchase={true}>
                <LearningApp />
              </ProtectedRoute>
            } />
            <Route path="/story-books" element={
              <ProtectedRoute requirePurchase={true}>
                <StoryBooks />
              </ProtectedRoute>
            } />
            <Route path="/story-books/:id" element={
              <ProtectedRoute requirePurchase={true}>
                <StoryBookReader />
              </ProtectedRoute>
            } />
            <Route path="/story-books/upload" element={
              <ProtectedRoute requirePurchase={true}>
                <StoryBookUpload />
              </ProtectedRoute>
            } />
            <Route path="/story-books/batch-upload" element={
              <ProtectedRoute requirePurchase={true}>
                <BatchStoryUpload />
              </ProtectedRoute>
            } />
            <Route path="/parent-dashboard" element={
              <ProtectedRoute requirePurchase={true}>
                <ParentDashboard />
              </ProtectedRoute>
            } />
            <Route path="/puzzle" element={
              <ProtectedRoute requirePurchase={true}>
                <Puzzle />
              </ProtectedRoute>
            } />
            <Route path="/puzzle-admin" element={<PuzzleAdmin />} />
            <Route path="/scissors-cutting" element={
              <ProtectedRoute requirePurchase={true}>
                <ScissorsCutting />
              </ProtectedRoute>
            } />
            <Route path="/alphabet-tracing" element={
              <ProtectedRoute requirePurchase={true}>
                <AlphabetTracing />
              </ProtectedRoute>
            } />
            <Route path="/alphabet-az-tracing" element={
              <ProtectedRoute requirePurchase={true}>
                <AlphabetAZTracing />
              </ProtectedRoute>
            } />
            <Route path="/numbers-tracing" element={
              <ProtectedRoute requirePurchase={true}>
                <NumbersTracing />
              </ProtectedRoute>
            } />
            <Route path="/fruit-drawing" element={
              <ProtectedRoute requirePurchase={true}>
                <FruitDrawing />
              </ProtectedRoute>
            } />
            <Route path="/alphabet-recognition" element={
              <ProtectedRoute requirePurchase={true}>
                <AlphabetRecognition />
              </ProtectedRoute>
            } />
            <Route path="/number-practice" element={
              <ProtectedRoute requirePurchase={true}>
                <NumberPractice />
              </ProtectedRoute>
            } />
            <Route path="/counting-worksheets" element={
              <ProtectedRoute requirePurchase={true}>
                <CountingWorksheets />
              </ProtectedRoute>
            } />
            <Route path="/addition-dots" element={
              <ProtectedRoute requirePurchase={true}>
                <AdditionWithDots />
              </ProtectedRoute>
            } />
            <Route path="/subtraction-numberline" element={
              <ProtectedRoute requirePurchase={true}>
                <SubtractionNumberLine />
              </ProtectedRoute>
            } />
            <Route path="/clock-faces" element={
              <ProtectedRoute requirePurchase={true}>
                <ClockFaces />
              </ProtectedRoute>
            } />
            <Route path="/poems" element={
              <ProtectedRoute requirePurchase={true}>
                <Poems />
              </ProtectedRoute>
            } />
          <Route path="/feelings-emotions" element={
            <ProtectedRoute requirePurchase={true}>
              <FeelingsEmotions />
            </ProtectedRoute>
          } />
          <Route path="/emotion-matching" element={
            <ProtectedRoute requirePurchase={true}>
              <EmotionMatching />
            </ProtectedRoute>
          } />
          <Route path="/emotion-scenarios" element={
            <ProtectedRoute requirePurchase={true}>
              <EmotionScenarios />
            </ProtectedRoute>
          } />
          <Route path="/friendship-activities" element={
            <ProtectedRoute requirePurchase={true}>
              <FriendshipActivities />
            </ProtectedRoute>
          } />
          <Route path="/where-is-thomas" element={
            <ProtectedRoute requirePurchase={true}>
              <WhereIsThomas />
            </ProtectedRoute>
          } />
            <Route path="/activities" element={
              <ProtectedRoute requirePurchase={true}>
                <Activities />
              </ProtectedRoute>
            } />
            <Route path="/activity-builder" element={
              <ProtectedRoute requirePurchase={true}>
                <ActivityBuilder />
              </ProtectedRoute>
            } />
            <Route path="/activity-builder/:id" element={
              <ProtectedRoute requirePurchase={true}>
                <ActivityBuilder />
              </ProtectedRoute>
            } />
            <Route path="/activity-player/:id" element={
              <ProtectedRoute requirePurchase={true}>
                <ActivityPlayer />
              </ProtectedRoute>
            } />
            <Route path="/interactive-story/:id" element={<InteractiveStory />} />
            <Route path="/ai-story-creator" element={
              <ProtectedRoute requirePurchase={true}>
                <AIStoryCreator />
              </ProtectedRoute>
            } />
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
