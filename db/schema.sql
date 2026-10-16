-- Daffodils Public School website. Safe to run more than once (npm run db:migrate).
-- Works on Neon Postgres (free tier) and any Postgres 14+.

-- Website text and contact details, one row.
create table if not exists site_settings (
  id         int primary key default 1 check (id = 1),
  data       jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);
insert into site_settings (id) values (1) on conflict do nothing;

-- Class 10 (SEE) batches, one row per B.S. year.
create table if not exists batches (
  year       int primary key check (year between 2060 and 2150),
  visible    boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists batch_students (
  id         bigserial primary key,
  year       int not null references batches(year) on delete cascade,
  name       text not null check (char_length(name) between 2 and 80),
  gpa        numeric(3,2) not null check (gpa >= 0 and gpa <= 4),
  now_doing  text check (now_doing is null or char_length(now_doing) <= 80),
  photo_url  text,
  photo_id   text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists batch_students_year_gpa on batch_students (year, gpa desc, name);

-- Featured students (achievements). At most 10 active, enforced below.
create table if not exists highlights (
  id          bigserial primary key,
  name        text not null check (char_length(name) between 2 and 80),
  grade       text not null check (char_length(grade) between 1 and 30),
  achievement text not null check (char_length(achievement) between 2 and 240),
  category    text not null check (category in ('Academics', 'Sports', 'Arts', 'Beyond school')),
  photo_url   text,
  photo_id    text,
  sort_order  int not null default 0,
  active      boolean not null default true,
  created_at  timestamptz not null default now()
);

create or replace function enforce_max_active_highlights() returns trigger as $$
begin
  if new.active and (
    select count(*) from highlights where active and id is distinct from new.id
  ) >= 10 then
    raise exception 'MAX_HIGHLIGHTS';
  end if;
  return new;
end;
$$ language plpgsql;

drop trigger if exists highlights_max_active on highlights;
create trigger highlights_max_active
  before insert or update on highlights
  for each row execute function enforce_max_active_highlights();

create table if not exists sports (
  id         bigserial primary key,
  name       text not null check (char_length(name) between 2 and 40),
  photo_url  text,
  photo_id   text,
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists gallery_photos (
  id         bigserial primary key,
  caption    text check (caption is null or char_length(caption) <= 120),
  category   text not null check (category in ('Campus', 'Events', 'Sports', 'Celebrations', 'Classroom')),
  photo_url  text not null,
  photo_id   text,
  created_at timestamptz not null default now()
);
create index if not exists gallery_photos_created on gallery_photos (created_at desc);

create table if not exists news (
  id        bigserial primary key,
  title     text not null check (char_length(title) between 3 and 140),
  summary   text not null check (char_length(summary) between 3 and 400),
  published date not null default current_date,
  visible   boolean not null default true
);

create table if not exists inquiries (
  id          bigserial primary key,
  parent_name text not null,
  phone       text not null,
  grade       text not null,
  message     text not null default '',
  status      text not null default 'new' check (status in ('new', 'contacted', 'visited', 'admitted', 'closed')),
  ip_hash     text,
  created_at  timestamptz not null default now()
);
create index if not exists inquiries_created on inquiries (created_at desc);
create index if not exists inquiries_ip on inquiries (ip_hash, created_at);

-- Admin accounts (admin subdomain only).
create table if not exists admin_users (
  id              bigserial primary key,
  username        text not null,
  display_name    text not null,
  password_hash   text not null,
  role            text not null default 'editor' check (role in ('owner', 'editor')),
  active          boolean not null default true,
  session_version int not null default 1,
  last_login_at   timestamptz,
  created_at      timestamptz not null default now()
);
create unique index if not exists admin_users_username on admin_users (lower(username));

create table if not exists login_attempts (
  id  bigserial primary key,
  key text not null,
  at  timestamptz not null default now()
);
create index if not exists login_attempts_key_at on login_attempts (key, at);

create table if not exists activity_log (
  id      bigserial primary key,
  user_id bigint references admin_users(id) on delete set null,
  who     text not null,
  action  text not null,
  at      timestamptz not null default now()
);
create index if not exists activity_log_at on activity_log (at desc);
