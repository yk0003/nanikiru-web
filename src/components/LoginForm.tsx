"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";

// ログイン / 新規登録フォーム（メール+パスワード）。
// Googleログインはボタンとコールバック経路のみ用意（プロバイダ設定は後日）。

export function LoginForm() {
  const router = useRouter();
  const supabase = getSupabaseBrowserClient();

  const [mode, setMode] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  const canSubmit = email.includes("@") && password.length >= 6 && !loading;

  async function handleSubmit() {
    if (!supabase || !canSubmit) return;
    setLoading(true);
    setError(null);
    setNotice(null);

    if (mode === "login") {
      const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });
      setLoading(false);
      if (signInError) {
        setError("ログインできませんでした。メールアドレスとパスワードを確認してください。");
        return;
      }
      router.push("/me");
      router.refresh();
    } else {
      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { display_name: displayName.trim() },
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      });
      setLoading(false);
      if (signUpError) {
        setError("登録できませんでした。すでに登録済みのメールアドレスかもしれません。");
        return;
      }
      if (data.session) {
        // メール確認オフの場合はそのままログイン状態になる
        router.push("/me");
        router.refresh();
      } else {
        setNotice("確認メールを送りました。メール内のリンクをクリックすると登録が完了します。");
      }
    }
  }

  async function handleGoogle() {
    if (!supabase) return;
    setError(null);
    const { error: oauthError } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${window.location.origin}/auth/callback` },
    });
    if (oauthError) {
      setError("Googleログインは現在準備中です。メールアドレスでログインしてください。");
    }
  }

  if (!supabase) {
    return (
      <div className="nk-card p-6 text-center text-sm text-sub">
        現在はモック動作中です（Supabase環境変数が未設定のため、ログイン機能は利用できません）。
      </div>
    );
  }

  return (
    <div className="nk-card space-y-4 p-6">
      {/* ログイン / 新規登録 切替 */}
      <div className="flex gap-2">
        {(["login", "signup"] as const).map((m) => (
          <button
            key={m}
            type="button"
            onClick={() => {
              setMode(m);
              setError(null);
              setNotice(null);
            }}
            className={`nk-chip flex-1 justify-center font-semibold ${
              mode === m ? "bg-sky/15 text-skydeep ring-1 ring-sky" : "bg-cloud text-sub"
            }`}
          >
            {m === "login" ? "ログイン" : "新規登録"}
          </button>
        ))}
      </div>

      {mode === "signup" && (
        <input
          value={displayName}
          onChange={(e) => setDisplayName(e.target.value)}
          placeholder="表示名（例：Yui）"
          className="w-full rounded-xl bg-cloud p-3 text-sm outline-sky"
        />
      )}

      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="メールアドレス"
        autoComplete="email"
        className="w-full rounded-xl bg-cloud p-3 text-sm outline-sky"
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="パスワード（6文字以上）"
        autoComplete={mode === "login" ? "current-password" : "new-password"}
        className="w-full rounded-xl bg-cloud p-3 text-sm outline-sky"
      />

      {error && <p className="text-xs text-[#B05A25]">{error}</p>}
      {notice && <p className="text-xs text-skydeep">{notice}</p>}

      <button
        type="button"
        onClick={handleSubmit}
        disabled={!canSubmit}
        className="w-full rounded-xl bg-sky py-3 font-bold text-white transition hover:opacity-90 disabled:opacity-40"
      >
        {loading ? "処理中…" : mode === "login" ? "メールでログイン" : "登録する"}
      </button>

      <div className="flex items-center gap-3 py-1 text-xs text-sub">
        <span className="h-px flex-1 bg-cloud" />
        または
        <span className="h-px flex-1 bg-cloud" />
      </div>

      <button
        type="button"
        onClick={handleGoogle}
        className="w-full rounded-xl border border-cloud bg-surface py-3 text-sm font-semibold transition hover:bg-cloud/50"
      >
        G Googleでログイン
      </button>
    </div>
  );
}
