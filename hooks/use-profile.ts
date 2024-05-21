import { create } from "zustand";

type ProfileStore = {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
};

export const useProfile = create<ProfileStore>((set) => ({
  isOpen: false,
  onOpen: () => set({ isOpen: true }),
  onClose: () => set({ isOpen: false }),
}));
