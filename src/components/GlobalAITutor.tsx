import { useState } from "react";
import { Button } from "@/components/ui/button";
import { MessageCircle } from "lucide-react";
import AITutorChat from "./AITutorChat";
import { useLocation } from "react-router-dom";

const GlobalAITutor = () => {
  const [showChat, setShowChat] = useState(false);
  const location = useLocation();

  // Don't show on homepage, auth, or dashboard pages
  const hiddenRoutes = ["/", "/auth", "/dashboard", "/new-product-launch"];
  if (hiddenRoutes.includes(location.pathname)) {
    return null;
  }

  // Don't show in story reader (it has its own AI tutor)
  if (location.pathname.startsWith("/story-books/") && location.pathname !== "/story-books") {
    return null;
  }

  return (
    <>
      {/* Floating AI Tutor Button */}
      {!showChat && (
        <Button
          onClick={() => setShowChat(true)}
          className="fixed bottom-8 right-8 h-14 w-14 rounded-full shadow-lg bg-green-600 hover:bg-green-700 z-50"
          size="icon"
          aria-label="Open AI Tutor"
        >
          <MessageCircle className="w-6 h-6" />
        </Button>
      )}

      {/* AI Tutor Chat Overlay */}
      {showChat && (
        <div className="fixed bottom-8 right-8 w-96 h-[600px] z-50 shadow-2xl rounded-lg">
          <AITutorChat
            onClose={() => setShowChat(false)}
          />
        </div>
      )}
    </>
  );
};

export default GlobalAITutor;
