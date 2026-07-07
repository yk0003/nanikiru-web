export const metadata = { title: "Creatorプラン" };

// Creatorプラン案内。MVPはUI表示のみ。フェーズ2でStripe Billingに接続する。
const BENEFITS = [
  ["🔗", "投稿に商品リンクを追加"],
  ["👤", "プロフィールにリンクを追加"],
  ["🛍", "アフィリエイトリンク対応（PR表記は自動挿入）"],
  ["👆", "商品リンクのクリック数を確認"],
  ["🚫", "広告を一部非表示"],
  ["📊", "リンク管理メニューを解放"],
];

export default function CreatorPage() {
  return (
    <div className="mx-auto max-w-md space-y-6 py-4 text-center">
      <div>
        <h1 className="text-2xl font-bold">NANIKIRU Creator</h1>
        <p className="mt-2 text-4xl font-extrabold text-sky">月額980円</p>
        <p className="mt-2 text-sm text-sub">投稿・閲覧はずっと無料。リンク機能だけが有料です。</p>
      </div>

      <div className="nk-card space-y-4 p-6 text-left">
        <p className="font-bold">できること</p>
        {BENEFITS.map(([emoji, text]) => (
          <p key={text} className="flex items-start gap-3 text-sm">
            <span>{emoji}</span>
            {text}
          </p>
        ))}
      </div>

      <button className="w-full rounded-xl bg-sky py-3.5 font-bold text-white">
        Creatorプランに加入する（モック）
      </button>

      <p className="text-xs text-sub">
        実際の課金はStripeで実装予定です。現在はUIモックとして表示しています。
      </p>
    </div>
  );
}
