"use server";

import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

import { createSafeAction } from "@/lib/create-safe-action";
import { db } from "@/lib/db";
import { CreateSubTodo } from "@/schema";

import { InputType, ReturnType } from "./types";

const handler = async (data: InputType): Promise<ReturnType> => {
  const { userId } = auth();

  if (!userId) {
    return {
      error: "Unauthorized.",
    };
  }

  const { name, todoId, workspaceId } = data;

  if (!name || !todoId || !workspaceId) {
    return {
      error: "Missing fields. Failed to create subtask.",
    };
  }

  let subtodo;

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

    const lastSubTodo = await db.subTask.findFirst({
      where: { todoId },
      orderBy: { order: "desc" },
      select: { order: true },
    });

    const newOrder = lastSubTodo ? lastSubTodo.order + 1 : 1;

    subtodo = await db.subTask.create({
      data: {
        todoId,
        task: name,
        order: newOrder,
      },
    });
  } catch (error) {
    return {
      error: "Failed to create subtask.",
    };
  }

  revalidatePath("/dashboard");
  revalidatePath(`/dashboard/${workspaceId}`);
  return { data: subtodo };
};

export const createSubTodo = createSafeAction(CreateSubTodo, handler);
