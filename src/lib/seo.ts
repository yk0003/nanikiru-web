// SEO用ヘルパー（サイトURL・構造化データなど）

// NEXT_PUBLIC_SITE_URL を優先、未設定時は仮ドメインにfallback（ビルドは落とさない）。
// 末尾スラッシュは重複URL防止のため除去する。
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? "https://nanikiru.com").replace(
  /\/+$/,
  ""
);

/** パンくずリストのJSON-LD（BreadcrumbList） */
export function breadcrumbJsonLd(items: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: `${SITE_URL}${item.path}`,
    })),
  };
}
