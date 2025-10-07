import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BookOpen, Plus, ArrowLeft } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface StoryBook {
  id: string;
  title: string;
  description: string;
  cover_image_url: string;
  category: string;
}

const StoryBooks = () => {
  const [storyBooks, setStoryBooks] = useState<StoryBook[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    fetchStoryBooks();
  }, []);

  const fetchStoryBooks = async () => {
    try {
      const { data, error } = await supabase
        .from('story_books')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setStoryBooks(data || []);
    } catch (error) {
      console.error('Error fetching story books:', error);
      toast({
        title: 'Error',
        description: 'Failed to load story books',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-background/80 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <Button
            variant="ghost"
            onClick={() => navigate('/learning-app')}
            className="gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </Button>
          <Button
            onClick={() => navigate('/story-books/upload')}
            className="gap-2"
          >
            <Plus className="w-4 h-4" />
            Add Story Book
          </Button>
        </div>

        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            Story Books
          </h1>
          <p className="text-muted-foreground text-lg">
            Read along with audio narration
          </p>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Loading story books...</p>
          </div>
        ) : storyBooks.length === 0 ? (
          <div className="text-center py-12">
            <BookOpen className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
            <p className="text-muted-foreground mb-4">No story books yet</p>
            <Button onClick={() => navigate('/story-books/upload')}>
              Add Your First Story Book
            </Button>
          </div>
        ) : (
          <div className="space-y-12">
            {Object.entries(
              storyBooks.reduce((acc, book) => {
                const category = book.category || 'Uncategorized';
                if (!acc[category]) acc[category] = [];
                acc[category].push(book);
                return acc;
              }, {} as Record<string, StoryBook[]>)
            ).map(([category, books]) => (
              <div key={category}>
                <h2 className="text-2xl font-semibold mb-6 text-foreground">
                  {category}
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {books.map((book) => (
                    <Card
                      key={book.id}
                      className="cursor-pointer hover:shadow-lg transition-shadow"
                      onClick={() => navigate(`/story-books/${book.id}`)}
                    >
                      {book.cover_image_url && (
                        <div className="aspect-[3/4] overflow-hidden rounded-t-lg">
                          <img
                            src={book.cover_image_url}
                            alt={book.title}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}
                      <CardHeader>
                        <CardTitle className="line-clamp-2">{book.title}</CardTitle>
                        {book.description && (
                          <CardDescription className="line-clamp-3">
                            {book.description}
                          </CardDescription>
                        )}
                      </CardHeader>
                      <CardContent>
                        <Button className="w-full" variant="outline">
                          <BookOpen className="w-4 h-4 mr-2" />
                          Read Story
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default StoryBooks;
