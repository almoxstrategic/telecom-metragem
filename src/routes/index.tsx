import { createFileRoute, Link } from "@tanstack/react-router";
import { Ruler, ClipboardList, Lock } from "lucide-react";
import { AppHeader } from "@/components/AppHeader";
import { useApp } from "@/lib/app-store";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Início — Estrategic Field" },
      { name: "description", content: "Dashboard do técnico de campo Estrategic." },
    ],
  }),
  component: HomePage,
});

type ModuleCard = {
  to?: string;
  title: string;
  desc: string;
  icon: React.ComponentType<{ className?: string }>;
  active: boolean;
};

const MODULES: ModuleCard[] = [
  {
    to: "/metragem",
    title: "Evidência de Metragem",
    desc: "Registre foto de início e fim da WO",
    icon: Ruler,
    active: true,
  },
  {
    title: "Vistoria Técnica",
    desc: "Em breve",
    icon: ClipboardList,
    active: false,
  },
];

function HomePage() {
  const { user } = useApp();

  return (
    <div className="min-h-screen bg-surface">
      <AppHeader />
      <main className="mx-auto max-w-2xl px-5 pb-10 pt-6">
        <section className="mb-6">
          <div className="text-sm text-muted-foreground">Olá,</div>
          <h1 className="text-2xl font-black tracking-tight">{user.nome}</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Escolha um módulo para iniciar seu registro.
          </p>
        </section>

        <section className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {MODULES.map((m) => {
            const Icon = m.icon;
            const content = (
              <div
                className={`relative flex h-40 flex-col justify-between rounded-2xl border p-5 shadow-sm transition ${
                  m.active
                    ? "border-primary/20 bg-card hover:-translate-y-0.5 hover:shadow-md"
                    : "border-border bg-muted/40 opacity-70"
                }`}
              >
                <div
                  className={`grid h-12 w-12 place-items-center rounded-xl ${
                    m.active
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  <Icon className="h-6 w-6" />
                </div>
                <div>
                  <div className="font-bold text-foreground">{m.title}</div>
                  <div className="text-xs text-muted-foreground">{m.desc}</div>
                </div>
                {!m.active && (
                  <span className="absolute right-3 top-3 inline-flex items-center gap-1 rounded-full bg-background/80 px-2 py-0.5 text-[10px] font-semibold text-muted-foreground">
                    <Lock className="h-3 w-3" /> Em breve
                  </span>
                )}
              </div>
            );
            return m.active && m.to ? (
              <Link key={m.title} to={m.to} className="block">
                {content}
              </Link>
            ) : (
              <div key={m.title}>{content}</div>
            );
          })}
        </section>
      </main>
    </div>
  );
}
