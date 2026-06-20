import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, AlertTriangle, FileText, Calendar } from "lucide-react";
import { AppHeader } from "@/components/AppHeader";
import { useApp } from "@/lib/app-store";
import { requireTecnico } from "@/lib/auth-guards";
import { fetchMyEvidencias } from "@/lib/evidencias-service";
import type { Evidencia } from "@/lib/types";

export const Route = createFileRoute("/historico")({
  beforeLoad: () => requireTecnico(),
  head: () => ({
    meta: [
      { title: "Meus Registros — Estrategic Field" },
      { name: "description", content: "Histórico de evidências de metragem." },
    ],
  }),
  component: HistoricoPage,
});

function dayKey(iso: string) {
  const d = new Date(iso);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

function HistoricoPage() {
  const { user } = useApp();
  const [records, setRecords] = useState<Evidencia[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterDate, setFilterDate] = useState("");

  useEffect(() => {
    if (!user) return;
    setLoading(true);
    fetchMyEvidencias(user.id)
      .then(setRecords)
      .finally(() => setLoading(false));
  }, [user]);

  const filtered = useMemo(() => {
    const list = filterDate ? records.filter((r) => dayKey(r.data_registro) === filterDate) : records;
    return [...list].sort((a, b) => (a.data_registro < b.data_registro ? 1 : -1));
  }, [records, filterDate]);

  return (
    <div className="min-h-screen bg-surface">
      <AppHeader />
      <main className="mx-auto max-w-2xl px-5 pb-10 pt-4">
        <Link
          to="/"
          className="mb-4 inline-flex items-center gap-1 text-sm font-medium text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" /> Voltar
        </Link>

        <header className="mb-5">
          <h1 className="text-2xl font-black tracking-tight">Meus Registros</h1>
          <p className="text-sm text-muted-foreground">Histórico de evidências enviadas.</p>
        </header>

        <div className="mb-4 flex items-start gap-3 rounded-xl border border-warning/40 bg-warning/15 p-3 text-warning-foreground">
          <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0" />
          <p className="text-sm font-medium">
            Aviso: Os registros são apagados automaticamente do aplicativo no prazo de 30 dias.
          </p>
        </div>

        <div className="mb-5 flex items-center gap-2 rounded-xl border border-border bg-card p-3 shadow-sm">
          <Calendar className="h-5 w-5 text-muted-foreground" />
          <input
            type="date"
            value={filterDate}
            onChange={(e) => setFilterDate(e.target.value)}
            className="flex-1 bg-transparent text-sm outline-none"
          />
          {filterDate && (
            <button
              onClick={() => setFilterDate("")}
              className="text-xs font-semibold text-primary hover:underline"
            >
              Limpar
            </button>
          )}
        </div>

        {loading ? (
          <p className="text-sm text-muted-foreground">Carregando registros...</p>
        ) : filtered.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border bg-card p-10 text-center">
            <FileText className="mx-auto mb-2 h-10 w-10 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">Nenhum registro encontrado.</p>
          </div>
        ) : (
          <ul className="space-y-3">
            {filtered.map((r) => (
              <li key={r.id} className="rounded-xl border border-border bg-card p-4 shadow-sm">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="rounded-md bg-primary/10 px-2 py-0.5 text-xs font-bold text-primary">
                    WO {r.wo}
                  </span>
                  <span className="text-sm font-medium">Contrato {r.contrato}</span>
                </div>
                <div className="mt-2 flex flex-wrap items-center justify-between gap-2 text-sm">
                  <span className="rounded-md bg-primary/10 px-2 py-0.5 text-xs font-bold text-primary">
                    Total: {r.total_utilizado} m
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {new Date(r.data_registro).toLocaleString("pt-BR")}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        )}
      </main>
    </div>
  );
}
