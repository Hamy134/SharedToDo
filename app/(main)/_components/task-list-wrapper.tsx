"use client";

import { CalendarDays, Loader2, Plus } from "lucide-react";
import { toast } from "sonner";

import { createTodo } from "@/actions/create-todo";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useAction } from "@/hooks/use-action";
import { useEditTask } from "@/hooks/use-edit-task";
import type { WorkspaceWithTodosWithSubTasks } from "@/types/workspace";

import { TaskList } from "./task-list";

type TaskListWrapperProps = {
  workspace: WorkspaceWithTodosWithSubTasks;
};

export const TaskListWrapper = ({ workspace }: TaskListWrapperProps) => {
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
    execute({ workspaceId: workspace.id, name: "Untitled Task" });
  };

  return (
    <>
      <div className="flex justify-between items-center mb-5">
        <h1 className="flex items-end text-4xl font-bold">
          <div className="flex items-center">
            <CalendarDays className="h-8 w-8 mr-2 text-primary" />
            Today
          </div>

          <span className="text-sm ml-1.5 text-primary">
            ({workspace.todos.length})
          </span>
        </h1>
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
              <Plus className="h-4 w-4 mr-2" /> Add New Task
            </>
          )}
        </Button>
      </div>

      <ScrollArea className="flex-1 mb-5">
        <TaskList workspaceId={workspace.id} todos={workspace.todos} />
      </ScrollArea>
    </>
  );
};
