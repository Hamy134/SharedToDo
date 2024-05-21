"use server";

import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

import { createSafeAction } from "@/lib/create-safe-action";
import { db } from "@/lib/db";
import { UpdateSubTodo } from "@/schema";

import { InputType, ReturnType } from "./types";

const handler = async (data: InputType): Promise<ReturnType> => {
  const { userId } = auth();

  if (!userId) {
    return {
      error: "Unauthorized.",
    };
  }

  const { subtask, workspaceId } = data;

  if (!subtask.id || !subtask.todoId || !workspaceId) {
    return {
      error: "Missing fields. Failed to update subtask.",
    };
  }

  let updatedSubtask;

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
        id: subtask.todoId,
        workspaceId,
      },
    });

    if (!todo) {
      return {
        error: "Task not found.",
      };
    }

    updatedSubtask = await db.subTask.update({
      where: {
        id: subtask.id,
        todoId: subtask.todoId,
      },
      data: subtask,
    });
  } catch (error) {
    return {
      error: "Failed to update subtask.",
    };
  }

  revalidatePath("/dashboard");
  revalidatePath(`/dashboard/${workspaceId}`);
  return { data: updatedSubtask };
};

export const updateSubTodo = createSafeAction(UpdateSubTodo, handler);
