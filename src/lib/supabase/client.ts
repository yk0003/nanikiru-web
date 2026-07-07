// ブラウザ用Supabaseクライアント（クライアントコンポーネントから使う）。
// シングルトンで使い回す。env未設定時はnullを返し、呼び出し側でモックにfallbackする。

import { createBrowserClient } from "@supabase/ssr";
import type { SupabaseClient } from "@supabase/supabase-js";
import { getSupabaseConfig } from "./config";

let browserClient: SupabaseClient | null = null;

export function getSupabaseBrowserClient(): SupabaseClient | null {
  const config = getSupabaseConfig();
  if (!config) return null;
  if (!browserClient) {
    browserClient = createBrowserClient(config.url, config.anonKey);
  }
  return browserClient;
}
