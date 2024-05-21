"use server";

import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

import { MAX_FREE_TASKS } from "@/constants";
import { createSafeAction } from "@/lib/create-safe-action";
import { db } from "@/lib/db";
import { checkSubscription } from "@/lib/subscription";
import { CreateTodo } from "@/schema";

import { InputType, ReturnType } from "./types";

const handler = async (data: InputType): Promise<ReturnType> => {
  const { userId } = auth();

  if (!userId) {
    return {
      error: "Unauthorized.",
    };
  }

  const { name, workspaceId } = data;

  if (!name || !workspaceId) {
    return {
      error: "Missing fields. Failed to create todo.",
    };
  }

  let todo;
  let workspace;

  try {
    workspace = await db.workspace.findUnique({
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

    const isSubscribed = await checkSubscription();
    const maxTodoCount = isSubscribed ? Infinity : MAX_FREE_TASKS;

    const existingTodoCount = await db.todo.count({
      where: {
        workspaceId,
      },
    });

    if (existingTodoCount + 1 > maxTodoCount) {
      return {
        error: "Upgrade to the pro plan to create more tasks.",
      };
    }

    const lastTodo = await db.todo.findFirst({
      where: { workspaceId },
      orderBy: { order: "desc" },
      select: { order: true },
    });

    const newOrder = lastTodo ? lastTodo.order + 1 : 1;

    todo = await db.todo.create({
      data: {
        workspaceId,
        task: name,
        order: newOrder,
      },
      include: {
        subtasks: {
          orderBy: {
            order: "asc",
          },
        },
      },
    });
  } catch (error) {
    return {
      error: "Failed to create todo.",
    };
  }

  revalidatePath("/dashboard");
  revalidatePath(`/dashboard/${workspace.id}`);
  return { data: todo };
};

export const createTodo = createSafeAction(CreateTodo, handler);