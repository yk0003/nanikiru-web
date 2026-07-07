// サーバー用Supabaseクライアント（サーバーコンポーネント / Route Handlerから使う）。
// cookieと連携するのでAuth導入後もこのまま使える。
// env未設定時はnullを返し、呼び出し側でモックにfallbackする。

import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { getSupabaseConfig } from "./config";

export async function getSupabaseServerClient() {
  const config = getSupabaseConfig();
  if (!config) return null;

  const cookieStore = await cookies();

  return createServerClient(config.url, config.anonKey, {
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
          // サーバーコンポーネントからのset呼び出しは無視される（Auth導入時にmiddlewareで対応）
        }
      },
    },
  });
}
