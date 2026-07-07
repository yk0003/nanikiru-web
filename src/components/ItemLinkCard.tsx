import type { ItemLink } from "@/lib/types";

// 商品リンクカード。本文URLベタ貼りは禁止で、「着用アイテム」欄にのみこの形式で表示する。
export function ItemLinkCard({ link, showsClickCount = false }: { link: ItemLink; showsClickCount?: boolean }) {
  return (
    <div className="flex items-center gap-3 rounded-xl bg-cloud p-3">
      <span className="flex h-9 w-9 items-center justify-center rounded-full bg-sky/15 text-sm">
        🛍
      </span>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-semibold">{link.title}</p>
        <div className="mt-0.5 flex items-center gap-1.5 text-[11px] text-sub">
          <span>{link.category}</span>
          <span className="rounded-full bg-sky/15 px-1.5 py-0.5 font-semibold text-skydeep">
            {link.label}
          </span>
          {link.isAffiliate && (
            <span className="rounded border border-sub/40 px-1 font-bold">PR</span>
          )}
          {showsClickCount && (
            <span className="font-semibold text-skydeep">{link.clickCount}クリック</span>
          )}
        </div>
      </div>
      <a
        href={link.url}
        target="_blank"
        rel="noopener noreferrer sponsored"
        className="shrink-0 rounded-full bg-sky px-3 py-1.5 text-xs font-semibold text-white"
      >
        詳しく見る
      </a>
    </div>
  );
}
