import Link from "next/link";
import { PostComposer } from "@/components/PostComposer";
import { getArea, getCity } from "@/lib/mock";
import { getSupabaseServerClient } from "@/lib/supabase/server";

export const metadata = { title: "今日の服装を投稿" };

// 投稿作成ページ。
// - Supabase接続済み + 未ログイン → ログイン導線
// - Supabase接続済み + ログイン済み → 実投稿（Server Action経由でDB保存）
// - env未設定（ローカル等） → 従来どおりのモック動作
// クエリ（?city=tokyo&area=shibuya）はサーバー側で解決してpropsで渡す。

type Props = { searchParams: Promise<{ city?: string; area?: string }> };

export default async function ComposePage({ searchParams }: Props) {
  const { city, area } = await searchParams;

  const resolvedArea =
    city && area && getArea(city, area)
      ? { citySlug: city, areaSlug: area, displayName: getArea(city, area)!.displayName }
      : { citySlug: "tokyo", areaSlug: "shibuya", displayName: "東京・渋谷" };

  // cityだけ指定された場合（都市ページの「最初に投稿する」導線）
  const resolved =
    !area && city && getCity(city)
      ? {
          citySlug: city,
          areaSlug: getCity(city)!.areas[0].slug,
          displayName: getCity(city)!.areas[0].displayName,
        }
      : resolvedArea;

  // 認証ゲート（env未設定ならモック動作のまま通す）
  const supabase = await getSupabaseServerClient();
  let canPost = false;

  if (supabase) {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return (
        <div className="mx-auto max-w-sm py-12">
          <div className="nk-card p-8 text-center">
            <p className="text-3xl">👕</p>
            <p className="mt-3 text-lg font-bold">投稿にはログインが必要です</p>
            <p className="mt-2 text-sm leading-relaxed text-sub">
              あなたの今日の服装が、誰かの「今日なに着る？」の参考になります。
              <br />
              ログインして投稿してみませんか？
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

    canPost = true;
  }

  return <PostComposer initialArea={resolved} canPost={canPost} />;
}
