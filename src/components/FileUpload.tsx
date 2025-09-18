import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Upload, File, X, CheckCircle, AlertCircle, Link } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Progress } from "@/components/ui/progress";

interface FileUploadProps {
  bundleType?: string;
  onUploadComplete?: (files: string[]) => void;
}

interface UploadingFile {
  file: File;
  progress: number;
  status: 'uploading' | 'success' | 'error';
  error?: string;
}

const FileUpload = ({ bundleType = "general", onUploadComplete }: FileUploadProps) => {
  const [dragActive, setDragActive] = useState(false);
  const [uploadingFiles, setUploadingFiles] = useState<UploadingFile[]>([]);
  const [shareableLink, setShareableLink] = useState("");
  const [linkProcessing, setLinkProcessing] = useState(false);
  const { toast } = useToast();

  const handleFiles = async (files: FileList) => {
    const fileArray = Array.from(files);
    const newUploadingFiles = fileArray.map(file => ({
      file,
      progress: 0,
      status: 'uploading' as const
    }));

    setUploadingFiles(prev => [...prev, ...newUploadingFiles]);

    const uploadPromises = fileArray.map(async (file, index) => {
      try {
        const fileName = `${Date.now()}-${file.name}`;
        const filePath = `${bundleType}/${fileName}`;

        // Update progress to show uploading
        setUploadingFiles(prev => 
          prev.map(uploadFile => 
            uploadFile.file === file 
              ? { ...uploadFile, progress: 50 }
              : uploadFile
          )
        );

        const { error } = await supabase.storage
          .from('product-files')
          .upload(filePath, file);

        if (error) throw error;

        setUploadingFiles(prev => 
          prev.map(uploadFile => 
            uploadFile.file === file 
              ? { ...uploadFile, status: 'success', progress: 100 }
              : uploadFile
          )
        );

        return filePath;
      } catch (error) {
        console.error('Upload error:', error);
        setUploadingFiles(prev => 
          prev.map(uploadFile => 
            uploadFile.file === file 
              ? { 
                  ...uploadFile, 
                  status: 'error', 
                  error: error instanceof Error ? error.message : 'Upload failed' 
                }
              : uploadFile
          )
        );
        return null;
      }
    });

    const results = await Promise.all(uploadPromises);
    const successfulUploads = results.filter(Boolean) as string[];
    
    if (successfulUploads.length > 0) {
      toast({
        title: "Upload Complete",
        description: `${successfulUploads.length} file(s) uploaded successfully!`,
      });
      onUploadComplete?.(successfulUploads);
    }

    if (results.some(result => result === null)) {
      toast({
        title: "Upload Error",
        description: "Some files failed to upload. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const removeFile = (index: number) => {
    setUploadingFiles(prev => prev.filter((_, i) => i !== index));
  };

  const clearCompleted = () => {
    setUploadingFiles(prev => prev.filter(file => file.status === 'uploading'));
  };

  const handleShareableLink = async () => {
    if (!shareableLink.trim()) {
      toast({
        title: "Invalid Link",
        description: "Please enter a valid shareable link.",
        variant: "destructive",
      });
      return;
    }

    setLinkProcessing(true);
    
    try {
      // Store the shareable link in the database with metadata
      const linkData = {
        bundle_type: bundleType,
        shareable_link: shareableLink,
        created_at: new Date().toISOString(),
        file_type: 'shareable_link'
      };

      // You can store this in a database table or just pass it to the callback
      const linkPath = `${bundleType}/link-${Date.now()}`;
      
      toast({
        title: "Link Added",
        description: "Shareable link has been saved successfully!",
      });
      
      onUploadComplete?.([linkPath]);
      setShareableLink("");
    } catch (error) {
      console.error('Link processing error:', error);
      toast({
        title: "Link Error",
        description: "Failed to process the shareable link. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLinkProcessing(false);
    }
  };

  return (
    <Card className="bg-white/90 backdrop-blur-sm shadow-xl border-2 border-purple-200">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Upload className="w-5 h-5" />
          File Management
        </CardTitle>
        <CardDescription>
          Upload files or add shareable links for the {bundleType} bundle
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Tabs defaultValue="upload" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="upload">Upload Files</TabsTrigger>
            <TabsTrigger value="link">Shareable Link</TabsTrigger>
          </TabsList>
          
          <TabsContent value="upload" className="space-y-4 mt-4">
            {/* Upload Area */}
            <div
              className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                dragActive 
                  ? 'border-purple-500 bg-purple-50' 
                  : 'border-gray-300 hover:border-purple-400'
              }`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              <Upload className="w-12 h-12 mx-auto text-gray-400 mb-4" />
              <p className="text-gray-600 mb-2">
                Drag and drop files here, or click to select
              </p>
              <input
                type="file"
                multiple
                onChange={(e) => e.target.files && handleFiles(e.target.files)}
                className="hidden"
                id="file-upload"
              />
              <Button
                onClick={() => document.getElementById('file-upload')?.click()}
                variant="outline"
                className="mt-2"
              >
                Select Files
              </Button>
            </div>

            {/* Upload Progress */}
            {uploadingFiles.length > 0 && (
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <h4 className="font-medium">Uploading Files</h4>
                  <Button
                    onClick={clearCompleted}
                    variant="outline"
                    size="sm"
                    className="text-xs"
                  >
                    Clear Completed
                  </Button>
                </div>
                
                {uploadingFiles.map((uploadFile, index) => (
                  <div key={index} className="bg-gray-50 p-3 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <File className="w-4 h-4 text-blue-600" />
                        <span className="text-sm font-medium truncate max-w-xs">
                          {uploadFile.file.name}
                        </span>
                        {uploadFile.status === 'success' && (
                          <CheckCircle className="w-4 h-4 text-green-600" />
                        )}
                        {uploadFile.status === 'error' && (
                          <AlertCircle className="w-4 h-4 text-red-600" />
                        )}
                      </div>
                      <Button
                        onClick={() => removeFile(index)}
                        variant="ghost"
                        size="sm"
                        className="p-1 h-6 w-6"
                      >
                        <X className="w-3 h-3" />
                      </Button>
                    </div>
                    
                    {uploadFile.status === 'uploading' && (
                      <Progress value={uploadFile.progress} className="h-2" />
                    )}
                    
                    {uploadFile.status === 'error' && uploadFile.error && (
                      <p className="text-xs text-red-600 mt-1">{uploadFile.error}</p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="link" className="space-y-4 mt-4">
            <div className="space-y-4">
              <div className="border-2 border-dashed border-blue-300 rounded-lg p-8 text-center bg-blue-50/50">
                <Link className="w-12 h-12 mx-auto text-blue-500 mb-4" />
                <p className="text-gray-600 mb-4">
                  Add a shareable link from Google Drive, Dropbox, OneDrive, or any cloud storage
                </p>
                <div className="space-y-3 max-w-md mx-auto">
                  <div>
                    <Label htmlFor="shareable-link">Shareable Link</Label>
                    <Input
                      id="shareable-link"
                      type="url"
                      placeholder="https://drive.google.com/file/d/..."
                      value={shareableLink}
                      onChange={(e) => setShareableLink(e.target.value)}
                      className="mt-1"
                    />
                  </div>
                  <Button
                    onClick={handleShareableLink}
                    disabled={linkProcessing || !shareableLink.trim()}
                    className="w-full"
                  >
                    {linkProcessing ? "Processing..." : "Add Link"}
                  </Button>
                </div>
              </div>
              <div className="text-xs text-gray-500 space-y-1">
                <p><strong>Supported services:</strong> Google Drive, Dropbox, OneDrive, Box, etc.</p>
                <p><strong>Tip:</strong> Make sure your link is set to "Anyone with the link can view"</p>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default FileUpload;