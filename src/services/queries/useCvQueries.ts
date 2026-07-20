import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { cvApi } from "@/services/api/cv.api";
import { cvKeys } from "./queryKeys";
import type { Cv } from "@/types/cv.types";

export function useCvsQuery() {
  return useQuery({ queryKey: cvKeys.list(), queryFn: cvApi.list });
}

export function useCvQuery(id: string | undefined) {
  return useQuery({
    queryKey: cvKeys.detail(id ?? ""),
    queryFn: () => cvApi.getById(id!),
    enabled: Boolean(id),
  });
}

export function useCreateCv() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (name: string) => cvApi.create(name),
    onSuccess: (cv) => {
      queryClient.invalidateQueries({ queryKey: cvKeys.list() });
      toast.success(`« ${cv.meta.name} » a été créé.`);
    },
    onError: () => toast.error("Impossible de créer le CV."),
  });
}

interface UpdateCvOptions {
  silent?: boolean;
}

export function useUpdateCv() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, cv }: { id: string; cv: Cv; options?: UpdateCvOptions }) =>
      cvApi.update(id, cv),
    onSuccess: (updated, variables) => {
      queryClient.setQueryData(cvKeys.detail(updated.id), updated);
      queryClient.invalidateQueries({ queryKey: cvKeys.list() });
      if (!variables.options?.silent) toast.success("Modifications enregistrées.");
    },
    onError: () => toast.error("Échec de l'enregistrement."),
  });
}

export function useDeleteCv() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => cvApi.remove(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: cvKeys.list() });
      toast.success("CV supprimé.");
    },
    onError: () => toast.error("Impossible de supprimer le CV."),
  });
}

export function useDuplicateCv() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => cvApi.duplicate(id),
    onSuccess: (cv) => {
      queryClient.invalidateQueries({ queryKey: cvKeys.list() });
      toast.success(`« ${cv.meta.name} » a été créé.`);
    },
    onError: () => toast.error("Impossible de dupliquer le CV."),
  });
}
