-- PowerChain Copilot 1.0.0 deterministic PWRC quote / reservation / settlement evidence.
-- Receipts are internal, non-transferable audit records and are not financial tokens.

create table if not exists credit_quotes (
  id text primary key,
  account_id text not null references credit_accounts(id) on delete cascade,
  workspace_id text not null references workspaces(id) on delete cascade,
  user_id text not null references users(id) on delete cascade,
  chat_id text not null references chats(id) on delete cascade,
  request_message_id text not null references messages(id) on delete cascade,
  response_message_id text references messages(id) on delete set null,
  asset text not null check (asset = 'PWRC'),
  amount numeric(40,0) not null check (amount > 0),
  pricing_version text not null check (pricing_version = 'pwrc-message-v1'),
  canonical_payload text not null,
  quote_hash text not null check (quote_hash ~ '^[a-f0-9]{64}$'),
  status text not null check (status in ('quoted','reserved','settled','released','expired')),
  expires_at timestamptz not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create unique index if not exists credit_quotes_request_message_idx on credit_quotes(request_message_id);
create index if not exists credit_quotes_workspace_user_idx on credit_quotes(workspace_id, user_id, created_at desc);
create index if not exists credit_quotes_status_idx on credit_quotes(status, expires_at);

create table if not exists credit_receipts (
  id text primary key,
  quote_id text not null unique references credit_quotes(id) on delete restrict,
  account_id text not null references credit_accounts(id) on delete restrict,
  workspace_id text not null references workspaces(id) on delete restrict,
  user_id text not null references users(id) on delete restrict,
  chat_id text not null references chats(id) on delete restrict,
  response_message_id text not null references messages(id) on delete restrict,
  quote_hash text not null check (quote_hash ~ '^[a-f0-9]{64}$'),
  amount numeric(40,0) not null check (amount > 0),
  reservation_ledger_id text not null references credit_ledger(id) on delete restrict,
  settlement_ledger_id text not null references credit_ledger(id) on delete restrict,
  transferable boolean not null default false check (transferable = false),
  created_at timestamptz not null default now()
);

create index if not exists credit_receipts_workspace_user_idx on credit_receipts(workspace_id, user_id, created_at desc);
