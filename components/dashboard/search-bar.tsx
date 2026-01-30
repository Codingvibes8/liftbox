"use client";

import { useState, useEffect, useRef } from "react";
import { Input } from "@/components/ui/input";
import { SearchIcon, FileIcon, Loader2 } from "lucide-react";
import { searchFiles } from "@/app/actions/search-actions";
import Link from "next/link";

export function SearchBar() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  // Debounce effect
  useEffect(() => {
    const timer = setTimeout(async () => {
      if (query.length > 2) {
        setLoading(true);
        const data = await searchFiles(query);
        setResults(data);
        setLoading(false);
        setOpen(true);
      } else {
        setResults([]);
        setOpen(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  // Click outside to close
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [wrapperRef]);


  return (
    <div className="relative w-full" ref={wrapperRef}>
       <div className="relative">
            <SearchIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search files..."
              className="w-full bg-gray-50 pl-8 dark:bg-gray-900 md:w-2/3 lg:w-1/3"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onFocus={() => { if (results.length > 0) setOpen(true); }}
            />
       </div>
       {open && (
         <div className="absolute top-full z-50 mt-1 w-full md:w-2/3 lg:w-1/3 bg-white dark:bg-gray-950 border rounded-md shadow-lg overflow-hidden">
            {loading ? (
                <div className="p-4 flex justify-center">
                    <Loader2 className="h-4 w-4 animate-spin" />
                </div>
            ) : results.length > 0 ? (
                <ul className="py-1">
                    {results.map((file) => (
                        <li key={file.id}>
                            <Link 
                                href={file.url} // Or some file viewer route
                                target="_blank"
                                className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-800 text-sm"
                                onClick={() => setOpen(false)}
                            >
                                <FileIcon className="h-4 w-4 text-gray-500" />
                                <span className="truncate">{file.name}</span>
                            </Link>
                        </li>
                    ))}
                </ul>
            ) : (
                <div className="p-4 text-sm text-gray-500 text-center">No results found.</div>
            )}
         </div>
       )}
    </div>
  );
}
