"use client";

import Link from "next/link";
import { useState, useTransition } from "react";
import { createPost } from "@/app/compose/actions";
import { AreaSearch, type AreaSelection } from "@/components/AreaSearch";
import { Chip, ChipGroup } from "@/components/ChipGroup";
import { ItemLinkCard } from "@/components/ItemLinkCard";
import { WeatherMiniCard } from "@/components/WeatherMiniCard";
import { CITIES } from "@/lib/mock";
import { FEEL_TAGS, type FeelTag, type ItemLink } from "@/lib/types";

// 投稿作成フォーム本体。「今日の服装メモを残す」感覚で30秒で投稿できることを目指す。
// canPost=true（ログイン済み+Supabase接続済み）ならServer Action経由でDB保存し、
// 成功時はそのエリアページへ遷移する。canPost=falseは従来のモック動作。
// 写真アップロードはフェーズ8（Storage）で対応（現在は体感タグ色のプレースホルダー）。

const OUTFIT_TAGS = [
  "半袖", "長袖", "シャツ", "ジャケット", "コート", "ニット",
  "パンツ", "スカート", "ワンピース", "スニーカー", "サンダル", "ブーツ",
  "傘あり", "帽子あり",
];

function SectionCard({ title, children }: { title?: string; children: React.ReactNode }) {
  return (
    <section className="nk-card space-y-3 p-5">
      {title && <p className="text-sm font-bold">{title}</p>}
      {children}
    </section>
  );
}

