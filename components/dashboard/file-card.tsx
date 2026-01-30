"use client";

import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { FileIcon, MoreVerticalIcon, TrashIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { deleteFile } from "@/app/actions/file-actions";
import { toast } from "sonner";
import Image from "next/image";

interface FileCardProps {
  file: any; // Use proper type
}

export function FileCard({ file }: FileCardProps) {
  const isImage = file.type.startsWith("image/");
  
  const handleDelete = async () => {
    const res = await deleteFile(file.id, file.path); 
    
    if (res?.error) {
      toast.error(res.error);
    } else {
      toast.success("File deleted");
    }
  };

  return (
    <Card className="overflow-hidden group relative">
      <CardContent className="p-0">
        <div className="aspect-square relative bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
            {isImage ? (
                <Image 
                    src={file.url} 
                    alt={file.name} 
                    fill 
                    className="object-cover" 
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
            ) : (
                <FileIcon className="h-12 w-12 text-gray-400" />
            )}
        </div>
      </CardContent>
      <CardFooter className="p-3 flex justify-between items-center bg-white dark:bg-gray-950">
        <div className="truncate text-sm font-medium pr-2 w-full">
            {file.name}
        </div>
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                    <MoreVerticalIcon className="h-4 w-4" />
                    <span className="sr-only">Open menu</span>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={handleDelete} className="text-red-600">
                    <TrashIcon className="mr-2 h-4 w-4" />
                    Delete
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
      </CardFooter>
    </Card>
  );
}
