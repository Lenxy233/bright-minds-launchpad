import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Puzzle, Move, CheckSquare, MousePointer, Check, X, Save, Eye } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";

type ActivityType = "matching" | "drag-drop" | "quiz" | "tap-find" | "true-false" | "fill-blanks";

interface ActivityItem {
  id: string;
  content: string;
  match?: string;
  isCorrect?: boolean;
  options?: string[];
}

export default function ActivityBuilder() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [step, setStep] = useState(1);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [activityType, setActivityType] = useState<ActivityType | "">("");
  const [difficulty, setDifficulty] = useState<"easy" | "medium" | "hard">("easy");
  const [ageRange, setAgeRange] = useState("");
  const [items, setItems] = useState<ActivityItem[]>([]);
  const [saving, setSaving] = useState(false);

  const activityTypes = [
    {
      type: "matching" as ActivityType,
      icon: Puzzle,
      title: "Matching Pairs",
      description: "Match items from left to right columns"
    },
    {
      type: "drag-drop" as ActivityType,
      icon: Move,
      title: "Drag & Drop",
      description: "Drag items to correct positions"
    },
    {
      type: "quiz" as ActivityType,
      icon: CheckSquare,
      title: "Multiple Choice",
      description: "Choose the correct answer"
    },
    {
      type: "tap-find" as ActivityType,
      icon: MousePointer,
      title: "Tap to Find",
      description: "Tap the correct items"
    },
    {
      type: "true-false" as ActivityType,
      icon: Check,
      title: "True or False",
      description: "Determine if statements are true or false"
    },
    {
      type: "fill-blanks" as ActivityType,
      icon: X,
      title: "Fill in the Blanks",
      description: "Complete sentences with correct words"
    }
  ];

  const addItem = () => {
    const newItem: ActivityItem = {
      id: Math.random().toString(),
      content: "",
      match: activityType === "matching" ? "" : undefined,
      isCorrect: activityType === "true-false" ? true : undefined,
      options: activityType === "quiz" ? ["", "", "", ""] : undefined
    };
    setItems([...items, newItem]);
  };

  const updateItem = (id: string, field: string, value: any) => {
    setItems(items.map(item => 
      item.id === id ? { ...item, [field]: value } : item
    ));
  };

  const removeItem = (id: string) => {
    setItems(items.filter(item => item.id !== id));
  };

  const handleSave = async (publish: boolean = false) => {
    if (!user) {
      toast.error("Please sign in to save activities");
      return;
    }

    if (!title || !activityType || items.length === 0) {
      toast.error("Please fill in all required fields and add at least one item");
      return;
    }

    setSaving(true);

    try {
      // Create the activity
      const { data: activity, error: activityError } = await supabase
        .from("activities")
        .insert({
          title,
          description,
          activity_type: activityType,
          difficulty,
          age_range: ageRange,
          created_by: user.id,
          is_published: publish
        })
        .select()
        .single();

      if (activityError) throw activityError;

      // Create activity items
      const itemsToInsert = items.map((item, index) => ({
        activity_id: activity.id,
        item_type: activityType,
        content: item as any,
        order_index: index,
        correct_answer: activityType === "matching" ? (item.match || null) : 
                       activityType === "true-false" ? String(item.isCorrect) :
                       activityType === "quiz" ? (item.content || null) : null
      }));

      const { error: itemsError } = await supabase
        .from("activity_items")
        .insert(itemsToInsert);

      if (itemsError) throw itemsError;

      toast.success(publish ? "Activity published!" : "Activity saved as draft!");
      navigate("/activities");
    } catch (error) {
      console.error("Error saving activity:", error);
      toast.error("Failed to save activity");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted p-4">
      <div className="max-w-4xl mx-auto">
        <Button
          variant="ghost"
          onClick={() => navigate(-1)}
          className="mb-4"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>

        <Card>
          <CardHeader>
            <CardTitle>Create New Activity</CardTitle>
            <CardDescription>
              Build interactive learning activities for your students
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs value={`step-${step}`} onValueChange={(v) => setStep(Number(v.split("-")[1]))}>
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="step-1">1. Basic Info</TabsTrigger>
                <TabsTrigger value="step-2" disabled={!activityType}>2. Content</TabsTrigger>
                <TabsTrigger value="step-3" disabled={items.length === 0}>3. Preview</TabsTrigger>
              </TabsList>

              {/* Step 1: Basic Information */}
              <TabsContent value="step-1" className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Activity Title *</Label>
                  <Input
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g., Match Animals to Their Homes"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Describe what students will learn..."
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Difficulty Level</Label>
                    <Select value={difficulty} onValueChange={(v: any) => setDifficulty(v)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="easy">Easy</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="hard">Hard</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="age">Age Range</Label>
                    <Input
                      id="age"
                      value={ageRange}
                      onChange={(e) => setAgeRange(e.target.value)}
                      placeholder="e.g., 5-7 years"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Choose Activity Type *</Label>
                  <div className="grid grid-cols-2 gap-4">
                    {activityTypes.map(({ type, icon: Icon, title, description }) => (
                      <Card
                        key={type}
                        className={`cursor-pointer transition-all ${
                          activityType === type
                            ? "border-primary ring-2 ring-primary"
                            : "hover:border-primary/50"
                        }`}
                        onClick={() => {
                          setActivityType(type);
                          setItems([]);
                        }}
                      >
                        <CardHeader className="p-4">
                          <div className="flex items-start gap-3">
                            <Icon className="h-5 w-5 text-primary mt-0.5" />
                            <div>
                              <CardTitle className="text-sm">{title}</CardTitle>
                              <CardDescription className="text-xs">{description}</CardDescription>
                            </div>
                          </div>
                        </CardHeader>
                      </Card>
                    ))}
                  </div>
                </div>

                <Button
                  onClick={() => setStep(2)}
                  disabled={!title || !activityType}
                  className="w-full"
                >
                  Next: Add Content
                </Button>
              </TabsContent>

              {/* Step 2: Add Content */}
              <TabsContent value="step-2" className="space-y-4">
                <div className="space-y-4">
                  {items.map((item, index) => (
                    <Card key={item.id}>
                      <CardContent className="p-4 space-y-3">
                        <div className="flex items-center justify-between">
                          <Label>Item {index + 1}</Label>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeItem(item.id)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>

                        {activityType === "matching" && (
                          <div className="grid grid-cols-2 gap-4">
                            <Input
                              placeholder="Left item"
                              value={item.content}
                              onChange={(e) => updateItem(item.id, "content", e.target.value)}
                            />
                            <Input
                              placeholder="Right match"
                              value={item.match || ""}
                              onChange={(e) => updateItem(item.id, "match", e.target.value)}
                            />
                          </div>
                        )}

                        {(activityType === "drag-drop" || activityType === "tap-find" || activityType === "fill-blanks") && (
                          <Input
                            placeholder="Item text"
                            value={item.content}
                            onChange={(e) => updateItem(item.id, "content", e.target.value)}
                          />
                        )}

                        {activityType === "quiz" && (
                          <div className="space-y-2">
                            <Input
                              placeholder="Question"
                              value={item.content}
                              onChange={(e) => updateItem(item.id, "content", e.target.value)}
                            />
                            {item.options?.map((option, optIndex) => (
                              <Input
                                key={optIndex}
                                placeholder={`Option ${optIndex + 1}`}
                                value={option}
                                onChange={(e) => {
                                  const newOptions = [...(item.options || [])];
                                  newOptions[optIndex] = e.target.value;
                                  updateItem(item.id, "options", newOptions);
                                }}
                              />
                            ))}
                          </div>
                        )}

                        {activityType === "true-false" && (
                          <div className="space-y-2">
                            <Input
                              placeholder="Statement"
                              value={item.content}
                              onChange={(e) => updateItem(item.id, "content", e.target.value)}
                            />
                            <Select
                              value={String(item.isCorrect)}
                              onValueChange={(v) => updateItem(item.id, "isCorrect", v === "true")}
                            >
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="true">True</SelectItem>
                                <SelectItem value="false">False</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))}

                  <Button onClick={addItem} variant="outline" className="w-full">
                    Add Item
                  </Button>
                </div>

                <div className="flex gap-2">
                  <Button variant="outline" onClick={() => setStep(1)} className="flex-1">
                    Back
                  </Button>
                  <Button
                    onClick={() => setStep(3)}
                    disabled={items.length === 0}
                    className="flex-1"
                  >
                    Preview
                  </Button>
                </div>
              </TabsContent>

              {/* Step 3: Preview & Save */}
              <TabsContent value="step-3" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>{title}</CardTitle>
                    <CardDescription>{description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <p className="text-sm text-muted-foreground">
                        Type: {activityTypes.find(t => t.type === activityType)?.title}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Difficulty: {difficulty}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Items: {items.length}
                      </p>
                    </div>
                  </CardContent>
                </Card>

                <div className="flex gap-2">
                  <Button variant="outline" onClick={() => setStep(2)} className="flex-1">
                    Back
                  </Button>
                  <Button
                    onClick={() => handleSave(false)}
                    disabled={saving}
                    variant="outline"
                    className="flex-1"
                  >
                    <Save className="mr-2 h-4 w-4" />
                    Save Draft
                  </Button>
                  <Button
                    onClick={() => handleSave(true)}
                    disabled={saving}
                    className="flex-1"
                  >
                    <Eye className="mr-2 h-4 w-4" />
                    Publish
                  </Button>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}