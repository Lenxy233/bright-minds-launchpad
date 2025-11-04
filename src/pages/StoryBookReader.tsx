import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ArrowRight, Play, Pause, Edit2, MessageCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import AITutorChat from '@/components/AITutorChat';

interface StoryPage {
  id: string;
  page_number: number;
  text_content: string;
  image_url: string | null;
  audio_url: string | null;
}

interface StoryBook {
  id: string;
  title: string;
  description: string;
  created_by: string | null;
}

const StoryBookReader = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  const audioRef = useRef<HTMLAudioElement>(null);

  const [book, setBook] = useState<StoryBook | null>(null);
  const [pages, setPages] = useState<StoryPage[]>([]);
  const [currentPageIndex, setCurrentPageIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [highlightedText, setHighlightedText] = useState<string>('');
  const [showTutorChat, setShowTutorChat] = useState(false);

  useEffect(() => {
    if (id) {
      fetchStoryBook();
      fetchPages();
    }
  }, [id]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.addEventListener('ended', handleAudioEnd);
      audioRef.current.addEventListener('timeupdate', handleTimeUpdate);
    }
    return () => {
      if (audioRef.current) {
        audioRef.current.removeEventListener('ended', handleAudioEnd);
        audioRef.current.removeEventListener('timeupdate', handleTimeUpdate);
      }
    };
  }, [currentPageIndex, pages]);

  const fetchStoryBook = async () => {
    try {
      const { data, error } = await supabase
        .from('story_books')
        .select('id, title, description, created_by')
        .eq('id', id)
        .single();

      if (error) throw error;
      setBook(data);
    } catch (error) {
      console.error('Error fetching story book:', error);
      toast({
        title: 'Error',
        description: 'Failed to load story book',
        variant: 'destructive',
      });
    }
  };

  const fetchPages = async () => {
    try {
      const { data, error } = await supabase
        .from('story_pages')
        .select('*')
        .eq('story_book_id', id)
        .order('page_number', { ascending: true });

      if (error) throw error;
      setPages(data || []);
    } catch (error) {
      console.error('Error fetching pages:', error);
      toast({
        title: 'Error',
        description: 'Failed to load story pages',
        variant: 'destructive',
      });
    }
  };

  const handleAudioEnd = () => {
    setIsPlaying(false);
    setHighlightedText('');
  };

  const handleTimeUpdate = () => {
    if (audioRef.current && pages[currentPageIndex]) {
      const currentTime = audioRef.current.currentTime;
      const duration = audioRef.current.duration;
      const progress = currentTime / duration;
      
      const words = pages[currentPageIndex].text_content.split(' ');
      const wordsToHighlight = Math.floor(progress * words.length);
      setHighlightedText(words.slice(0, wordsToHighlight).join(' '));
    }
  };

  const toggleAudio = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const goToNextPage = () => {
    if (currentPageIndex < pages.length - 1) {
      setCurrentPageIndex(currentPageIndex + 1);
      setIsPlaying(false);
      setHighlightedText('');
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
    }
  };

  const goToPreviousPage = () => {
    if (currentPageIndex > 0) {
      setCurrentPageIndex(currentPageIndex - 1);
      setIsPlaying(false);
      setHighlightedText('');
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
    }
  };

  const handleEditClick = () => {
    navigate(`/story-books/upload?id=${id}`);
  };

  const currentPage = pages[currentPageIndex];
  const isCreator = user && book && user.id === book.created_by;

  if (!book || pages.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Loading story...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-purple-100 sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Button
              onClick={() => navigate('/story-books')}
              variant="ghost"
              className="gap-2"
            >
              <ArrowLeft className="w-5 h-5" />
              Back to Stories
            </Button>
            {isCreator && (
              <Button
                onClick={handleEditClick}
                variant="outline"
                className="gap-2"
              >
                <Edit2 className="w-4 h-4" />
                Edit Story
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8 flex gap-4">
        {/* Story Reader */}
        <div className={`${showTutorChat ? 'flex-1' : 'max-w-4xl mx-auto w-full'}`}>
          <div className="bg-white rounded-2xl shadow-xl p-8 mb-6">
            <h1 className="text-4xl font-bold text-center mb-2 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              {book.title}
            </h1>
            <p className="text-center text-gray-600 mb-4">{book.description}</p>
            <div className="flex justify-center items-center gap-2 mb-6">
              <span className="text-sm text-gray-500">
                Page {currentPageIndex + 1} of {pages.length}
              </span>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-xl p-8">
            {currentPage?.image_url && (
              <div className="mb-6 rounded-lg overflow-hidden">
                <img
                  src={currentPage.image_url}
                  alt={`Page ${currentPageIndex + 1}`}
                  className="w-full h-auto object-contain max-h-96"
                />
              </div>
            )}

            <div className="text-lg leading-relaxed mb-6">
              {currentPage?.text_content.split(' ').map((word, index) => {
                const isHighlighted = highlightedText.split(' ').includes(word);
                return (
                  <span
                    key={index}
                    className={`transition-colors duration-200 ${
                      isHighlighted ? 'bg-primary/20 text-primary font-semibold' : ''
                    }`}
                  >
                    {word}{' '}
                  </span>
                );
              })}
            </div>

            {currentPage?.audio_url && (
              <div className="flex justify-center gap-4 mb-6">
                <audio ref={audioRef} src={currentPage.audio_url} />
                <Button
                  onClick={toggleAudio}
                  size="lg"
                  className="gap-2"
                >
                  {isPlaying ? (
                    <>
                      <Pause className="w-5 h-5" />
                      Pause
                    </>
                  ) : (
                    <>
                      <Play className="w-5 h-5" />
                      Play Audio
                    </>
                  )}
                </Button>
              </div>
            )}
          </div>

          <div className="flex justify-between gap-4 mt-6">
            <Button
              onClick={goToPreviousPage}
              disabled={currentPageIndex === 0}
              variant="outline"
              size="lg"
              className="gap-2"
            >
              <ArrowLeft className="w-5 h-5" />
              Previous
            </Button>
            <Button
              onClick={goToNextPage}
              disabled={currentPageIndex === pages.length - 1}
              size="lg"
              className="gap-2"
            >
              Next
              <ArrowRight className="w-5 h-5" />
            </Button>
          </div>
        </div>

        {/* AI Tutor Chat Sidebar */}
        {showTutorChat && (
          <div className="w-96 h-[calc(100vh-12rem)] sticky top-24">
            <AITutorChat
              storyTitle={book.title}
              storyContent={pages.map(p => p.text_content).join('\n\n')}
              onClose={() => setShowTutorChat(false)}
            />
          </div>
        )}
      </div>

      {/* Floating AI Tutor Button */}
      {!showTutorChat && (
        <Button
          onClick={() => setShowTutorChat(true)}
          className="fixed bottom-8 right-8 h-14 w-14 rounded-full shadow-lg bg-green-600 hover:bg-green-700"
          size="icon"
        >
          <MessageCircle className="w-6 h-6" />
        </Button>
      )}
    </div>
  );
};

export default StoryBookReader;