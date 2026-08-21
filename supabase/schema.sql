create table if not exists public.projects (
  id text primary key,
  title text not null,
  description text not null,
  "imageUrl" text,
  "liveUrl" text,
  "githubUrl" text,
  "techStack" jsonb not null default '[]'::jsonb,
  discipline text not null default 'Full stack',
  "projectType" text not null default 'Personal project',
  tags jsonb not null default '[]'::jsonb,
  accent text not null default '#f59e0b',
  featured boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists public.blogs (
  id text primary key,
  slug text unique not null,
  title text not null,
  excerpt text not null,
  content text not null,
  category text not null,
  "publishedAt" date not null default current_date,
  "readTime" text not null default '5 min read',
  "imageUrl" text,
  published boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists public.messages (
  id uuid primary key,
  name text not null,
  email text not null,
  subject text not null,
  message text not null,
  status text not null default 'new',
  "createdAt" timestamptz not null default now()
);

alter table public.projects enable row level security;
alter table public.blogs enable row level security;
alter table public.messages enable row level security;

alter table public.projects add column if not exists discipline text not null default 'Full stack';
alter table public.projects add column if not exists "projectType" text not null default 'Personal project';
alter table public.projects add column if not exists tags jsonb not null default '[]'::jsonb;
