import { Search } from "lucide-react";
import { Input } from "@/shared/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/components/ui/select";
import type { SortOption } from "../hooks/useCvListPage";
import type { CvTemplate } from "@/types/cv.types";

interface DashboardToolbarProps {
  search: string;
  onSearchChange: (value: string) => void;
  sort: SortOption;
  onSortChange: (value: SortOption) => void;
  templateFilter: CvTemplate | "all";
  onTemplateFilterChange: (value: CvTemplate | "all") => void;
}

export function DashboardToolbar({
  search,
  onSearchChange,
  sort,
  onSortChange,
  templateFilter,
  onTemplateFilterChange,
}: DashboardToolbarProps) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
      <div className="relative flex-1">
        <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-foreground-secondary" />
        <Input
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Rechercher un CV ou un candidat…"
          className="pl-9"
          aria-label="Rechercher un CV"
        />
      </div>

      <Select value={templateFilter} onValueChange={(v) => onTemplateFilterChange(v as CvTemplate | "all")}>
        <SelectTrigger className="w-full sm:w-44">
          <SelectValue placeholder="Modèle" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Tous les modèles</SelectItem>
          <SelectItem value="modern">Modern</SelectItem>
          <SelectItem value="classic">Classique</SelectItem>
        </SelectContent>
      </Select>

      <Select value={sort} onValueChange={(v) => onSortChange(v as SortOption)}>
        <SelectTrigger className="w-full sm:w-56">
          <SelectValue placeholder="Trier par" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="updatedAt-desc">Dernière modification</SelectItem>
          <SelectItem value="createdAt-desc">Date de création</SelectItem>
          <SelectItem value="name-asc">Nom (A → Z)</SelectItem>
          <SelectItem value="name-desc">Nom (Z → A)</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
