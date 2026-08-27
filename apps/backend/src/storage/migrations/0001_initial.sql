-- PowerChain Copilot 1.0.0 canonical PostgreSQL schema.
-- Prefixed opaque IDs are stored as text intentionally (usr_, wsp_, cht_, msg_, ...).

create table if not exists users (
  id text primary key,
  email text not null unique,
  name text not null,
  password_hash text not null,
  created_at timestamptz not null default now()
);

create table if not exists workspaces (
  id text primary key,
  name text not null,
  slug text not null unique,
  plan text not null check (plan in ('free','pro','business')),
  created_at timestamptz not null default now()
);

create table if not exists memberships (
  id text primary key,
  user_id text not null references users(id) on delete cascade,
  workspace_id text not null references workspaces(id) on delete cascade,
  role text not null check (role in ('owner','admin','operator','analyst','viewer')),
  unique(user_id, workspace_id)
);

create table if not exists sessions (
  id text primary key,
  user_id text not null references users(id) on delete cascade,
  workspace_id text not null references workspaces(id) on delete cascade,
  role text not null check (role in ('owner','admin','operator','analyst','viewer')),
  persistent boolean not null default false,
  expires_at timestamptz not null,
  revoked_at timestamptz,
  created_at timestamptz not null default now(),
  last_seen_at timestamptz not null default now()
);

create table if not exists assets (
  id text primary key,
  workspace_id text not null references workspaces(id) on delete cascade,
  slug text not null,
  name text not null,
  type text not null check (type in ('solar','wind','storage','ev','meter')),
  location text not null,
  capacity_mw numeric not null default 0,
  availability numeric not null default 0,
  status text not null check (status in ('operational','attention','offline')),
  verified boolean not null default false,
  unique(workspace_id, slug)
);

create table if not exists approvals (
  id text primary key,
  workspace_id text not null references workspaces(id) on delete cascade,
  slug text not null,
  title text not null,
  description text not null,
  severity text not null check (severity in ('low','medium','high')),
  amount text,
  status text not null check (status in ('pending','approved','changes_requested')),
  updated_at timestamptz not null default now(),
  unique(workspace_id, slug)
);

create table if not exists activities (
  id text primary key,
  workspace_id text not null references workspaces(id) on delete cascade,
  kind text not null check (kind in ('asset','approval','copilot','system','billing')),
  title text not null,
  detail text not null,
  created_at timestamptz not null default now()
);

create table if not exists chats (
  id text primary key,
  workspace_id text not null references workspaces(id) on delete cascade,
  user_id text not null references users(id) on delete cascade,
  slug text not null,
  title text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(workspace_id, user_id, slug)
);

create table if not exists messages (
  id text primary key,
  chat_id text not null references chats(id) on delete cascade,
  workspace_id text not null references workspaces(id) on delete cascade,
  user_id text not null references users(id) on delete cascade,
  role text not null check (role in ('user','assistant','system')),
  content text not null,
  created_at timestamptz not null default now()
);

create table if not exists contacts (
  id text primary key,
  name text not null,
  email text not null,
  company text not null default '',
  message text not null,
  intent text not null default 'general',
  created_at timestamptz not null default now()
);

create table if not exists legal_acceptances (
  id text primary key,
  user_id text not null references users(id) on delete cascade,
  document text not null,
  version text not null,
  accepted_at timestamptz not null default now(),
  unique(user_id, document, version)
);

create index if not exists memberships_user_idx on memberships(user_id);
create index if not exists memberships_workspace_idx on memberships(workspace_id);
create index if not exists sessions_user_idx on sessions(user_id, created_at desc);
create index if not exists sessions_expiry_idx on sessions(expires_at) where revoked_at is null;
create index if not exists assets_workspace_idx on assets(workspace_id, name);
create index if not exists approvals_workspace_idx on approvals(workspace_id, updated_at desc);
create index if not exists activities_workspace_idx on activities(workspace_id, created_at desc);
create index if not exists chats_workspace_user_idx on chats(workspace_id, user_id, updated_at desc);
create index if not exists messages_chat_idx on messages(chat_id, created_at);
