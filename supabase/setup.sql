-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- 1. Users Table (Linked to Steam ID)
create table public.users (
  id uuid default uuid_generate_v4() primary key,
  steam_id text unique not null,
  username text,
  avatar_url text,
  reputation_credits int default 100, -- Starting credits for QV
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. Reviews Table
create table public.reviews (
  id uuid default uuid_generate_v4() primary key,
  game_id text not null, -- AppID from Steam
  user_id uuid references public.users(id) not null,
  content text,
  score decimal(3, 1), -- e.g. 8.9
  playtime_at_review decimal(10, 1), -- Snapshot of playtime when reviewed
  proof_of_play_verified boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 3. Votes Table (Quadratic Voting Ledger)
create table public.votes (
  id uuid default uuid_generate_v4() primary key,
  review_id uuid references public.reviews(id) not null,
  user_id uuid references public.users(id) not null,
  vote_count int not null, -- Number of votes cast (can be negative for downvotes)
  credit_cost int not null, -- Calculated as vote_count^2
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Function to handle new user signup via Steam
create or replace function handle_new_steam_user() 
returns trigger as $$
begin
  insert into public.users (steam_id, username, avatar_url)
  values (new.raw_user_meta_data->>'steam_id', new.raw_user_meta_data->>'name', new.raw_user_meta_data->>'avatar')
  on conflict (steam_id) do nothing;
  return new;
end;
$$ language plpgsql security definer;
