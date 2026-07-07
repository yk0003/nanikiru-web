-- ============================================================
-- NANIKIRU フェーズ5: posts / post_tags テーブル + RLS + seed
-- Supabase SQL Editor にこのファイル全体を貼り付けて実行する
-- ============================================================

-- ---------- posts ----------
create table if not exists posts (
  id text primary key,                    -- mockと同じid（p1..）。Auth導入時にuuidへ移行予定
  user_id text,                           -- Auth未導入のためtext/nullable。導入後にuuid化
  author_name text not null,
  author_avatar_url text,
  author_is_creator boolean not null default false, -- Creatorバッジ・着用アイテム欄の表示判定
  city_slug text not null,
  area_slug text,
  image_url text,
  feeling text not null check (feeling in
    ('cold','slightly_cold','comfortable','slightly_hot','hot')),
  comment text check (comment !~* 'https?://'),  -- 本文URL禁止
  temperature integer,
  feels_like integer,
  weather text check (weather in ('sunny','cloudy','rain','snow')),
  weather_emoji text,
  wind_speed double precision,
  humidity integer,
  weather_source text not null default 'mock'
    check (weather_source in ('open-meteo','mock','manual')),
  posted_at timestamptz not null,
  created_at timestamptz not null default now()
);
create index if not exists posts_area_idx on posts (city_slug, area_slug, posted_at desc);

-- ---------- post_tags ----------
create table if not exists post_tags (
  id uuid primary key default gen_random_uuid(),
  post_id text not null references posts(id) on delete cascade,
  tag text not null,
  created_at timestamptz not null default now(),
  unique (post_id, tag)
);

-- ---------- RLS（読み取りのみ公開。書き込みポリシーなし = SQL Editor/service_roleのみ） ----------
alter table posts enable row level security;
alter table post_tags enable row level security;

drop policy if exists "posts_read" on posts;
create policy "posts_read" on posts for select using (true);

drop policy if exists "post_tags_read" on post_tags;
create policy "post_tags_read" on post_tags for select using (true);

-- ---------- seedヘルパー: 実行日のJST日付 + 指定時刻 のtimestamptzを返す ----------
create or replace function jst_today(t time) returns timestamptz
language sql stable as $$
  select ((now() at time zone 'Asia/Tokyo')::date + t) at time zone 'Asia/Tokyo'
$$;

-- ---------- seed（mockの12投稿。再実行しても安全） ----------
truncate table posts cascade;

insert into posts
  (id, author_name, author_is_creator, city_slug, area_slug, feeling, comment,
   temperature, feels_like, weather, weather_emoji, wind_speed, humidity, weather_source, posted_at)
values
  ('p1',  'Yui',  false, 'tokyo', 'shibuya',       'slightly_hot', '半袖でちょうどいいけど、室内は冷房で少し寒い。羽織りをカバンに入れて正解。',
   29, 32, 'sunny',  '☀️', 3, 68, 'mock', jst_today('12:30')),
  ('p2',  'Rin',  false, 'tokyo', 'omotesando',    'hot',          'ノースリーブにスカートで正解。日陰なら快適です。',
   30, 33, 'sunny',  '☀️', 2, 64, 'mock', jst_today('11:45')),
  ('p3',  'Ken',  false, 'tokyo', 'shinjuku',      'comfortable',  '半袖に薄手シャツを羽織って出勤。朝はこれでちょうどいい。',
   27, 29, 'sunny',  '☀️', 3, 70, 'mock', jst_today('09:20')),
  ('p4',  'Mika', true,  'tokyo', 'ginza',         'comfortable',  '朝はこれでOK。昼は日差しが強いので帽子があると安心です。',
   27, 30, 'sunny',  '☀️', 2, 70, 'mock', jst_today('10:15')),
  ('p5',  'Yui',  false, 'tokyo', 'daikanyama',    'slightly_cold', '日が落ちると少し涼しい。半袖＋カーディガンでちょうどよかった。',
   26, 26, 'cloudy', '☁️', 4, 72, 'mock', jst_today('18:40')),
  ('p6',  'Rin',  false, 'tokyo', 'harajuku',      'hot',          'Tシャツにショートパンツ。日なたはかなり暑いので水分必須！',
   31, 34, 'sunny',  '☀️', 2, 62, 'mock', jst_today('15:00')),
  ('p7',  'Taro', false, 'tokyo', 'ebisu',         'slightly_cold', '夜は風が出て少し肌寒い。薄手ジャケットがあってよかった。',
   25, 25, 'cloudy', '☁️', 5, 74, 'mock', jst_today('20:15')),
  ('p8',  'Ken',  false, 'tokyo', 'tokyo-station', 'comfortable',  '出張前に。朝はシャツ1枚でちょうどいいです。',
   26, 28, 'sunny',  '☀️', 3, 72, 'mock', jst_today('08:40')),
  ('p9',  'Mika', true,  'tokyo', 'omotesando',    'hot',          '日なたはかなり暑い。日陰を歩くルートがおすすめ。ワンピース＋サンダルで正解でした。',
   30, 33, 'sunny',  '☀️', 2, 65, 'mock', jst_today('15:00')),
  ('p10', 'Yui',  false, 'tokyo', 'shibuya',       'slightly_hot', '雨だけど蒸し暑い。長袖は少し暑いと思います。折りたたみ傘必須。',
   25, 26, 'rain',   '🌧', 6, 88, 'mock', jst_today('08:20')),
  ('p11', 'Sora', true,  'seoul', 'myeongdong',    'comfortable',  '曇りで歩きやすい。旅行なら半袖＋薄手の羽織りで十分です。',
   27, 29, 'cloudy', '☁️', 5, 72, 'mock', jst_today('13:10')),
  ('p12', 'Sora', true,  'seoul', 'hongdae',       'slightly_cold', '夜は風が強くて半袖だと少し肌寒い。薄手の長袖がちょうどいいです。',
   24, 24, 'cloudy', '☁️', 6, 70, 'mock', jst_today('21:00'));

insert into post_tags (post_id, tag) values
  ('p1','半袖'),('p1','パンツ'),('p1','スニーカー'),('p1','帽子あり'),
  ('p2','半袖'),('p2','スカート'),('p2','サンダル'),
  ('p3','半袖'),('p3','シャツ'),('p3','スニーカー'),
  ('p4','半袖'),('p4','スカート'),('p4','サンダル'),
  ('p5','半袖'),('p5','ニット'),('p5','パンツ'),
  ('p6','半袖'),('p6','パンツ'),('p6','スニーカー'),('p6','帽子あり'),
  ('p7','長袖'),('p7','ジャケット'),('p7','パンツ'),
  ('p8','シャツ'),('p8','パンツ'),('p8','スニーカー'),
  ('p9','ワンピース'),('p9','サンダル'),('p9','帽子あり'),
  ('p10','半袖'),('p10','パンツ'),('p10','傘あり'),
  ('p11','半袖'),('p11','パンツ'),('p11','スニーカー'),
  ('p12','長袖'),('p12','パンツ'),('p12','スニーカー');

-- 確認用:
--   select count(*) from posts;      → 12
--   select count(*) from post_tags;  → 37
