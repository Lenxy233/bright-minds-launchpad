import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FolderOpen } from "lucide-react";
import FileUpload from "@/components/FileUpload";

const FileManagementCard = () => {
  const [activeTab, setActiveTab] = useState("upload");

  const handleUploadComplete = (files: string[]) => {
    console.log("Files uploaded:", files);
    // Could refresh file lists or show success notifications here
  };

  return (
    <Card className="bg-white/90 backdrop-blur-sm shadow-xl border-2 border-purple-200">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FolderOpen className="w-5 h-5" />
          File Management
        </CardTitle>
        <CardDescription>
          Upload and manage your product files
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="upload">Upload</TabsTrigger>
            <TabsTrigger value="kids-curriculum">Kids Curriculum</TabsTrigger>
            <TabsTrigger value="video-bundle">Video Bundle</TabsTrigger>
          </TabsList>
          
          <TabsContent value="upload" className="mt-4">
            <FileUpload 
              bundleType="general"
              onUploadComplete={handleUploadComplete}
            />
          </TabsContent>
          
          <TabsContent value="kids-curriculum" className="mt-4">
            <FileUpload 
              bundleType="kids-curriculum"
              onUploadComplete={handleUploadComplete}
            />
          </TabsContent>
          
          <TabsContent value="video-bundle" className="mt-4">
            <FileUpload 
              bundleType="video-bundle"
              onUploadComplete={handleUploadComplete}
            />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default FileManagementCard;