import { FullMessageType } from "@/types";
import { create } from "zustand";

interface IStore {
  isInputFocused: boolean;
  toggleInputFocused: () => void;
  data: FullMessageType | null;
  setData: (data: FullMessageType) => void;
}

export const useStore = create<IStore>((set) => ({
  data: null,
  setData: (data) => set((state) => ({ data })),
  isInputFocused: false,
  toggleInputFocused: () =>
    set((state) => ({ isInputFocused: !state.isInputFocused })),
}));

