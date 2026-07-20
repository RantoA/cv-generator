import { useEffect } from "react";
import { useCvEditorStore } from "@/stores/useCvEditorStore";

export function useUndoRedoShortcuts() {
  const undo = useCvEditorStore((s) => s.undo);
  const redo = useCvEditorStore((s) => s.redo);

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      const isModifier = event.ctrlKey || event.metaKey;
      if (!isModifier || event.key.toLowerCase() !== "z") return;
      event.preventDefault();
      if (event.shiftKey) redo();
      else undo();
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [undo, redo]);
}
