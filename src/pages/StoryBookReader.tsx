import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ArrowRight, Play, Pause, Volume2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface StoryPage {
  id: string;
  page_number: number;
  text_content: string;
  image_url: string | null;
  audio_url: string | null;
}

interface StoryBook {
  title: string;
  description: string;
}

const StoryBookReader = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const audioRef = useRef<HTMLAudioElement>(null);

  const [book, setBook] = useState<StoryBook | null>(null);
  const [pages, setPages] = useState<StoryPage[]>([]);
  const [currentPageIndex, setCurrentPageIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [highlightedText, setHighlightedText] = useState<string>('');

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
        .select('title, description')
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

  const currentPage = pages[currentPageIndex];

  if (!book || pages.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Loading story...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-background/80 p-6">
      <div className="max-w-4xl mx-auto">
        <Button
          variant="ghost"
          onClick={() => navigate('/story-books')}
          className="mb-6 gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Story Books
        </Button>

        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">{book.title}</h1>
          <p className="text-muted-foreground">
            Page {currentPageIndex + 1} of {pages.length}
          </p>
        </div>

        <div className="bg-card rounded-lg shadow-lg p-8 mb-6">
          {currentPage?.image_url && (
            <div className="aspect-video mb-6 overflow-hidden rounded-lg">
              <img
                src={currentPage.image_url}
                alt={`Page ${currentPage.page_number}`}
                className="w-full h-full object-contain"
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

        <div className="flex justify-between gap-4">
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
    </div>
  );
};

export default StoryBookReader;
