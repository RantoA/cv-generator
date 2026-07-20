import type { FocusEvent } from "react";
import { useCvEditorStore } from "@/stores/useCvEditorStore";

/**
 * Regroupe les modifications d'un champ/bloc en une seule étape d'annulation :
 * capture l'état au focus, l'enregistre dans l'historique quand le focus quitte le bloc.
 */
export function useEditCheckpoint() {
  const beginEdit = useCvEditorStore((s) => s.beginEdit);
  const endEdit = useCvEditorStore((s) => s.endEdit);

  return {
    onFocus: () => beginEdit(),
    onBlur: (event: FocusEvent<HTMLElement>) => {
      if (event.currentTarget.contains(event.relatedTarget as Node | null)) return;
      endEdit();
    },
  };
}
