"use client";

import { Draggable } from "@hello-pangea/dnd";
import { formatDistance } from "date-fns";
import { ChevronRight, GripVertical, History } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import { updateTodo } from "@/actions/update-todo";
import { Hint } from "@/components/hint";
import { Checkbox } from "@/components/ui/checkbox";
import { useAction } from "@/hooks/use-action";
import { useEditTask } from "@/hooks/use-edit-task";
import { cn } from "@/lib/utils";
import type { TodoWithSubTasks } from "@/types/workspace";

type TaskProps = {
  todo: TodoWithSubTasks;
  index: number;
  isLoading: boolean;
  isPreview?: boolean;
};

export const Task = ({
  todo,
  index,
  isLoading,
  isPreview = false,
}: TaskProps) => {
  const [checked, setChecked] = useState(todo.isCompleted);
  const editTask = useEditTask();
  const { execute: executeTodoUpdate, isLoading: isUpdating } = useAction(
    updateTodo,
    {
      onSuccess: (data) => {
        toast.success(
          data.isCompleted ? "Marked as completed." : "Marked as not completed."
        );

        setChecked(data.isCompleted);
      },
      onError: (error) => {
        toast.error(error);
      },
    }
  );

  const handleClick = () => {
    if (isLoading || isUpdating) return;

    editTask.setTask(todo);
    if (isPreview) editTask.showPreview();
    editTask.onOpen();
  };

  const toggleChecked = () => {
    if (isPreview) return;

    executeTodoUpdate({
      todo: {
        id: todo.id,
        workspaceId: todo.workspaceId,
        task: todo.task,
        description: todo.description || "",
        isCompleted: !todo.isCompleted,
      },
    });
  };

  useEffect(() => {
    if (editTask.task.id === todo.id) editTask.setTask(todo);
  }, [todo]);

  return (
    <Draggable
      draggableId={todo.id}
      index={index}
      isDragDisabled={isLoading || isUpdating || isPreview}
    >
      {(provided) => (
        <li
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          ref={provided.innerRef}
          className={cn(
            "flex space-x-2 items-center p-3 dark:bg-gray-800 bg-gray-100 hover:bg-gray-200 rounded-md select-none shadow transition dark:hover:bg-gray-700",
            checked && "opacity-50 hover:opacity-60",
            editTask.task.id === todo.id && "dark:bg-gray-700 bg-gray-200",
            isPreview && "cursor-default"
          )}
        >
          {!isPreview && (
            <GripVertical className="h-5 w-5 opacity-80 hover:opacity-100 transition" />
          )}
          <Hint
            description={checked ? "Marked as not completed" : "Mark as complete"}
            side="right"
            sideOffset={2}
          >
            <Checkbox
              className="h-5 w-5"
              checked={checked}
              onCheckedChange={toggleChecked}
              disabled={isUpdating || isPreview}
              aria-disabled={isUpdating || isPreview}
            />
          </Hint>
          <div
            role="button"
            onClick={handleClick}
            className="flex justify-between items-center w-full cursor-default"
          >
            <div className="flex items-center space-x-2">
              <p className={cn(checked && "line-through")}>{todo.task}</p>
            </div>

            <div className="flex items-center">
              <History className="h-4 w-4 mr-1 text-primary" />
              <p className="text-xs mr-5">
                <strong className="font-semibold">
                  {formatDistance(
                    new Date("2024, 4, 26"),
                    new Date("2024, 4, 27"),
                    {
                      addSuffix: true,
                    }
                  )}
                </strong>
              </p>
              <Hint description="Show More" side="left" sideOffset={5}>
                <button>
                  <ChevronRight className="h-4 w-4 text-primary" />
                </button>
              </Hint>
            </div>
          </div>
        </li>
      )}
    </Draggable>
  );
};
