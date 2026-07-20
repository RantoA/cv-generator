import { zodResolver } from "@hookform/resolvers/zod";
import { Copy, Trash2 } from "lucide-react";
import { educationSchema } from "@/validations/education.schema";
import type { EducationItem as EducationItemType } from "@/types/cv.types";
import { useLiveForm } from "../hooks/useLiveForm";
import { useEditCheckpoint } from "../hooks/useEditCheckpoint";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { Button } from "@/shared/components/ui/button";
import { DragHandle, type SortableHandleProps } from "@/shared/components/SortableList";

interface EducationItemProps {
  item: EducationItemType;
  onChange: (item: EducationItemType) => void;
  onRemove: () => void;
  onDuplicate: () => void;
  handle: SortableHandleProps;
}

export function EducationItem({ item, onChange, onRemove, onDuplicate, handle }: EducationItemProps) {
  const checkpoint = useEditCheckpoint();
  const { register, formState } = useLiveForm<EducationItemType>({
    resolver: zodResolver(educationSchema),
    defaultValues: item,
    mode: "onBlur",
    onChange,
  });
  const errors = formState.errors;

  return (
    <div {...checkpoint} className="rounded-lg border border-border bg-background-secondary/50 p-4">
      <div className="mb-3 flex items-center justify-between gap-2">
        <DragHandle {...handle} />
        <div className="flex items-center gap-1">
          <Button type="button" variant="ghost" size="icon" onClick={onDuplicate} aria-label="Dupliquer">
            <Copy className="size-4" />
          </Button>
          <Button type="button" variant="ghost" size="icon" onClick={onRemove} aria-label="Supprimer">
            <Trash2 className="size-4 text-destructive" />
          </Button>
        </div>
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-1.5">
          <Label>Établissement</Label>
          <Input invalid={Boolean(errors.institution)} {...register("institution")} placeholder="École Centrale" />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label>Ville</Label>
          <Input invalid={Boolean(errors.city)} {...register("city")} placeholder="Paris" />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label>Diplôme</Label>
          <Input invalid={Boolean(errors.degree)} {...register("degree")} placeholder="Master" />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label>Parcours</Label>
          <Input invalid={Boolean(errors.field)} {...register("field")} placeholder="Ingénierie Logicielle" />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label>Date d&apos;obtention</Label>
          <Input invalid={Boolean(errors.graduationDate)} {...register("graduationDate")} placeholder="2012" />
        </div>
      </div>
    </div>
  );
}
