import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useCvQuery } from "@/services/queries/useCvQueries";
import { useCvEditorStore } from "@/stores/useCvEditorStore";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { EmptyState } from "@/shared/components/EmptyState";
import { FileWarning } from "lucide-react";
import { PreviewFrame } from "@/features/cv-preview/components/PreviewFrame";
import { HiddenPdfExport } from "@/features/cv-preview/components/HiddenPdfExport";
import { EditorToolbar } from "./components/EditorToolbar";
import { EditorNav } from "./components/EditorNav";
import { EditorSectionContent } from "./components/EditorSectionContent";
import { useAutosave } from "./hooks/useAutosave";
import { useUndoRedoShortcuts } from "./hooks/useUndoRedoShortcuts";
import type { EditorSectionId } from "./editor.types";
import type { Cv } from "@/types/cv.types";

export function EditorPage() {
  const { id } = useParams<{ id: string }>();
  const { data, isLoading, isError } = useCvQuery(id);
  const draft = useCvEditorStore((s) => s.draft);
  const load = useCvEditorStore((s) => s.load);
  const undoRedoVersion = useCvEditorStore((s) => s.undoRedoVersion);

  const [activeSection, setActiveSection] = useState<EditorSectionId>("personalInfo");
  const [exportingCv, setExportingCv] = useState<Cv | null>(null);

  const autosaveStatus = useAutosave(id);
  useUndoRedoShortcuts();

  useEffect(() => {
    if (data && data.id !== draft?.id) load(data);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  if (isLoading || !draft) {
    return (
      <div className="flex flex-col gap-4 p-6">
        <Skeleton className="h-10 w-64" />
        <Skeleton className="h-96 w-full rounded-xl" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="p-6">
        <EmptyState icon={FileWarning} title="CV introuvable" description="Ce CV n'existe pas ou a été supprimé." />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col">
      <EditorToolbar
        autosaveStatus={autosaveStatus}
        onExportPdf={() => setExportingCv(draft)}
        isExporting={Boolean(exportingCv)}
      />

      <div className="mx-auto flex w-full max-w-[1600px] flex-1 flex-col gap-6 p-4 sm:p-6 lg:grid lg:grid-cols-[200px_1fr_460px] lg:items-start">
        <EditorNav customization={draft.customization} active={activeSection} onChange={setActiveSection} />

        <div key={`${activeSection}-${undoRedoVersion}`}>
          <EditorSectionContent section={activeSection} />
        </div>

        <div className="hidden lg:sticky lg:top-20 lg:block lg:max-h-[calc(100vh-6rem)] lg:overflow-y-auto lg:pb-6">
          <PreviewFrame cv={draft} />
        </div>
      </div>

      {exportingCv && <HiddenPdfExport cv={exportingCv} onDone={() => setExportingCv(null)} />}
    </div>
  );
}
