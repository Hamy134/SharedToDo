import type { Todo } from "@prisma/client";
import { z } from "zod";

import { ActionState } from "@/lib/create-safe-action";
import { DeleteTodo } from "@/schema";

export type InputType = z.infer<typeof DeleteTodo>;
export type ReturnType = ActionState<InputType, Todo>;
