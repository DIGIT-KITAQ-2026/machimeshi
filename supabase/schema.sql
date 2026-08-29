-- ============================================================
-- まちめし: Supabase スキーマ定義
--
-- specifications/DBs.md のテーブル定義に、RLS（Row Level Security）ポリシーと
-- 新規ユーザー登録時に public.users 行を自動作成するトリガーを加えたもの。
--
-- 使い方: Supabaseダッシュボード > SQL Editor に貼り付けて実行するだけ。
-- 手順の全体像は supabase/README.md を参照してください。
-- ============================================================

-- gen_random_uuid() を使うために pgcrypto 拡張を有効化（Supabaseでは通常デフォルトで有効）
create extension if not exists pgcrypto;

-- ------------------------------------------------------------
-- テーブル定義（specifications/DBs.md 準拠）
-- ------------------------------------------------------------

create table if not exists public.stores (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text,
  address text,
  phone text,
  website_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  open_time time,
  close_time time,
  star numeric,
  price_min numeric,
  price_max numeric,
  store_images text[],
  genres text[],
  table_amount integer,
  counter_amount integer,
  id_generating text not null default 'increment'
    check (id_generating in ('increment', 'manual'))
);

create table if not exists public.users (
  id uuid primary key references auth.users (id) on delete cascade,
  created_at timestamptz not null default now(),
  store_id uuid references public.stores (id) on delete set null
);

create table if not exists public.visits (
  id uuid primary key default gen_random_uuid(),
  store_id uuid not null references public.stores (id) on delete cascade,
  group_id integer not null,
  seat_type text not null check (seat_type in ('table', 'counter')),
  people_count integer not null,
  entered_at timestamptz not null default now(),
  exited_at timestamptz,
  created_at timestamptz not null default now()
);

-- 同一店舗内で未退店のgroup_idの重複を防止（DBs.md記載の制約）
create unique index if not exists visits_active_group_id_unique
  on public.visits (store_id, group_id)
  where exited_at is null;

create table if not exists public.search_history (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users (id) on delete cascade,
  query_text text not null,
  created_at timestamptz not null default now()
);

-- ------------------------------------------------------------
-- 新規ユーザー登録時（匿名認証・メール認証のどちらでも）に
-- public.users 行を自動で作成するトリガー。
-- 一般ユーザー（匿名）はstore_idがNULLのまま、店舗登録者は登録後にアプリ側から
-- store_idを自分のstoreのidへ更新する想定（specifications/DBs.md参照）。
-- ------------------------------------------------------------

create or replace function public.handle_new_auth_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.users (id) values (new.id)
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_auth_user();

-- ------------------------------------------------------------
-- RLS（Row Level Security）
-- ------------------------------------------------------------

alter table public.stores enable row level security;
alter table public.users enable row level security;
alter table public.visits enable row level security;
alter table public.search_history enable row level security;

-- stores: 検索機能で誰でも閲覧できる必要があるためSELECTは全員可。
-- 新規作成は「匿名ではない認証済みユーザー（店舗登録者）」のみ。
-- 更新は、public.users経由でそのstoreの管理者だと確認できた本人のみ。
-- （drop policy if existsを前置し、このファイル全体を何度再実行しても安全にしている）
drop policy if exists "stores_select_all" on public.stores;
create policy "stores_select_all" on public.stores
  for select using (true);

drop policy if exists "stores_insert_authenticated" on public.stores;
create policy "stores_insert_authenticated" on public.stores
  for insert to authenticated
  with check (coalesce((auth.jwt() ->> 'is_anonymous')::boolean, false) = false);

drop policy if exists "stores_update_owner" on public.stores;
create policy "stores_update_owner" on public.stores
  for update using (
    exists (
      select 1 from public.users u
      where u.id = auth.uid() and u.store_id = stores.id
    )
  );

-- users: 本人の行のみ閲覧・更新可。
-- （store_idへの紐付けは、店舗登録直後にアプリから本人が自分の行を更新する）
drop policy if exists "users_select_own" on public.users;
create policy "users_select_own" on public.users
  for select using (id = auth.uid());

drop policy if exists "users_update_own" on public.users;
create policy "users_update_own" on public.users
  for update using (id = auth.uid())
  with check (id = auth.uid());

-- visits: 個人情報を含まないため、待ち時間予測のためにSELECTは誰でも可。
-- 入店・退店（INSERT/UPDATE）は当該店舗の管理者のみ。
drop policy if exists "visits_select_all" on public.visits;
create policy "visits_select_all" on public.visits
  for select using (true);

drop policy if exists "visits_insert_owner" on public.visits;
create policy "visits_insert_owner" on public.visits
  for insert with check (
    exists (
      select 1 from public.users u
      where u.id = auth.uid() and u.store_id = visits.store_id
    )
  );

drop policy if exists "visits_update_owner" on public.visits;
create policy "visits_update_owner" on public.visits
  for update using (
    exists (
      select 1 from public.users u
      where u.id = auth.uid() and u.store_id = visits.store_id
    )
  );

-- search_history: 本人の検索履歴のみ閲覧・追加可（おすすめ検索機能で使用）
drop policy if exists "search_history_select_own" on public.search_history;
create policy "search_history_select_own" on public.search_history
  for select using (user_id = auth.uid());

drop policy if exists "search_history_insert_own" on public.search_history;
create policy "search_history_insert_own" on public.search_history
  for insert with check (user_id = auth.uid());

-- ------------------------------------------------------------
-- 店舗画像の複数枚対応（Supabase Storage）
--
-- 以前は store_img text（単一URL）だったが、複数枚の画像に対応するため
-- store_images text[] に置き換える。実ファイルはSupabase Storageの
-- 公開バケット`store-images`に保存し、DBにはその公開URLだけを配列で持つ。
--
-- このセクションはすべて冪等（何度再実行しても安全）なので、
-- 既にschema.sqlを一度実行済みのプロジェクトでも、このファイル全体を
-- そのまま再実行するだけで反映される。
-- ------------------------------------------------------------

-- store_img（単一URL）が残っていれば削除し、store_images（配列）を用意する
alter table public.stores drop column if exists store_img;
alter table public.stores add column if not exists store_images text[];

-- 店舗画像用の公開バケット（画像のみ・8MBまで）
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'store-images',
  'store-images',
  true,
  8388608,
  array['image/png', 'image/jpeg', 'image/webp', 'image/gif']
)
on conflict (id) do nothing;

-- ファイルパスは "<store_id>/<uuid>.<拡張子>" という想定（storage/storageService.ts参照）。
-- 閲覧は誰でも可（バケット自体が公開のため実質不要だが念のため）。
-- 追加・削除は、そのstore_idを持つ店舗の管理者のみ許可する。
drop policy if exists "store_images_select_all" on storage.objects;
create policy "store_images_select_all" on storage.objects
  for select using (bucket_id = 'store-images');

drop policy if exists "store_images_insert_owner" on storage.objects;
create policy "store_images_insert_owner" on storage.objects
  for insert to authenticated
  with check (
    bucket_id = 'store-images'
    and exists (
      select 1 from public.users u
      where u.id = auth.uid() and u.store_id::text = (storage.foldername(name))[1]
    )
  );

drop policy if exists "store_images_delete_owner" on storage.objects;
create policy "store_images_delete_owner" on storage.objects
  for delete using (
    bucket_id = 'store-images'
    and exists (
      select 1 from public.users u
      where u.id = auth.uid() and u.store_id::text = (storage.foldername(name))[1]
    )
  );
