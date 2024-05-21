import { create } from "zustand";

type EditSubTaskStore = {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
  toggle: () => void;
  subtaskId: string;
  setSubtaskId: (id: string) => void;
};

export const useEditSubtask = create<EditSubTaskStore>((set, get) => ({
  isOpen: false,
  onOpen: () => set({ isOpen: true }),
  onClose: () => set({ isOpen: false }),
  toggle: () => set({ isOpen: !get().isOpen }),
  subtaskId: "",
  setSubtaskId: (id) => set({ subtaskId: id }),
}));
