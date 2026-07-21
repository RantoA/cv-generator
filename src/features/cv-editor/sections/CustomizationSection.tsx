import { Check } from "lucide-react";
import { useCvEditorStore } from "@/stores/useCvEditorStore";
import { Label } from "@/shared/components/ui/label";
import { Switch } from "@/shared/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/components/ui/select";
import { SortableList, DragHandle } from "@/shared/components/SortableList";
import { CV_TEMPLATES } from "@/features/cv-preview/templates";
import { SECTION_LABELS, type Cv, type SectionKey } from "@/types/cv.types";
import { cn } from "@/lib/utils";

const FONT_OPTIONS = ["Inter", "Georgia", "Roboto Slab", "Poppins", "Merriweather"];
const COLOR_PRESETS = ["#2563EB", "#7C3AED", "#059669", "#DC2626", "#EA580C", "#0891B2", "#1F2937"];

export function CustomizationSection() {
  const draft = useCvEditorStore((s) => s.draft as Cv);
  const updateDraft = useCvEditorStore((s) => s.updateDraft);
  const commit = useCvEditorStore((s) => s.commit);
  const beginEdit = useCvEditorStore((s) => s.beginEdit);
  const endEdit = useCvEditorStore((s) => s.endEdit);
  const { customization } = draft;

  function updateCustomization(patch: Partial<Cv["customization"]>, live = false) {
    const updater = (cv: Cv) => ({ ...cv, customization: { ...cv.customization, ...patch } });
    if (live) updateDraft(updater);
    else commit(updater);
  }

  function toggleSection(key: SectionKey) {
    const isHidden = customization.hiddenSections.includes(key);
    updateCustomization({
      hiddenSections: isHidden
        ? customization.hiddenSections.filter((k) => k !== key)
        : [...customization.hiddenSections, key],
    });
  }

  return (
    <div className="flex flex-col gap-8">
      <div>
        <Label className="mb-3 block">Modèle de CV</Label>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {CV_TEMPLATES.map((template) => (
            <button
              key={template.value}
              type="button"
              onClick={() => updateCustomization({ template: template.value })}
              className={cn(
                "rounded-lg border p-4 text-left transition-colors",
                customization.template === template.value
                  ? "border-primary bg-accent"
                  : "border-border hover:bg-muted",
              )}
            >
              <div className="flex items-center justify-between">
                <span className="font-medium text-foreground">{template.label}</span>
                {customization.template === template.value && <Check className="size-4 text-primary" />}
              </div>
              <p className="mt-1 text-xs text-foreground-secondary">{template.description}</p>
            </button>
          ))}
        </div>
      </div>

      <div>
        <Label className="mb-3 block">Couleur principale</Label>
        <div className="flex flex-wrap items-center gap-2">
          {COLOR_PRESETS.map((color) => (
            <button
              key={color}
              type="button"
              onClick={() => updateCustomization({ primaryColor: color })}
              aria-label={`Choisir la couleur ${color}`}
              className={cn(
                "size-8 rounded-full border-2 transition-transform hover:scale-110",
                customization.primaryColor.toLowerCase() === color.toLowerCase() ? "border-foreground" : "border-transparent",
              )}
              style={{ backgroundColor: color }}
            />
          ))}
          <input
            type="color"
            value={customization.primaryColor}
            onFocus={beginEdit}
            onChange={(e) => updateCustomization({ primaryColor: e.target.value }, true)}
            onBlur={endEdit}
            className="size-8 cursor-pointer rounded-full border border-border bg-transparent"
            aria-label="Couleur personnalisée"
          />
        </div>
      </div>

      <div className="max-w-xs">
        <Label className="mb-3 block">Police</Label>
        <Select value={customization.fontFamily} onValueChange={(v) => updateCustomization({ fontFamily: v })}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {FONT_OPTIONS.map((font) => (
              <SelectItem key={font} value={font}>
                {font}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label className="mb-3 block">Sections (ordre et visibilité)</Label>
        <SortableList
          items={customization.sectionOrder}
          getId={(key) => key}
          onReorder={(next) => updateCustomization({ sectionOrder: next })}
          renderItem={(key, _index, handle) => (
            <div className="flex items-center justify-between rounded-lg border border-border bg-background-secondary/50 px-3 py-2.5">
              <div className="flex items-center gap-2">
                <DragHandle {...handle} />
                <span className="text-sm font-medium text-foreground">{SECTION_LABELS[key]}</span>
              </div>
              <Switch checked={!customization.hiddenSections.includes(key)} onCheckedChange={() => toggleSection(key)} />
            </div>
          )}
        />
      </div>
    </div>
  );
}
