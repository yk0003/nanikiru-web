import { ImageResponse } from "next/og";

// OG画像の生成本体（opengraph-image.tsx と twitter-image.tsx から共用）。
// デザイン: オフホワイト背景 + NANIKIRUロゴ + キャッチコピー + 天気カード + 地図風ピン + 服装カード。
// 絵文字はsatoriで描画できないため、太陽やピンは図形で表現する。

export const OG_SIZE = { width: 1200, height: 630 };
export const OG_ALT = "NANIKIRU｜天気予報よりリアル。現地の今日の服装を見る。";

// フォントのサブセット取得に使う全文字（ここに含めない文字は豆腐になるので注意）
const OG_TEXT =
  "NANIKIRU天気予報よりリアル。現地の今日の服装を見る東京・渋谷ソウルパリ台北体感晴れ半袖薄手シャツが多めちょうどいい少し暑いニット0123456789°/｜";

async function loadNotoSansJP(): Promise<ArrayBuffer> {
  const url = `https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@700&text=${encodeURIComponent(OG_TEXT)}`;
  const css = await (await fetch(url)).text();
  const resource = css.match(/src: url\((.+?)\) format\('(opentype|truetype)'\)/);
  if (resource) {
    const response = await fetch(resource[1]);
    if (response.ok) return response.arrayBuffer();
  }
  throw new Error("Failed to load Noto Sans JP for OG image");
}

// 都市ピン風チップ
function Pin({ label, count, top, left }: { label: string; count: string; top: number; left: number }) {
  return (
    <div
      style={{
        position: "absolute",
        top,
        left,
        display: "flex",
        alignItems: "center",
        background: "#ffffff",
        borderRadius: 999,
        padding: "8px 16px",
        fontSize: 20,
        color: "#1F2933",
        boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
      }}
    >
      <span>{label}</span>
      <div
        style={{
          display: "flex",
          background: "#78B7D0",
          color: "#ffffff",
          borderRadius: 999,
          padding: "2px 10px",
          fontSize: 16,
          marginLeft: 8,
        }}
      >
        {count}
      </div>
    </div>
  );
}

// 服装カード風の四角（体感タグ色のグラデーション）
function OutfitCard({ from, to, label }: { from: string; to: string; label: string }) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "flex-end",
        width: 104,
        height: 132,
        borderRadius: 20,
        background: `linear-gradient(to bottom, ${from}, ${to})`,
        paddingBottom: 12,
      }}
    >
      <span style={{ fontSize: 17, color: "#ffffff" }}>{label}</span>
    </div>
  );
}

export async function buildOgImage() {
  const font = await loadNotoSansJP();

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          background: "linear-gradient(135deg, #FAF8F3 60%, rgba(140,207,193,0.25))",
          padding: 56,
          fontFamily: "NotoSansJP",
        }}
      >
        {/* 左: ロゴ + コピー + 天気カード */}
        <div style={{ display: "flex", flexDirection: "column", flex: 1, justifyContent: "center" }}>
          <div style={{ display: "flex", fontSize: 40, color: "#78B7D0", letterSpacing: 4 }}>
            NANIKIRU
          </div>

          <div style={{ display: "flex", flexDirection: "column", marginTop: 24 }}>
            <span style={{ fontSize: 56, color: "#1F2933" }}>天気予報よりリアル。</span>
            <div style={{ display: "flex", fontSize: 56, color: "#1F2933", marginTop: 4 }}>
              <span>現地の</span>
              <span style={{ color: "#4E93B8" }}>今日の服装</span>
              <span>を見る。</span>
            </div>
          </div>

          {/* 天気カード */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              marginTop: 44,
              background: "#ffffff",
              borderRadius: 28,
              padding: "24px 36px",
              width: 560,
              boxShadow: "0 6px 20px rgba(0,0,0,0.07)",
            }}
          >
            <div style={{ display: "flex", flexDirection: "column" }}>
              <span style={{ fontSize: 24, color: "#6B7280" }}>東京・渋谷</span>
              <div style={{ display: "flex", alignItems: "baseline", marginTop: 4 }}>
                <span style={{ fontSize: 68, color: "#1F2933" }}>29°</span>
                <span style={{ fontSize: 26, color: "#6B7280", marginLeft: 16 }}>
                  体感 32° / 晴れ
                </span>
              </div>
            </div>
            {/* 太陽（絵文字の代わりに図形で） */}
            <div
              style={{
                display: "flex",
                width: 72,
                height: 72,
                borderRadius: 999,
                background: "#F5C063",
                marginLeft: "auto",
                boxShadow: "0 0 0 12px rgba(245,192,99,0.25)",
              }}
            />
          </div>
        </div>

        {/* 右: 地図風パネル + 服装カード */}
        <div style={{ display: "flex", flexDirection: "column", width: 380, marginLeft: 44 }}>
          <div
            style={{
              display: "flex",
              position: "relative",
              flex: 1,
              borderRadius: 32,
              background:
                "linear-gradient(135deg, rgba(120,183,208,0.28), rgba(250,248,243,0.9) 50%, rgba(140,207,193,0.3))",
              border: "2px solid rgba(120,183,208,0.25)",
            }}
          >
            <Pin label="ソウル" count="86" top={44} left={40} />
            <Pin label="東京" count="128" top={130} left={150} />
            <Pin label="台北" count="38" top={220} left={60} />
          </div>

          {/* 服装カード列 */}
          <div style={{ display: "flex", marginTop: 20, gap: 16 }}>
            <OutfitCard from="#FBF0DA" to="#A9741B" label="半袖" />
            <OutfitCard from="#E4F4EC" to="#35845F" label="シャツ" />
            <OutfitCard from="#E6F3F9" to="#4E93B8" label="ニット" />
          </div>
        </div>
      </div>
    ),
    {
      ...OG_SIZE,
      fonts: [{ name: "NotoSansJP", data: font, weight: 700, style: "normal" }],
    }
  );
}
