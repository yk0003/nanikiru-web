-- ============================================================
-- NANIKIRU フェーズ4: locationsテーブル + RLS + seed
-- Supabase SQL Editor にこのファイル全体を貼り付けて実行する
-- ============================================================

-- ---------- テーブル ----------
create table if not exists locations (
  id uuid primary key default gen_random_uuid(),
  city_slug text not null,
  city_name text not null,
  area_slug text,          -- null = 都市行
  area_name text,
  display_name text not null, -- 例: 東京・渋谷 / 東京駅周辺（UIの表示名）
  country text not null,
  latitude double precision not null,   -- エリア代表点のみ（正確な住所は持たない）
  longitude double precision not null,
  is_area boolean generated always as (area_slug is not null) stored,
  is_popular boolean not null default false,
  is_travel_popular boolean not null default false,
  post_count integer not null default 0,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  unique nulls not distinct (city_slug, area_slug)
);

-- ---------- RLS ----------
alter table locations enable row level security;

-- 誰でも読める（anon含む）。書き込みポリシーは作らない = SQL Editor / service_roleのみ書ける
drop policy if exists "locations_read" on locations;
create policy "locations_read" on locations for select using (true);

-- ---------- seed（都市7 + エリア27） ----------
-- 再実行しても安全なように一度クリアしてから投入
truncate table locations;

insert into locations
  (city_slug, city_name, area_slug, area_name, display_name, country, latitude, longitude, is_popular, is_travel_popular, post_count, sort_order)
values
  -- ===== 都市 =====
  ('tokyo',    '東京',   null, null, '東京',   '日本',     35.6895, 139.6917, false, false, 128, 0),
  ('osaka',    '大阪',   null, null, '大阪',   '日本',     34.6937, 135.5023, false, false,  42, 100),
  ('kyoto',    '京都',   null, null, '京都',   '日本',     35.0116, 135.7681, false, false,  31, 200),
  ('seoul',    'ソウル', null, null, 'ソウル', '韓国',     37.5665, 126.9780, false, false,  86, 300),
  ('taipei',   '台北',   null, null, '台北',   '台湾',     25.0330, 121.5654, false, false,  38, 400),
  ('paris',    'パリ',   null, null, 'パリ',   'フランス', 48.8566,   2.3522, false, false,  33, 500),
  ('honolulu', 'ホノルル', null, null, 'ホノルル', 'アメリカ', 21.3069, -157.8583, false, false, 21, 600),

  -- ===== 東京のエリア =====
  ('tokyo', '東京', 'shibuya',       '渋谷',       '東京・渋谷',   '日本', 35.6595, 139.7005, true,  false, 24,  1),
  ('tokyo', '東京', 'shinjuku',      '新宿',       '東京・新宿',   '日本', 35.6896, 139.7006, true,  false, 18,  2),
  ('tokyo', '東京', 'ikebukuro',     '池袋',       '東京・池袋',   '日本', 35.7295, 139.7109, true,  false, 13,  3),
  ('tokyo', '東京', 'ginza',         '銀座',       '東京・銀座',   '日本', 35.6717, 139.7650, true,  false, 12,  4),
  ('tokyo', '東京', 'tokyo-station', '東京駅周辺', '東京駅周辺',   '日本', 35.6812, 139.7671, true,  false, 11,  5),
  ('tokyo', '東京', 'omotesando',    '表参道',     '東京・表参道', '日本', 35.6652, 139.7126, true,  false, 10,  6),
  ('tokyo', '東京', 'harajuku',      '原宿',       '東京・原宿',   '日本', 35.6702, 139.7026, true,  false,  9,  7),
  ('tokyo', '東京', 'roppongi',      '六本木',     '東京・六本木', '日本', 35.6627, 139.7314, true,  false,  9,  8),
  ('tokyo', '東京', 'asakusa',       '浅草',       '東京・浅草',   '日本', 35.7118, 139.7967, true,  false,  8,  9),
  ('tokyo', '東京', 'ebisu',         '恵比寿',     '東京・恵比寿', '日本', 35.6467, 139.7101, true,  false,  7, 10),
  ('tokyo', '東京', 'daikanyama',    '代官山',     '東京・代官山', '日本', 35.6485, 139.7031, true,  false,  6, 11),
  ('tokyo', '東京', 'ueno',          '上野',       '東京・上野',   '日本', 35.7141, 139.7774, true,  false,  6, 12),
  ('tokyo', '東京', 'nakameguro',    '中目黒',     '東京・中目黒', '日本', 35.6440, 139.6982, false, false,  0, 13),

  -- ===== 大阪のエリア =====
  ('osaka', '大阪', 'umeda',        '梅田',   '大阪・梅田',   '日本', 34.7055, 135.4983, false, false, 16, 101),
  ('osaka', '大阪', 'shinsaibashi', '心斎橋', '大阪・心斎橋', '日本', 34.6720, 135.5008, false, false, 14, 102),
  ('osaka', '大阪', 'namba',        '難波',   '大阪・難波',   '日本', 34.6659, 135.5013, false, false, 12, 103),

  -- ===== 京都のエリア =====
  ('kyoto', '京都', 'kawaramachi', '河原町', '京都・河原町', '日本', 35.0045, 135.7681, false, false, 14, 201),
  ('kyoto', '京都', 'gion',        '祇園',   '京都・祇園',   '日本', 35.0037, 135.7752, false, false, 11, 202),
  ('kyoto', '京都', 'arashiyama',  '嵐山',   '京都・嵐山',   '日本', 35.0094, 135.6668, false, false, 10, 203),

  -- ===== ソウルのエリア =====
  ('seoul', 'ソウル', 'myeongdong', '明洞', 'ソウル・明洞', '韓国', 37.5636, 126.9838, false, false, 42, 301),
  ('seoul', 'ソウル', 'hongdae',    '弘大', 'ソウル・弘大', '韓国', 37.5563, 126.9236, false, true,  31, 302),
  ('seoul', 'ソウル', 'gangnam',    '江南', 'ソウル・江南', '韓国', 37.4979, 127.0276, false, false, 25, 303),

  -- ===== 台北のエリア =====
  ('taipei', '台北', 'ximending', '西門町', '台北・西門町', '台湾', 25.0421, 121.5081, false, true,  19, 401),
  ('taipei', '台北', 'xinyi',     '信義',   '台北・信義',   '台湾', 25.0330, 121.5654, false, false, 13, 402),

  -- ===== パリのエリア =====
  ('paris', 'パリ', 'marais',        'マレ',           'パリ・マレ',           'フランス', 48.8566, 2.3622, false, true,  12, 501),
  ('paris', 'パリ', 'saint-germain', 'サンジェルマン', 'パリ・サンジェルマン', 'フランス', 48.8540, 2.3330, false, false,  7, 502),

  -- ===== ホノルルのエリア =====
  ('honolulu', 'ホノルル', 'waikiki', 'ワイキキ', 'ホノルル・ワイキキ', 'アメリカ', 21.2793, -157.8293, false, true, 21, 601);

-- 確認用: select count(*) from locations; → 34 になるはず
