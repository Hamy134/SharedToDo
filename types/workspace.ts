import type { SubTask, Todo, Workspace } from "@prisma/client";

export type TodoWithSubTasks = Todo & {
  subtasks: SubTask[];
};

export type WorkspaceWithTodosWithSubTasks = Workspace & {
  todos: (Todo & {
    subtasks: SubTask[];
  })[];
};
