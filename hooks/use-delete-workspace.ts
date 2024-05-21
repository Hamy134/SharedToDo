import { create } from "zustand";

type DeleteWorkspaceStore = {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
  toggle: () => void;
  workspaceId: string;
  setWorkspaceId: (id: string) => void;
};

export const useDeleteWorkspace = create<DeleteWorkspaceStore>((set, get) => ({
  isOpen: false,
  onOpen: () => set({ isOpen: true }),
  onClose: () => set({ isOpen: false }),
  toggle: () => set({ isOpen: !get().isOpen }),
  workspaceId: "",
  setWorkspaceId: (id) => set({ workspaceId: id }),
}));
