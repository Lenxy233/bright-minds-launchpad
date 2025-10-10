import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, Upload, Plus, Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';

interface PageData {
  id?: string;
  pageNumber: number;
  text: string;
  imageFile: File | null;
  audioFile: File | null;
  existingImageUrl?: string | null;
  existingAudioUrl?: string | null;
}

const StoryBookUpload = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const editId = searchParams.get('id');
  const [loading, setLoading] = useState(false);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Character Education & Social Skills');
  const [coverImage, setCoverImage] = useState<File | null>(null);
  const [existingCoverUrl, setExistingCoverUrl] = useState<string | null>(null);
  const [pages, setPages] = useState<PageData[]>([
    { pageNumber: 1, text: '', imageFile: null, audioFile: null },
  ]);

  useEffect(() => {
    if (editId) {
      loadExistingStory();
    }
  }, [editId]);

  const loadExistingStory = async () => {
    try {
      setLoading(true);
      
      // Fetch story book
      const { data: bookData, error: bookError } = await supabase
        .from('story_books')
        .select('*')
        .eq('id', editId)
        .single();

      if (bookError) throw bookError;

      setTitle(bookData.title);
      setDescription(bookData.description || '');
      setCategory(bookData.category || 'Character Education & Social Skills');
      setExistingCoverUrl(bookData.cover_image_url);

      // Fetch pages
      const { data: pagesData, error: pagesError } = await supabase
        .from('story_pages')
        .select('*')
        .eq('story_book_id', editId)
        .order('page_number', { ascending: true });

      if (pagesError) throw pagesError;

      if (pagesData && pagesData.length > 0) {
        setPages(
          pagesData.map((page) => ({
            id: page.id,
            pageNumber: page.page_number,
            text: page.text_content,
            imageFile: null,
            audioFile: null,
            existingImageUrl: page.image_url,
            existingAudioUrl: page.audio_url,
          }))
        );
      }
    } catch (error) {
      console.error('Error loading story:', error);
      toast({
        title: 'Error',
        description: 'Failed to load story for editing',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const addPage = () => {
    setPages([
      ...pages,
      { pageNumber: pages.length + 1, text: '', imageFile: null, audioFile: null },
    ]);
  };

  const removePage = (index: number) => {
    const updatedPages = pages.filter((_, i) => i !== index);
    setPages(updatedPages.map((page, i) => ({ ...page, pageNumber: i + 1 })));
  };

  const updatePage = (index: number, field: keyof PageData, value: any) => {
    const updatedPages = [...pages];
    updatedPages[index] = { ...updatedPages[index], [field]: value };
    setPages(updatedPages);
  };

  const uploadFile = async (file: File, bucket: string, path: string) => {
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(path, file, {
        cacheControl: '3600',
        upsert: false,
      });

    if (error) throw error;

    const { data: urlData } = supabase.storage
      .from(bucket)
      .getPublicUrl(data.path);

    return urlData.publicUrl;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast({
        title: 'Authentication Required',
        description: 'Please log in to upload story books',
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);

    try {
      if (editId) {
        // UPDATE MODE
        // Upload new cover image if provided
        let coverImageUrl = existingCoverUrl;
        if (coverImage) {
          const timestamp = Date.now();
          coverImageUrl = await uploadFile(
            coverImage,
            'story-books',
            `covers/${timestamp}_${coverImage.name}`
          );
        }

        // Update story book
        const { error: bookError } = await supabase
          .from('story_books')
          .update({
            title,
            description,
            category,
            cover_image_url: coverImageUrl,
          })
          .eq('id', editId);

        if (bookError) throw bookError;

        // Update or insert pages
        for (const page of pages) {
          let imageUrl = page.existingImageUrl;
          let audioUrl = page.existingAudioUrl;

          if (page.imageFile) {
            const timestamp = Date.now();
            imageUrl = await uploadFile(
              page.imageFile,
              'story-books',
              `pages/${editId}/${timestamp}_${page.imageFile.name}`
            );
          }

          if (page.audioFile) {
            const timestamp = Date.now();
            audioUrl = await uploadFile(
              page.audioFile,
              'story-books',
              `audio/${editId}/${timestamp}_${page.audioFile.name}`
            );
          }

          if (page.id) {
            // Update existing page
            const { error: pageError } = await supabase
              .from('story_pages')
              .update({
                page_number: page.pageNumber,
                text_content: page.text,
                image_url: imageUrl,
                audio_url: audioUrl,
              })
              .eq('id', page.id);

            if (pageError) throw pageError;
          } else {
            // Insert new page
            const { error: pageError } = await supabase
              .from('story_pages')
              .insert({
                story_book_id: editId,
                page_number: page.pageNumber,
                text_content: page.text,
                image_url: imageUrl,
                audio_url: audioUrl,
              });

            if (pageError) throw pageError;
          }
        }

        toast({
          title: 'Success!',
          description: 'Story book updated successfully',
        });
      } else {
        // CREATE MODE
        // Upload cover image
        let coverImageUrl = '';
        if (coverImage) {
          const timestamp = Date.now();
          coverImageUrl = await uploadFile(
            coverImage,
            'story-books',
            `covers/${timestamp}_${coverImage.name}`
          );
        }

        // Create story book
        const { data: bookData, error: bookError } = await supabase
          .from('story_books')
          .insert({
            title,
            description,
            category,
            cover_image_url: coverImageUrl,
            created_by: user.id,
          })
          .select()
          .single();

        if (bookError) throw bookError;

        // Upload pages
        for (const page of pages) {
          let imageUrl = null;
          let audioUrl = null;

          if (page.imageFile) {
            const timestamp = Date.now();
            imageUrl = await uploadFile(
              page.imageFile,
              'story-books',
              `pages/${bookData.id}/${timestamp}_${page.imageFile.name}`
            );
          }

          if (page.audioFile) {
            const timestamp = Date.now();
            audioUrl = await uploadFile(
              page.audioFile,
              'story-books',
              `audio/${bookData.id}/${timestamp}_${page.audioFile.name}`
            );
          }

          const { error: pageError } = await supabase.from('story_pages').insert({
            story_book_id: bookData.id,
            page_number: page.pageNumber,
            text_content: page.text,
            image_url: imageUrl,
            audio_url: audioUrl,
          });

          if (pageError) throw pageError;
        }

        toast({
          title: 'Success!',
          description: 'Story book uploaded successfully',
        });
      }

      navigate('/story-books');
    } catch (error) {
      console.error('Error uploading story book:', error);
      toast({
        title: 'Error',
        description: editId ? 'Failed to update story book' : 'Failed to upload story book',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-background/80 p-6">
      <div className="max-w-4xl mx-auto">
        <Button
          variant="ghost"
          onClick={() => navigate('/story-books')}
          className="mb-6 gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </Button>

        <h1 className="text-3xl font-bold mb-8 text-center">
          {editId ? 'Edit Story Book' : 'Upload Story Book'}
        </h1>

        <form onSubmit={handleSubmit} className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>Story Book Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="title">Title *</Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={3}
                />
              </div>
              <div>
                <Label htmlFor="category">Category *</Label>
                <Select value={category} onValueChange={setCategory}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Character Education & Social Skills">
                      Character Education & Social Skills
                    </SelectItem>
                    <SelectItem value="STEM & Science">STEM & Science</SelectItem>
                    <SelectItem value="Creativity & Arts">Creativity & Arts</SelectItem>
                    <SelectItem value="Health & Wellness">Health & Wellness</SelectItem>
                    <SelectItem value="Cultural Awareness">Cultural Awareness</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="cover">Cover Image</Label>
                {existingCoverUrl && !coverImage && (
                  <div className="mb-2">
                    <img src={existingCoverUrl} alt="Current cover" className="w-32 h-32 object-cover rounded" />
                    <p className="text-sm text-muted-foreground mt-1">Current cover image</p>
                  </div>
                )}
                <Input
                  id="cover"
                  type="file"
                  accept="image/*"
                  onChange={(e) => setCoverImage(e.target.files?.[0] || null)}
                />
              </div>
            </CardContent>
          </Card>

          {pages.map((page, index) => (
            <Card key={index}>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Page {page.pageNumber}</CardTitle>
                {pages.length > 1 && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removePage(index)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                )}
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor={`text-${index}`}>Text Content *</Label>
                  <Textarea
                    id={`text-${index}`}
                    value={page.text}
                    onChange={(e) => updatePage(index, 'text', e.target.value)}
                    rows={4}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor={`image-${index}`}>Page Image</Label>
                  {page.existingImageUrl && !page.imageFile && (
                    <div className="mb-2">
                      <img src={page.existingImageUrl} alt={`Page ${page.pageNumber}`} className="w-32 h-32 object-cover rounded" />
                      <p className="text-sm text-muted-foreground mt-1">Current image</p>
                    </div>
                  )}
                  <Input
                    id={`image-${index}`}
                    type="file"
                    accept="image/*"
                    onChange={(e) =>
                      updatePage(index, 'imageFile', e.target.files?.[0] || null)
                    }
                  />
                </div>
                <div>
                  <Label htmlFor={`audio-${index}`}>Audio File</Label>
                  {page.existingAudioUrl && !page.audioFile && (
                    <div className="mb-2">
                      <audio controls src={page.existingAudioUrl} className="w-full" />
                      <p className="text-sm text-muted-foreground mt-1">Current audio</p>
                    </div>
                  )}
                  <Input
                    id={`audio-${index}`}
                    type="file"
                    accept="audio/*"
                    onChange={(e) =>
                      updatePage(index, 'audioFile', e.target.files?.[0] || null)
                    }
                  />
                </div>
              </CardContent>
            </Card>
          ))}

          <Button
            type="button"
            variant="outline"
            onClick={addPage}
            className="w-full gap-2"
          >
            <Plus className="w-4 h-4" />
            Add Another Page
          </Button>

          <Button type="submit" className="w-full" size="lg" disabled={loading}>
            {loading ? (
              editId ? 'Updating...' : 'Uploading...'
            ) : (
              <>
                <Upload className="w-5 h-5 mr-2" />
                {editId ? 'Update Story Book' : 'Upload Story Book'}
              </>
            )}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default StoryBookUpload;
