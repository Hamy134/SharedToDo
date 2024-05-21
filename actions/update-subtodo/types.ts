import type { SubTask } from "@prisma/client";
import { z } from "zod";

import { ActionState } from "@/lib/create-safe-action";
import { UpdateSubTodo } from "@/schema";

export type InputType = z.infer<typeof UpdateSubTodo>;
export type ReturnType = ActionState<InputType, SubTask>;
