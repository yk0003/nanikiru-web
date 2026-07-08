import Link from "next/link";
import { ensureOwnProfile, resolveDisplayName } from "@/lib/repo/profile";
import { getSupabaseServerClient } from "@/lib/supabase/server";

export const metadata = { title: "マイページ" };

// マイページ。ユーザー固有ページなのでここだけ動的レンダリング（cookieでセッション判定）。
// 未ログイン → ログイン導線 / ログイン済み → プロフィール簡易表示。
// 表示名は profiles.display_name を正とする（行が無ければ自己修復で作成）。
export const dynamic = "force-dynamic";

export default async function MePage() {
  const supabase = await getSupabaseServerClient();

  // env未設定（ローカルのモック動作）またはセッションなし → ログイン導線
  const user = supabase ? (await supabase.auth.getUser()).data.user : null;

  if (!user) {
    return (
      <div className="mx-auto max-w-sm py-12">
        <div className="nk-card p-8 text-center">
          <p className="text-3xl">👤</p>
          <p className="mt-3 text-lg font-bold">ログインしていません</p>
          <p className="mt-2 text-sm leading-relaxed text-sub">
            ログインすると、今日の服装の投稿・保存・フォローができるようになります。
          </p>
          <Link
            href="/login"
            className="mt-5 inline-block rounded-xl bg-sky px-8 py-3 font-bold text-white transition hover:opacity-90"
          >
            ログイン / 新規登録
          </Link>
          <p className="mt-4 text-xs text-sub">見るだけならログインは不要です。</p>
        </div>
      </div>
    );
  }

  // プロフィール取得（profiles.display_nameが正。行が無ければ自己修復で作成）
  const profile = await ensureOwnProfile(supabase!, user);
  const displayName = resolveDisplayName(profile, user);
  const joinedAt = profile?.created_at
    ? new Intl.DateTimeFormat("ja-JP", { dateStyle: "medium" }).format(new Date(profile.created_at))
    : null;

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      {/* プロフィール */}
      <div className="nk-card flex items-center gap-4 p-6">
        <span className="flex h-16 w-16 items-center justify-center rounded-full bg-sky/30 text-xl font-bold text-white">
          {displayName.charAt(0).toUpperCase()}
        </span>
        <div className="min-w-0">
          <p className="flex items-center gap-2 text-lg font-bold">
            {displayName}
            {profile?.is_creator && <span className="text-sm text-mint">✓ Creator</span>}
          </p>
          <p className="truncate text-xs text-sub">
            {user.email}
            {joinedAt && ` ・ ${joinedAt}に登録`}
          </p>
          {profile?.bio && <p className="mt-1 text-sm text-sub">{profile.bio}</p>}
        </div>
      </div>

      {/* Creatorプラン導線 */}
      {!profile?.is_creator && (
        <Link href="/creator" className="nk-card block p-5 transition hover:bg-cloud/50">
          <p className="font-semibold">✨ Creatorプランに加入する</p>
          <p className="mt-1 text-xs text-sub">月980円で投稿に商品リンクを追加できます</p>
        </Link>
      )}

      {/* メニュー */}
      <div className="nk-card divide-y divide-cloud">
        {[
          { label: "🔗 リンク管理", locked: !profile?.is_creator },
          { label: "📊 簡易アナリティクス", locked: !profile?.is_creator },
          { label: "⚙️ 設定", locked: false },
          { label: "🛡 通報・ブロックの管理", locked: false },
        ].map((row) => (
          <div key={row.label} className="flex items-center justify-between p-4 text-sm">
            <span className={row.locked ? "text-sub" : ""}>{row.label}</span>
            {row.locked && (
              <span className="rounded-full bg-cloud px-2 py-0.5 text-[10px] font-semibold text-sub">
                🔒 Creator限定
              </span>
            )}
          </div>
        ))}
      </div>

      {/* 自分の投稿（投稿保存はフェーズ7で対応） */}
      <section>
        <h2 className="mb-3 font-bold">自分の投稿</h2>
        <div className="nk-card p-8 text-center">
          <p className="text-2xl">👕</p>
          <p className="mt-2 text-sm font-semibold">まだ投稿がありません</p>
          <p className="mt-1 text-xs text-sub">
            今日の服装を投稿して、誰かの「今日なに着る？」の参考になりましょう。
          </p>
          <Link
            href="/compose"
            className="mt-4 inline-block rounded-xl bg-sky px-6 py-2.5 text-sm font-bold text-white"
          >
            今日の服装を投稿する
          </Link>
        </div>
      </section>
    </div>
  );
}
