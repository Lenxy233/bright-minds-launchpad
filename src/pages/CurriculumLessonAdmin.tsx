import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Plus, Trash2, Pencil, Sparkles } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

interface Lesson {
  id: string;
  title: string;
  description: string;
  category: string;
  content_type: string;
  is_published: boolean;
  content_data: any;
}

const CATEGORIES = [
  "Language & Literacy",
  "Math & Numbers",
  "Arts & Crafts",
  "Music & Movement",
  "Science & Discovery",
  "Social & Emotional",
  "Around the World",
  "Interactive Activities"
];

const CONTENT_TYPES = [
  { value: "worksheet", label: "Worksheet/Printable" },
  { value: "interactive", label: "Interactive Activity" },
  { value: "video", label: "Video Lesson" },
  { value: "quiz", label: "Quiz/Assessment" },
  { value: "story", label: "Story/Reading" }
];

const CurriculumLessonAdmin = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [isCreating, setIsCreating] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showAiDialog, setShowAiDialog] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  
  const [aiFormData, setAiFormData] = useState({
    topic: "",
    category: "",
    contentType: "",
    ageRange: "4-6 years"
  });
  
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    content_type: "",
    content_data: { text: "", instructions: "" },
    is_published: false
  });

  useEffect(() => {
    fetchLessons();
  }, []);

  const fetchLessons = async () => {
    const { data, error } = await supabase
      .from("curriculum_lessons")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      toast({ title: "Error loading lessons", variant: "destructive" });
      return;
    }
    setLessons(data || []);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title || !formData.category || !formData.content_type) {
      toast({ title: "Please fill in all required fields", variant: "destructive" });
      return;
    }

    const lessonData = {
      ...formData,
      created_by: (await supabase.auth.getUser()).data.user?.id
    };

    if (editingId) {
      const { error } = await supabase
        .from("curriculum_lessons")
        .update(lessonData)
        .eq("id", editingId);

      if (error) {
        toast({ title: "Error updating lesson", variant: "destructive" });
        return;
      }
      toast({ title: "Lesson updated successfully!" });
    } else {
      const { error } = await supabase
        .from("curriculum_lessons")
        .insert(lessonData);

      if (error) {
        toast({ title: "Error creating lesson", variant: "destructive" });
        return;
      }
      toast({ title: "Lesson created successfully!" });
    }

    setFormData({
      title: "",
      description: "",
      category: "",
      content_type: "",
      content_data: { text: "", instructions: "" },
      is_published: false
    });
    setIsCreating(false);
    setEditingId(null);
    fetchLessons();
  };

  const handleEdit = (lesson: Lesson) => {
    setFormData({
      title: lesson.title,
      description: lesson.description || "",
      category: lesson.category,
      content_type: lesson.content_type,
      content_data: lesson.content_data as any,
      is_published: lesson.is_published
    });
    setEditingId(lesson.id);
    setIsCreating(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this lesson?")) return;

    const { error } = await supabase
      .from("curriculum_lessons")
      .delete()
      .eq("id", id);

    if (error) {
      toast({ title: "Error deleting lesson", variant: "destructive" });
      return;
    }
    toast({ title: "Lesson deleted successfully!" });
    fetchLessons();
  };

  const handleAiGenerate = async () => {
    if (!aiFormData.topic || !aiFormData.category || !aiFormData.contentType) {
      toast({ title: "Please fill in all fields", variant: "destructive" });
      return;
    }

    setIsGenerating(true);
    try {
      const { data, error } = await supabase.functions.invoke("generate-lesson-content", {
        body: aiFormData
      });

      if (error) {
        if (error.message.includes("429")) {
          toast({ 
            title: "Rate limit exceeded", 
            description: "Please try again later.",
            variant: "destructive" 
          });
        } else if (error.message.includes("402")) {
          toast({ 
            title: "Lovable AI credits needed", 
            description: "Add credits in Settings → Workspace → Usage",
            variant: "destructive" 
          });
        } else {
          throw error;
        }
        return;
      }

      // Parse the structured AI response
      const parsedData = data || {};
      const lessonTitle = parsedData.title || `${aiFormData.topic} - ${aiFormData.category}`;
      const lessonDesc = parsedData.description || `Learn about ${aiFormData.topic}`;
      
      // Format the full content with all sections
      let formattedContent = parsedData.content || parsedData.rawContent || '';
      
      if (parsedData.learningGoals) {
        formattedContent += `\n\n**Learning Goals:**\n${parsedData.learningGoals}`;
      }
      
      if (parsedData.materials) {
        formattedContent += `\n\n**Materials Needed:**\n${parsedData.materials}`;
      }
      
      // Pre-fill the form
      setFormData({
        title: lessonTitle,
        description: lessonDesc,
        category: aiFormData.category,
        content_type: aiFormData.contentType,
        content_data: { 
          text: formattedContent,
          instructions: formattedContent 
        },
        is_published: false
      });

      setShowAiDialog(false);
      setIsCreating(true);
      toast({ title: "AI lesson created! Review and save." });
    } catch (error) {
      console.error("Error generating lesson:", error);
      toast({ 
        title: "Failed to generate lesson", 
        description: error instanceof Error ? error.message : "Check console for details",
        variant: "destructive" 
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-secondary/5 to-accent/5 p-4 md:p-8">
      <div className="container mx-auto max-w-6xl">
        <Button onClick={() => navigate(-1)} variant="ghost" className="mb-6">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>

        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
            Curriculum Lesson Manager
          </h1>
          <p className="text-muted-foreground">Create and manage custom curriculum lessons</p>
        </div>

        {!isCreating ? (
          <>
            <div className="mb-6 flex gap-2 flex-wrap">
              <Button onClick={() => setIsCreating(true)} className="flex-1 md:flex-none">
                <Plus className="w-4 h-4 mr-2" />
                Create New Lesson
              </Button>
              
              <Dialog open={showAiDialog} onOpenChange={setShowAiDialog}>
                <DialogTrigger asChild>
                  <Button variant="outline" className="flex-1 md:flex-none">
                    <Sparkles className="w-4 h-4 mr-2" />
                    AI Generate Lesson
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Generate Lesson with AI</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div>
                      <Label htmlFor="ai-topic">Lesson Topic *</Label>
                      <Input
                        id="ai-topic"
                        value={aiFormData.topic}
                        onChange={(e) => setAiFormData({ ...aiFormData, topic: e.target.value })}
                        placeholder="e.g., Animal Sounds, Counting to 10"
                      />
                    </div>

                    <div>
                      <Label htmlFor="ai-category">Category *</Label>
                      <Select 
                        value={aiFormData.category} 
                        onValueChange={(value) => setAiFormData({ ...aiFormData, category: value })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          {CATEGORIES.map((cat) => (
                            <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="ai-content-type">Content Type *</Label>
                      <Select 
                        value={aiFormData.contentType} 
                        onValueChange={(value) => setAiFormData({ ...aiFormData, contentType: value })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select content type" />
                        </SelectTrigger>
                        <SelectContent>
                          {CONTENT_TYPES.map((type) => (
                            <SelectItem key={type.value} value={type.value}>{type.label}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="ai-age-range">Age Range</Label>
                      <Input
                        id="ai-age-range"
                        value={aiFormData.ageRange}
                        onChange={(e) => setAiFormData({ ...aiFormData, ageRange: e.target.value })}
                        placeholder="e.g., 4-6 years"
                      />
                    </div>

                    <Button 
                      onClick={handleAiGenerate} 
                      disabled={isGenerating}
                      className="w-full"
                    >
                      {isGenerating ? (
                        <>
                          <Sparkles className="w-4 h-4 mr-2 animate-pulse" />
                          Generating...
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-4 h-4 mr-2" />
                          Generate Lesson
                        </>
                      )}
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            <div className="grid gap-4">
              {lessons.map((lesson) => (
                <Card key={lesson.id}>
                  <CardContent className="flex items-center justify-between p-6">
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg">{lesson.title}</h3>
                      <p className="text-sm text-muted-foreground">{lesson.category}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {CONTENT_TYPES.find(ct => ct.value === lesson.content_type)?.label}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-1 rounded text-xs ${lesson.is_published ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>
                        {lesson.is_published ? 'Published' : 'Draft'}
                      </span>
                      <Button variant="ghost" size="icon" onClick={() => handleEdit(lesson)}>
                        <Pencil className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => handleDelete(lesson.id)}>
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle>{editingId ? "Edit Lesson" : "Create New Lesson"}</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="title">Lesson Title *</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="e.g., Phonics Practice Level 1"
                  />
                </div>

                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Brief description of the lesson"
                  />
                </div>

                <div>
                  <Label htmlFor="category">Category *</Label>
                  <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {CATEGORIES.map((cat) => (
                        <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="content_type">Content Type *</Label>
                  <Select value={formData.content_type} onValueChange={(value) => setFormData({ ...formData, content_type: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select content type" />
                    </SelectTrigger>
                    <SelectContent>
                      {CONTENT_TYPES.map((type) => (
                        <SelectItem key={type.value} value={type.value}>{type.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="instructions">Instructions/Content</Label>
                  <Textarea
                    id="instructions"
                    value={formData.content_data.instructions}
                    onChange={(e) => setFormData({ 
                      ...formData, 
                      content_data: { ...formData.content_data, instructions: e.target.value }
                    })}
                    placeholder="Add lesson instructions or content here"
                    rows={6}
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="published"
                    checked={formData.is_published}
                    onCheckedChange={(checked) => setFormData({ ...formData, is_published: checked })}
                  />
                  <Label htmlFor="published">Publish lesson</Label>
                </div>

                <div className="flex gap-2">
                  <Button type="submit">
                    {editingId ? "Update Lesson" : "Create Lesson"}
                  </Button>
                  <Button type="button" variant="outline" onClick={() => {
                    setIsCreating(false);
                    setEditingId(null);
                    setFormData({
                      title: "",
                      description: "",
                      category: "",
                      content_type: "",
                      content_data: { text: "", instructions: "" },
                      is_published: false
                    });
                  }}>
                    Cancel
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default CurriculumLessonAdmin;