-- Signature Villas core data model (v1)

create table if not exists properties (
  id uuid primary key,
  name text not null,
  timezone text not null default 'Europe/Berlin',
  default_language text not null default 'de',
  emergency_contact text,
  created_at timestamptz not null default now()
);

create table if not exists users (
  id uuid primary key,
  email text unique,
  full_name text,
  created_at timestamptz not null default now()
);

create table if not exists property_roles (
  id uuid primary key,
  property_id uuid not null references properties(id) on delete cascade,
  user_id uuid not null references users(id) on delete cascade,
  role text not null check (role in ('admin','owner','manager')),
  created_at timestamptz not null default now(),
  unique(property_id, user_id, role)
);

create table if not exists bookings (
  id uuid primary key,
  property_id uuid not null references properties(id) on delete cascade,
  booking_ref text not null,
  guest_name text,
  guest_phone text,
  check_in timestamptz not null,
  check_out timestamptz not null,
  status text not null default 'confirmed',
  created_at timestamptz not null default now(),
  unique(property_id, booking_ref)
);

create table if not exists guest_sessions (
  id uuid primary key,
  booking_id uuid not null references bookings(id) on delete cascade,
  auth_method text not null check (auth_method in ('magic_link','pin','whatsapp')),
  expires_at timestamptz not null,
  created_at timestamptz not null default now()
);

create table if not exists knowledge_documents (
  id uuid primary key,
  property_id uuid not null references properties(id) on delete cascade,
  source_type text not null check (source_type in ('manual','interview','region')),
  title text,
  status text not null default 'active',
  version int not null default 1,
  created_at timestamptz not null default now()
);

create table if not exists vault_secrets (
  id uuid primary key,
  property_id uuid not null references properties(id) on delete cascade,
  key_name text not null,
  cipher_text text not null,
  valid_from timestamptz,
  valid_until timestamptz,
  created_by uuid references users(id),
  created_at timestamptz not null default now(),
  unique(property_id, key_name, created_at)
);

create table if not exists audit_logs (
  id uuid primary key,
  property_id uuid,
  actor_user_id uuid,
  actor_session_id uuid,
  event_type text not null,
  target_type text,
  target_id text,
  metadata jsonb,
  created_at timestamptz not null default now()
);
