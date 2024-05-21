"use client";

import { ChevronRight, MoreHorizontal, Trash } from "lucide-react";
import React from "react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";
import { useDeleteWorkspace } from "@/hooks/use-delete-workspace";
import { cn } from "@/lib/utils";

type ItemProps = {
  id: string;
  active?: boolean;
  label: string;
  onClick?: () => void;
};

export const Item = ({ id, label, onClick, active }: ItemProps) => {
  const deleteWorkspace = useDeleteWorkspace();

  const handleClick = () => {
    deleteWorkspace.setWorkspaceId(id);
    deleteWorkspace.onOpen();
  };

  return (
    <button
      onClick={onClick}
      className={cn(
        "group min-h-[27px] text-md py-1.5 px-2.5 w-full hover:bg-primary/10 dark:hover:bg-primary/5 flex items-center text-muted-foreground font-medium rounded",
        active && "bg-primary/5 text-primary"
      )}
    >
      <ChevronRight
        className={cn(
          "h-5 w-5 shrink-0 mr-1 text-primary/50",
          active && "text-primary"
        )}
      />

      <span className="truncate">{label}</span>

      <div className="ml-auto flex items-center gap-x-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
            <div
              role="button"
              tabIndex={0}
              className={cn(
                "group-hover:opacity-100 h-full ml-auto rounded-md p-0.5 flex items-center justify-center hover:bg-neutral-300 dark:hover:bg-neutral-600 opacity-100 md:opacity-0 group-focus:opacity-100 focus:opacity-100",
                active && "md:opacity-80"
              )}
            >
              <MoreHorizontal
                className={cn(
                  "h-4 w-4 text-muted-foreground",
                  active && "text-primary"
                )}
              />
            </div>
          </DropdownMenuTrigger>

          <DropdownMenuContent
            className="w-60"
            align="start"
            side="right"
            forceMount
          >
            <DropdownMenuItem onClick={handleClick} className="text-rose-500">
              <Trash className="h-4 w-4 mr-2" />
              Delete
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <div className="text-xs text-muted-foreground p-2">
              You won&apos;t be able to <strong>recover this workspace</strong>{" "}
              after this action.
            </div>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </button>
  );
};

Item.Skeleton = function ItemSkeleton({ level }: { level?: number }) {
  return (
    <div
      style={{
        paddingLeft: level ? `${level * 12 + 25}px` : "12px",
      }}
      className="flex gap-x-2 py-[3px]"
    >
      <Skeleton className="h-4 w-4" />
      <Skeleton className="h-4 w-[30%]" />
    </div>
  );
};
