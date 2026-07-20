import { useState } from "react";
import type { LucideIcon } from "lucide-react";
import { Plus, X } from "lucide-react";
import { useCvEditorStore } from "@/stores/useCvEditorStore";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { EmptyState } from "@/shared/components/EmptyState";
import { SortableList, DragHandle } from "@/shared/components/SortableList";
import { useEditCheckpoint } from "../hooks/useEditCheckpoint";
import { createBadge } from "@/utils/factories";
import type { Cv, SkillBadge } from "@/types/cv.types";

interface BadgeListSectionProps {
  sectionKey: "hardSkills" | "softSkills";
  icon: LucideIcon;
  emptyLabel: string;
  emptyDescription: string;
  addLabel: string;
}

export function BadgeListSection({ sectionKey, icon, emptyLabel, emptyDescription, addLabel }: BadgeListSectionProps) {
  const draft = useCvEditorStore((s) => s.draft as Cv);
  const updateDraft = useCvEditorStore((s) => s.updateDraft);
  const commit = useCvEditorStore((s) => s.commit);
  const checkpoint = useEditCheckpoint();
  const badges = draft[sectionKey];
  const [newLabel, setNewLabel] = useState("");

  function replace(list: SkillBadge[], live: boolean) {
    const updater = (cv: Cv) => ({ ...cv, [sectionKey]: list }) as Cv;
    if (live) updateDraft(updater);
    else commit(updater);
  }

  function handleAdd() {
    const label = newLabel.trim();
    if (!label) return;
    replace([...badges, { ...createBadge(), label }], false);
    setNewLabel("");
  }

  return (
    <div className="flex flex-col gap-4">
      {badges.length === 0 ? (
        <EmptyState icon={icon} title={emptyLabel} description={emptyDescription} />
      ) : (
        <SortableList
          orientation="wrap"
          items={badges}
          getId={(badge) => badge.id}
          onReorder={(next) => replace(next, false)}
          renderItem={(badge, _index, handle) => (
            <div
              {...checkpoint}
              className="flex items-center gap-1 rounded-full border border-border bg-background-secondary/60 py-1 pl-1 pr-2"
            >
              <DragHandle {...handle} className="size-6" />
              <Input
                value={badge.label}
                onChange={(e) => replace(badges.map((b) => (b.id === badge.id ? { ...b, label: e.target.value } : b)), true)}
                className="h-7 w-32 border-none bg-transparent px-1 shadow-none focus-visible:ring-0"
              />
              <button
                type="button"
                onClick={() => replace(badges.filter((b) => b.id !== badge.id), false)}
                aria-label="Supprimer"
                className="rounded-full p-0.5 text-foreground-secondary/60 hover:bg-muted hover:text-destructive"
              >
                <X className="size-3.5" />
              </button>
            </div>
          )}
        />
      )}

      <div className="flex items-center gap-2">
        <Input
          value={newLabel}
          onChange={(e) => setNewLabel(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), handleAdd())}
          placeholder="Ajouter…"
          className="max-w-xs"
        />
        <Button type="button" variant="outline" onClick={handleAdd}>
          <Plus /> {addLabel}
        </Button>
      </div>
    </div>
  );
}
