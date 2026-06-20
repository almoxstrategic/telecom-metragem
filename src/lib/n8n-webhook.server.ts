import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const payloadSchema = z.object({
  nome_tecnico: z.string(),
  tecnico_id: z.string().uuid(),
  contrato: z.string(),
  wo: z.string(),
  metragem_inicial: z.number(),
  metragem_final: z.number(),
  total_utilizado: z.number(),
  urls_das_fotos: z.object({
    inicio: z.string().url(),
    fim: z.string().url(),
  }),
  data_registro: z.string(),
});

/**
 * Dispara o fluxo n8n "controle_metragem".
 * Configure a URL em N8N_WEBHOOK_URL (.env / Render secrets).
 */
export const notifyControleMetragemWebhook = createServerFn({ method: "POST" })
  .validator(payloadSchema)
  .handler(async ({ data }) => {
    const webhookUrl = process.env.N8N_WEBHOOK_URL || process.env.VITE_N8N_WEBHOOK_URL;

    if (!webhookUrl) {
      console.warn(
        "[n8n] N8N_WEBHOOK_URL não configurada — fluxo controle_metragem não disparado.",
      );
      return { ok: false, skipped: true };
    }

    const response = await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(`Falha ao notificar n8n (${response.status})`);
    }

    return { ok: true };
  });
