// Supabase接続設定。
// 環境変数が未設定でもビルド・表示は落とさない（呼び出し側でnullを扱い、モックにfallbackする方針）。
// service_role keyはNext.jsからは絶対に使わない（anon keyのみ）。

export interface SupabaseConfig {
  url: string;
  anonKey: string;
}

export function getSupabaseConfig(): SupabaseConfig | null {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !anonKey) return null;
  return { url, anonKey };
}
