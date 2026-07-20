import { useEffect, useState } from "react";
import { useCvEditorStore } from "@/stores/useCvEditorStore";
import { useUpdateCv } from "@/services/queries/useCvQueries";
import { useDebounce } from "@/shared/hooks/useDebounce";

export type AutosaveStatus = "idle" | "saving" | "saved" | "error";

export function useAutosave(cvId: string | undefined) {
  const draft = useCvEditorStore((s) => s.draft);
  const markSaved = useCvEditorStore((s) => s.markSaved);
  const isDirty = useCvEditorStore((s) => s.isDirty);
  const updateCv = useUpdateCv();
  const debouncedDraft = useDebounce(draft, 800);
  const [status, setStatus] = useState<AutosaveStatus>("idle");

  useEffect(() => {
    if (!cvId || !debouncedDraft) return;
    if (!isDirty()) return;

    setStatus("saving");
    updateCv.mutate(
      { id: cvId, cv: debouncedDraft, options: { silent: true } },
      {
        onSuccess: () => {
          markSaved();
          setStatus("saved");
        },
        onError: () => setStatus("error"),
      },
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedDraft, cvId]);

  return status;
}
