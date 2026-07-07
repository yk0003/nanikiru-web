// 検索流入向けの短い説明文ブロック。
// NANIKIRUは投稿アプリなので、記事っぽく長くせず実用的に。

export function SeoTextBlock({ placeName }: { placeName: string }) {
  return (
    <section className="nk-card space-y-2 p-6 text-sm leading-relaxed text-sub">
      <h2 className="text-base font-bold text-ink">{placeName}の服装選びに</h2>
      <p>
        {placeName}
        で今日なにを着るか迷ったら、NANIKIRUで現地のリアルな服装をチェックできます。
      </p>
      <p>
        天気予報だけではわかりにくい「半袖で寒くないか」「夜に羽織りが必要か」「雨の日にどんな靴がよいか」を、実際の投稿と体感メモから確認できます。正確な位置情報は表示されず、服装はエリア単位で共有されます。
      </p>
    </section>
  );
}
