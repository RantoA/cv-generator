import { EyeOff, Palette, User } from "lucide-react";
import { SECTION_LABELS, type Cv } from "@/types/cv.types";
import type { EditorSectionId } from "../editor.types";
import { cn } from "@/lib/utils";

interface EditorNavProps {
  customization: Cv["customization"];
  active: EditorSectionId;
  onChange: (section: EditorSectionId) => void;
  className?: string;
}

export function EditorNav({ customization, active, onChange, className }: EditorNavProps) {
  return (
    <nav className={cn("flex gap-1 overflow-x-auto lg:flex-col lg:overflow-visible", className)}>
      <NavButton active={active === "personalInfo"} onClick={() => onChange("personalInfo")}>
        <User className="size-4" /> Informations
      </NavButton>

      {customization.sectionOrder.map((key) => (
        <NavButton key={key} active={active === key} onClick={() => onChange(key)}>
          <span className="flex-1 truncate text-left">{SECTION_LABELS[key]}</span>
          {customization.hiddenSections.includes(key) && <EyeOff className="size-3.5 shrink-0 opacity-60" />}
        </NavButton>
      ))}

      <NavButton active={active === "customization"} onClick={() => onChange("customization")}>
        <Palette className="size-4" /> Personnalisation
      </NavButton>
    </nav>
  );
}

function NavButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex shrink-0 items-center gap-2 rounded-lg px-3 py-2 text-left text-sm font-medium transition-colors",
        active ? "bg-primary text-primary-foreground shadow-subtle" : "text-foreground-secondary hover:bg-muted",
      )}
    >
      {children}
    </button>
  );
}
