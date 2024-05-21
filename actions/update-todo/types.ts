import { z } from "zod";

import { ActionState } from "@/lib/create-safe-action";
import { UpdateTodo } from "@/schema";
import { Todo } from "@prisma/client";

export type InputType = z.infer<typeof UpdateTodo>;
export type ReturnType = ActionState<InputType, Todo>;
