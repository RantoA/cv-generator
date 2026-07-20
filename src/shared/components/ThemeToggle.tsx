import { Moon, Sun } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { useUiStore } from "@/stores/useUiStore";

export function ThemeToggle() {
  const theme = useUiStore((state) => state.theme);
  const toggleTheme = useUiStore((state) => state.toggleTheme);

  return (
    <Button
      type="button"
      variant="ghost"
      size="icon"
      onClick={toggleTheme}
      aria-label={theme === "dark" ? "Activer le thème clair" : "Activer le thème sombre"}
    >
      {theme === "dark" ? <Sun /> : <Moon />}
    </Button>
  );
}
