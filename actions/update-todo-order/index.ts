"use server";

import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

import { createSafeAction } from "@/lib/create-safe-action";
import { db } from "@/lib/db";
import { UpdateTodoOrder } from "@/schema";

import { InputType, ReturnType } from "./types";

const handler = async (data: InputType): Promise<ReturnType> => {
  const { userId } = auth();

  if (!userId) {
    return {
      error: "Unauthorized.",
    };
  }

  const { workspaceId, todos } = data;

  if (!workspaceId || !todos) {
    return {
      error: "Missing fields. Failed to update todo order.",
    };
  }

  let updatedTodos;

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

    const transaction = todos.map((todo) =>
      db.todo.update({
        where: {
          id: todo.id,
          workspaceId,
        },
        data: {
          order: todo.order,
        },
      })
    );

    updatedTodos = await db.$transaction(transaction);
  } catch (error) {
    return {
      error: "Failed to update todo order.",
    };
  }

  revalidatePath(`/dashboard/${workspaceId}`);
  return { data: updatedTodos };
};

export const updateTodoOrder = createSafeAction(UpdateTodoOrder, handler);
