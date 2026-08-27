-- PowerChain Copilot 1.0.0 PWRC internal credit accounting.
-- Amounts are integer PWRC units in the configured credit schedule; no private keys are stored here.

create table if not exists credit_accounts (
  id text primary key,
  workspace_id text not null references workspaces(id) on delete cascade,
  user_id text not null references users(id) on delete cascade,
  asset text not null check (asset = 'PWRC'),
  decimals integer not null default 9 check (decimals = 9),
  available numeric(40,0) not null default 0 check (available >= 0),
  reserved numeric(40,0) not null default 0 check (reserved >= 0),
  spent numeric(40,0) not null default 0 check (spent >= 0),
  funded numeric(40,0) not null default 0 check (funded >= 0),
  updated_at timestamptz not null default now(),
  unique(workspace_id, user_id, asset)
);

create table if not exists credit_ledger (
  id text primary key,
  account_id text not null references credit_accounts(id) on delete cascade,
  workspace_id text not null references workspaces(id) on delete cascade,
  user_id text not null references users(id) on delete cascade,
  kind text not null check (kind in ('fund','reserve','settle','release')),
  amount numeric(40,0) not null check (amount >= 0),
  balance_after numeric(40,0) not null check (balance_after >= 0),
  reference text not null default '',
  created_at timestamptz not null default now()
);

create index if not exists credit_accounts_workspace_user_idx on credit_accounts(workspace_id, user_id);
create index if not exists credit_ledger_workspace_user_idx on credit_ledger(workspace_id, user_id, created_at desc);
