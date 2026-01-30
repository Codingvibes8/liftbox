"use client";

import { useState } from "react";
import { FileObject, FolderObject } from "@/types"; // Need to define types or use Prisma generic types
import { Button } from "@/components/ui/button";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger,
  DialogFooter
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  PlusIcon, 
  FolderPlusIcon, 
  FileUpIcon, 
  GridIcon, 
  ListIcon,
  SearchIcon
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { createFolder, recordFileUpload } from "@/app/actions/file-actions";
import { FileCard } from "@/components/dashboard/file-card";
import { FolderCard } from "@/components/dashboard/folder-card";
import { toast } from "sonner"; // Assuming sonner is installed as requested

interface FileBrowserProps {
  initialFiles: any[]; // Replace 'any' with Prisma type later
  initialFolders: any[];
}

export function FileBrowser({ initialFiles, initialFolders }: FileBrowserProps) {
  const [currentFolderId, setCurrentFolderId] = useState<string | null>(null);
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [isCreateFolderOpen, setIsCreateFolderOpen] = useState(false);
  const [newFolderName, setNewFolderName] = useState("");
  const [uploading, setUploading] = useState(false);

  // For this simplified version, we rely on server revalidation to update the list, 
  // but optimistic updates would be better. 
  // Since 'initialFiles' comes from server component, we might strictly rely on router.refresh() 
  // or use a client-side fetch if we wanted full interactivity without page reload.
  // The server action revalidatePath should handle regular page updates.

  const handleCreateFolder = async () => {
    if (!newFolderName) return;
    const res = await createFolder(newFolderName, currentFolderId);
    if (res?.error) {
      toast.error(res.error);
    } else {
      toast.success("Folder created");
      setIsCreateFolderOpen(false);
      setNewFolderName("");
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        toast.error("You must be logged in to upload");
        setUploading(false);
        return;
    }

    const uniquePath = `${user.id}/${Date.now()}_${file.name}`;
    
    const { data, error } = await supabase.storage
      .from('files')
      .upload(uniquePath, file);

    if (error) {
      toast.error(`Upload failed: ${error.message}`);
      setUploading(false);
      return;
    }

    // Get public URL or signed URL. 
    // Public buckets are easier for this demo.
    const { data: { publicUrl } } = supabase.storage
      .from('files')
      .getPublicUrl(uniquePath);

    const recordRes = await recordFileUpload({
      name: file.name,
      type: file.type,
      size: file.size,
      url: publicUrl,
      path: uniquePath, // Needed for deletion
      folderId: currentFolderId,
    });

    if (recordRes?.error) {
       toast.error(recordRes.error);
    } else {
       toast.success("File uploaded successfully");
       setIsUploadOpen(false);
    }
    setUploading(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">My Files</h1>
        <div className="flex gap-2">
            <Dialog open={isCreateFolderOpen} onOpenChange={setIsCreateFolderOpen}>
            <DialogTrigger asChild>
                <Button variant="outline">
                <FolderPlusIcon className="mr-2 h-4 w-4" />
                New Folder
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                <DialogTitle>Create New Folder</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="name" className="text-right">
                    Name
                    </Label>
                    <Input
                    id="name"
                    value={newFolderName}
                    onChange={(e) => setNewFolderName(e.target.value)}
                    className="col-span-3"
                    />
                </div>
                </div>
                <DialogFooter>
                <Button onClick={handleCreateFolder}>Create</Button>
                </DialogFooter>
            </DialogContent>
            </Dialog>

            <Dialog open={isUploadOpen} onOpenChange={setIsUploadOpen}>
            <DialogTrigger asChild>
                <Button>
                <FileUpIcon className="mr-2 h-4 w-4" />
                Upload File
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                <DialogTitle>Upload File</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                 <div className="flex items-center justify-center w-full">
                    <label htmlFor="dropzone-file" className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600">
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                            <FileUpIcon className="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400" />
                            <p className="mb-2 text-sm text-gray-500 dark:text-gray-400"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">SVG, PNG, JPG or GIF (MAX. 800x400px)</p>
                        </div>
                        <input id="dropzone-file" type="file" className="hidden" onChange={handleFileUpload} disabled={uploading} />
                    </label>
                </div> 
                {uploading && <p className="text-center text-sm text-muted-foreground">Uploading...</p>}
                </div>
            </DialogContent>
            </Dialog>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3 lg:grid-cols-4">
        {initialFolders.map((folder) => (
             <FolderCard key={folder.id} folder={folder} />
        ))}
        {initialFiles.map((file) => (
             <FileCard key={file.id} file={file} />
        ))}
         {initialFiles.length === 0 && initialFolders.length === 0 && (
             <div className="col-span-full py-12 text-center text-muted-foreground">
                 No files or folders found.
             </div>
         )}
      </div>
    </div>
  );
}
