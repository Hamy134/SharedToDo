"use client";

import { DragDropContext, type DropResult, Droppable } from "@hello-pangea/dnd";
import type { SubTask } from "@prisma/client";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import { updateSubTodoOrder } from "@/actions/update-subtodo-order";
import { useAction } from "@/hooks/use-action";
import { reorder } from "@/lib/utils";

import { Subtask } from "./subtask";

type TaskListProps = {
  todos: SubTask[];
  workspaceId: string;
  todoId: string;
  isPreview?: boolean;
};

export const SubTaskList = ({
  workspaceId,
  todos,
  todoId,
  isPreview = false,
}: TaskListProps) => {
  const [orderedTodos, setOrderedTodos] = useState(todos);
  const { execute: executeUpdateSubTodoOrder, isLoading: isTaskLoading } =
    useAction(updateSubTodoOrder, {
      onSuccess: () => {
        toast.success("Subtasks reordered");
      },
      onError: (error) => {
        toast.error(error);
      },
    });

  const onDragEnd = (result: DropResult) => {
    if (isPreview) return;

    const { destination, source, type } = result;

    // if no destination
    if (!destination) return;

    // if dropped in the same position
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    )
      return;

    if (type !== "card") return;

    const items = reorder(orderedTodos, source.index, destination.index).map(
      (item, index) => ({ ...item, order: index })
    );

    setOrderedTodos(items);

    executeUpdateSubTodoOrder({ workspaceId, todoId, subtasks: items });
  };

  useEffect(() => {
    setOrderedTodos(todos);
  }, [todos]);

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable
        droppableId="lists"
        type="card"
        direction="vertical"
        isDropDisabled={isTaskLoading || isPreview}
      >
        {(provided) => (
          <ul
            {...provided.droppableProps}
            ref={provided.innerRef}
            className="space-y-3"
          >
            {orderedTodos.map((todo, i) => (
              <Subtask
                key={todo.id}
                index={i}
                todo={todo}
                isLoading={isTaskLoading}
                isPreview={isPreview}
                workspaceId={workspaceId}
              />
            ))}

            {provided.placeholder}
          </ul>
        )}
      </Droppable>
    </DragDropContext>
  );
};
