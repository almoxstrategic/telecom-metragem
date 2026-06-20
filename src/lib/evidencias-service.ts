import { getStoragePublicUrl, getSupabaseClient } from "./supabase";
import type { Evidencia, EvidenciaInsert } from "./types";

type DbEvidencia = Evidencia & {
  profiles?: { nome: string } | null;
};

function mapRow(row: DbEvidencia): Evidencia {
  return {
    id: row.id,
    contrato: row.contrato,
    wo: row.wo,
    metragem_inicial: Number(row.metragem_inicial),
    metragem_final: Number(row.metragem_final),
    total_utilizado: Number(row.total_utilizado),
    foto_inicio_url: row.foto_inicio_url,
    foto_fim_url: row.foto_fim_url,
    foto_inicio_path: row.foto_inicio_path,
    foto_fim_path: row.foto_fim_path,
    data_registro: row.data_registro,
    tecnico_id: row.tecnico_id,
    tecnico_nome: row.profiles?.nome,
  };
}

export async function fetchMyEvidencias(tecnicoId: string): Promise<Evidencia[]> {
  const supabase = getSupabaseClient();
  const { data, error } = await supabase
    .from("evidencias")
    .select("*")
    .eq("tecnico_id", tecnicoId)
    .order("data_registro", { ascending: false });

  if (error) throw error;
  return (data ?? []).map(mapRow);
}

export async function fetchAllEvidencias(): Promise<Evidencia[]> {
  const supabase = getSupabaseClient();
  const { data, error } = await supabase
    .from("evidencias")
    .select("*")
    .order("data_registro", { ascending: false });

  if (error) throw error;

  const { data: profiles, error: profilesError } = await supabase
    .from("profiles")
    .select("id, nome");

  if (profilesError) throw profilesError;

  const nameById = new Map((profiles ?? []).map((profile) => [profile.id, profile.nome]));

  return (data ?? []).map((row) =>
    mapRow({
      ...(row as DbEvidencia),
      tecnico_nome: nameById.get(row.tecnico_id),
    }),
  );
}

export async function uploadEvidencePhoto(
  tecnicoId: string,
  file: File,
  suffix: "inicio" | "fim",
): Promise<{ path: string; publicUrl: string }> {
  const supabase = getSupabaseClient();
  const ext = file.name.split(".").pop()?.toLowerCase() || "jpg";
  const path = `${tecnicoId}/${crypto.randomUUID()}-${suffix}.${ext}`;

  const { error } = await supabase.storage.from("evidencias-fotos").upload(path, file, {
    cacheControl: "3600",
    upsert: false,
    contentType: file.type || "image/jpeg",
  });

  if (error) throw error;

  return { path, publicUrl: getStoragePublicUrl(path) };
}

export async function insertEvidencia(payload: EvidenciaInsert): Promise<Evidencia> {
  const supabase = getSupabaseClient();
  const { data, error } = await supabase
    .from("evidencias")
    .insert(payload)
    .select("*")
    .single();

  if (error) throw error;
  return mapRow(data as DbEvidencia);
}

export async function deleteEvidenciasWithPhotos(ids: string[]): Promise<void> {
  if (ids.length === 0) return;

  const supabase = getSupabaseClient();
  const { data: rows, error: fetchError } = await supabase
    .from("evidencias")
    .select("id, foto_inicio_path, foto_fim_path")
    .in("id", ids);

  if (fetchError) throw fetchError;

  const paths = (rows ?? []).flatMap((row) => [row.foto_inicio_path, row.foto_fim_path]);
  if (paths.length > 0) {
    const { error: storageError } = await supabase.storage.from("evidencias-fotos").remove(paths);
    if (storageError) throw storageError;
  }

  const { error: deleteError } = await supabase.from("evidencias").delete().in("id", ids);
  if (deleteError) throw deleteError;
}
