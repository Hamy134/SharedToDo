"use client";

import { SearchIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSearch } from "@/hooks/use-search";

export const Search = () => {
  const { onOpen } = useSearch();

  return (
    <Button
      variant="outline"
      className="md:w-full md:max-w-md lg:max-w-lg dark:hover:bg-foreground/10 cursor-text p-2"
      onClick={onOpen}
    >
      <div className="flex md:justify-between w-full">
        <div className="flex items-center">
          <SearchIcon className="h-4 w-4 md:mr-3 text-primary" />
          <span className="hidden md:block">Search workspaces...</span>
        </div>

        <kbd className="ml-auto pointer-events-none hidden md:inline-flex h-5 select-none items-center gap-1 rounded border dark:bg-foreground/10 px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
          <span className="text-xs">⌘</span>K
        </kbd>
      </div>
    </Button>
  );
};
