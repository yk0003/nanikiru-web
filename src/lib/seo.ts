// SEO用ヘルパー（サイトURL・構造化データなど）

// NEXT_PUBLIC_SITE_URL を優先、未設定時はVercelの本番URLにfallback（ビルドは落とさない）。
// 末尾スラッシュは重複URL防止のため除去する。
export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://nanikiru-web.vercel.app"
).replace(/\/+$/, "");

/** サイト共通のOGPタイトル・説明文 */
export const SITE_TITLE = "NANIKIRU｜天気予報よりリアル。現地の今日の服装を見る。";
export const SITE_DESCRIPTION =
  "気温だけでは「なに着るか」は決められない。NANIKIRUは、現地のリアルな服装投稿と体感メモで、旅行前・外出前の服装選びを助けます。";

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
