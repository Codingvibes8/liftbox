"use client";

import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { FolderIcon, MoreVerticalIcon, TrashIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link"; 

interface FolderCardProps {
  folder: any;
}

export function FolderCard({ folder }: FolderCardProps) {
  return (
    <Card className="overflow-hidden group relative hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors">
      <Link href={`/dashboard/files/${folder.id}`} className="absolute inset-0 z-10" />
      <CardContent className="p-4 flex items-center justify-center h-full">
        <FolderIcon className="h-16 w-16 text-blue-500 fill-blue-500/20" />
      </CardContent>
      <CardFooter className="p-3 flex justify-between items-center bg-white dark:bg-gray-950 relative z-20">
         <div className="truncate text-sm font-medium pr-2 w-full">
            {folder.name}
        </div>
         <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                    <MoreVerticalIcon className="h-4 w-4" />
                    <span className="sr-only">Open menu</span>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuItem className="text-red-600">
                    <TrashIcon className="mr-2 h-4 w-4" />
                    Delete
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
      </CardFooter>
    </Card>
  );
}
