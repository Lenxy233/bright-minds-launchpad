import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { BookOpen, Plus, ArrowLeft, Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';

const CATEGORIES = [
  'All',
  'Character Education & Social Skills',
  'STEM & Science',
  'Creativity & Arts',
  'Health & Wellness',
  'Cultural Awareness',
  'Uncategorized',
];

interface StoryBook {
  id: string;
  title: string;
  description: string;
  cover_image_url: string;
  category: string;
  created_by: string | null;
}

const StoryBooks = () => {
  const [storyBooks, setStoryBooks] = useState<StoryBook[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [bookToDelete, setBookToDelete] = useState<StoryBook | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();

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

  const filteredBooks = selectedCategory === 'All' 
    ? storyBooks 
    : storyBooks.filter(book => (book.category || 'Uncategorized') === selectedCategory);

  const getCategoryCount = (category: string) => {
    if (category === 'All') return storyBooks.length;
    return storyBooks.filter(book => (book.category || 'Uncategorized') === category).length;
  };

  const handleDeleteClick = (e: React.MouseEvent, book: StoryBook) => {
    e.stopPropagation();
    setBookToDelete(book);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!bookToDelete) return;

    try {
      // Delete all pages first
      const { error: pagesError } = await supabase
        .from('story_pages')
        .delete()
        .eq('story_book_id', bookToDelete.id);

      if (pagesError) throw pagesError;

      // Delete the story book
      const { error: bookError } = await supabase
        .from('story_books')
        .delete()
        .eq('id', bookToDelete.id);

      if (bookError) throw bookError;

      toast({
        title: 'Success',
        description: 'Story book deleted successfully',
      });

      // Refresh the list
      fetchStoryBooks();
    } catch (error) {
      console.error('Error deleting story book:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete story book',
        variant: 'destructive',
      });
    } finally {
      setDeleteDialogOpen(false);
      setBookToDelete(null);
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
          <Tabs value={selectedCategory} onValueChange={setSelectedCategory} className="w-full">
            <TabsList className="w-full flex flex-wrap h-auto justify-start gap-2 bg-muted/50 p-2 mb-8">
              {CATEGORIES.map((category) => {
                const count = getCategoryCount(category);
                return count > 0 ? (
                  <TabsTrigger 
                    key={category} 
                    value={category}
                    className="flex items-center gap-2"
                  >
                    {category}
                    <Badge variant="secondary" className="ml-1">
                      {count}
                    </Badge>
                  </TabsTrigger>
                ) : null;
              })}
            </TabsList>

            {CATEGORIES.map((category) => (
              <TabsContent key={category} value={category} className="mt-0">
                {filteredBooks.length === 0 ? (
                  <div className="text-center py-12">
                    <BookOpen className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
                    <p className="text-muted-foreground">No story books in this category</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredBooks.map((book) => {
                      const isCreator = user && book.created_by === user.id;
                      return (
                        <Card
                          key={book.id}
                          className="cursor-pointer hover:shadow-lg transition-all hover:-translate-y-1 relative"
                          onClick={() => navigate(`/story-books/${book.id}`)}
                        >
                          {isCreator && (
                            <Button
                              variant="destructive"
                              size="icon"
                              className="absolute top-2 right-2 z-10 h-8 w-8"
                              onClick={(e) => handleDeleteClick(e, book)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          )}
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
                            <div className="flex items-start justify-between gap-2 mb-2">
                              <CardTitle className="line-clamp-2 flex-1">{book.title}</CardTitle>
                              {selectedCategory === 'All' && (
                                <Badge variant="outline" className="shrink-0 text-xs">
                                  {book.category || 'Uncategorized'}
                                </Badge>
                              )}
                            </div>
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
                      );
                    })}
                  </div>
                )}
              </TabsContent>
            ))}
          </Tabs>
        )}
      </div>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Story Book</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{bookToDelete?.title}"? This action cannot be undone and will delete all pages in this story book.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteConfirm} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default StoryBooks;
