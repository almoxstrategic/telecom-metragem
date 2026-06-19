import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Logo } from "@/components/Logo";
import { useApp } from "@/lib/app-store";
import { toast } from "sonner";
import { LogIn } from "lucide-react";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Entrar — Estrategic Field" },
      { name: "description", content: "Acesso para técnicos de campo da Estrategic." },
    ],
  }),
  component: LoginPage,
});

function LoginPage() {
  const { login } = useApp();
  const navigate = useNavigate();
  const [matricula, setMatricula] = useState("");
  const [senha, setSenha] = useState("");
  const [loading, setLoading] = useState(false);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      if (login(matricula.trim(), senha)) {
        navigate({ to: "/" });
      } else {
        toast.error("Informe matrícula e senha.");
      }
      setLoading(false);
    }, 300);
  };

  return (
    <main className="flex min-h-screen flex-col bg-surface px-6 pb-10 pt-16">
      <div className="mx-auto w-full max-w-sm">
        <div className="flex flex-col items-center gap-3">
          <div className="grid h-16 w-16 place-items-center rounded-2xl bg-primary text-primary-foreground font-black text-3xl shadow-lg">
            E
          </div>
          <div className="text-center">
            <h1 className="text-2xl font-black tracking-tight">Estrategic</h1>
            <p className="text-sm text-muted-foreground">Portal do Técnico</p>
          </div>
        </div>

        <form
          onSubmit={onSubmit}
          className="mt-10 space-y-4 rounded-2xl border border-border bg-card p-6 shadow-sm"
        >
          <div>
            <label className="mb-1.5 block text-sm font-semibold">Usuário</label>
            <input
              type="text"
              autoCapitalize="none"
              autoCorrect="off"
              spellCheck={false}
              value={matricula}
              onChange={(e) => setMatricula(e.target.value)}
              placeholder="nome.sobrenome"
              className="w-full rounded-lg border border-input bg-background px-4 py-3 text-base outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
              required
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-semibold">Senha</label>
            <input
              type="password"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              placeholder="••••••••"
              className="w-full rounded-lg border border-input bg-background px-4 py-3 text-base outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
              required
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="mt-2 flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-4 py-3.5 text-base font-semibold text-primary-foreground shadow-sm transition hover:bg-primary-hover active:scale-[0.99] disabled:opacity-60"
          >
            <LogIn className="h-5 w-5" />
            {loading ? "Entrando..." : "Entrar"}
          </button>
        </form>

        <p className="mt-6 text-center text-xs text-muted-foreground">
          © {new Date().getFullYear()} Estrategic Telecom
        </p>
      </div>
    </main>
  );
}
