import { Link, useNavigate } from "@tanstack/react-router";
import { ClipboardList, LogOut, Home } from "lucide-react";
import { Logo } from "./Logo";
import { useApp } from "@/lib/app-store";

export function AppSidebar({ onNavigate }: { onNavigate?: () => void }) {
  const { user, logout } = useApp();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    onNavigate?.();
    navigate({ to: "/login" });
  };

  return (
    <nav className="flex h-full flex-col bg-sidebar text-sidebar-foreground">
      <div className="border-b border-sidebar-border p-5">
        <Logo />
        {user && (
          <div className="mt-4">
            <div className="text-xs uppercase tracking-wider text-muted-foreground">Técnico</div>
            <div className="truncate font-semibold">{user.nome}</div>
            <div className="text-xs text-muted-foreground">Matrícula {user.matricula}</div>
          </div>
        )}
      </div>

      <div className="flex-1 space-y-1 p-3">
        <Link
          to="/"
          onClick={onNavigate}
          className="flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium hover:bg-sidebar-accent"
          activeProps={{ className: "bg-sidebar-accent text-sidebar-accent-foreground" }}
        >
          <Home className="h-5 w-5 text-primary" />
          Início
        </Link>
        <Link
          to="/historico"
          onClick={onNavigate}
          className="flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium hover:bg-sidebar-accent"
          activeProps={{ className: "bg-sidebar-accent text-sidebar-accent-foreground" }}
        >
          <ClipboardList className="h-5 w-5 text-primary" />
          Meus Registros
        </Link>
      </div>

      <div className="border-t border-sidebar-border p-3">
        <button
          onClick={handleLogout}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium text-destructive hover:bg-destructive/10"
        >
          <LogOut className="h-5 w-5" />
          Sair
        </button>
      </div>
    </nav>
  );
}
