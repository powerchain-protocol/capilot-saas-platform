-- PowerChain Copilot SaaS schema
-- Run in Supabase SQL editor for durable production persistence.
-- The application writes through server-side REST with the service-role key.

create table if not exists public.users (
  id uuid primary key,
  email text not null unique,
  name text not null,
  password_hash text not null,
  created_at timestamptz not null default now()
);

create table if not exists public.workspaces (
  id uuid primary key,
  name text not null,
  slug text not null unique,
  plan text not null check (plan in ('free','pro','business')),
  created_at timestamptz not null default now()
);

create table if not exists public.memberships (
  id uuid primary key,
  user_id uuid not null references public.users(id) on delete cascade,
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  role text not null check (role in ('owner','admin','operator','analyst','viewer')),
  unique(user_id, workspace_id)
);

create table if not exists public.assets (
  id uuid primary key,
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  name text not null,
  type text not null check (type in ('solar','wind','storage','ev','meter')),
  location text not null,
  capacity_mw numeric not null default 0,
  availability numeric not null default 0,
  status text not null check (status in ('operational','attention','offline')),
  verified boolean not null default false
);

create table if not exists public.approvals (
  id uuid primary key,
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  title text not null,
  description text not null,
  severity text not null check (severity in ('low','medium','high')),
  amount text,
  status text not null check (status in ('pending','approved','changes_requested')),
  updated_at timestamptz not null default now()
);

create table if not exists public.activities (
  id uuid primary key,
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  kind text not null check (kind in ('asset','approval','copilot','system','billing')),
  title text not null,
  detail text not null,
  created_at timestamptz not null default now()
);

create table if not exists public.messages (
  id uuid primary key,
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  user_id uuid not null references public.users(id) on delete cascade,
  role text not null check (role in ('user','assistant')),
  content text not null,
  created_at timestamptz not null default now()
);

create table if not exists public.contacts (
  id uuid primary key,
  name text not null,
  email text not null,
  company text not null default '',
  message text not null,
  intent text not null default 'general',
  created_at timestamptz not null default now()
);

create index if not exists memberships_user_idx on public.memberships(user_id);
create index if not exists memberships_workspace_idx on public.memberships(workspace_id);
create index if not exists assets_workspace_idx on public.assets(workspace_id);
create index if not exists approvals_workspace_idx on public.approvals(workspace_id, updated_at desc);
create index if not exists activities_workspace_idx on public.activities(workspace_id, created_at desc);
create index if not exists messages_workspace_user_idx on public.messages(workspace_id, user_id, created_at);

alter table public.users enable row level security;
alter table public.workspaces enable row level security;
alter table public.memberships enable row level security;
alter table public.assets enable row level security;
alter table public.approvals enable row level security;
alter table public.activities enable row level security;
alter table public.messages enable row level security;
alter table public.contacts enable row level security;

-- No anon/authenticated policies are intentionally created here. The current
-- application accesses these tables only through trusted Next.js server routes
-- using SUPABASE_SERVICE_ROLE_KEY. Add end-user RLS policies only if direct
-- Supabase client access is introduced later.

create table if not exists public.legal_acceptances (
  id uuid primary key,
  user_id uuid not null references public.users(id) on delete cascade,
  document text not null check (document in ('terms')),
  version text not null,
  accepted_at timestamptz not null default now(),
  unique(user_id, document, version)
);
create index if not exists legal_acceptances_user_idx on public.legal_acceptances(user_id, accepted_at desc);
alter table public.legal_acceptances enable row level security;