export function PostComposer({
  initialArea,
  canPost = false,
}: {
  initialArea: AreaSelection;
  canPost?: boolean;
}) {
  const [photoAdded, setPhotoAdded] = useState(false);
  const [area, setArea] = useState<AreaSelection>(initialArea);
  const [feel, setFeel] = useState<FeelTag>("comfortable");
  const [tags, setTags] = useState<Set<string>>(new Set());
  const [comment, setComment] = useState("");
  const [isCreator, setIsCreator] = useState(false); // モック: Creator表示の切り替え
  const [links, setLinks] = useState<ItemLink[]>([]);
  const [linkTitle, setLinkTitle] = useState("");
  const [linkUrl, setLinkUrl] = useState("");
  const [linkCategory, setLinkCategory] = useState("");
  const [linkLabel, setLinkLabel] = useState("着用");
  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  // 選択エリアの天気（未登録エリアは東京の天気を仮表示）
  const weather = (CITIES.find((c) => c.slug === area.citySlug) ?? CITIES[0]).weather;

  const toggleTag = (tag: string) => {
    const next = new Set(tags);
    if (next.has(tag)) next.delete(tag);
    else next.add(tag);
    setTags(next);
  };

  const canAddLink = linkTitle.trim() !== "" && linkUrl.startsWith("http");

  const addLink = () => {
    if (!canAddLink) return;
    setLinks([
      ...links,
      {
        id: `new-${Date.now()}`,
        title: linkTitle.trim(),
        category: linkCategory.trim() || "その他",
        label: linkLabel,
        url: linkUrl.trim(),
        isAffiliate: true,
        clickCount: 0,
      },
    ]);
    setLinkTitle("");
    setLinkUrl("");
    setLinkCategory("");
    setLinkLabel("着用");
  };

  // 投稿処理: canPost=true → Server ActionでDB保存（成功時はエリアページへredirectされる）
  //           canPost=false → 従来のモック完了表示
  function handleSubmit() {
    if (!photoAdded || pending) return;

    if (!canPost) {
      setSubmitted(true);
      return;
    }

    // クライアント側の事前チェック（Server Action側でも再検証される）
    if (/https?:\/\//i.test(comment)) {
      setSubmitError(
        "本文にURLは入れられません。商品リンクはCreatorプランのアイテムリンク欄で追加できます。"
      );
      return;
    }
    if (area.citySlug === "custom") {
      setSubmitError("候補にあるエリアを選んでください（新しいエリアの登録は準備中です）。");
      return;
    }

    setSubmitError(null);
    startTransition(async () => {
      const result = await createPost({
        citySlug: area.citySlug,
        areaSlug: area.areaSlug,
        feeling: feel,
        comment,
        tags: [...tags],
      });
      // 成功時はredirectされるため、ここに来るのはエラー時のみ
      if (result?.error) setSubmitError(result.error);
    });
  }

  if (submitted) {
    return (
      <div className="nk-card mx-auto max-w-xl p-12 text-center">
        <p className="text-4xl">👕</p>
        <p className="mt-4 text-xl font-bold">投稿できました</p>
        <p className="mt-2 text-sm text-sub">
          {area.displayName}の今日の服装として共有されます。
          <br />
          （MVPのため実保存はフェーズ2で対応します）
        </p>
        <Link
          href="/"
          className="mt-6 inline-block rounded-xl bg-sky px-8 py-3 font-bold text-white"
        >
          トップへ戻る
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl space-y-5">
      {/* タイトル */}
      <div>
        <h1 className="text-2xl font-bold">今日の服装を投稿</h1>
        <p className="mt-1 text-sm text-sub">
          その場所・その時間のリアルな服装が、誰かの「今日なに着る？」の参考になります。
        </p>
      </div>

      {/* 1. 写真 */}
      <button
        type="button"
        onClick={() => setPhotoAdded(!photoAdded)}
        className={`flex h-56 w-full flex-col items-center justify-center gap-2 rounded-2xl transition ${
          photoAdded ? "text-white" : "border-2 border-dashed border-sky/40 bg-cloud"
        }`}
        style={
          photoAdded
            ? {
                background: `linear-gradient(to bottom, ${FEEL_TAGS[feel].bg}, ${FEEL_TAGS[feel].fg}99)`,
              }
            : undefined
        }
      >
        {photoAdded ? (
          <>
            <span className="text-3xl">✓</span>
            <span className="text-sm font-semibold">写真を追加しました</span>
            <span className="text-xs opacity-80">タップで削除（モック）</span>
          </>
        ) : (
          <>
            <span className="text-3xl">📷</span>
            <span className="text-sm font-bold text-ink">今日の服装写真を追加</span>
            <span className="text-xs text-sub">全身がわかる写真がおすすめ</span>
          </>
        )}
      </button>

      {/* 2. 場所 */}
      <SectionCard title="場所（エリア単位）">
        <AreaSearch value={area} onChange={setArea} />
      </SectionCard>

      {/* 3. 天気 */}
      <SectionCard title="今日の天気（自動取得）">
        <WeatherMiniCard weather={weather} />
      </SectionCard>

      {/* 4. 体感 */}
      <SectionCard title="この服での体感">
        <ChipGroup>
          {(Object.keys(FEEL_TAGS) as FeelTag[]).map((f) => (
            <Chip
              key={f}
              selected={feel === f}
              onClick={() => setFeel(f)}
              selectedStyle={{
                color: FEEL_TAGS[f].fg,
                backgroundColor: FEEL_TAGS[f].bg,
                boxShadow: `inset 0 0 0 1.5px ${FEEL_TAGS[f].fg}99`,
              }}
            >
              {FEEL_TAGS[f].label}
            </Chip>
          ))}
        </ChipGroup>
      </SectionCard>

      {/* 5. 服装タグ */}
      <SectionCard title="服装タグ（複数選択できます）">
        <ChipGroup>
          {OUTFIT_TAGS.map((tag) => (
            <Chip key={tag} selected={tags.has(tag)} onClick={() => toggleTag(tag)}>
              {tag}
            </Chip>
          ))}
        </ChipGroup>
      </SectionCard>

      {/* 6. 体感コメント */}
      <SectionCard title="体感コメント">
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          rows={4}
          placeholder="この服でどうだった？ 例：昼は半袖でOK。でも夜は羽織りが欲しいかも。"
          className="w-full resize-y rounded-xl bg-cloud p-4 text-sm leading-relaxed outline-sky"
        />
        <p className="text-xs text-sub">
          本文にURLは貼れません。商品リンクは下の「アイテムリンク」欄から追加してください。
        </p>
      </SectionCard>

      {/* 7. アイテムリンク */}
      <SectionCard>
        <div className="flex items-center justify-between">
          <p className="text-sm font-bold">アイテムリンク {!isCreator && "🔒"}</p>
          <label className="flex cursor-pointer items-center gap-1.5 text-xs text-sub">
            <input
              type="checkbox"
              checked={isCreator}
              onChange={(e) => setIsCreator(e.target.checked)}
            />
            Creator表示（モック）
          </label>
        </div>

        {isCreator ? (
          <div className="space-y-3">
            {links.map((link) => (
              <ItemLinkCard key={link.id} link={link} />
            ))}
            <div className="grid gap-2 sm:grid-cols-2">
              <input
                value={linkTitle}
                onChange={(e) => setLinkTitle(e.target.value)}
                placeholder="商品名（例：リネンシャツ）"
                className="rounded-xl bg-cloud p-3 text-sm"
              />
              <input
                value={linkUrl}
                onChange={(e) => setLinkUrl(e.target.value)}
                placeholder="URL（https://…）"
                className="rounded-xl bg-cloud p-3 text-sm"
              />
              <input
                value={linkCategory}
                onChange={(e) => setLinkCategory(e.target.value)}
                placeholder="カテゴリ（例：トップス）"
                className="rounded-xl bg-cloud p-3 text-sm"
              />
              <div className="flex items-center gap-2">
                {["着用", "似ている", "おすすめ"].map((label) => (
                  <Chip key={label} selected={linkLabel === label} onClick={() => setLinkLabel(label)}>
                    {label}
                  </Chip>
                ))}
              </div>
            </div>
            <button
              type="button"
              onClick={addLink}
              disabled={!canAddLink}
              className="w-full rounded-xl bg-sky/15 py-2.5 text-sm font-semibold text-skydeep disabled:opacity-40"
            >
              ＋ リンクを追加
            </button>
            <p className="text-xs text-sub">PR・アフィリエイト表記は投稿に自動で挿入されます。</p>
          </div>
        ) : (
          <div className="rounded-xl bg-cloud p-5">
            <p className="text-sm font-semibold">商品リンクを追加するにはCreatorプランが必要です。</p>
            <p className="mt-1 text-xs text-sub">月980円で投稿に商品リンクを追加できます。</p>
            <Link
              href="/creator"
              className="mt-3 block rounded-xl bg-mint py-2.5 text-center text-sm font-bold text-white"
            >
              Creatorプランを見る
            </Link>
          </div>
        )}
      </SectionCard>

      {/* 8. 投稿ボタン */}
      <div className="pb-8">
        {submitError && (
          <p className="mb-3 rounded-xl bg-[#FAE7DA] p-3 text-sm text-[#B05A25]">{submitError}</p>
        )}
        <button
          type="button"
          onClick={handleSubmit}
          disabled={!photoAdded || pending}
          className="w-full rounded-2xl bg-sky py-4 text-lg font-bold text-white transition hover:opacity-90 disabled:opacity-40"
        >
          {pending ? "投稿中…" : "投稿する"}
        </button>
        {!photoAdded && (
          <p className="mt-2 text-center text-xs text-sub">写真を追加すると投稿できます</p>
        )}
      </div>
    </div>
  );
}
