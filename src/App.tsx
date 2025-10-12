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
import NotFound from "./pages/NotFound";

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
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } />
            <Route path="/new-product-launch" element={<NewProductLaunch />} />
            <Route path="/learning-app" element={<LearningApp />} />
            <Route path="/story-books" element={<StoryBooks />} />
            <Route path="/story-books/:id" element={<StoryBookReader />} />
            <Route path="/story-books/upload" element={
              <ProtectedRoute>
                <StoryBookUpload />
              </ProtectedRoute>
            } />
            <Route path="/story-books/batch-upload" element={
              <ProtectedRoute>
                <BatchStoryUpload />
              </ProtectedRoute>
            } />
            <Route path="/parent-dashboard" element={
              <ProtectedRoute>
                <ParentDashboard />
              </ProtectedRoute>
            } />
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
