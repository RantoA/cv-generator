import { useState } from "react";
import { useParams } from "react-router-dom";
import { Download, FileWarning } from "lucide-react";
import { useCvQuery } from "@/services/queries/useCvQueries";
import { Button } from "@/shared/components/ui/button";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { EmptyState } from "@/shared/components/EmptyState";
import { PreviewFrame } from "./components/PreviewFrame";
import { PrintableCv } from "./components/PrintableCv";

/** Page d'aperçu épurée (ouverte dans un nouvel onglet) : uniquement le CV et le bouton d'export, sans chrome applicatif. */
export function PreviewPage() {
  const { id } = useParams<{ id: string }>();
  const { data: cv, isLoading, isError } = useCvQuery(id);
  const [isExporting, setIsExporting] = useState(false);

  if (isLoading || !cv) {
    return (
      <div className="flex flex-col gap-4 p-6">
        <Skeleton className="h-10 w-64" />
        <Skeleton className="mx-auto h-[600px] w-full max-w-[820px] rounded-2xl" />
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
    <div className="min-h-screen bg-background-secondary">
      <div className="fixed left-4 top-4 z-20">
        <Button onClick={() => setIsExporting(true)} disabled={isExporting} className="gap-0">
          <Download className="mr-[10px]" />
          {isExporting ? "Export…" : "Télécharger PDF"}
        </Button>
      </div>

      <main className="py-10">
        <PreviewFrame cv={cv} />
      </main>

      {isExporting && <PrintableCv cv={cv} onDone={() => setIsExporting(false)} />}
    </div>
  );
}
