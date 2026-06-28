import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import type { Database, Json } from "@/types/database";

type ServerSupabaseClient = ReturnType<typeof createServerClient<Database>>;
type RpcOptions = {
  head?: boolean;
  get?: boolean;
  count?: "exact" | "planned" | "estimated";
};
type RpcResponse = PromiseLike<{
  data: Json | null;
  error: { message: string } | null;
}>;
type AppServerSupabaseClient = Omit<ServerSupabaseClient, "rpc"> & {
  rpc(
    fn: "sync_clerk_user",
    args: Database["public"]["Functions"]["sync_clerk_user"]["Args"],
    options?: RpcOptions
  ): RpcResponse;
  rpc(
    fn: "get_dashboard_data",
    args: Database["public"]["Functions"]["get_dashboard_data"]["Args"],
    options?: RpcOptions
  ): RpcResponse;
};

export async function createSupabaseServerClient() {
  const cookieStore = await cookies();

  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // Server Component — cookies can't be set, middleware handles this
          }
        },
      },
    }
  );
}

export async function createSupabaseAdminClient() {
  const cookieStore = await cookies();

  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {}
        },
      },
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    }
  ) as unknown as AppServerSupabaseClient;
}
