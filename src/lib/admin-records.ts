export type AdminRecord = {
  id: string;
  tecnico: string;
  matricula: string;
  contrato: string;
  wo: string;
  fotoInicio: string;
  fotoFim: string;
  createdAt: string;
};

const day = 86_400_000;

export const ADMIN_RECORDS: AdminRecord[] = [
  {
    id: "a1",
    tecnico: "Carlos Silva",
    matricula: "1234",
    contrato: "458921",
    wo: "WO-77231",
    fotoInicio: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=600&q=70",
    fotoFim: "https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=600&q=70",
    createdAt: new Date().toISOString(),
  },
  {
    id: "a2",
    tecnico: "Marcos Pereira",
    matricula: "2087",
    contrato: "461552",
    wo: "WO-77245",
    fotoInicio: "https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=600&q=70",
    fotoFim: "https://images.unsplash.com/photo-1581093588401-fbb62a02f120?w=600&q=70",
    createdAt: new Date(Date.now() - day * 1).toISOString(),
  },
  {
    id: "a3",
    tecnico: "Joana Ribeiro",
    matricula: "3310",
    contrato: "460102",
    wo: "WO-77301",
    fotoInicio: "https://images.unsplash.com/photo-1517420704952-d9f39e95b43e?w=600&q=70",
    fotoFim: "https://images.unsplash.com/photo-1581094271901-8022df4466f9?w=600&q=70",
    createdAt: new Date(Date.now() - day * 2).toISOString(),
  },
  {
    id: "a4",
    tecnico: "Bruno Castro",
    matricula: "4419",
    contrato: "462088",
    wo: "WO-77410",
    fotoInicio: "https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=600&q=70",
    fotoFim: "https://images.unsplash.com/photo-1581091870622-1c6a4c9d3c30?w=600&q=70",
    createdAt: new Date(Date.now() - day * 3).toISOString(),
  },
  {
    id: "a5",
    tecnico: "Carlos Silva",
    matricula: "1234",
    contrato: "458930",
    wo: "WO-77235",
    fotoInicio: "https://images.unsplash.com/photo-1581094288338-2314dddb7ece?w=600&q=70",
    fotoFim: "https://images.unsplash.com/photo-1581090700227-1e8e3a36da9f?w=600&q=70",
    createdAt: new Date(Date.now() - day * 5).toISOString(),
  },
  {
    id: "a6",
    tecnico: "Patrícia Lopes",
    matricula: "5521",
    contrato: "463900",
    wo: "WO-77500",
    fotoInicio: "https://images.unsplash.com/photo-1581093588401-fbb62a02f120?w=600&q=70",
    fotoFim: "https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=600&q=70",
    createdAt: new Date(Date.now() - day * 7).toISOString(),
  },
];
