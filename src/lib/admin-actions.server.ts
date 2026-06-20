import { createServerFn } from "@tanstack/react-start";
import { createClient } from "@supabase/supabase-js";
import { z } from "zod";

function getServiceClient() {
  const url = process.env.VITE_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceKey) {
    throw new Error("Configure VITE_SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY no servidor.");
  }
  return createClient(url, serviceKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}

async function assertAdmin(accessToken: string) {
  const supabase = getServiceClient();
  const { data, error } = await supabase.auth.getUser(accessToken);
  if (error || !data.user) throw new Error("Sessão inválida.");

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", data.user.id)
    .single();

  if (profileError || profile?.role !== "admin") {
    throw new Error("Acesso restrito a administradores.");
  }

  return data.user;
}

const withToken = z.object({
  accessToken: z.string().min(1),
});

export const createUserAccount = createServerFn({ method: "POST" })
  .validator(
    withToken.extend({
      email: z.string().email(),
      password: z.string().min(6),
      nome: z.string().min(2),
      role: z.enum(["admin", "tecnico"]),
    }),
  )
  .handler(async ({ data }) => {
    await assertAdmin(data.accessToken);
    const supabase = getServiceClient();

    const { data: created, error } = await supabase.auth.admin.createUser({
      email: data.email,
      password: data.password,
      email_confirm: true,
      app_metadata: { role: data.role },
      user_metadata: { nome: data.nome },
    });

    if (error) throw error;

    await supabase.from("profiles").upsert({
      id: created.user.id,
      nome: data.nome,
      role: data.role,
    });

    return { id: created.user.id, email: created.user.email };
  });

export const resetUserPassword = createServerFn({ method: "POST" })
  .validator(
    withToken.extend({
      email: z.string().email(),
      password: z.string().min(6),
    }),
  )
  .handler(async ({ data }) => {
    await assertAdmin(data.accessToken);
    const supabase = getServiceClient();

    const { data: listed, error: listError } = await supabase.auth.admin.listUsers();
    if (listError) throw listError;

    const target = listed.users.find(
      (user) => user.email?.toLowerCase() === data.email.toLowerCase(),
    );
    if (!target) throw new Error("Usuário não encontrado.");

    const { error } = await supabase.auth.admin.updateUserById(target.id, {
      password: data.password,
    });
    if (error) throw error;

    return { ok: true };
  });

export const createInitialAdmin = createServerFn({ method: "POST" })
  .validator(
    z.object({
      email: z.string().email(),
      password: z.string().min(8),
      nome: z.string().min(2),
      setupSecret: z.string().min(8),
    }),
  )
  .handler(async ({ data }) => {
    const expectedSecret = process.env.ADMIN_SETUP_SECRET ?? "estrategic-setup-2026";
    if (data.setupSecret !== expectedSecret) {
      throw new Error("Setup secret inválido.");
    }

    const supabase = getServiceClient();
    const { count, error: countError } = await supabase
      .from("profiles")
      .select("*", { count: "exact", head: true })
      .eq("role", "admin");

    if (countError) throw countError;
    if ((count ?? 0) > 0) throw new Error("Administrador inicial já existe.");

    const { data: created, error } = await supabase.auth.admin.createUser({
      email: data.email,
      password: data.password,
      email_confirm: true,
      app_metadata: { role: "admin" },
      user_metadata: { nome: data.nome },
    });
    if (error) throw error;

    await supabase.from("profiles").upsert({
      id: created.user.id,
      nome: data.nome,
      role: "admin",
    });

    return { email: data.email };
  });
