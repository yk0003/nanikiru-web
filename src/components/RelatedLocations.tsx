import Link from "next/link";
import type { Area } from "@/lib/types";

// 関連エリアのチップ一覧（ページ下部の内部リンク網。SEOと回遊の両方に効く）

export function RelatedLocations({
  title,
  citySlug,
  areas,
  currentAreaSlug,
  cityName,
}: {
  title: string;
  citySlug: string;
  areas: Area[];
  currentAreaSlug?: string;
  cityName?: string;
}) {
  const list = areas.filter((a) => a.slug !== currentAreaSlug);
  if (list.length === 0) return null;

  return (
    <section>
      <h2 className="mb-3 text-lg font-bold">{title}</h2>
      <div className="flex flex-wrap gap-2">
        {list.map((area) => (
          <Link
            key={area.slug}
            href={`/locations/${citySlug}/${area.slug}`}
            className="nk-chip bg-surface font-semibold shadow-sm hover:bg-cloud"
          >
            {area.name}
            <span className="text-xs text-sub">
              {area.postCount > 0 ? `${area.postCount}件` : "投稿なし"}
            </span>
          </Link>
        ))}
        {cityName && (
          <Link
            href={`/locations/${citySlug}`}
            className="nk-chip bg-sky/10 font-semibold text-skydeep hover:bg-sky/20"
          >
            {cityName}のすべての投稿 →
          </Link>
        )}
      </div>
    </section>
  );
}
