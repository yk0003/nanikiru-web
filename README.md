# NANIKIRU Web

天気予報よりリアル。現地の今日の服装を見る。

## セットアップ

```bash
npm install
npm run dev
```

http://localhost:3000 で起動します。

## 現在の状態（Web MVP フェーズ1）

- 全ページがモックデータ（`src/lib/mock.ts`）で動作。Supabase接続はまだなし
- 画像はネット不要（体感タグ色のグラデーション + Tシャツアイコンのプレースホルダー）
- 広告は `AdCard` コンポーネントのモック。AdSense導入時はこのコンポーネントだけ差し替える
- Creatorプランは `compose` ページ内のモックトグルでUI出し分けを確認できる
- Supabaseのテーブル設計は `supabase/schema.sql`（フェーズ2でそのまま適用する）

## URL

| パス | 内容 |
|---|---|
| `/` | トップ（今日の服装フィード） |
| `/locations/tokyo` | 都市ページ（SEO: 「東京 今日の服装」） |
| `/locations/tokyo/shibuya` | エリアページ（SEO: 「渋谷 今日の服装」） |
| `/posts/[postId]` | 投稿詳細 |
| `/compose` | 投稿作成 |
| `/login` | ログイン（モックUI） |
| `/me` | マイページ |
| `/creator` | Creatorプラン |
| `/saved` | 保存 |
| `/map` | 地図風ページ |

## 次のフェーズ

1. Supabase接続（Auth / DB / Storage）— schema.sqlを適用し、mock.tsをリポジトリ層に置き換え
2. 実写真アップロード（EXIF除去）
3. Open-Meteoで天気の実取得
4. Stripe（Creatorプラン課金）
5. AdSense差し替え
