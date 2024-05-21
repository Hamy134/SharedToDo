"use client";

import { Loader2, PlusCircle } from "lucide-react";
import Image from "next/image";
import { toast } from "sonner";

import { createTodo } from "@/actions/create-todo";
import { Button } from "@/components/ui/button";
import { useAction } from "@/hooks/use-action";
import { useCreateWorkspace } from "@/hooks/use-create-workspace";
import { useEditTask } from "@/hooks/use-edit-task";

type WelcomeScreenProps = {
  title: string | React.ReactElement;
  imgUrl: Record<"default" | "dark", { src: string; alt: string }>;
  type?: "dashboard" | "workspace";
  workspaceId?: string;
};

export const WelcomeScreen = ({
  title,
  imgUrl,
  type = "dashboard",
  workspaceId,
}: WelcomeScreenProps) => {
  const createWorkspace = useCreateWorkspace();
  const editTask = useEditTask();
  const { execute, isLoading } = useAction(createTodo, {
    onSuccess: (data) => {
      toast.success(`Todo "${data.task}" created.`);

      editTask.setTask(data);
      editTask.onOpen();
    },
    onError: (error) => {
      toast.error(error);
    },
  });

  const onClick = () => {
    if (!workspaceId) return;

    execute({ workspaceId, name: "Untitled Task" });
  };

  return (
    <div className="h-full flex flex-col items-center justify-center space-y-4">
      <Image
        src={imgUrl.default.src}
        alt={imgUrl.default.alt}
        height={400}
        width={400}
        className="dark:hidden select-none pointer-events-none"
        draggable={false}
      />

      <Image
        src={imgUrl.dark.src}
        alt={imgUrl.dark.alt}
        height={400}
        width={400}
        className="hidden dark:block select-none pointer-events-none"
        draggable={false}
      />

      <h2 className="text-2xl font-medium">{title}</h2>

      {type === "dashboard" ? (
        <Button onClick={createWorkspace.onOpen}>
          <PlusCircle className="h-4 w-4 mr-2" />
          Add Workspace
        </Button>
      ) : (
        <Button
          onClick={onClick}
          disabled={isLoading}
          aria-disabled={isLoading}
        >
          {isLoading ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Loading...
            </>
          ) : (
            <>
              <PlusCircle className="h-4 w-4 mr-2" />
              Create Todo
            </>
          )}
        </Button>
      )}
    </div>
  );
};
