import { create } from "zustand";

type Panel = "directory" | "team" | "settings" | "help" | null;
type UiStore = {
  cameraMode: "follow" | "orbit";
  setCameraMode: (m: "follow" | "orbit") => void;
  panel: Panel;
  toggle: (p: Exclude<Panel, null>) => void;
  close: () => void;
  open: (p: Exclude<Panel, null>) => void;
  toast: string | null;
  setToast: (t: string | null) => void;
};

let toastTimer: ReturnType<typeof setTimeout> | null = null;

export const useUi = create<UiStore>((set, get) => ({
  cameraMode: "follow",
  setCameraMode: (cameraMode) => set({ cameraMode }),
  panel: null,
  toggle: (p) => set({ panel: get().panel === p ? null : p }),
  open: (p) => set({ panel: p }),
  close: () => set({ panel: null }),
  toast: null,
  setToast: (toast) => {
    if (toastTimer) {
      clearTimeout(toastTimer);
      toastTimer = null;
    }
    set({ toast });
    if (toast) {
      toastTimer = setTimeout(() => {
        toastTimer = null;
        if (get().toast === toast) set({ toast: null });
      }, 4000);
    }
  },
}));

