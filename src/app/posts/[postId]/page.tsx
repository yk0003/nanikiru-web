import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AdBanner } from "@/components/AdCard";
import { ItemLinkCard } from "@/components/ItemLinkCard";
import { FeelChip, PhotoPlaceholder, PostCard } from "@/components/PostCard";
import { EnvChips } from "@/components/WeatherHeader";
import { ADS, POSTS, getPost, relatedPosts } from "@/lib/mock";

// 投稿詳細。主役は「この場所・この気温で、この服を着てどう感じたか」＝体感メモ。

type Props = { params: Promise<{ postId: string }> };

export function generateStaticParams() {
  return POSTS.map((post) => ({ postId: post.id }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { postId } = await params;
  const post = getPost(postId);
  if (!post) return {};
  return {
    title: `${post.areaName}の今日の服装（${Math.round(post.weather.tempC)}℃・${post.outfitTags.slice(0, 2).join("・")}）`,
    description: post.comment,
  };
}

export default async function PostDetailPage({ params }: Props) {
  const { postId } = await params;
  const post = getPost(postId);
  if (!post) notFound();

  const related = relatedPosts(post);

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <PhotoPlaceholder post={post} />

      {/* 投稿情報カード（投稿者 / 環境 / 体感メモ / 服装タグを1枚に） */}
      <div className="nk-card space-y-5 p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-sky/30 font-bold text-white">
              {post.userName.charAt(0)}
            </span>
            <div>
              <p className="text-sm font-semibold">
                {post.userName}
                {post.userIsCreator && <span className="ml-1 text-mint">✓</span>}
              </p>
              <p className="text-xs text-sub">
                <Link href={`/locations/${post.citySlug}/${post.areaSlug}`} className="hover:text-skydeep">
                  {post.cityName}・{post.areaName}
                </Link>{" "}
                ・ {post.time}
              </p>
            </div>
          </div>
          <button className="rounded-full bg-sky px-4 py-1.5 text-xs font-semibold text-white">
            フォロー
          </button>
        </div>

        <EnvChips weather={post.weather} />

        <hr className="border-cloud" />

        <div className="space-y-2">
          <FeelChip tag={post.feelTag} />
          <div className="rounded-xl bg-[#FDFAF2] p-4">
            <p className="mb-2 text-xs font-semibold text-sub">❝ 体感メモ</p>
            <p className="leading-relaxed">{post.comment}</p>
          </div>
        </div>

        <hr className="border-cloud" />

        <div className="flex flex-wrap gap-2">
          {post.outfitTags.map((tag) => (
            <span key={tag} className="nk-chip bg-cloud text-sub">
              {tag}
            </span>
          ))}
        </div>
      </div>

      {/* Creator投稿: 着用アイテム欄を最優先し、広告は出さない */}
      {post.userIsCreator && post.itemLinks.length > 0 ? (
        <div className="nk-card space-y-3 p-6">
          <h2 className="font-bold">着用アイテム</h2>
          <p className="text-xs text-sub">※ PR・アフィリエイトリンクが含まれる場合があります</p>
          {post.itemLinks.map((link) => (
            <ItemLinkCard key={link.id} link={link} />
          ))}
        </div>
      ) : (
        <AdBanner ad={ADS[0]} />
      )}

      {/* 関連投稿 */}
      {related.length > 0 && (
        <section>
          <h2 className="mb-3 font-bold">{post.cityName}の他の投稿</h2>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            {related.map((p) => (
              <PostCard key={p.id} post={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
