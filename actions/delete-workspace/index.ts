"use server";

import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

import { createSafeAction } from "@/lib/create-safe-action";
import { db } from "@/lib/db";
import { DeleteWorkspace } from "@/schema";

import { InputType, ReturnType } from "./types";

const handler = async (data: InputType): Promise<ReturnType> => {
  const { userId } = auth();

  if (!userId) {
    return {
      error: "Unauthorized.",
    };
  }

  const { id } = data;

  if (!id) {
    return {
      error: "Missing fields. Failed to delete workspace.",
    };
  }

  let workspace;

  try {
    workspace = await db.workspace.delete({
      where: {
        id,
        userId,
      },
    });
  } catch (error) {
    return {
      error: "Failed to delete workspace.",
    };
  }

  revalidatePath("/dashboard");
  revalidatePath(`/dashboard/${workspace.id}`);
  return { data: workspace };
};

export const deleteWorkspace = createSafeAction(DeleteWorkspace, handler);
