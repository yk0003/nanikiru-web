"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import type { User } from "@supabase/supabase-js";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";

// ヘッダー右側のナビ。ログイン状態はクライアント側で判定する。
// （サーバー側でcookieを読むと全ページが動的化してSSG/ISRが壊れるため）
// 未ログイン: ログイン / 投稿する
// ログイン済: マイページ / 投稿する / ログアウト

export function AuthNav() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    const supabase = getSupabaseBrowserClient();
    if (!supabase) {
      setChecked(true);
      return;
    }

    supabase.auth
      .getSession()
      .then(({ data }) => setUser(data.session?.user ?? null))
      .finally(() => setChecked(true));

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setChecked(true);
    });

    return () => subscription.unsubscribe();
  }, []);

  async function handleSignOut() {
    const supabase = getSupabaseBrowserClient();
    if (!supabase) return;
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  }

  const signedIn = checked && !!user;

  return (
    <nav className="flex items-center gap-3 text-sm text-sub sm:gap-4">
      <Link href="/map" className="whitespace-nowrap hover:text-ink">
        地図
      </Link>
      <Link href="/saved" className="hidden whitespace-nowrap hover:text-ink sm:inline">
        保存
      </Link>

      {signedIn ? (
        <>
          <Link href="/me" className="whitespace-nowrap hover:text-ink">
            マイページ
          </Link>
          <button
            type="button"
            onClick={handleSignOut}
            className="hidden whitespace-nowrap hover:text-ink sm:inline"
          >
            ログアウト
          </button>
        </>
      ) : (
        <Link href="/login" className="whitespace-nowrap hover:text-ink">
          ログイン
        </Link>
      )}

      <Link
        href="/compose"
        className="whitespace-nowrap rounded-full bg-sky px-4 py-1.5 font-semibold text-white hover:opacity-90"
      >
        投稿する
      </Link>
    </nav>
  );
}
