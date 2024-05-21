"use server";

import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

import { createSafeAction } from "@/lib/create-safe-action";
import { db } from "@/lib/db";
import { DeleteTodo } from "@/schema";

import { InputType, ReturnType } from "./types";

const handler = async (data: InputType): Promise<ReturnType> => {
  const { userId } = auth();

  if (!userId) {
    return {
      error: "Unauthorized.",
    };
  }

  const { id, workspaceId } = data;

  if (!id || !workspaceId) {
    return {
      error: "Missing fields. Failed to delete todo.",
    };
  }

  let todo;

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

    todo = await db.todo.delete({
      where: {
        id,
        workspaceId,
      },
    });
  } catch (error) {
    return {
      error: "Failed to delete todo.",
    };
  }

  revalidatePath("/dashboard");
  revalidatePath(`/dashboard/${workspaceId}`);
  return { data: todo };
};

export const deleteTodo = createSafeAction(DeleteTodo, handler);
