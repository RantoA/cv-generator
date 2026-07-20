import { Link, Outlet } from "react-router-dom";
import { FileText } from "lucide-react";
import { ThemeToggle } from "@/shared/components/ThemeToggle";

export function AppLayout() {
  return (
    <div className="min-h-screen bg-background-secondary">
      <header className="border-b border-border bg-background">
        <div className="mx-auto flex max-w-[1600px] items-center justify-between px-4 py-3 sm:px-6">
          <Link to="/" className="flex items-center gap-2 text-primary">
            <FileText className="size-5" />
            <span className="text-base font-bold">CV Generator</span>
          </Link>
          <ThemeToggle />
        </div>
      </header>
      <main className="mx-auto max-w-[1600px] px-4 py-6 sm:px-6">
        <Outlet />
      </main>
    </div>
  );
}
