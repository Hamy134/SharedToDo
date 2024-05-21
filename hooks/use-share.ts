import type { Workspace } from "@prisma/client";
import { create } from "zustand";

type ShareStore = {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
  workspace?: Workspace;
  setWorkspace: (workspace?: Workspace) => void;
};

export const useShare = create<ShareStore>((set) => ({
  isOpen: false,
  onOpen: () => set({ isOpen: true }),
  onClose: () => set({ isOpen: false }),
  workspace: {
    name: "",
    id: "",
    userId: "",
    publicId: "",
    createdAt: new Date(),
    updatedAt: new Date(),
    isPublic: false,
  },
  setWorkspace: (workspace) => set({ workspace }),
}));
