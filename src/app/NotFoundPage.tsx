import { useNavigate } from "react-router-dom";
import { Compass } from "lucide-react";
import { EmptyState } from "@/shared/components/EmptyState";
import { Button } from "@/shared/components/ui/button";

export function NotFoundPage() {
  const navigate = useNavigate();
  return (
    <div className="flex min-h-screen items-center justify-center p-6">
      <EmptyState
        icon={Compass}
        title="Page introuvable"
        description="La page que vous cherchez n'existe pas ou a été déplacée."
        action={<Button onClick={() => navigate("/")}>Retour au tableau de bord</Button>}
      />
    </div>
  );
}
