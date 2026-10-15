-- peetoo P2P — migración MVP
-- Ejecutar en Supabase: Dashboard -> SQL Editor -> pegar y Run.
-- RLS activado con políticas permisivas para el MVP (lectura pública,
-- escritura del propio registro). ENDURECER antes de producción.

create table if not exists public.profiles (
  id text primary key,
  wallet_address text,
  display_name text not null default 'Usuario',
  location text default 'La Habana',
  trades_count int not null default 0,
  score int not null default 100,
  created_at timestamptz not null default now()
);

create table if not exists public.offers (
  id text primary key,
  owner_id text not null,
  owner_name text not null default 'Usuario',
  side text not null check (side in ('buy_crypto', 'sell_crypto')),
  crypto text not null,
  fiat text not null,
  payment_method text not null,
  chain int not null default 84532,
  chain_name text not null default 'Base Sepolia',
  price numeric not null,
  available numeric not null,
  min_amount numeric not null,
  max_amount numeric not null,
  status text not null default 'active' check (status in ('active', 'paused', 'cancelled')),
  created_at timestamptz not null default now()
);

create table if not exists public.orders (
  id text primary key,
  offer_id text not null,
  maker_id text not null,
  taker_id text not null,
  side text not null,
  crypto text not null,
  fiat text not null,
  payment_method text not null,
  crypto_amount numeric not null,
  fiat_amount numeric not null,
  price numeric not null,
  status text not null default 'pending_payment'
    check (status in ('pending_payment', 'paid', 'completed', 'cancelled', 'disputed')),
  proof text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.profiles enable row level security;
alter table public.offers enable row level security;
alter table public.orders enable row level security;

-- MVP: cualquiera puede leer. Escritura: el propio usuario (por id).
-- En producción, restringir con auth.uid() y roles.
drop policy if exists "read all profiles" on public.profiles;
create policy "read all profiles" on public.profiles for select using (true);
drop policy if exists "write own profile" on public.profiles;
create policy "write own profile" on public.profiles for all using (true) with check (true);

drop policy if exists "read all offers" on public.offers;
create policy "read all offers" on public.offers for select using (true);
drop policy if exists "write offers" on public.offers;
create policy "write offers" on public.offers for all using (true) with check (true);

drop policy if exists "read all orders" on public.orders;
create policy "read all orders" on public.orders for select using (true);
drop policy if exists "write orders" on public.orders;
create policy "write orders" on public.orders for all using (true) with check (true);
