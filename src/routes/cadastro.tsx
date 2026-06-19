import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { UserPlus } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/cadastro")({
  head: () => ({
    meta: [
      { title: "Cadastro — Estrategic Field" },
      { name: "description", content: "Cadastro de técnicos da Estrategic." },
    ],
  }),
  component: CadastroPage,
});

function CadastroPage() {
  const navigate = useNavigate();
  const [nome, setNome] = useState("");
  const [matricula, setMatricula] = useState("");
  const [senha, setSenha] = useState("");
  const [senha2, setSenha2] = useState("");
  const [loading, setLoading] = useState(false);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (senha !== senha2) {
      toast.error("As senhas não coincidem.");
      return;
    }
    setLoading(true);
    setTimeout(() => {
      toast.success("Cadastro realizado com sucesso!");
      setLoading(false);
      navigate({ to: "/login" });
    }, 400);
  };

  return (
    <main className="flex min-h-screen flex-col bg-surface px-6 pb-10 pt-16">
      <div className="mx-auto w-full max-w-sm">
        <div className="flex flex-col items-center gap-3">
          <div className="grid h-16 w-16 place-items-center rounded-2xl bg-primary text-primary-foreground font-black text-3xl shadow-lg">
            E
          </div>
          <div className="text-center">
            <h1 className="text-2xl font-black tracking-tight">Criar Conta</h1>
            <p className="text-sm text-muted-foreground">Cadastro do Técnico</p>
          </div>
        </div>

        <form
          onSubmit={onSubmit}
          className="mt-10 space-y-4 rounded-2xl border border-border bg-card p-6 shadow-sm"
        >
          <div>
            <label className="mb-1.5 block text-sm font-semibold">Nome</label>
            <input
              type="text"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              placeholder="Nome Completo"
              className="w-full rounded-lg border border-input bg-background px-4 py-3 text-base outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
              required
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-semibold">Identificação</label>
            <input
              type="text"
              autoCapitalize="none"
              autoCorrect="off"
              spellCheck={false}
              value={matricula}
              onChange={(e) => setMatricula(e.target.value)}
              placeholder="nome.sobrenome"
              className="w-full rounded-lg border border-input bg-background px-4 py-3 text-base outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
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
              className="w-full rounded-lg border border-input bg-background px-4 py-3 text-base outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
              required
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-semibold">Repetir senha</label>
            <input
              type="password"
              value={senha2}
              onChange={(e) => setSenha2(e.target.value)}
              placeholder="••••••••"
              className="w-full rounded-lg border border-input bg-background px-4 py-3 text-base outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
              required
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="mt-2 flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-4 py-3.5 text-base font-semibold text-primary-foreground shadow-sm transition hover:bg-primary-hover active:scale-[0.99] disabled:opacity-60"
          >
            <UserPlus className="h-5 w-5" />
            {loading ? "Cadastrando..." : "Cadastrar"}
          </button>

          <p className="pt-2 text-center text-sm text-muted-foreground">
            Já tem cadastro?{" "}
            <Link to="/login" className="font-semibold text-primary hover:underline">
              Faça o login
            </Link>
          </p>
        </form>
      </div>
    </main>
  );
}
