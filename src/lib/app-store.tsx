import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

export type EvidenceRecord = {
  id: string;
  tecnico: string;
  matricula: string;
  contrato: string;
  wo: string;
  metragemInicial: number;
  metragemFinal: number;
  metragemTotal: number;
  fotoInicio: string;
  fotoFim: string;
  createdAt: string;
};

export type User = { nome: string; matricula: string };

type AppState = {
  user: User;
  records: EvidenceRecord[];
  myRecords: EvidenceRecord[];
  login: (matricula: string, senha: string) => boolean;
  logout: () => void;
  addRecord: (
    r: Omit<EvidenceRecord, "id" | "createdAt" | "tecnico" | "matricula" | "metragemTotal">,
  ) => EvidenceRecord;
};

const Ctx = createContext<AppState | null>(null);

const day = 86_400_000;
const FIXED_NOW = 1_735_000_000_000; // fixed seed timestamp so SSR/CSR match

const SEED_RECORDS: EvidenceRecord[] = [
  {
    id: "r1",
    tecnico: "Técnico 1234",
    matricula: "1234",
    contrato: "458921",
    wo: "77231",
    metragemInicial: 120,
    metragemFinal: 245,
    metragemTotal: 125,
    fotoInicio: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=600&q=70",
    fotoFim: "https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=600&q=70",
    createdAt: new Date(FIXED_NOW).toISOString(),
  },
  {
    id: "r2",
    tecnico: "Técnico 1234",
    matricula: "1234",
    contrato: "458999",
    wo: "77240",
    metragemInicial: 80,
    metragemFinal: 210,
    metragemTotal: 130,
    fotoInicio: "https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=600&q=70",
    fotoFim: "https://images.unsplash.com/photo-1581093588401-fbb62a02f120?w=600&q=70",
    createdAt: new Date(FIXED_NOW - day).toISOString(),
  },
  {
    id: "r3",
    tecnico: "Técnico 1234",
    matricula: "1234",
    contrato: "460102",
    wo: "77301",
    metragemInicial: 50,
    metragemFinal: 320,
    metragemTotal: 270,
    fotoInicio: "https://images.unsplash.com/photo-1517420704952-d9f39e95b43e?w=600&q=70",
    fotoFim: "https://images.unsplash.com/photo-1581094271901-8022df4466f9?w=600&q=70",
    createdAt: new Date(FIXED_NOW - day * 3).toISOString(),
  },
  {
    id: "a2",
    tecnico: "Marcos Pereira",
    matricula: "2087",
    contrato: "461552",
    wo: "77245",
    metragemInicial: 0,
    metragemFinal: 180,
    metragemTotal: 180,
    fotoInicio: "https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=600&q=70",
    fotoFim: "https://images.unsplash.com/photo-1581093588401-fbb62a02f120?w=600&q=70",
    createdAt: new Date(FIXED_NOW - day).toISOString(),
  },
  {
    id: "a3",
    tecnico: "Joana Ribeiro",
    matricula: "3310",
    contrato: "460102",
    wo: "77301",
    metragemInicial: 15,
    metragemFinal: 240,
    metragemTotal: 225,
    fotoInicio: "https://images.unsplash.com/photo-1517420704952-d9f39e95b43e?w=600&q=70",
    fotoFim: "https://images.unsplash.com/photo-1581094271901-8022df4466f9?w=600&q=70",
    createdAt: new Date(FIXED_NOW - day * 2).toISOString(),
  },
  {
    id: "a4",
    tecnico: "Bruno Castro",
    matricula: "4419",
    contrato: "462088",
    wo: "77410",
    metragemInicial: 0,
    metragemFinal: 95,
    metragemTotal: 95,
    fotoInicio: "https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=600&q=70",
    fotoFim: "https://images.unsplash.com/photo-1581091870622-1c6a4c9d3c30?w=600&q=70",
    createdAt: new Date(FIXED_NOW - day * 3).toISOString(),
  },
  {
    id: "a6",
    tecnico: "Patrícia Lopes",
    matricula: "5521",
    contrato: "463900",
    wo: "77500",
    metragemInicial: 100,
    metragemFinal: 460,
    metragemTotal: 360,
    fotoInicio: "https://images.unsplash.com/photo-1581093588401-fbb62a02f120?w=600&q=70",
    fotoFim: "https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=600&q=70",
    createdAt: new Date(FIXED_NOW - day * 7).toISOString(),
  },
];

const MOCK_USER: User = { nome: "Técnico 1234", matricula: "1234" };

export function AppProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User>(MOCK_USER);
  const [records, setRecords] = useState<EvidenceRecord[]>(SEED_RECORDS);

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
      tecnico: user.nome,
      matricula: user.matricula,
      metragemTotal: Math.max(0, r.metragemFinal - r.metragemInicial),
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
    };
    setRecords((prev) => [rec, ...prev]);
    return rec;
  };

  const myRecords = records.filter((r) => r.matricula === user.matricula);

  return (
    <Ctx.Provider value={{ user, records, myRecords, login, logout, addRecord }}>
      {children}
    </Ctx.Provider>
  );
}

export function useApp() {
  const v = useContext(Ctx);
  if (!v) throw new Error("useApp must be used inside AppProvider");
  return v;
}
