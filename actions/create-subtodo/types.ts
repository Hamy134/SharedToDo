import type { SubTask } from "@prisma/client";
import { z } from "zod";

import { ActionState } from "@/lib/create-safe-action";
import { CreateSubTodo } from "@/schema";

export type InputType = z.infer<typeof CreateSubTodo>;
export type ReturnType = ActionState<InputType, SubTask>;
