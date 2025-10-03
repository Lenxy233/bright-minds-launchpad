import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Plus, FileText, Trash2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface Worksheet {
  id: string;
  title: string;
  description: string;
  subject: string;
  difficulty: string;
  created_at: string;
}

interface WorksheetsTabProps {
  parentId: string;
}

const WorksheetsTab = ({ parentId }: WorksheetsTabProps) => {
  const [worksheets, setWorksheets] = useState<Worksheet[]>([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    subject: '',
    difficulty: '',
  });
  const { toast } = useToast();

  useEffect(() => {
    fetchWorksheets();
  }, [parentId]);

  const fetchWorksheets = async () => {
    const { data, error } = await supabase
      .from('worksheets' as any)
      .select('*')
      .eq('created_by', parentId)
      .order('created_at', { ascending: false });

    if (error) {
      toast({
        title: 'Error',
        description: 'Failed to load worksheets',
        variant: 'destructive',
      });
      return;
    }

    setWorksheets(data as any || []);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { error } = await supabase.from('worksheets' as any).insert({
      ...formData,
      created_by: parentId,
    });

    if (error) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    } else {
      toast({
        title: 'Success',
        description: 'Worksheet created successfully!',
      });
      setFormData({ title: '', description: '', subject: '', difficulty: '' });
      setShowForm(false);
      fetchWorksheets();
    }

    setLoading(false);
  };

  const handleDelete = async (worksheetId: string, title: string) => {
    if (!confirm(`Are you sure you want to delete "${title}"?`)) {
      return;
    }

    const { error } = await supabase
      .from('worksheets' as any)
      .delete()
      .eq('id', worksheetId);

    if (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete worksheet',
        variant: 'destructive',
      });
    } else {
      toast({
        title: 'Success',
        description: 'Worksheet deleted successfully',
      });
      fetchWorksheets();
    }
  };

  return (
    <div className="space-y-6">
      <Card className="bg-white/80">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Worksheets</CardTitle>
              <CardDescription>Create and manage learning worksheets</CardDescription>
            </div>
            {!showForm && (
              <Button onClick={() => setShowForm(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Add Worksheet
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {showForm && (
            <form onSubmit={handleSubmit} className="space-y-4 mb-6 p-4 border rounded-lg bg-blue-50">
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Math Practice"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Practice addition and subtraction..."
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="subject">Subject</Label>
                  <Select
                    value={formData.subject}
                    onValueChange={(value) => setFormData({ ...formData, subject: value })}
                    required
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select subject" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="math">Math</SelectItem>
                      <SelectItem value="reading">Reading</SelectItem>
                      <SelectItem value="science">Science</SelectItem>
                      <SelectItem value="art">Art</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="difficulty">Difficulty</Label>
                  <Select
                    value={formData.difficulty}
                    onValueChange={(value) => setFormData({ ...formData, difficulty: value })}
                    required
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select difficulty" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="easy">Easy</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="hard">Hard</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="flex gap-2">
                <Button type="submit" disabled={loading}>
                  {loading ? 'Creating...' : 'Create Worksheet'}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setShowForm(false);
                    setFormData({ title: '', description: '', subject: '', difficulty: '' });
                  }}
                >
                  Cancel
                </Button>
              </div>
            </form>
          )}

          {worksheets.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <FileText className="mx-auto h-12 w-12 mb-4 opacity-50" />
              <p>No worksheets yet. Create one to get started!</p>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {worksheets.map((worksheet) => (
                <Card key={worksheet.id} className="bg-gradient-to-br from-blue-50 to-green-50">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-lg">{worksheet.title}</CardTitle>
                        <CardDescription className="mt-2">{worksheet.description}</CardDescription>
                        <div className="flex gap-2 mt-3">
                          <Badge variant="secondary">{worksheet.subject}</Badge>
                          <Badge variant="outline">{worksheet.difficulty}</Badge>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(worksheet.id, worksheet.title)}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardHeader>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default WorksheetsTab;
