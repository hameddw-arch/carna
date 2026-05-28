-- ═══════════════════════════════════════════════════
-- CARNA — Database Schema
-- شغّله في Supabase → SQL Editor → New query
-- ═══════════════════════════════════════════════════

-- ── Extensions ───────────────────────────────────
create extension if not exists "uuid-ossp";

-- ── Users ─────────────────────────────────────────
create table users (
  id            uuid primary key default uuid_generate_v4(),
  phone         text unique not null,
  name          text,
  avatar_url    text,
  verified      boolean default false,
  wallet_balance integer default 0,
  is_admin      boolean default false,
  created_at    timestamptz default now()
);

-- ── Service Categories ────────────────────────────
create table service_categories (
  id   serial primary key,
  name text not null
);

insert into service_categories (name) values
  ('ميكانيك'),
  ('كهرباء وبرمجة'),
  ('تجليس ودهان'),
  ('عناية سريعة'),
  ('فحص فني');

-- ── Services (Workshops) ──────────────────────────
create table services (
  id          uuid primary key default uuid_generate_v4(),
  name        text not null,
  category_id integer references service_categories(id),
  city        text not null,
  phone       text,
  description text,
  verified    boolean default false,
  inspection  boolean default false,
  rating      numeric(2,1) default 0,
  created_at  timestamptz default now()
);

-- ── Listings ──────────────────────────────────────
create table listings (
  id          uuid primary key default uuid_generate_v4(),
  user_id     uuid references users(id) on delete cascade,
  title       text not null,
  description text,
  price       integer not null,
  city        text not null,
  make        text,
  model       text,
  year        integer,
  km          integer,
  fuel        text,
  transmission text,
  color       text,
  status      text default 'pending' check (status in ('pending','active','rejected','expired','sold')),
  views       integer default 0,
  created_at  timestamptz default now()
);

-- ── Listing Images ────────────────────────────────
create table listing_images (
  id         uuid primary key default uuid_generate_v4(),
  listing_id uuid references listings(id) on delete cascade,
  url        text not null,
  "order"    integer default 0
);

-- ── Listing Tags ──────────────────────────────────
create table listing_tags (
  id         uuid primary key default uuid_generate_v4(),
  listing_id uuid references listings(id) on delete cascade,
  tag        text not null
);

-- ── Messages ──────────────────────────────────────
create table messages (
  id          uuid primary key default uuid_generate_v4(),
  sender_id   uuid references users(id) on delete cascade,
  receiver_id uuid references users(id) on delete cascade,
  listing_id  uuid references listings(id) on delete set null,
  body        text not null,
  read_at     timestamptz,
  created_at  timestamptz default now()
);

-- ── Notifications ─────────────────────────────────
create table notifications (
  id         uuid primary key default uuid_generate_v4(),
  user_id    uuid references users(id) on delete cascade,
  type       text not null,
  payload    jsonb default '{}',
  read_at    timestamptz,
  created_at timestamptz default now()
);

-- ── Ad Packages ───────────────────────────────────
create table ad_packages (
  id            serial primary key,
  name          text not null,
  price         integer not null,
  duration_days integer not null,
  features      jsonb default '{}'
);

insert into ad_packages (name, price, duration_days, features) values
  ('أساسي',   0,      7,  '{"featured": false}'),
  ('مميز',    500000, 14, '{"featured": true, "highlight": false}'),
  ('بريميوم', 900000, 30, '{"featured": true, "highlight": true, "top": true}');

-- ── Featured Listings ─────────────────────────────
create table featured_listings (
  id         uuid primary key default uuid_generate_v4(),
  listing_id uuid references listings(id) on delete cascade,
  package_id integer references ad_packages(id),
  starts_at  timestamptz default now(),
  ends_at    timestamptz not null
);

-- ── Wallet Transactions ───────────────────────────
create table wallet_transactions (
  id         uuid primary key default uuid_generate_v4(),
  user_id    uuid references users(id) on delete cascade,
  amount     integer not null,
  type       text check (type in ('credit','debit')),
  method     text,
  ref        text,
  created_at timestamptz default now()
);

-- ── OTP Codes ─────────────────────────────────────
create table otp_codes (
  id         uuid primary key default uuid_generate_v4(),
  phone      text not null,
  code       text not null,
  expires_at timestamptz not null,
  used       boolean default false,
  created_at timestamptz default now()
);

-- ── Legal Agreements ──────────────────────────────
create table legal_agreements (
  id         uuid primary key default uuid_generate_v4(),
  user_id    uuid references users(id) on delete cascade,
  version    text not null,
  agreed_at  timestamptz default now()
);

-- ═══════════════════════════════════════════════════
-- RLS POLICIES
-- ═══════════════════════════════════════════════════

alter table users               enable row level security;
alter table listings            enable row level security;
alter table listing_images      enable row level security;
alter table listing_tags        enable row level security;
alter table messages            enable row level security;
alter table notifications       enable row level security;
alter table wallet_transactions enable row level security;
alter table otp_codes           enable row level security;
alter table legal_agreements    enable row level security;
alter table services            enable row level security;
alter table featured_listings   enable row level security;

-- Listings: anyone can read active listings
create policy "listings_public_read"
  on listings for select
  using (status = 'active');

-- Listing images: public read
create policy "images_public_read"
  on listing_images for select
  using (true);

-- Listing tags: public read
create policy "tags_public_read"
  on listing_tags for select
  using (true);

-- Services: public read
create policy "services_public_read"
  on services for select
  using (true);

-- Featured listings: public read
create policy "featured_public_read"
  on featured_listings for select
  using (true);

-- Ad packages: public read
-- (no RLS needed — public table)

-- ═══════════════════════════════════════════════════
-- INDEXES (للأداء)
-- ═══════════════════════════════════════════════════

create index idx_listings_status   on listings(status);
create index idx_listings_city     on listings(city);
create index idx_listings_make     on listings(make);
create index idx_listings_created  on listings(created_at desc);
create index idx_listing_tags_tag  on listing_tags(tag);
create index idx_messages_receiver on messages(receiver_id);

-- ═══════════════════════════════════════════════════
-- SAMPLE DATA (اختياري — للاختبار)
-- ═══════════════════════════════════════════════════

-- insert into services (name, category_id, city, verified, inspection, rating) values
--   ('ورشة أبو علي للميكانيك',      1, 'دمشق', true,  false, 4.9),
--   ('مركز الشام للكهرباء والبرمجة', 2, 'دمشق', true,  false, 4.7),
--   ('مركز الفحص الفني المعتمد',     5, 'دمشق', true,  true,  4.8),
--   ('مركز حلب للفحص الفني',         5, 'حلب',  true,  true,  4.7);
