import type { SubTask } from "@prisma/client";
import { z } from "zod";

import { ActionState } from "@/lib/create-safe-action";
import { UpdateSubTodoOrder } from "@/schema";

export type InputType = z.infer<typeof UpdateSubTodoOrder>;
export type ReturnType = ActionState<InputType, SubTask[]>;
