import type { Todo } from "@prisma/client";
import { z } from "zod";

import { ActionState } from "@/lib/create-safe-action";
import { UpdateTodoOrder } from "@/schema";

export type InputType = z.infer<typeof UpdateTodoOrder>;
export type ReturnType = ActionState<InputType, Todo[]>;
