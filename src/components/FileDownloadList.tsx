
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Download, File, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface FileDownloadListProps {
  bundleType: string;
  purchaseStatus: string;
}

interface FileItem {
  name: string;
  id: string;
  size: number;
}

const FileDownloadList = ({ bundleType, purchaseStatus }: FileDownloadListProps) => {
  const [files, setFiles] = useState<FileItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [downloadingFile, setDownloadingFile] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (purchaseStatus === 'completed') {
      fetchFiles();
    } else {
      setLoading(false);
    }
  }, [bundleType, purchaseStatus]);

  const fetchFiles = async () => {
    try {
      const { data, error } = await supabase.storage
        .from('product-files')
        .list(bundleType, {
          limit: 100,
        });

      if (error) {
        console.error('Error fetching files:', error);
        toast({
          title: "Error",
          description: "Failed to load files. Please try again.",
          variant: "destructive",
        });
        return;
      }

      // Filter out folders and only show files
      const fileItems = data?.filter(item => !item.id) || [];
      setFiles(fileItems.map(file => ({
        name: file.name,
        id: file.name,
        size: file.metadata?.size || 0
      })));
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

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  if (purchaseStatus !== 'completed') {
    return (
      <div className="text-sm text-gray-500 mt-2">
        Files will be available once payment is completed.
      </div>
    );
  }

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
      <div className="text-sm text-gray-500 mt-2">
        No files available for download yet.
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
              <File className="w-4 h-4 text-blue-600" />
              <div>
                <span className="text-sm font-medium">{file.name}</span>
                {file.size > 0 && (
                  <span className="text-xs text-gray-500 ml-2">
                    ({formatFileSize(file.size)})
                  </span>
                )}
              </div>
            </div>
            <Button
              onClick={() => downloadFile(file.name)}
              disabled={downloadingFile === file.name}
              size="sm"
              className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700"
            >
              {downloadingFile === file.name ? (
                <Loader2 className="w-4 h-4 animate-spin" />
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
