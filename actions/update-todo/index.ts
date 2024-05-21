"use server";

import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

import { createSafeAction } from "@/lib/create-safe-action";
import { db } from "@/lib/db";
import { UpdateTodo } from "@/schema";

import { InputType, ReturnType } from "./types";

const handler = async (data: InputType): Promise<ReturnType> => {
  const { userId } = auth();

  if (!userId) {
    return {
      error: "Unauthorized.",
    };
  }

  const { todo } = data;

  if (!todo.id || !todo.workspaceId) {
    return {
      error: "Missing fields. Failed to update todo.",
    };
  }

  let updatedTodo;

  try {
    const workspace = await db.workspace.findUnique({
      where: {
        id: todo.workspaceId,
        userId,
      },
    });

    if (!workspace) {
      return {
        error: "Workspace not found.",
      };
    }

    updatedTodo = await db.todo.update({
      where: {
        id: todo.id,
        workspaceId: todo.workspaceId,
      },
      data: todo,
    });
  } catch (error) {
    return {
      error: "Failed to update todo.",
    };
  }

  revalidatePath("/dashboard");
  revalidatePath(`/dashboard/${todo.workspaceId}`);
  return { data: updatedTodo };
};

export const updateTodo = createSafeAction(UpdateTodo, handler);
