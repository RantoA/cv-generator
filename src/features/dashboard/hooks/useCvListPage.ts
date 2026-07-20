import { useMemo, useState } from "react";
import type { Cv, CvTemplate } from "@/types/cv.types";

export type SortOption = "updatedAt-desc" | "updatedAt-asc" | "name-asc" | "name-desc" | "createdAt-desc";

const PAGE_SIZE = 9;

export function countSkills(cv: Cv): number {
  return (
    cv.skillsTable.reduce((total, row) => total + row.technologies.length, 0) +
    cv.hardSkills.length +
    cv.softSkills.length
  );
}

export function useCvListPage(cvs: Cv[]) {
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState<SortOption>("updatedAt-desc");
  const [templateFilter, setTemplateFilter] = useState<CvTemplate | "all">("all");
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();
    let result = cvs.filter((cv) => {
      const matchesSearch =
        !query ||
        cv.meta.name.toLowerCase().includes(query) ||
        cv.personalInfo.fullName.toLowerCase().includes(query);
      const matchesTemplate = templateFilter === "all" || cv.customization.template === templateFilter;
      return matchesSearch && matchesTemplate;
    });

    result = [...result].sort((a, b) => {
      switch (sort) {
        case "name-asc":
          return a.meta.name.localeCompare(b.meta.name);
        case "name-desc":
          return b.meta.name.localeCompare(a.meta.name);
        case "createdAt-desc":
          return new Date(b.meta.createdAt).getTime() - new Date(a.meta.createdAt).getTime();
        case "updatedAt-asc":
          return new Date(a.meta.updatedAt).getTime() - new Date(b.meta.updatedAt).getTime();
        case "updatedAt-desc":
        default:
          return new Date(b.meta.updatedAt).getTime() - new Date(a.meta.updatedAt).getTime();
      }
    });

    return result;
  }, [cvs, search, sort, templateFilter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const paginated = filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

  return {
    search,
    setSearch: (value: string) => {
      setSearch(value);
      setPage(1);
    },
    sort,
    setSort: (value: SortOption) => {
      setSort(value);
      setPage(1);
    },
    templateFilter,
    setTemplateFilter: (value: CvTemplate | "all") => {
      setTemplateFilter(value);
      setPage(1);
    },
    page: safePage,
    setPage,
    totalPages,
    totalResults: filtered.length,
    items: paginated,
  };
}
