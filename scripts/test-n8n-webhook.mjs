import { readFileSync, existsSync } from "node:fs";
import { resolve } from "node:path";

function loadEnvFile() {
  const envPath = resolve(process.cwd(), ".env");
  if (!existsSync(envPath)) return;

  for (const line of readFileSync(envPath, "utf8").split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const idx = trimmed.indexOf("=");
    if (idx === -1) continue;
    const key = trimmed.slice(0, idx).trim();
    const value = trimmed.slice(idx + 1).trim().replace(/^["']|["']$/g, "");
    if (!process.env[key]) process.env[key] = value;
  }
}

loadEnvFile();

const url = process.env.N8N_WEBHOOK_URL;
if (!url) {
  console.error("N8N_WEBHOOK_URL não configurada no .env");
  process.exit(1);
}

const payload = {
  nome_tecnico: "Teste",
  tecnico_id: "00000000-0000-4000-8000-000000000001",
  contrato: "123",
  wo: "456",
  metragem_inicial: 0,
  metragem_final: 10,
  total_utilizado: 10,
  urls_das_fotos: {
    inicio: "https://example.com/inicio.jpg",
    fim: "https://example.com/fim.jpg",
  },
  data_registro: new Date().toISOString(),
};

const response = await fetch(url, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify(payload),
});

const body = await response.text();
console.log("URL:", url);
console.log("Status:", response.status);
console.log("Resposta:", body);
