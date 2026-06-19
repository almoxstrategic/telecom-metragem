import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

export type EvidenceRecord = {
  id: string;
  contrato: string;
  wo: string;
  fotoInicio: string; // data URL
  fotoFim: string;
  createdAt: string; // ISO
};

export type User = { nome: string; matricula: string };

type AppState = {
  user: User;
  records: EvidenceRecord[];
  login: (matricula: string, senha: string) => boolean;
  logout: () => void;
  addRecord: (r: Omit<EvidenceRecord, "id" | "createdAt">) => EvidenceRecord;
};

const Ctx = createContext<AppState | null>(null);

const MOCK_RECORDS: EvidenceRecord[] = [
  {
    id: "r1",
    contrato: "458921",
    wo: "WO-77231",
    fotoInicio:
      "https://images.unsplash.com/photo-1518770660439-4636190af475?w=600&q=70",
    fotoFim:
      "https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=600&q=70",
    createdAt: new Date().toISOString(),
  },
  {
    id: "r2",
    contrato: "458999",
    wo: "WO-77240",
    fotoInicio:
      "https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=600&q=70",
    fotoFim:
      "https://images.unsplash.com/photo-1581093588401-fbb62a02f120?w=600&q=70",
    createdAt: new Date(Date.now() - 86_400_000).toISOString(),
  },
  {
    id: "r3",
    contrato: "460102",
    wo: "WO-77301",
    fotoInicio:
      "https://images.unsplash.com/photo-1517420704952-d9f39e95b43e?w=600&q=70",
    fotoFim:
      "https://images.unsplash.com/photo-1581094271901-8022df4466f9?w=600&q=70",
    createdAt: new Date(Date.now() - 86_400_000 * 3).toISOString(),
  },
];

const MOCK_USER: User = { nome: "Técnico 1234", matricula: "1234" };

export function AppProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User>(MOCK_USER);
  const [records, setRecords] = useState<EvidenceRecord[]>(MOCK_RECORDS);

  useEffect(() => {
    try {
      const raw = typeof window !== "undefined" ? localStorage.getItem("estrategic_user") : null;
      if (raw) setUser(JSON.parse(raw));
    } catch {}
  }, []);

  const login = (matricula: string, senha: string) => {
    if (!matricula || !senha) return false;
    const u: User = { nome: "Técnico " + matricula, matricula };
    setUser(u);
    try {
      localStorage.setItem("estrategic_user", JSON.stringify(u));
    } catch {}
    return true;
  };

  const logout = () => {
    setUser(MOCK_USER);
    try {
      localStorage.removeItem("estrategic_user");
    } catch {}
  };

  const addRecord: AppState["addRecord"] = (r) => {
    const rec: EvidenceRecord = {
      ...r,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
    };
    setRecords((prev) => [rec, ...prev]);
    return rec;
  };

  return (
    <Ctx.Provider value={{ user, records, login, logout, addRecord }}>{children}</Ctx.Provider>
  );
}

export function useApp() {
  const v = useContext(Ctx);
  if (!v) throw new Error("useApp must be used inside AppProvider");
  return v;
}
