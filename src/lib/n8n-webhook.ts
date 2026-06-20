import type { Evidencia } from "./types";
import { notifyControleMetragemWebhook } from "./n8n-webhook.server";

export function buildN8nPayload(evidencia: Evidencia, nomeTecnico: string) {
  return {
    nome_tecnico: nomeTecnico,
    tecnico_id: evidencia.tecnico_id,
    contrato: evidencia.contrato,
    wo: evidencia.wo,
    metragem_inicial: evidencia.metragem_inicial,
    metragem_final: evidencia.metragem_final,
    total_utilizado: evidencia.total_utilizado,
    urls_das_fotos: {
      inicio: evidencia.foto_inicio_url,
      fim: evidencia.foto_fim_url,
    },
    data_registro: evidencia.data_registro,
  };
}

export async function notifyN8nControleMetragem(
  evidencia: Evidencia,
  nomeTecnico: string,
): Promise<void> {
  await notifyControleMetragemWebhook({ data: buildN8nPayload(evidencia, nomeTecnico) });
}
