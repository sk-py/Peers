import { create } from "zustand";

export const StateStore = create((set) => ({
  isOpen: false,
  toggleProfile: () => {
    set((state) => ({ isOpen: !state.isOpen }));
    console.log("isOpen", isOpen);
  },
}));
