import { create } from "zustand";
import type { Cv } from "@/types/cv.types";

const MAX_HISTORY = 50;

interface CvEditorState {
  draft: Cv | null;
  savedSnapshot: Cv | null;
  past: Cv[];
  future: Cv[];
  /** Incrémenté uniquement par undo()/redo(), utilisé pour forcer le resynchronisation des formulaires. */
  undoRedoVersion: number;
  /** Snapshot du draft pris au focus d'un champ, poussé dans l'historique au blur si la valeur a changé. */
  editSnapshot: Cv | null;
  load: (cv: Cv) => void;
  /** Applique une mise à jour sans créer d'étape d'annulation (saisie en cours). */
  updateDraft: (updater: (cv: Cv) => Cv) => void;
  /** Enregistre l'état courant comme point d'annulation, puis applique la mise à jour. */
  commit: (updater: (cv: Cv) => Cv) => void;
  /** À appeler au focus d'un champ pour capturer l'état avant édition. */
  beginEdit: () => void;
  /** À appeler quand le focus quitte le champ/la section : crée un point d'annulation si la valeur a changé. */
  endEdit: () => void;
  undo: () => void;
  redo: () => void;
  markSaved: () => void;
  isDirty: () => boolean;
}

export const useCvEditorStore = create<CvEditorState>()((set, get) => ({
  draft: null,
  savedSnapshot: null,
  past: [],
  future: [],
  undoRedoVersion: 0,
  editSnapshot: null,

  load: (cv) => set({ draft: cv, savedSnapshot: cv, past: [], future: [], undoRedoVersion: 0, editSnapshot: null }),

  updateDraft: (updater) => {
    const { draft } = get();
    if (!draft) return;
    set({ draft: updater(draft) });
  },

  commit: (updater) => {
    const { draft, past } = get();
    if (!draft) return;
    const nextPast = [...past, draft].slice(-MAX_HISTORY);
    set({ past: nextPast, future: [], draft: updater(draft) });
  },

  beginEdit: () => {
    const { draft, editSnapshot } = get();
    if (!draft || editSnapshot) return;
    set({ editSnapshot: draft });
  },

  endEdit: () => {
    const { draft, editSnapshot, past } = get();
    if (!editSnapshot) return;
    if (draft && JSON.stringify(draft) !== JSON.stringify(editSnapshot)) {
      set({ past: [...past, editSnapshot].slice(-MAX_HISTORY), future: [], editSnapshot: null });
    } else {
      set({ editSnapshot: null });
    }
  },

  undo: () => {
    const { draft, past, future, undoRedoVersion } = get();
    if (!draft || past.length === 0) return;
    const previous = past[past.length - 1];
    set({
      draft: previous,
      past: past.slice(0, -1),
      future: [draft, ...future].slice(0, MAX_HISTORY),
      undoRedoVersion: undoRedoVersion + 1,
    });
  },

  redo: () => {
    const { draft, past, future, undoRedoVersion } = get();
    if (!draft || future.length === 0) return;
    const next = future[0];
    set({
      draft: next,
      future: future.slice(1),
      past: [...past, draft].slice(-MAX_HISTORY),
      undoRedoVersion: undoRedoVersion + 1,
    });
  },

  markSaved: () => set({ savedSnapshot: get().draft }),

  isDirty: () => {
    const { draft, savedSnapshot } = get();
    if (!draft || !savedSnapshot) return false;
    return JSON.stringify(draft) !== JSON.stringify(savedSnapshot);
  },
}));
