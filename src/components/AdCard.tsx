import type { Ad } from "@/lib/types";

// モック広告カード。
// AdSense導入時はこのコンポーネントの中身を広告ユニットに差し替える。
// ルール: 「広告」ラベル必須 / 投稿カードと混同しない（枠線・比率違い） / 目立ちすぎない。

/** グリッドの1マスに収まる広告カード */
export function AdCard({ ad }: { ad: Ad }) {
  return (
    <div className="flex flex-col">
      <div className="relative flex aspect-[3/4] w-full flex-col items-center justify-center gap-2 rounded-xl border border-cloud bg-gradient-to-br from-cloud to-sky/15">
        <span className="text-3xl opacity-50" aria-hidden>
          🧳
        </span>
        <span className="text-xs font-semibold text-skydeep">{ad.ctaLabel}</span>
        <span className="absolute left-2 top-2 rounded bg-white/90 px-1.5 py-0.5 text-[10px] font-bold text-sub">
          広告
        </span>
      </div>
      <p className="mt-2 truncate text-xs font-semibold">{ad.title}</p>
      <p className="truncate text-[11px] text-sub">提供: {ad.advertiser}</p>
    </div>
  );
}

/** 記事・投稿詳細の下部に置く横長の広告カード */
export function AdBanner({ ad }: { ad: Ad }) {
  return (
    <div className="nk-card border border-cloud p-4">
      <div className="mb-2 flex items-center justify-between">
        <span className="rounded border border-sub/40 px-1.5 py-0.5 text-[10px] font-bold text-sub">
          広告
        </span>
        <span className="text-xs text-sub">提供: {ad.advertiser}</span>
      </div>
      <p className="text-sm font-semibold">{ad.title}</p>
      <p className="mt-1 text-xs text-sub">{ad.body}</p>
      <button className="mt-3 w-full rounded-xl bg-cloud py-2 text-sm font-semibold">
        {ad.ctaLabel}
      </button>
    </div>
  );
}
