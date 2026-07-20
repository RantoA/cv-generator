import { Plus, Wrench } from "lucide-react";
import { useCvEditorStore } from "@/stores/useCvEditorStore";
import { Button } from "@/shared/components/ui/button";
import { EmptyState } from "@/shared/components/EmptyState";
import { SortableList } from "@/shared/components/SortableList";
import { SkillRowItem } from "../components/SkillRowItem";
import { createSkillRow } from "@/utils/factories";
import type { Cv, SkillCategoryRow } from "@/types/cv.types";

export function SkillsTableSection() {
  const draft = useCvEditorStore((s) => s.draft as Cv);
  const updateDraft = useCvEditorStore((s) => s.updateDraft);
  const commit = useCvEditorStore((s) => s.commit);
  const rows = draft.skillsTable;

  function replace(list: SkillCategoryRow[], live: boolean) {
    const updater = (cv: Cv) => ({ ...cv, skillsTable: list });
    if (live) updateDraft(updater);
    else commit(updater);
  }

  return (
    <div className="flex flex-col gap-4">
      {rows.length === 0 ? (
        <EmptyState icon={Wrench} title="Aucune compétence technique" description="Ajoutez vos catégories de compétences." />
      ) : (
        <SortableList
          items={rows}
          getId={(row) => row.id}
          onReorder={(next) => replace(next, false)}
          renderItem={(row, _index, handle) => (
            <SkillRowItem
              row={row}
              handle={handle}
              onChange={(updated) => replace(rows.map((r) => (r.id === updated.id ? updated : r)), true)}
              onRemove={() => replace(rows.filter((r) => r.id !== row.id), false)}
              onDuplicate={() => {
                const index = rows.findIndex((r) => r.id === row.id);
                const copy: SkillCategoryRow = { ...structuredClone(row), id: `${row.id}-copy-${Date.now()}` };
                const next = [...rows];
                next.splice(index + 1, 0, copy);
                replace(next, false);
              }}
            />
          )}
        />
      )}

      <Button type="button" variant="outline" onClick={() => replace([...rows, createSkillRow()], false)}>
        <Plus /> Ajouter une ligne
      </Button>
    </div>
  );
}
