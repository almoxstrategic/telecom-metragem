import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ArrowLeft, Send, CheckCircle2 } from "lucide-react";
import { AppHeader } from "@/components/AppHeader";
import { PhotoUpload } from "@/components/PhotoUpload";
import { useApp } from "@/lib/app-store";
import { toast } from "sonner";

export const Route = createFileRoute("/metragem")({
  head: () => ({
    meta: [
      { title: "Evidência de Metragem — Estrategic Field" },
      { name: "description", content: "Registre evidências de metragem da WO em campo." },
    ],
  }),
  component: MetragemPage,
});

function MetragemPage() {
  const { user, addRecord } = useApp();
  const navigate = useNavigate();
  const [contrato, setContrato] = useState("");
  const [wo, setWo] = useState("");
  const [fotoInicio, setFotoInicio] = useState<string | null>(null);
  const [fotoFim, setFotoFim] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!user) navigate({ to: "/login" });
  }, [user, navigate]);

  const canSubmit = contrato.trim() && wo.trim() && fotoInicio && fotoFim && !submitting;

  const reset = () => {
    setContrato("");
    setWo("");
    setFotoInicio(null);
    setFotoFim(null);
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;
    setSubmitting(true);
    setTimeout(() => {
      try {
        addRecord({
          contrato: contrato.trim(),
          wo: wo.trim(),
          fotoInicio: fotoInicio!,
          fotoFim: fotoFim!,
        });
        toast.success(`Registrado metragem da WO ${wo.trim()}`, {
          icon: <CheckCircle2 className="h-5 w-5" />,
          className: "!bg-success !text-success-foreground !border-success",
        });
        reset();
      } catch (err) {
        toast.error(`Erro de envio: ${(err as Error).message || "tente novamente"}`);
      } finally {
        setSubmitting(false);
      }
    }, 500);
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-surface">
      <AppHeader />
      <main className="mx-auto max-w-2xl px-5 pb-24 pt-4">
        <Link
          to="/"
          className="mb-4 inline-flex items-center gap-1 text-sm font-medium text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" /> Voltar
        </Link>

        <header className="mb-6">
          <h1 className="text-2xl font-black tracking-tight">Evidência de Metragem</h1>
          <p className="text-sm text-muted-foreground">
            Informe a WO e registre as fotos de início e fim.
          </p>
        </header>

        <form onSubmit={onSubmit} className="space-y-5">
          <div className="space-y-4 rounded-2xl border border-border bg-card p-5 shadow-sm">
            <div>
              <label className="mb-1.5 block text-sm font-semibold">Número do Contrato</label>
              <input
                inputMode="numeric"
                pattern="[0-9]*"
                value={contrato}
                onChange={(e) => setContrato(e.target.value.replace(/\D/g, ""))}
                placeholder="Ex: 458921"
                className="w-full rounded-lg border border-input bg-background px-4 py-3 text-base outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                required
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-semibold">Número da WO</label>
              <input
                inputMode="numeric"
                pattern="[0-9]*"
                value={wo}
                onChange={(e) => setWo(e.target.value.replace(/\D/g, ""))}
                placeholder="Ex: 77231"
                className="w-full rounded-lg border border-input bg-background px-4 py-3 text-base outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                required
              />
            </div>
          </div>

          <div className="space-y-4 rounded-2xl border border-border bg-card p-5 shadow-sm">
            <PhotoUpload label="📸 Foto do Início" value={fotoInicio} onChange={setFotoInicio} />
            <PhotoUpload label="📸 Foto do Fim" value={fotoFim} onChange={setFotoFim} />
          </div>

          <button
            type="submit"
            disabled={!canSubmit}
            className="sticky bottom-4 flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 py-4 text-base font-semibold text-primary-foreground shadow-lg transition hover:bg-primary-hover active:scale-[0.99] disabled:cursor-not-allowed disabled:bg-muted disabled:text-muted-foreground disabled:shadow-none"
          >
            <Send className="h-5 w-5" />
            {submitting ? "Enviando..." : "Enviar Evidência"}
          </button>
        </form>
      </main>
    </div>
  );
}
