import type { TodoWithSubTasks } from "@/types/workspace";
import { create } from "zustand";

type EditTaskStore = {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
  toggle: () => void;
  task: TodoWithSubTasks;
  setTask: (task: TodoWithSubTasks) => void;
  isPreview: boolean;
  showPreview: () => void;
};

const defaultTask: TodoWithSubTasks = {
  id: "",
  task: "",
  description: "",
  isCompleted: false,
  order: 0,
  workspaceId: "",
  updatedAt: new Date(),
  createdAt: new Date(),
  subtasks: [],
};

export const useEditTask = create<EditTaskStore>((set, get) => ({
  isOpen: false,
  onOpen: () => set({ isOpen: true }),
  onClose: () => set({ isOpen: false, task: defaultTask, isPreview: false }),
  toggle: () => set({ isOpen: !get().isOpen }),
  task: defaultTask,
  setTask: (task) => set({ task }),
  isPreview: false,
  showPreview: () => set({ isPreview: true }),
}));
