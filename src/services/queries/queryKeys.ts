export const cvKeys = {
  all: ["cvs"] as const,
  list: () => [...cvKeys.all, "list"] as const,
  detail: (id: string) => [...cvKeys.all, "detail", id] as const,
};
