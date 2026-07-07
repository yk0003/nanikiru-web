-- NANIKIRU Supabase スキーマ（フェーズ2で適用）
-- 原則:
--  1. 正確な位置情報は保存しない。投稿はarea_idのみ（GPS→最寄りエリア変換は端末/クライアントで行い、座標は破棄）
--  2. 本文URLは禁止。商品リンクは item_links テーブルにのみ保存
--  3. item_links の作成は Creator（creator_subscriptions が active）のみ

-- ユーザープロフィール（auth.users と1:1）
create table profiles (
  id uuid primary key references auth.users on delete cascade,
  handle text unique not null,
  display_name text not null,
  avatar_url text,
  bio text,
  home_area_id uuid,
  cold_sensitivity int not null default 3 check (cold_sensitivity between 1 and 5),
  plan text not null default 'free' check (plan in ('free', 'creator')),
  created_at timestamptz not null default now()
);

-- エリア（都市・エリアの2階層。中心座標のみ持つ）
create table areas (
  id uuid primary key default gen_random_uuid(),
  country text not null,
  city_slug text not null,
  city_name text not null,
  slug text not null,
  name text not null,
  display_name text not null,
  center_lat double precision,
  center_lng double precision,
  is_popular boolean not null default false,
  is_travel_popular boolean not null default false,
  aliases text[] not null default '{}',
  unique (city_slug, slug)
);

-- 投稿（天気は投稿時点のスナップショットを非正規化して保持）
create table posts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references profiles on delete cascade,
  area_id uuid not null references areas,
  photo_url text not null,
  time_of_day text not null check (time_of_day in ('morning', 'daytime', 'night')),
  temp_c numeric not null,
  feels_like_c numeric not null,
  weather text not null check (weather in ('sunny', 'cloudy', 'rain', 'snow')),
  wind_mps numeric not null,
  humidity int not null,
  feel_tag text not null check (feel_tag in ('cold', 'slightly_cold', 'comfortable', 'slightly_hot', 'hot')),
  comment text not null check (comment !~* 'https?://'), -- 本文URL禁止
  status text not null default 'active' check (status in ('active', 'hidden', 'reported')),
  created_at timestamptz not null default now()
);
create index posts_area_created_idx on posts (area_id, created_at desc);
create index posts_user_temp_idx on posts (user_id, temp_c); -- プロフィールの気温別フィルター用

-- 服装タグ
create table post_tags (
  post_id uuid not null references posts on delete cascade,
  tag text not null,
  primary key (post_id, tag)
);

-- 商品リンク（Creatorのみ。RLSで posts.user_id の plan を検証）
create table item_links (
  id uuid primary key default gen_random_uuid(),
  post_id uuid not null references posts on delete cascade,
  title text not null,
  category text not null default 'その他',
  label text not null default '着用' check (label in ('着用', '似ている', 'おすすめ')),
  url text not null,
  is_affiliate boolean not null default true,
  click_count int not null default 0,
  position int not null default 0
);

-- 保存した投稿
create table saved_posts (
  user_id uuid not null references profiles on delete cascade,
  post_id uuid not null references posts on delete cascade,
  created_at timestamptz not null default now(),
  primary key (user_id, post_id)
);

-- お気に入り場所 / 旅行予定（kindで区別）
create table favorite_areas (
  user_id uuid not null references profiles on delete cascade,
  area_id uuid not null references areas on delete cascade,
  kind text not null default 'favorite' check (kind in ('favorite', 'travel')),
  created_at timestamptz not null default now(),
  primary key (user_id, area_id, kind)
);

-- フォロー
create table follows (
  follower_id uuid not null references profiles on delete cascade,
  followee_id uuid not null references profiles on delete cascade,
  created_at timestamptz not null default now(),
  primary key (follower_id, followee_id),
  check (follower_id <> followee_id)
);

-- 広告枠（配置ごとの設定。AdSense移行後もどの枠に何を出すかを管理）
create table ad_slots (
  id uuid primary key default gen_random_uuid(),
  placement text not null check (placement in ('home_feed', 'area_feed', 'post_detail_bottom', 'city_page_bottom')),
  provider text not null default 'mock' check (provider in ('mock', 'adsense')),
  every_n_posts int not null default 4,
  is_active boolean not null default true
);

-- Creatorプラン購読（Stripe連携）
create table creator_subscriptions (
  user_id uuid primary key references profiles on delete cascade,
  stripe_customer_id text,
  stripe_subscription_id text,
  status text not null default 'inactive' check (status in ('active', 'past_due', 'canceled', 'inactive')),
  current_period_end timestamptz,
  created_at timestamptz not null default now()
);

-- 天気キャッシュ（Open-Meteoから取得してエリア単位で保持）
create table weather_snapshots (
  area_id uuid not null references areas on delete cascade,
  fetched_at timestamptz not null default now(),
  temp_c numeric not null,
  feels_like_c numeric not null,
  weather text not null,
  wind_mps numeric not null,
  humidity int not null,
  primary key (area_id, fetched_at)
);

-- 通報・ブロック
create table reports (
  id uuid primary key default gen_random_uuid(),
  reporter_id uuid not null references profiles,
  post_id uuid references posts on delete cascade,
  reason text not null,
  created_at timestamptz not null default now()
);

create table blocks (
  blocker_id uuid not null references profiles on delete cascade,
  blocked_id uuid not null references profiles on delete cascade,
  created_at timestamptz not null default now(),
  primary key (blocker_id, blocked_id)
);

-- ============ RLS（要点のみ。適用時に詳細化） ============
alter table profiles enable row level security;
alter table posts enable row level security;
alter table item_links enable row level security;
alter table saved_posts enable row level security;
alter table favorite_areas enable row level security;
alter table follows enable row level security;

-- 閲覧は誰でも（activeな投稿のみ）
create policy "posts_read" on posts for select using (status = 'active');
-- 投稿は本人のみ
create policy "posts_write" on posts for insert with check (auth.uid() = user_id);
-- 商品リンクはCreatorのみ作成できる
create policy "item_links_read" on item_links for select using (true);
create policy "item_links_creator_only" on item_links for insert with check (
  exists (
    select 1 from posts p
    join profiles pr on pr.id = p.user_id
    where p.id = post_id and p.user_id = auth.uid() and pr.plan = 'creator'
  )
);
