
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Download, File, Loader2, ExternalLink, Sparkles } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface FileDownloadListProps {
  bundleType: string;
  purchaseStatus: string;
  includesAiPrompts?: boolean;
}

interface FileItem {
  name: string;
  id: string;
  size: number;
  type: 'file' | 'link' | 'ai-file';
  url?: string;
  description?: string;
}

const FileDownloadList = ({ bundleType, purchaseStatus, includesAiPrompts }: FileDownloadListProps) => {
  const [files, setFiles] = useState<FileItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [downloadingFile, setDownloadingFile] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    // Always fetch files on success page
    fetchFiles();
  }, [bundleType]);

  const fetchFiles = async () => {
    try {
      // Fetch main bundle files and links
      const [storageResponse, bundleLinksResponse] = await Promise.all([
        supabase.storage
          .from('product-files')
          .list(bundleType, {
            limit: 100,
          }),
        supabase
          .from('bundle_links')
          .select('*')
          .eq('bundle_type', bundleType)
      ]);

      const combinedFiles: FileItem[] = [];

      // Add storage files
      if (storageResponse.data && !storageResponse.error) {
        const fileItems = storageResponse.data.filter(item => !item.id) || [];
        fileItems.forEach(file => {
          combinedFiles.push({
            name: file.name,
            id: file.name,
            size: file.metadata?.size || 0,
            type: 'file'
          });
        });
      }

      // Add bundle links
      if (bundleLinksResponse.data && !bundleLinksResponse.error) {
        bundleLinksResponse.data.forEach(link => {
          combinedFiles.push({
            name: link.link_title || 'Bundle Files',
            id: link.id,
            size: 0,
            type: 'link',
            url: link.link_url,
            description: link.description
          });
        });
      }

      // Fetch AI prompts if user purchased them
      if (includesAiPrompts) {
        const aiPromptsResponse = await supabase.storage
          .from('100+ AI IMAGE DESIGN STYLE PROMPTS')
          .list('', {
            limit: 100,
          });

        if (aiPromptsResponse.data && !aiPromptsResponse.error) {
          const aiFiles = aiPromptsResponse.data.filter(item => !item.id) || [];
          aiFiles.forEach(file => {
            combinedFiles.push({
              name: `AI Prompts: ${file.name}`,
              id: `ai-${file.name}`,
              size: file.metadata?.size || 0,
              type: 'ai-file'
            });
          });
        }
      }

      setFiles(combinedFiles);

      // Show error only if main requests failed
      if (storageResponse.error && bundleLinksResponse.error) {
        console.error('Error fetching files:', storageResponse.error, bundleLinksResponse.error);
        toast({
          title: "Error",
          description: "Failed to load files. Please try again.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: "Error",
        description: "Failed to load files. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleItemClick = async (file: FileItem) => {
    if (file.type === 'link') {
      // Open shareable link in new tab
      if (file.url) {
        window.open(file.url, '_blank');
        toast({
          title: "Success",
          description: "Opening files in new tab...",
        });
      }
    } else if (file.type === 'ai-file') {
      // Download AI prompts file
      downloadAiPromptsFile(file.name.replace('AI Prompts: ', ''));
    } else {
      // Download regular file from storage
      downloadFile(file.name);
    }
  };

  const downloadFile = async (fileName: string) => {
    setDownloadingFile(fileName);
    try {
      const { data, error } = await supabase.storage
        .from('product-files')
        .download(`${bundleType}/${fileName}`);

      if (error) {
        console.error('Error downloading file:', error);
        toast({
          title: "Download Error",
          description: "Failed to download file. Please try again.",
          variant: "destructive",
        });
        return;
      }

      // Create download link
      const url = URL.createObjectURL(data);
      const link = document.createElement('a');
      link.href = url;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      toast({
        title: "Success",
        description: `${fileName} downloaded successfully!`,
      });
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: "Download Error",
        description: "Failed to download file. Please try again.",
        variant: "destructive",
      });
    } finally {
      setDownloadingFile(null);
    }
  };

  const downloadAiPromptsFile = async (fileName: string) => {
    setDownloadingFile(`AI Prompts: ${fileName}`);
    try {
      const { data, error } = await supabase.storage
        .from('100+ AI IMAGE DESIGN STYLE PROMPTS')
        .download(fileName);

      if (error) {
        console.error('Error downloading AI prompts file:', error);
        toast({
          title: "Download Error",
          description: "Failed to download AI prompts file. Please try again.",
          variant: "destructive",
        });
        return;
      }

      // Create download link
      const url = URL.createObjectURL(data);
      const link = document.createElement('a');
      link.href = url;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      toast({
        title: "Success",
        description: `${fileName} downloaded successfully!`,
      });
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: "Download Error",
        description: "Failed to download AI prompts file. Please try again.",
        variant: "destructive",
      });
    } finally {
      setDownloadingFile(null);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  if (loading) {
    return (
      <div className="flex items-center gap-2 mt-3 text-sm text-gray-600">
        <Loader2 className="w-4 h-4 animate-spin" />
        Loading files...
      </div>
    );
  }

  if (files.length === 0) {
    return (
      <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg mt-3">
        <p className="text-sm text-yellow-800 font-medium mb-2">
          ⚠️ No bundle content configured yet
        </p>
        <p className="text-xs text-yellow-700">
          Please add bundle links and files to the database (bundle_links table and product-files storage) for bundle type: <strong>{bundleType}</strong>
        </p>
      </div>
    );
  }

  return (
    <div className="mt-3 space-y-2">
      <h4 className="text-sm font-medium text-gray-700">Available Downloads:</h4>
      <div className="space-y-2">
        {files.map((file) => (
          <div key={file.id} className="flex items-center justify-between bg-gray-50 p-2 rounded">
            <div className="flex items-center gap-2">
              {file.type === 'link' ? (
                <ExternalLink className="w-4 h-4 text-blue-600" />
              ) : file.type === 'ai-file' ? (
                <Sparkles className="w-4 h-4 text-purple-600" />
              ) : (
                <File className="w-4 h-4 text-blue-600" />
              )}
              <div>
                <span className="text-sm font-medium">{file.name}</span>
                {file.description && (
                  <p className="text-xs text-gray-500">{file.description}</p>
                )}
                {file.size > 0 && (
                  <span className="text-xs text-gray-500 ml-2">
                    ({formatFileSize(file.size)})
                  </span>
                )}
              </div>
            </div>
            <Button
              onClick={() => handleItemClick(file)}
              disabled={downloadingFile === file.name}
              size="sm"
              className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700"
            >
              {downloadingFile === file.name ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : file.type === 'link' ? (
                <ExternalLink className="w-4 h-4" />
              ) : (
                <Download className="w-4 h-4" />
              )}
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FileDownloadList;
