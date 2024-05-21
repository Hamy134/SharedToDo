"use server";

import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

import { createSafeAction } from "@/lib/create-safe-action";
import { db } from "@/lib/db";
import { UpdateWorkspace } from "@/schema";

import { InputType, ReturnType } from "./types";

const handler = async (data: InputType): Promise<ReturnType> => {
  const { userId } = auth();

  if (!userId) {
    return {
      error: "Unauthorized.",
    };
  }

  const { id, updateData } = data;

  if (!id) {
    return {
      error: "Missing fields. Failed to update workspace.",
    };
  }

  let workspace;

  try {
    workspace = await db.workspace.update({
      where: {
        id,
        userId,
      },
      data: updateData,
    });
  } catch (error) {
    return {
      error: "Failed to update workspace.",
    };
  }

  revalidatePath("/dashboard");
  revalidatePath(`/dashboard/${workspace.id}`);
  return { data: workspace };
};

export const updateWorkspace = createSafeAction(UpdateWorkspace, handler);
