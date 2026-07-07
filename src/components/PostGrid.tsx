import { interleaveAds } from "@/lib/ads";
import type { Post } from "@/lib/types";
import { AdCard } from "./AdCard";
import { PostCard } from "./PostCard";

/** 投稿グリッド（広告を数件ごとに自然に混ぜる） */
export function PostGrid({ posts, showsAds = true }: { posts: Post[]; showsAds?: boolean }) {
  const items = interleaveAds(posts, 4, showsAds);
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
      {items.map((item, index) =>
        item.kind === "post" ? (
          <PostCard key={`post-${item.post.id}`} post={item.post} />
        ) : (
          <AdCard key={`ad-${index}`} ad={item.ad} />
        )
      )}
    </div>
  );
}
