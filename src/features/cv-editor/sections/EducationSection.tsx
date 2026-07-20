import { GraduationCap, Plus } from "lucide-react";
import { useCvEditorStore } from "@/stores/useCvEditorStore";
import { Button } from "@/shared/components/ui/button";
import { EmptyState } from "@/shared/components/EmptyState";
import { SortableList } from "@/shared/components/SortableList";
import { EducationItem } from "../components/EducationItem";
import { createEducation } from "@/utils/factories";
import type { Cv, EducationItem as EducationItemType } from "@/types/cv.types";

export function EducationSection() {
  const draft = useCvEditorStore((s) => s.draft as Cv);
  const updateDraft = useCvEditorStore((s) => s.updateDraft);
  const commit = useCvEditorStore((s) => s.commit);
  const education = draft.education;

  function replace(list: EducationItemType[], live: boolean) {
    const updater = (cv: Cv) => ({ ...cv, education: list });
    if (live) updateDraft(updater);
    else commit(updater);
  }

  return (
    <div className="flex flex-col gap-4">
      {education.length === 0 ? (
        <EmptyState icon={GraduationCap} title="Aucune formation" description="Ajoutez votre parcours académique." />
      ) : (
        <SortableList
          items={education}
          getId={(item) => item.id}
          onReorder={(next) => replace(next, false)}
          renderItem={(item, _index, handle) => (
            <EducationItem
              item={item}
              handle={handle}
              onChange={(updated) => replace(education.map((e) => (e.id === updated.id ? updated : e)), true)}
              onRemove={() => replace(education.filter((e) => e.id !== item.id), false)}
              onDuplicate={() => {
                const index = education.findIndex((e) => e.id === item.id);
                const copy: EducationItemType = { ...structuredClone(item), id: `${item.id}-copy-${Date.now()}` };
                const next = [...education];
                next.splice(index + 1, 0, copy);
                replace(next, false);
              }}
            />
          )}
        />
      )}

      <Button type="button" variant="outline" onClick={() => replace([...education, createEducation()], false)}>
        <Plus /> Ajouter une formation
      </Button>
    </div>
  );
}
