import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { getN8nWebhookUrl } from "./server-env";

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

function getWebhookUrl(): string | undefined {
  return getN8nWebhookUrl();
}

/**
 * Dispara o fluxo n8n "controle_metragem".
 * Configure a URL em N8N_WEBHOOK_URL (.env / Render secrets).
 */
export const notifyControleMetragemWebhook = createServerFn({ method: "POST" })
  .validator(payloadSchema)
  .handler(async ({ data }) => {
    const webhookUrl = getWebhookUrl();

    if (!webhookUrl) {
      console.warn(
        "[n8n] N8N_WEBHOOK_URL não configurada — fluxo controle_metragem não disparado.",
      );
      return { ok: false, skipped: true as const };
    }

    const response = await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const body = await response.text().catch(() => "");
      console.error("[n8n] webhook falhou", response.status, body);
      return {
        ok: false as const,
        skipped: false as const,
        status: response.status,
        message: `Falha ao notificar n8n (${response.status})`,
      };
    }

    return { ok: true as const };
  });
