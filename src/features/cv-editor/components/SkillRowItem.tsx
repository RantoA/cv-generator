import { Copy, Trash2 } from "lucide-react";
import type { SkillCategoryRow } from "@/types/cv.types";
import { useLiveForm } from "../hooks/useLiveForm";
import { useEditCheckpoint } from "../hooks/useEditCheckpoint";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { Button } from "@/shared/components/ui/button";
import { DragHandle, type SortableHandleProps } from "@/shared/components/SortableList";

interface SkillRowFormValues {
  category: string;
  technologiesText: string;
}

interface SkillRowItemProps {
  row: SkillCategoryRow;
  onChange: (row: SkillCategoryRow) => void;
  onRemove: () => void;
  onDuplicate: () => void;
  handle: SortableHandleProps;
}

export function SkillRowItem({ row, onChange, onRemove, onDuplicate, handle }: SkillRowItemProps) {
  const checkpoint = useEditCheckpoint();
  const { register, formState } = useLiveForm<SkillRowFormValues>({
    defaultValues: { category: row.category, technologiesText: row.technologies.join(", ") },
    mode: "onBlur",
    onChange: (values) =>
      onChange({
        ...row,
        category: values.category,
        technologies: values.technologiesText
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean),
      }),
  });
  const errors = formState.errors;

  return (
    <div {...checkpoint} className="flex items-start gap-2 rounded-lg border border-border bg-background-secondary/50 p-3">
      <DragHandle {...handle} className="mt-6" />
      <div className="grid flex-1 grid-cols-1 gap-3 sm:grid-cols-[200px_1fr]">
        <div className="flex flex-col gap-1.5">
          <Label>Catégorie</Label>
          <Input invalid={Boolean(errors.category)} {...register("category", { required: true })} placeholder="Backend" />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label>Technologies (séparées par des virgules)</Label>
          <Input {...register("technologiesText")} placeholder="Node.js, Django, FastAPI" />
        </div>
      </div>
      <div className="mt-6 flex items-center gap-1">
        <Button type="button" variant="ghost" size="icon" onClick={onDuplicate} aria-label="Dupliquer la ligne">
          <Copy className="size-4" />
        </Button>
        <Button type="button" variant="ghost" size="icon" onClick={onRemove} aria-label="Supprimer la ligne">
          <Trash2 className="size-4 text-destructive" />
        </Button>
      </div>
    </div>
  );
}
