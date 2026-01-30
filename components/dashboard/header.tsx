import { SearchBar } from "@/components/dashboard/search-bar";
import { Button } from "@/components/ui/button";
import { BellIcon } from "lucide-react";
import { UserNav } from "@/components/dashboard/user-nav";

export function Header() {
  return (
    <header className="flex h-14 items-center gap-4 border-b bg-white px-6 dark:bg-gray-950">
      <div className="w-full flex-1">
         <SearchBar />
      </div>
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" className="rounded-full">
          <BellIcon className="h-5 w-5 text-muted-foreground" />
          <span className="sr-only">Notifications</span>
        </Button>
        <UserNav />
      </div>
    </header>
  );
}
