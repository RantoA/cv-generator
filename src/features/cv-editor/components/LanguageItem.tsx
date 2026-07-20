import { Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Trash2 } from "lucide-react";
import { languageSchema, LANGUAGE_LEVELS } from "@/validations/language.schema";
import type { LanguageItem as LanguageItemType } from "@/types/cv.types";
import { useLiveForm } from "../hooks/useLiveForm";
import { useEditCheckpoint } from "../hooks/useEditCheckpoint";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { Button } from "@/shared/components/ui/button";
import { Slider } from "@/shared/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/components/ui/select";
import { DragHandle, type SortableHandleProps } from "@/shared/components/SortableList";

interface LanguageItemProps {
  item: LanguageItemType;
  onChange: (item: LanguageItemType) => void;
  onRemove: () => void;
  handle: SortableHandleProps;
}

export function LanguageItem({ item, onChange, onRemove, handle }: LanguageItemProps) {
  const checkpoint = useEditCheckpoint();
  const { register, control, watch, formState } = useLiveForm<LanguageItemType>({
    resolver: zodResolver(languageSchema),
    defaultValues: item,
    mode: "onBlur",
    onChange,
  });
  const proficiency = watch("proficiency");
  const errors = formState.errors;

  return (
    <div {...checkpoint} className="flex flex-col gap-3 rounded-lg border border-border bg-background-secondary/50 p-4 sm:flex-row sm:items-center">
      <DragHandle {...handle} />
      <div className="grid flex-1 grid-cols-1 gap-3 sm:grid-cols-3">
        <div className="flex flex-col gap-1.5">
          <Label>Langue</Label>
          <Input invalid={Boolean(errors.name)} {...register("name")} placeholder="Anglais" />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label>Niveau</Label>
          <Controller
            control={control}
            name="level"
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Niveau" />
                </SelectTrigger>
                <SelectContent>
                  {LANGUAGE_LEVELS.map((level) => (
                    <SelectItem key={level} value={level}>
                      {level}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label>Maîtrise ({proficiency}%)</Label>
          <Controller
            control={control}
            name="proficiency"
            render={({ field }) => (
              <Slider
                value={[field.value]}
                onValueChange={([v]) => field.onChange(v)}
                min={0}
                max={100}
                step={5}
                className="mt-2"
              />
            )}
          />
        </div>
      </div>
      <Button type="button" variant="ghost" size="icon" onClick={onRemove} aria-label="Supprimer la langue">
        <Trash2 className="size-4 text-destructive" />
      </Button>
    </div>
  );
}
