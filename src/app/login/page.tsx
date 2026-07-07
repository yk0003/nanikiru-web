export const metadata = { title: "ログイン" };

// ログイン（モックUI）。フェーズ2でSupabase Auth（メール + Apple/Google）に接続する。
export default function LoginPage() {
  return (
    <div className="mx-auto max-w-sm space-y-6 py-8">
      <div className="text-center">
        <p className="text-2xl font-extrabold text-sky">NANIKIRU</p>
        <p className="mt-2 text-sm text-sub">天気予報よりリアル。現地の今日の服装を見る。</p>
      </div>

      <div className="nk-card space-y-3 p-6">
        <input
          type="email"
          placeholder="メールアドレス"
          className="w-full rounded-xl bg-cloud p-3 text-sm"
        />
        <button className="w-full rounded-xl bg-sky py-3 font-bold text-white">
          メールでログイン（モック）
        </button>
        <div className="flex items-center gap-3 py-1 text-xs text-sub">
          <span className="h-px flex-1 bg-cloud" />
          または
          <span className="h-px flex-1 bg-cloud" />
        </div>
        <button className="w-full rounded-xl border border-cloud bg-surface py-3 text-sm font-semibold">
           Appleでログイン（モック）
        </button>
        <button className="w-full rounded-xl border border-cloud bg-surface py-3 text-sm font-semibold">
          G Googleでログイン（モック）
        </button>
      </div>

      <p className="text-center text-xs text-sub">
        閲覧はログイン不要です。投稿・保存・フォローにはログインが必要になります。
        <br />
        （フェーズ2でSupabase Authに接続します）
      </p>
    </div>
  );
}
