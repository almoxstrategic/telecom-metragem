import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { ArrowLeft, AlertTriangle, ChevronDown, FileText, Calendar } from "lucide-react";
import { AppHeader } from "@/components/AppHeader";
import { useApp, type EvidenceRecord } from "@/lib/app-store";

export const Route = createFileRoute("/historico")({
  head: () => ({
    meta: [
      { title: "Meus Registros — Estrategic Field" },
      { name: "description", content: "Histórico de evidências de metragem." },
    ],
  }),
  component: HistoricoPage,
});

function formatDayLabel(iso: string) {
  const d = new Date(iso);
  const today = new Date();
  const yest = new Date();
  yest.setDate(today.getDate() - 1);
  const sameDay = (a: Date, b: Date) =>
    a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
  if (sameDay(d, today)) return "Hoje";
  if (sameDay(d, yest)) return "Ontem";
  return d.toLocaleDateString("pt-BR", { weekday: "long", day: "2-digit", month: "long" });
}

function dayKey(iso: string) {
  const d = new Date(iso);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

function HistoricoPage() {
  const { myRecords: records } = useApp();
  const [filterDate, setFilterDate] = useState("");
  const [expanded, setExpanded] = useState<string | null>(null);

  const grouped = useMemo(() => {
    const filtered = filterDate
      ? records.filter((r) => dayKey(r.createdAt) === filterDate)
      : records;
    const map = new Map<string, EvidenceRecord[]>();
    for (const r of filtered) {
      const k = dayKey(r.createdAt);
      if (!map.has(k)) map.set(k, []);
      map.get(k)!.push(r);
    }
    return Array.from(map.entries()).sort(([a], [b]) => (a < b ? 1 : -1));
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

        {grouped.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border bg-card p-10 text-center">
            <FileText className="mx-auto mb-2 h-10 w-10 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">Nenhum registro encontrado.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {grouped.map(([k, items]) => (
              <section key={k}>
                <h2
                  suppressHydrationWarning
                  className="mb-2 px-1 text-xs font-bold uppercase tracking-wider text-muted-foreground"
                >
                  {formatDayLabel(items[0].createdAt)}
                </h2>
                <ul className="space-y-2">
                  {items.map((r) => {
                    const open = expanded === r.id;
                    return (
                      <li
                        key={r.id}
                        className="overflow-hidden rounded-xl border border-border bg-card shadow-sm"
                      >
                        <button
                          onClick={() => setExpanded(open ? null : r.id)}
                          className="flex w-full items-center justify-between gap-3 p-4 text-left active:bg-muted/50"
                        >
                          <div className="min-w-0">
                            <div className="flex items-center gap-2">
                              <span className="rounded-md bg-primary/10 px-2 py-0.5 text-xs font-bold text-primary">
                                WO {r.wo}
                              </span>
                              <span className="text-xs text-muted-foreground">
                                {new Date(r.createdAt).toLocaleTimeString("pt-BR", {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                })}
                              </span>
                            </div>
                            <div className="mt-1 flex items-center gap-2 truncate text-sm font-medium">
                              <span>Contrato {r.contrato}</span>
                              <span className="rounded-md bg-primary/10 px-2 py-0.5 text-xs font-bold text-primary">
                                {r.metragemTotal} m
                              </span>
                            </div>
                          </div>
                          <ChevronDown
                            className={`h-5 w-5 shrink-0 text-muted-foreground transition-transform ${
                              open ? "rotate-180" : ""
                            }`}
                          />
                        </button>
                        <div
                          className={`grid transition-all duration-300 ${
                            open ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                          }`}
                        >
                          <div className="overflow-hidden">
                            <div className="grid grid-cols-2 gap-3 border-t border-border p-4">
                              <figure>
                                <img
                                  src={r.fotoInicio}
                                  alt="Foto do início"
                                  className="h-32 w-full rounded-lg object-cover"
                                />
                                <figcaption className="mt-1 text-center text-xs font-semibold text-muted-foreground">
                                  Início
                                </figcaption>
                              </figure>
                              <figure>
                                <img
                                  src={r.fotoFim}
                                  alt="Foto do fim"
                                  className="h-32 w-full rounded-lg object-cover"
                                />
                                <figcaption className="mt-1 text-center text-xs font-semibold text-muted-foreground">
                                  Fim
                                </figcaption>
                              </figure>
                            </div>
                          </div>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              </section>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
