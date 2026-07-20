import { apiClient } from "./client";
import type { Cv } from "@/types/cv.types";

export const cvApi = {
  list: () => apiClient.get<Cv[]>("/cvs"),
  getById: (id: string) => apiClient.get<Cv>(`/cvs/${id}`),
  create: (name: string) => apiClient.post<Cv>("/cvs", { name }),
  update: (id: string, cv: Cv) => apiClient.put<Cv>(`/cvs/${id}`, cv),
  remove: (id: string) => apiClient.delete<void>(`/cvs/${id}`),
  duplicate: (id: string) => apiClient.post<Cv>(`/cvs/${id}/duplicate`),
};
