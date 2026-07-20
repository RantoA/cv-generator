import { Briefcase, Plus } from "lucide-react";
import { useCvEditorStore } from "@/stores/useCvEditorStore";
import { Button } from "@/shared/components/ui/button";
import { EmptyState } from "@/shared/components/EmptyState";
import { SortableList } from "@/shared/components/SortableList";
import { ExperienceItem } from "../components/ExperienceItem";
import { createExperience } from "@/utils/factories";
import type { Cv, Experience } from "@/types/cv.types";

export function ExperienceSection() {
  const draft = useCvEditorStore((s) => s.draft as Cv);
  const updateDraft = useCvEditorStore((s) => s.updateDraft);
  const commit = useCvEditorStore((s) => s.commit);
  const experiences = draft.experiences;

  function replace(list: Experience[], live: boolean) {
    const updater = (cv: Cv) => ({ ...cv, experiences: list });
    if (live) updateDraft(updater);
    else commit(updater);
  }

  return (
    <div className="flex flex-col gap-4">
      {experiences.length === 0 ? (
        <EmptyState
          icon={Briefcase}
          title="Aucune expérience"
          description="Ajoutez vos expériences professionnelles pour enrichir votre CV."
        />
      ) : (
        <SortableList
          items={experiences}
          getId={(exp) => exp.id}
          onReorder={(next) => replace(next, false)}
          renderItem={(exp, _index, handle) => (
            <ExperienceItem
              experience={exp}
              handle={handle}
              onChange={(updated) => replace(experiences.map((e) => (e.id === updated.id ? updated : e)), true)}
              onCommitStructuralChange={(updated) =>
                replace(experiences.map((e) => (e.id === updated.id ? updated : e)), false)
              }
              onRemove={() => replace(experiences.filter((e) => e.id !== exp.id), false)}
              onDuplicate={() => {
                const index = experiences.findIndex((e) => e.id === exp.id);
                const copy: Experience = { ...structuredClone(exp), id: `${exp.id}-copy-${Date.now()}` };
                const next = [...experiences];
                next.splice(index + 1, 0, copy);
                replace(next, false);
              }}
            />
          )}
        />
      )}

      <Button type="button" variant="outline" onClick={() => replace([...experiences, createExperience()], false)}>
        <Plus /> Ajouter une expérience
      </Button>
    </div>
  );
}
