import type { OutfitSummary } from "@/lib/mock";

// 「今日の服装メモ」カード。投稿一覧の前に置き、
// 気温・体感・傾向から「今日この場所で何を着ればいいか」を一目で伝える。

export function WeatherSummary({ summary }: { summary: OutfitSummary }) {
  const rows = [
    { emoji: "👕", label: "今日のおすすめ", value: summary.recommend },
    { emoji: "🌙", label: "夜の注意", value: summary.nightNote },
    { emoji: "🌬", label: "雨・風", value: summary.weatherNote },
    { emoji: "📊", label: "体感傾向", value: summary.feelNote },
  ];

  return (
    <section className="nk-card space-y-4 p-6">
      <div>
        <h2 className="font-bold">今日の服装メモ</h2>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-sub">{summary.memo}</p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        {rows.map((row) => (
          <div key={row.label} className="rounded-xl bg-cloud/60 p-3">
            <p className="text-xs font-semibold text-sub">
              {row.emoji} {row.label}
            </p>
            <p className="mt-1 text-sm font-semibold leading-relaxed">{row.value}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
