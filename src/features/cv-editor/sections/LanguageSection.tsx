import { Languages, Plus } from "lucide-react";
import { useCvEditorStore } from "@/stores/useCvEditorStore";
import { Button } from "@/shared/components/ui/button";
import { EmptyState } from "@/shared/components/EmptyState";
import { SortableList } from "@/shared/components/SortableList";
import { LanguageItem } from "../components/LanguageItem";
import { createLanguage } from "@/utils/factories";
import type { Cv, LanguageItem as LanguageItemType } from "@/types/cv.types";

export function LanguageSection() {
  const draft = useCvEditorStore((s) => s.draft as Cv);
  const updateDraft = useCvEditorStore((s) => s.updateDraft);
  const commit = useCvEditorStore((s) => s.commit);
  const languages = draft.languages;

  function replace(list: LanguageItemType[], live: boolean) {
    const updater = (cv: Cv) => ({ ...cv, languages: list });
    if (live) updateDraft(updater);
    else commit(updater);
  }

  return (
    <div className="flex flex-col gap-4">
      {languages.length === 0 ? (
        <EmptyState icon={Languages} title="Aucune langue" description="Ajoutez les langues que vous maîtrisez." />
      ) : (
        <SortableList
          items={languages}
          getId={(item) => item.id}
          onReorder={(next) => replace(next, false)}
          renderItem={(item, _index, handle) => (
            <LanguageItem
              item={item}
              handle={handle}
              onChange={(updated) => replace(languages.map((l) => (l.id === updated.id ? updated : l)), true)}
              onRemove={() => replace(languages.filter((l) => l.id !== item.id), false)}
            />
          )}
        />
      )}

      <Button type="button" variant="outline" onClick={() => replace([...languages, createLanguage()], false)}>
        <Plus /> Ajouter une langue
      </Button>
    </div>
  );
}
