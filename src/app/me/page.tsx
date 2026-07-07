import Link from "next/link";
import { PostCard } from "@/components/PostCard";
import { POSTS } from "@/lib/mock";

export const metadata = { title: "マイページ" };

// マイページ（モック: ログインユーザー = Yui / 無料プラン）
export default function MePage() {
  const myPosts = POSTS.filter((p) => p.userName === "Yui");

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div className="nk-card flex items-center gap-4 p-6">
        <span className="flex h-16 w-16 items-center justify-center rounded-full bg-sky/30 text-xl font-bold text-white">
          Y
        </span>
        <div>
          <p className="text-lg font-bold">Yui</p>
          <p className="text-xs text-sub">@yui_tokyo ・ よく投稿する場所: 東京・渋谷</p>
        </div>
      </div>

      <Link href="/creator" className="nk-card block p-5 hover:bg-cloud/50">
        <p className="font-semibold">✨ Creatorプランに加入する</p>
        <p className="mt-1 text-xs text-sub">月980円で投稿に商品リンクを追加できます</p>
      </Link>

      <div className="nk-card divide-y divide-cloud">
        {[
          { label: "🔗 リンク管理", locked: true },
          { label: "📊 簡易アナリティクス", locked: true },
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

      <section>
        <h2 className="mb-3 font-bold">自分の投稿</h2>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
          {myPosts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      </section>
    </div>
  );
}
