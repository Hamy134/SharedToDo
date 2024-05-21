"use client";

import { Edit } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { useAction } from "@/hooks/use-action";
import { updateWorkspace } from "@/actions/update-workspace";
import { toast } from "sonner";

type TitleProps = {
  id: string;
  name?: string;
};

export const Title = ({ id, name }: TitleProps) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(name || "Untitled");

  const { execute, isLoading } = useAction(updateWorkspace, {
    onSuccess: (data) => {
      toast.success(`Workspace updated.`);
      setTitle(data.name);
      disableEditing();
    },
    onError: (error) => {
      toast.error(error);
    },
  });

  const enableInput = () => {
    setIsEditing(true);

    setTimeout(() => {
      inputRef.current?.focus();
      inputRef.current?.setSelectionRange(0, inputRef.current.value.length);
    }, 0);
  };

  const disableInput = () => setIsEditing(false);

  const disableEditing = () => {
    setIsEditing(false);
  };

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") onSubmit();
  };

  const onSubmit = () => {
    disableInput();
    if (!title.trim() || name?.trim() === title.trim()) return;

    execute({ id, updateData: { name: title } });
  };

  useEffect(() => {
    setTitle(name || "Untitled");
  }, [name]);

  return (
    <div className="flex items-center gap-x-1">
      {isEditing ? (
        <Input
          ref={inputRef}
          onClick={enableInput}
          onBlur={onSubmit}
          onChange={onChange}
          onKeyDown={onKeyDown}
          disabled={isLoading}
          aria-disabled={isLoading}
          value={title}
          className="h-9 px-3 py-2 focus-visible:ring-transparent"
        />
      ) : (
        <Button
          onClick={enableInput}
          disabled={isLoading}
          aria-disabled={isLoading}
          variant="ghost"
          size="sm"
          className="font-normal h-auto px-3 py-2 dark:bg-foreground/10 border max-w-xs cursor-text"
        >
          <Edit className="h-4 w-4 mr-2 text-primary" />
          <span className="truncate">{name}</span>
        </Button>
      )}
    </div>
  );
};

Title.Skeleton = function TitleSkeleton() {
  return <Skeleton className="h-9 w-16 rounded-md" />;
};
