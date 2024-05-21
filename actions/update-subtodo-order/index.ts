"use server";

import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

import { createSafeAction } from "@/lib/create-safe-action";
import { db } from "@/lib/db";
import { UpdateSubTodoOrder } from "@/schema";

import { InputType, ReturnType } from "./types";

const handler = async (data: InputType): Promise<ReturnType> => {
  const { userId } = auth();

  if (!userId) {
    return {
      error: "Unauthorized.",
    };
  }

  const { workspaceId, subtasks, todoId } = data;

  if (!workspaceId || !subtasks || !todoId) {
    return {
      error: "Missing fields. Failed to update subtasks order.",
    };
  }

  let updatedSubtasks;

  try {
    const workspace = await db.workspace.findUnique({
      where: {
        id: workspaceId,
        userId,
      },
    });

    if (!workspace) {
      return {
        error: "Workspace not found.",
      };
    }

    const todo = await db.todo.findUnique({
      where: {
        id: todoId,
        workspaceId,
      },
    });

    if (!todo) {
      return {
        error: "Todo not found.",
      };
    }

    const transaction = subtasks.map((todo) =>
      db.subTask.update({
        where: {
          id: todo.id,
          todoId,
        },
        data: {
          order: todo.order,
        },
      })
    );

    updatedSubtasks = await db.$transaction(transaction);
  } catch (error) {
    return {
      error: "Failed to update todo order.",
    };
  }

  revalidatePath(`/dashboard/${workspaceId}`);
  return { data: updatedSubtasks };
};

export const updateSubTodoOrder = createSafeAction(UpdateSubTodoOrder, handler);
