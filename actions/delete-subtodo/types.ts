import type { SubTask } from "@prisma/client";
import { z } from "zod";

import { ActionState } from "@/lib/create-safe-action";
import { DeleteSubTodo } from "@/schema";

export type InputType = z.infer<typeof DeleteSubTodo>;
export type ReturnType = ActionState<InputType, SubTask>;
