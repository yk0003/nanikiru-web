import { NextResponse } from "next/server";
import { getSupabaseConfig } from "@/lib/supabase/config";

// Supabase接続ヘルスチェック。
// GET /api/health/supabase
//  - env-missing : 環境変数が未設定（ローカル等。モックfallbackで動作継続）
//  - connected   : URL・anon keyでSupabaseに到達できた
//  - error       : 到達できたがエラー応答（keyの誤りなど）
//  - unreachable : ネットワークエラー
// 秘密情報は返さない（URLはNEXT_PUBLIC_で元々公開値）。

export const dynamic = "force-dynamic";

export async function GET() {
  const config = getSupabaseConfig();

  if (!config) {
    return NextResponse.json({
      ok: false,
      status: "env-missing",
      message:
        "NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_ANON_KEY が未設定です。モックデータで動作します。",
    });
  }

  try {
    const res = await fetch(`${config.url}/auth/v1/health`, {
      headers: { apikey: config.anonKey },
      cache: "no-store",
    });

    if (!res.ok) {
      return NextResponse.json(
        {
          ok: false,
          status: "error",
          httpStatus: res.status,
          message: "Supabaseに到達しましたがエラー応答です。anon keyを確認してください。",
        },
        { status: 502 }
      );
    }

    return NextResponse.json({
      ok: true,
      status: "connected",
      projectUrl: config.url,
      message: "Supabaseに接続できています。",
    });
  } catch {
    return NextResponse.json(
      {
        ok: false,
        status: "unreachable",
        message: "Supabaseに到達できません。URLとネットワークを確認してください。",
      },
      { status: 502 }
    );
  }
}
