"use server";

import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

import { createSafeAction } from "@/lib/create-safe-action";
import { db } from "@/lib/db";
import { DeleteSubTodo } from "@/schema";

import { InputType, ReturnType } from "./types";

const handler = async (data: InputType): Promise<ReturnType> => {
  const { userId } = auth();

  if (!userId) {
    return {
      error: "Unauthorized.",
    };
  }

  const { id, workspaceId, todoId } = data;

  if (!id || !workspaceId || !todoId) {
    return {
      error: "Missing fields. Failed to delete subtask.",
    };
  }

  let subtask;

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

    subtask = await db.subTask.delete({
      where: {
        id,
        todoId,
      },
    });
  } catch (error) {
    return {
      error: "Failed to delete subtask.",
    };
  }

  revalidatePath("/dashboard");
  revalidatePath(`/dashboard/${workspaceId}`);
  return { data: subtask };
};

export const deleteSubTodo = createSafeAction(DeleteSubTodo, handler);
