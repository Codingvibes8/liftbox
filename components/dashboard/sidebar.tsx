"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  CloudIcon,
  FileIcon,
  HomeIcon,
  SettingsIcon,
  Share2Icon,
  TrashIcon,
} from "lucide-react";

const sidebarItems = [
  { href: "/dashboard", icon: HomeIcon, label: "Home" },
  { href: "/dashboard/files", icon: FileIcon, label: "My Files" },
  { href: "/dashboard/shared", icon: Share2Icon, label: "Shared" },
  { href: "/dashboard/trash", icon: TrashIcon, label: "Trash" },
  { href: "/dashboard/settings", icon: SettingsIcon, label: "Settings" },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden w-64 flex-col border-r bg-white dark:bg-gray-950 md:flex">
      <div className="flex h-14 items-center border-b px-4">
        <Link href="/dashboard" className="flex items-center gap-2 font-semibold">
          <div className="p-1.5 bg-blue-600 rounded-md">
            <CloudIcon className="h-5 w-5 text-white" />
          </div>
          <span>LiftBox</span>
        </Link>
      </div>
      
      <div className="flex-1 overflow-auto py-4">
        <nav className="grid gap-1 px-2">
          {sidebarItems.map((item, index) => (
            <Link
              key={index}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:bg-gray-100 dark:hover:bg-gray-800",
                pathname === item.href
                  ? "bg-gray-100 text-gray-900 dark:bg-gray-800 dark:text-gray-50"
                  : "text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50"
              )}
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </Link>
          ))}
        </nav>
      </div>

      <div className="mt-auto border-t p-4">
        <div className="mb-2 flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Storage</span>
          <span>75%</span>
        </div>
        <Progress value={75} className="h-2" />
        <div className="mt-2 text-xs text-muted-foreground">
          1.5 GB of 2 GB used
        </div>
        <Button variant="outline" className="mt-4 w-full" size="sm">
          Upgrade Plan
        </Button>
      </div>
    </aside>
  );
}
