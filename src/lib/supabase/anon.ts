// 読み取り専用の匿名Supabaseクライアント（cookie不使用）。
// server.ts（cookie連携）を公開データの読み取りに使うとページが動的レンダリングに
// 切り替わってSSG/ISRが壊れるため、locations等の公開マスタはこちらで読む。
// fetchに revalidate を指定して、Next.jsのデータキャッシュに乗せる（1時間）。

import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { getSupabaseConfig } from "./config";

const REVALIDATE_SECONDS = 3600;

let anonClient: SupabaseClient | null = null;

export function getSupabaseAnonClient(): SupabaseClient | null {
  const config = getSupabaseConfig();
  if (!config) return null;
  if (!anonClient) {
    anonClient = createClient(config.url, config.anonKey, {
      auth: { persistSession: false, autoRefreshToken: false },
      global: {
        // "supabase"タグ付きでキャッシュ。投稿作成時に revalidateTag("supabase") で即時反映できる
        fetch: (url, init) =>
          fetch(url, {
            ...init,
            next: { revalidate: REVALIDATE_SECONDS, tags: ["supabase"] },
          } as RequestInit),
      },
    });
  }
  return anonClient;
}
