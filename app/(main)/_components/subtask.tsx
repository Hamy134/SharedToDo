"use client";

import { Draggable } from "@hello-pangea/dnd";
import type { SubTask } from "@prisma/client";
import { GripVertical, Trash2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

import { deleteSubTodo } from "@/actions/delete-subtodo";
import { updateSubTodo } from "@/actions/update-subtodo";
import { Hint } from "@/components/hint";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { useAction } from "@/hooks/use-action";
import { useEditSubtask } from "@/hooks/use-edit-subtask";
import { cn } from "@/lib/utils";

type SubtaskProps = {
  todo: SubTask;
  index: number;
  workspaceId: string;
  isLoading: boolean;
  isPreview?: boolean;
};

export const Subtask = ({
  todo,
  index,
  workspaceId,
  isLoading,
  isPreview = false,
}: SubtaskProps) => {
  const [checked, setChecked] = useState(todo.isCompleted);
  const editSubtask = useEditSubtask();
  const inputRef = useRef<HTMLInputElement>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [subtask, setSubtask] = useState(todo.task || "Untitled Subtask");

  const { execute: executeSubTodoUpdate, isLoading: isUpdating } = useAction(
    updateSubTodo,
    {
      onSuccess: (data) => {
        toast.success("Subtask updated.");

        setSubtask(data.task);
        setIsEditing(false);
      },
      onError: (error) => {
        toast.error(error);
      },
    }
  );

  const {
    execute: executeSubTodoIsCompleteUpdate,
    isLoading: isCompleteUpdating,
  } = useAction(updateSubTodo, {
    onSuccess: (data) => {
      toast.success(
        data.isCompleted ? "Marked as completed." : "Marked as not completed."
      );

      setChecked(data.isCompleted);
    },
    onError: (error) => {
      toast.error(error);
    },
  });

  const { execute: executeSubTodoDelete, isLoading: isDeleting } = useAction(
    deleteSubTodo,
    {
      onSuccess: (data) => {
        toast.success(`Subtask "${data.task}" deleted.`);
      },
      onError: (error) => {
        toast.error(error);
      },
    }
  );

  const enableInput = () => {
    if (isPreview) return;

    setSubtask(subtask);
    setIsEditing(true);

    setTimeout(() => {
      inputRef.current?.focus();
      inputRef.current?.setSelectionRange(0, inputRef.current.value.length);
    }, 0);
  };

  const disableInput = () => {
    if (subtask === todo.task || isPreview) return setIsEditing(false);

    executeSubTodoUpdate({
      subtask: {
        id: todo.id,
        todoId: todo.todoId,
        isCompleted: checked,
        task: subtask,
      },
      workspaceId,
    });

    editSubtask.setSubtaskId("");
  };

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSubtask(e.target.value);
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") disableInput();
  };

  const toggleChecked = () => {
    if (isPreview) return;

    executeSubTodoIsCompleteUpdate({
      subtask: {
        id: todo.id,
        todoId: todo.todoId,
        isCompleted: !checked,
        task: subtask,
      },
      workspaceId,
    });
  };

  const handleDelete = () => {
    if (isPreview) return;

    executeSubTodoDelete({ id: todo.id, todoId: todo.todoId, workspaceId });
  };

  useEffect(() => {
    if (todo.id === editSubtask.subtaskId) enableInput();
  }, [todo.id, editSubtask.subtaskId]);

  return (
    <Draggable
      draggableId={todo.id}
      index={index}
      isDragDisabled={
        isLoading || isUpdating || isDeleting || isCompleteUpdating || isPreview
      }
    >
      {(provided) => (
        <li
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          ref={provided.innerRef}
          className={cn(
            "flex space-x-2 items-center p-2 dark:bg-gray-800 bg-gray-100 hover:bg-gray-200 rounded-md select-none shadow transition dark:hover:bg-gray-700",
            checked && "opacity-50 hover:opacity-60",
            isPreview && "cursor-default"
          )}
        >
          {!isPreview && (
            <GripVertical className="h-4 w-4 opacity-80 hover:opacity-100 transition" />
          )}
          <Hint
            description={checked ? "Marked as not completed" : "Mark as complete"}
            side="right"
            sideOffset={2}
          >
            <Checkbox
              className="h-4 w-4"
              checked={checked}
              onCheckedChange={toggleChecked}
              disabled={
                isUpdating || isDeleting || isCompleteUpdating || isPreview
              }
              aria-disabled={
                isUpdating || isDeleting || isCompleteUpdating || isPreview
              }
            />
          </Hint>
          <div className="flex justify-between items-center w-full cursor-default">
            {isEditing ? (
              <Input
                disabled={
                  isLoading ||
                  isUpdating ||
                  isDeleting ||
                  isCompleteUpdating ||
                  isPreview
                }
                aria-disabled={
                  isLoading ||
                  isUpdating ||
                  isDeleting ||
                  isCompleteUpdating ||
                  isPreview
                }
                ref={inputRef}
                onClick={enableInput}
                onBlur={disableInput}
                onChange={onChange}
                onKeyDown={onKeyDown}
                value={subtask}
                className="h-7 px-3 mr-2 py-2 bg-background focus-visible:ring-transparent"
              />
            ) : (
              <button
                disabled={
                  isLoading ||
                  isUpdating ||
                  isDeleting ||
                  isCompleteUpdating ||
                  isPreview
                }
                aria-disabled={
                  isLoading ||
                  isUpdating ||
                  isDeleting ||
                  isCompleteUpdating ||
                  isPreview
                }
                onClick={enableInput}
                className="flex items-center space-x-2 cursor-text"
              >
                <p className={cn("text-sm", checked && "line-through")}>
                  {subtask}
                </p>
              </button>
            )}

            {!isPreview && (
              <Hint description="Delete Subtask" side="left" sideOffset={5}>
                <button type="button" onClick={handleDelete}>
                  <Trash2 className="h-4 w-4 text-destructive/80 hover:text-destructive transition" />
                </button>
              </Hint>
            )}
          </div>
        </li>
      )}
    </Draggable>
  );
};
