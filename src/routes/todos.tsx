import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { ArrowLeft, Search, Calendar as CalendarIcon, ChevronDown, FileText, X } from "lucide-react";
import { AppHeader } from "@/components/AppHeader";
import { useApp } from "@/lib/app-store";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import type { DateRange } from "react-day-picker";

export const Route = createFileRoute("/todos")({
  head: () => ({
    meta: [
      { title: "Todas as Metragens — Estrategic Field" },
      { name: "description", content: "Auditoria de todos os registros." },
    ],
  }),
  component: TodosPage,
});

function fmtDate(d: Date) {
  return d.toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit", year: "numeric" });
}

function TodosPage() {
  const { records } = useApp();
  const [query, setQuery] = useState("");
  const [range, setRange] = useState<DateRange | undefined>();
  const [expanded, setExpanded] = useState<string | null>(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return records.filter((r) => {
      const matchQ =
        !q ||
        r.tecnico.toLowerCase().includes(q) ||
        r.wo.toLowerCase().includes(q) ||
        r.contrato.toLowerCase().includes(q) ||
        r.matricula.includes(q);
      const date = new Date(r.createdAt);
      const from = range?.from ? new Date(range.from.setHours(0, 0, 0, 0)) : null;
      const to = range?.to
        ? new Date(new Date(range.to).setHours(23, 59, 59, 999))
        : from
          ? new Date(new Date(from).setHours(23, 59, 59, 999))
          : null;
      const matchD = !from || (date >= from && (!to || date <= to));
      return matchQ && matchD;
    }).sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
  }, [records, query, range]);

  const rangeLabel = range?.from
    ? range.to && range.to.getTime() !== range.from.getTime()
      ? `${fmtDate(range.from)} — ${fmtDate(range.to)}`
      : fmtDate(range.from)
    : "Selecionar período";

  return (
    <div className="min-h-screen bg-surface">
      <AppHeader />
      <main className="mx-auto max-w-5xl px-5 pb-10 pt-4">
        <Link
          to="/admin"
          className="mb-4 inline-flex items-center gap-1 text-sm font-medium text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" /> Voltar
        </Link>

        <header className="mb-5">
          <h1 className="text-2xl font-black tracking-tight">Todas as Metragens</h1>
          <p className="text-sm text-muted-foreground">
            Auditoria de evidências enviadas pelos técnicos.
          </p>
        </header>

        <div className="mb-5 flex flex-col gap-3 sm:flex-row">
          <div className="flex flex-1 items-center gap-2 rounded-xl border border-border bg-card px-3 py-2 shadow-sm focus-within:ring-1 focus-within:ring-primary">
            <Search className="h-5 w-5 text-muted-foreground" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Buscar por técnico, WO ou contrato..."
              className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
            />
            {query && (
              <button onClick={() => setQuery("")} aria-label="Limpar busca">
                <X className="h-4 w-4 text-muted-foreground" />
              </button>
            )}
          </div>

          <Popover>
            <PopoverTrigger
              className={cn(
                "flex items-center gap-2 rounded-xl border border-border bg-card px-3 py-2 text-sm font-medium shadow-sm hover:bg-muted/50",
                !range && "text-muted-foreground",
              )}
            >
              <CalendarIcon className="h-5 w-5 text-primary" />
              <span>{rangeLabel}</span>
              {range && (
                <X
                  className="ml-1 h-4 w-4 text-muted-foreground hover:text-foreground"
                  onClick={(e) => {
                    e.stopPropagation();
                    setRange(undefined);
                  }}
                />
              )}
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="end">
              <Calendar
                mode="range"
                selected={range}
                onSelect={setRange}
                numberOfMonths={1}
                initialFocus
                className={cn("p-3 pointer-events-auto")}
              />
            </PopoverContent>
          </Popover>
        </div>

        {filtered.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border bg-card p-10 text-center">
            <FileText className="mx-auto mb-2 h-10 w-10 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">Nenhum registro encontrado.</p>
          </div>
        ) : (
          <ul className="space-y-2">
            {filtered.map((r) => {
              const open = expanded === r.id;
              const dt = new Date(r.createdAt);
              return (
                <li
                  key={r.id}
                  className="overflow-hidden rounded-xl border border-border bg-card shadow-sm"
                >
                  <button
                    onClick={() => setExpanded(open ? null : r.id)}
                    className="flex w-full items-center justify-between gap-3 p-4 text-left active:bg-muted/50"
                  >
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="rounded-md bg-primary/10 px-2 py-0.5 text-xs font-bold text-primary">
                          WO {r.wo}
                        </span>
                        <span className="text-xs font-semibold text-foreground">{r.tecnico}</span>
                        <span className="text-[11px] text-muted-foreground">
                          Matr. {r.matricula}
                        </span>
                        <span className="ml-auto rounded-md bg-primary px-2 py-0.5 text-xs font-bold text-primary-foreground">
                          {r.metragemTotal} m
                        </span>
                      </div>
                      <div className="mt-1 flex flex-wrap items-center gap-x-3 text-xs text-muted-foreground">
                        <span>Contrato {r.contrato}</span>
                        <span>
                          {dt.toLocaleDateString("pt-BR")} ·{" "}
                          {dt.toLocaleTimeString("pt-BR", {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
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
                            className="h-40 w-full rounded-lg object-cover"
                          />
                          <figcaption className="mt-1 text-center text-xs font-semibold text-muted-foreground">
                            Foto do Início
                          </figcaption>
                        </figure>
                        <figure>
                          <img
                            src={r.fotoFim}
                            alt="Foto do fim"
                            className="h-40 w-full rounded-lg object-cover"
                          />
                          <figcaption className="mt-1 text-center text-xs font-semibold text-muted-foreground">
                            Foto do Fim
                          </figcaption>
                        </figure>
                      </div>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </main>
    </div>
  );
}
