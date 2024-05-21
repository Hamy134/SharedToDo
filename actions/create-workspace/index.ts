"use server";

import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

import { MAX_FREE_WORKSPACES } from "@/constants";
import { createSafeAction } from "@/lib/create-safe-action";
import { db } from "@/lib/db";
import { checkSubscription } from "@/lib/subscription";
import { CreateWorkspace } from "@/schema";

import { InputType, ReturnType } from "./types";

const handler = async (data: InputType): Promise<ReturnType> => {
  const { userId } = auth();

  if (!userId) {
    return {
      error: "Unauthorized.",
    };
  }

  const { name } = data;

  if (!name) {
    return {
      error: "Missing fields. Failed to create workspace.",
    };
  }

  let workspace;

  try {
    const isSubscribed = await checkSubscription();
    const maxWorkspaceCount = isSubscribed ? Infinity : MAX_FREE_WORKSPACES;

    const existingWorkspaceCount = await db.workspace.count({
      where: {
        userId,
      },
    });

    if (existingWorkspaceCount + 1 > maxWorkspaceCount) {
      return {
        error: "Upgrade to the pro plan to create more workspaces.",
      };
    }

    workspace = await db.workspace.create({
      data: {
        userId,
        name,
      },
    });
  } catch (error) {
    return {
      error: "Failed to create workspace.",
    };
  }

  revalidatePath("/dashboard");
  revalidatePath(`/dashboard/${workspace.id}`);
  return { data: workspace };
};

export const createWorkspace = createSafeAction(CreateWorkspace, handler);