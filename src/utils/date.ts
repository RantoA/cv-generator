import { format, parse, isValid } from "date-fns";
import { fr } from "date-fns/locale";

/** Parse une date au format "YYYY-MM" et retourne "Jan 2020". Retourne la chaîne brute si invalide. */
export function formatMonthYear(value: string): string {
  if (!value) return "";
  const parsed = parse(value, "yyyy-MM", new Date());
  if (!isValid(parsed)) return value;
  const label = format(parsed, "MMM yyyy", { locale: fr });
  return label.charAt(0).toUpperCase() + label.slice(1);
}

export function formatDateRange(startDate: string, endDate: string, current: boolean): string {
  const start = formatMonthYear(startDate);
  const end = current ? "Présent" : formatMonthYear(endDate);
  if (!start && !end) return "";
  return `${start} — ${end}`;
}

export function formatDate(value: string): string {
  if (!value) return "";
  const date = new Date(value);
  if (!isValid(date)) return value;
  return format(date, "dd MMM yyyy", { locale: fr });
}
