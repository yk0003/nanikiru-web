import Link from "next/link";
import { FEEL_TAGS, WEATHER_KINDS, type Post } from "@/lib/types";

/** 体感タグチップ */
export function FeelChip({ tag }: { tag: Post["feelTag"] }) {
  const t = FEEL_TAGS[tag];
  return (
    <span
      className="nk-chip font-semibold"
      style={{ color: t.fg, backgroundColor: t.bg, fontSize: "0.72rem" }}
    >
      {t.label}
    </span>
  );
}

/** シンプルなTシャツアイコン（写真プレースホルダー用） */
export function TShirtIcon({ size = 44 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="white" aria-hidden>
      <path d="M8 3 4 6l2 3 1.5-1V20a1 1 0 0 0 1 1h7a1 1 0 0 0 1-1V8L18 9l2-3-4-3a4 4 0 0 1-8 0Z" />
    </svg>
  );
}

/** 服装写真プレースホルダー（体感タグ色のグラデーション。実装時に実写真へ差し替え） */
export function PhotoPlaceholder({ post, className = "" }: { post: Post; className?: string }) {
  const t = FEEL_TAGS[post.feelTag];
  return (
    <div
      className={`relative flex aspect-[3/4] w-full flex-col items-center justify-center gap-2 overflow-hidden rounded-xl ${className}`}
      style={{ background: `linear-gradient(to bottom, ${t.bg}, ${t.fg}99)` }}
    >
      <TShirtIcon />
      <span className="text-xs font-semibold text-white/90">
        {post.outfitTags.slice(0, 2).join(" ・ ")}
      </span>
      <span className="absolute left-2 top-2">
        <FeelChip tag={post.feelTag} />
      </span>
    </div>
  );
}

/** グリッド用の投稿カード（ホーム・エリアページ共通） */
export function PostCard({ post }: { post: Post }) {
  const w = post.weather;
  return (
    <Link href={`/posts/${post.id}`} className="group block">
      <PhotoPlaceholder post={post} className="transition group-hover:opacity-90" />
      <div className="mt-2 space-y-0.5">
        <p className="text-sm font-semibold">
          {post.areaName} ・ {post.time}
        </p>
        <p className="text-xs text-sub">
          {Math.round(w.tempC)}℃ ・ {post.outfitTags.slice(0, 2).join("・")} ・{" "}
          {WEATHER_KINDS[w.kind].label}
        </p>
        <p className="truncate text-xs text-sub">{post.comment}</p>
      </div>
    </Link>
  );
}
