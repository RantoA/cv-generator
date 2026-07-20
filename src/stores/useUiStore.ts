import { create } from "zustand";
import { persist } from "zustand/middleware";

export type Theme = "light" | "dark";

function applyThemeClass(theme: Theme) {
  if (typeof document === "undefined") return;
  document.documentElement.classList.toggle("dark", theme === "dark");
}

function getSystemTheme(): Theme {
  if (typeof window === "undefined") return "light";
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

interface UiState {
  theme: Theme;
  isFullscreenPreview: boolean;
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
  setFullscreenPreview: (value: boolean) => void;
}

export const useUiStore = create<UiState>()(
  persist(
    (set, get) => ({
      theme: getSystemTheme(),
      isFullscreenPreview: false,
      toggleTheme: () => {
        const next: Theme = get().theme === "light" ? "dark" : "light";
        applyThemeClass(next);
        set({ theme: next });
      },
      setTheme: (theme) => {
        applyThemeClass(theme);
        set({ theme });
      },
      setFullscreenPreview: (value) => set({ isFullscreenPreview: value }),
    }),
    {
      name: "cv-generator-ui",
      partialize: (state) => ({ theme: state.theme }),
      onRehydrateStorage: () => (state) => {
        if (state) applyThemeClass(state.theme);
      },
    },
  ),
);

applyThemeClass(useUiStore.getState().theme);
