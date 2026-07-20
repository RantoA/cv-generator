import { zodResolver } from "@hookform/resolvers/zod";
import { Copy, Plus, Trash2 } from "lucide-react";
import { experienceSchema } from "@/validations/experience.schema";
import type { Experience } from "@/types/cv.types";
import { useLiveForm } from "../hooks/useLiveForm";
import { useEditCheckpoint } from "../hooks/useEditCheckpoint";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { Button } from "@/shared/components/ui/button";
import { Switch } from "@/shared/components/ui/switch";
import { DragHandle, SortableList, type SortableHandleProps } from "@/shared/components/SortableList";
import { createMission } from "@/utils/factories";

interface ExperienceItemProps {
  experience: Experience;
  onChange: (experience: Experience) => void;
  onCommitStructuralChange: (experience: Experience) => void;
  onRemove: () => void;
  onDuplicate: () => void;
  handle: SortableHandleProps;
}

export function ExperienceItem({ experience, onChange, onCommitStructuralChange, onRemove, onDuplicate, handle }: ExperienceItemProps) {
  const checkpoint = useEditCheckpoint();
  const form = useLiveForm<Experience>({
    resolver: zodResolver(experienceSchema),
    defaultValues: experience,
    mode: "onBlur",
    // `missions` n'est pas un champ RHF : on préserve toujours sa valeur la plus récente du store.
    onChange: (values) => onChange({ ...values, missions: experience.missions }),
  });
  const { register, formState, watch } = form;
  const current = watch("current");
  const errors = formState.errors;

  function updateMissions(missions: Experience["missions"]) {
    onCommitStructuralChange({ ...experience, missions });
  }

  return (
    <div {...checkpoint} className="rounded-lg border border-border bg-background-secondary/50 p-4">
      <div className="mb-3 flex items-center justify-between gap-2">
        <DragHandle {...handle} />
        <div className="flex items-center gap-1">
          <Button type="button" variant="ghost" size="icon" onClick={onDuplicate} aria-label="Dupliquer l'expérience">
            <Copy className="size-4" />
          </Button>
          <Button type="button" variant="ghost" size="icon" onClick={onRemove} aria-label="Supprimer l'expérience">
            <Trash2 className="size-4 text-destructive" />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-1.5">
          <Label>Poste</Label>
          <Input invalid={Boolean(errors.position)} {...register("position")} placeholder="Tech Lead" />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label>Entreprise</Label>
          <Input invalid={Boolean(errors.company)} {...register("company")} placeholder="TechFlow Solutions" />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label>Ville</Label>
          <Input invalid={Boolean(errors.city)} {...register("city")} placeholder="Paris" />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label>Pays</Label>
          <Input invalid={Boolean(errors.country)} {...register("country")} placeholder="France" />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label>Date de début</Label>
          <Input type="month" {...register("startDate")} />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label>Date de fin</Label>
          <Input type="month" disabled={current} {...register("endDate")} />
        </div>
      </div>

      <label className="mt-3 flex items-center gap-2 text-sm text-foreground-secondary">
        <Switch checked={current} onCheckedChange={(checked) => form.setValue("current", checked, { shouldDirty: true })} />
        Poste actuel
      </label>

      <div className="mt-4">
        <Label className="mb-2 block">Missions</Label>
        <SortableList
          items={experience.missions}
          getId={(m) => m.id}
          onReorder={updateMissions}
          renderItem={(mission, index, missionHandle) => (
            <div className="flex items-center gap-2">
              <DragHandle {...missionHandle} className="size-6" />
              <Input
                value={mission.text}
                onChange={(e) => {
                  const next = experience.missions.map((m, i) => (i === index ? { ...m, text: e.target.value } : m));
                  onChange({ ...experience, missions: next });
                }}
                placeholder="Décrivez une réalisation…"
                className="flex-1"
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => updateMissions(experience.missions.filter((m) => m.id !== mission.id))}
                aria-label="Supprimer la mission"
              >
                <Trash2 className="size-3.5 text-destructive" />
              </Button>
            </div>
          )}
        />
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="mt-2"
          onClick={() => updateMissions([...experience.missions, createMission()])}
        >
          <Plus /> Ajouter une mission
        </Button>
      </div>
    </div>
  );
}
