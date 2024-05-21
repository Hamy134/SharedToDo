import { z } from "zod";

import { ActionState } from "@/lib/create-safe-action";
import { CreateTodo } from "@/schema";
import type { TodoWithSubTasks } from "@/types/workspace";

export type InputType = z.infer<typeof CreateTodo>;
export type ReturnType = ActionState<InputType, TodoWithSubTasks>;
