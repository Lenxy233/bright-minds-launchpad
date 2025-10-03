import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Plus, Trash2, UserCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface KidProfile {
  id: string;
  username: string;
  age: number;
  created_at: string;
}

interface KidProfilesTabProps {
  parentId: string;
}

const KidProfilesTab = ({ parentId }: KidProfilesTabProps) => {
  const [kids, setKids] = useState<KidProfile[]>([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    pin: '',
    age: '',
  });
  const { toast } = useToast();

  useEffect(() => {
    fetchKids();
  }, [parentId]);

  const fetchKids = async () => {
    const { data, error } = await supabase
      .from('kid_profiles' as any)
      .select('*')
      .eq('parent_id', parentId)
      .order('created_at', { ascending: false });

    if (error) {
      toast({
        title: 'Error',
        description: 'Failed to load kid profiles',
        variant: 'destructive',
      });
      return;
    }

    setKids(data as any || []);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { error } = await supabase.from('kid_profiles' as any).insert({
      parent_id: parentId,
      username: formData.username,
      pin_hash: formData.pin, // In production, hash this properly
      age: parseInt(formData.age),
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
        description: `Profile created for ${formData.username}!`,
      });
      setFormData({ username: '', pin: '', age: '' });
      setShowForm(false);
      fetchKids();
    }

    setLoading(false);
  };

  const handleDelete = async (kidId: string, username: string) => {
    if (!confirm(`Are you sure you want to delete ${username}'s profile?`)) {
      return;
    }

    const { error } = await supabase
      .from('kid_profiles' as any)
      .delete()
      .eq('id', kidId);

    if (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete profile',
        variant: 'destructive',
      });
    } else {
      toast({
        title: 'Success',
        description: 'Profile deleted successfully',
      });
      fetchKids();
    }
  };

  return (
    <div className="space-y-6">
      <Card className="bg-white/80">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Kid Profiles</CardTitle>
              <CardDescription>Manage your kids' learning profiles</CardDescription>
            </div>
            {!showForm && (
              <Button onClick={() => setShowForm(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Add Kid
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {showForm && (
            <form onSubmit={handleSubmit} className="space-y-4 mb-6 p-4 border rounded-lg bg-purple-50">
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  placeholder="Choose a fun username"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="pin">PIN (4 digits)</Label>
                <Input
                  id="pin"
                  type="password"
                  maxLength={4}
                  value={formData.pin}
                  onChange={(e) => setFormData({ ...formData, pin: e.target.value.replace(/\D/g, '') })}
                  placeholder="1234"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="age">Age</Label>
                <Input
                  id="age"
                  type="number"
                  min="3"
                  max="18"
                  value={formData.age}
                  onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                  placeholder="8"
                  required
                />
              </div>
              <div className="flex gap-2">
                <Button type="submit" disabled={loading}>
                  {loading ? 'Creating...' : 'Create Profile'}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setShowForm(false);
                    setFormData({ username: '', pin: '', age: '' });
                  }}
                >
                  Cancel
                </Button>
              </div>
            </form>
          )}

          {kids.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <UserCircle className="mx-auto h-12 w-12 mb-4 opacity-50" />
              <p>No kid profiles yet. Add one to get started!</p>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {kids.map((kid) => (
                <Card key={kid.id} className="bg-gradient-to-br from-purple-50 to-pink-50">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="bg-purple-200 p-2 rounded-full">
                          <UserCircle className="h-8 w-8 text-purple-700" />
                        </div>
                        <div>
                          <CardTitle className="text-lg">{kid.username}</CardTitle>
                          <Badge variant="secondary" className="mt-1">
                            Age {kid.age}
                          </Badge>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(kid.id, kid.username)}
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

export default KidProfilesTab;
