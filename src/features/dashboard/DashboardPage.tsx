import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus } from "lucide-react";
import { PageHeader } from "@/shared/components/PageHeader";
import { Button } from "@/shared/components/ui/button";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { ConfirmDialog } from "@/shared/components/ConfirmDialog";
import { useCvsQuery, useCreateCv, useDeleteCv, useDuplicateCv } from "@/services/queries/useCvQueries";
import type { Cv } from "@/types/cv.types";
import { DashboardToolbar } from "./components/DashboardToolbar";
import { CvGrid } from "./components/CvGrid";
import { Pagination } from "./components/Pagination";
import { useCvListPage } from "./hooks/useCvListPage";
import { PrintableCv } from "@/features/cv-preview/components/PrintableCv";

export function DashboardPage() {
  const navigate = useNavigate();
  const { data: cvs = [], isLoading } = useCvsQuery();
  const createCv = useCreateCv();
  const duplicateCv = useDuplicateCv();
  const deleteCv = useDeleteCv();

  const [cvToDelete, setCvToDelete] = useState<Cv | null>(null);
  const [cvToExport, setCvToExport] = useState<Cv | null>(null);

  const list = useCvListPage(cvs);

  async function handleCreate() {
    const cv = await createCv.mutateAsync("Nouveau CV");
    navigate(`/cv/${cv.id}/edit`);
  }

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Tableau de bord"
        description="Gérez tous vos CV professionnels en un seul endroit."
        actions={
          <Button onClick={handleCreate} disabled={createCv.isPending}>
            <Plus /> Nouveau CV
          </Button>
        }
      />

      <DashboardToolbar
        search={list.search}
        onSearchChange={list.setSearch}
        sort={list.sort}
        onSortChange={list.setSort}
        templateFilter={list.templateFilter}
        onTemplateFilterChange={list.setTemplateFilter}
      />

      {isLoading ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-48 rounded-xl" />
          ))}
        </div>
      ) : (
        <>
          <p className="text-sm text-foreground-secondary">
            {list.totalResults} CV{list.totalResults > 1 ? "s" : ""}
          </p>
          <CvGrid
            cvs={list.items}
            hasAnyCv={cvs.length > 0}
            onDuplicate={(cv) => duplicateCv.mutate(cv.id)}
            onDelete={(cv) => setCvToDelete(cv)}
            onExportPdf={(cv) => setCvToExport(cv)}
          />
          <Pagination page={list.page} totalPages={list.totalPages} onPageChange={list.setPage} />
        </>
      )}

      <ConfirmDialog
        open={Boolean(cvToDelete)}
        onOpenChange={(open) => !open && setCvToDelete(null)}
        title="Supprimer ce CV ?"
        description={`« ${cvToDelete?.meta.name} » sera définitivement supprimé. Cette action est irréversible.`}
        onConfirm={() => cvToDelete && deleteCv.mutate(cvToDelete.id)}
      />

      {cvToExport && <PrintableCv cv={cvToExport} onDone={() => setCvToExport(null)} />}
    </div>
  );
}
