import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { ArrowLeft, Send, CheckCircle2, Ruler } from "lucide-react";
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
  const [contrato, setContrato] = useState("");
  const [wo, setWo] = useState("");
  const [metInicial, setMetInicial] = useState("");
  const [metFinal, setMetFinal] = useState("");
  const [fotoInicio, setFotoInicio] = useState<string | null>(null);
  const [fotoFim, setFotoFim] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const mi = parseFloat(metInicial);
  const mf = parseFloat(metFinal);
  const total = useMemo(() => {
    if (Number.isFinite(mi) && Number.isFinite(mf)) return mf - mi;
    return null;
  }, [mi, mf]);
  const totalValid = total !== null && total >= 0;

  const canSubmit =
    contrato.trim() &&
    wo.trim() &&
    metInicial.trim() &&
    metFinal.trim() &&
    totalValid &&
    fotoInicio &&
    fotoFim &&
    !submitting;

  const reset = () => {
    setContrato("");
    setWo("");
    setMetInicial("");
    setMetFinal("");
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
          metragemInicial: mi,
          metragemFinal: mf,
          fotoInicio: fotoInicio!,
          fotoFim: fotoFim!,
        });
        toast.success(`Registrado metragem da WO ${wo.trim()} (${total} m)`, {
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

  return (
    <div className="min-h-screen bg-surface">
      <AppHeader />
      <main className="mx-auto max-w-2xl px-5 pb-40 pt-4">
        <Link
          to="/"
          className="mb-4 inline-flex items-center gap-1 text-sm font-medium text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" /> Voltar
        </Link>

        <section className="mb-5">
          <p className="text-sm text-muted-foreground">
            <span className="font-semibold text-foreground">Olá, {user.nome}</span>{" "}
            Escolha um módulo para iniciar seu registro.
          </p>
        </section>

        <header className="mb-6">
          <h1 className="text-2xl font-black tracking-tight">Evidência de Metragem</h1>
          <p className="text-sm text-muted-foreground">
            Informe a WO, a metragem e registre as fotos de início e fim.
          </p>
        </header>

        <form id="metragem-form" onSubmit={onSubmit} className="space-y-5">
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
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="mb-1.5 block text-sm font-semibold">Metragem Inicial</label>
                <input
                  inputMode="decimal"
                  value={metInicial}
                  onChange={(e) => setMetInicial(e.target.value.replace(",", ".").replace(/[^0-9.]/g, ""))}
                  placeholder="0"
                  className="w-full rounded-lg border border-input bg-background px-4 py-3 text-base outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                  required
                />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-semibold">Metragem Final</label>
                <input
                  inputMode="decimal"
                  value={metFinal}
                  onChange={(e) => setMetFinal(e.target.value.replace(",", ".").replace(/[^0-9.]/g, ""))}
                  placeholder="0"
                  className="w-full rounded-lg border border-input bg-background px-4 py-3 text-base outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                  required
                />
              </div>
            </div>

            <div
              className={`flex items-center justify-between gap-3 rounded-xl border px-4 py-3 ${
                total === null
                  ? "border-dashed border-border bg-surface text-muted-foreground"
                  : totalValid
                    ? "border-primary/30 bg-primary/10 text-primary"
                    : "border-destructive/40 bg-destructive/10 text-destructive"
              }`}
            >
              <div className="flex items-center gap-2 text-sm font-semibold">
                <Ruler className="h-5 w-5" />
                Total Utilizado
              </div>
              <div className="text-lg font-black">
                {total === null
                  ? "— m"
                  : totalValid
                    ? `${total} metros`
                    : "Valor inválido"}
              </div>
            </div>
          </div>

          <div className="space-y-4 rounded-2xl border border-border bg-card p-5 shadow-sm">
            <PhotoUpload label="📸 Foto do Início" value={fotoInicio} onChange={setFotoInicio} />
            <PhotoUpload label="📸 Foto do Fim" value={fotoFim} onChange={setFotoFim} />
          </div>
        </form>
      </main>

      <div className="fixed inset-x-0 bottom-0 z-30 border-t border-border bg-card/95 px-5 pt-3 pb-[max(env(safe-area-inset-bottom),1rem)] shadow-[0_-4px_16px_rgba(0,0,0,0.06)] backdrop-blur">
        <div className="mx-auto max-w-2xl">
          <button
            type="submit"
            form="metragem-form"
            disabled={!canSubmit}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 py-4 text-base font-semibold text-primary-foreground shadow-sm transition hover:bg-primary-hover active:scale-[0.99] disabled:cursor-not-allowed disabled:bg-muted disabled:text-muted-foreground disabled:shadow-none"
          >
            <Send className="h-5 w-5" />
            {submitting ? "Enviando..." : "Enviar Evidência"}
          </button>
        </div>
      </div>
    </div>
  );
}
