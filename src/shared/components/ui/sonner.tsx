import { Toaster as Sonner } from "sonner";
import { useUiStore } from "@/stores/useUiStore";

type ToasterProps = React.ComponentProps<typeof Sonner>;

function Toaster({ ...props }: ToasterProps) {
  const isDark = useUiStore((state) => state.theme === "dark");

  return (
    <Sonner
      theme={isDark ? "dark" : "light"}
      position="bottom-right"
      className="toaster group"
      toastOptions={{
        classNames: {
          toast:
            "group toast group-[.toaster]:bg-card group-[.toaster]:text-card-foreground group-[.toaster]:border-border group-[.toaster]:shadow-card group-[.toaster]:rounded-lg",
          description: "group-[.toast]:text-foreground-secondary",
          actionButton: "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground",
          cancelButton: "group-[.toast]:bg-muted group-[.toast]:text-foreground-secondary",
        },
      }}
      {...props}
    />
  );
}

export { Toaster };
