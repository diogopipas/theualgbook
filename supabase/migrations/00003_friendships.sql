-- Friendships table
create table public.friendships (
  id uuid primary key default gen_random_uuid(),
  requester_id uuid not null references profiles(id) on delete cascade,
  addressee_id uuid not null references profiles(id) on delete cascade,
  status text not null default 'pending' check (status in ('pending', 'accepted', 'rejected', 'blocked')),
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  unique (requester_id, addressee_id)
);

create index idx_friendships_addressee on friendships(addressee_id, status);
create index idx_friendships_requester on friendships(requester_id, status);

-- RLS
alter table friendships enable row level security;

create policy "Users can view own friendships" on friendships for select to authenticated
  using (auth.uid() = requester_id or auth.uid() = addressee_id);
create policy "Users can send friend requests" on friendships for insert to authenticated
  with check (auth.uid() = requester_id);
create policy "Involved users can update friendship" on friendships for update to authenticated
  using (auth.uid() = requester_id or auth.uid() = addressee_id);
create policy "Involved users can delete friendship" on friendships for delete to authenticated
  using (auth.uid() = requester_id or auth.uid() = addressee_id);

-- Helper function
create or replace function is_friend(user1 uuid, user2 uuid) returns boolean as $$
  select exists (
    select 1 from friendships
    where status = 'accepted'
    and ((requester_id = user1 and addressee_id = user2)
      or (requester_id = user2 and addressee_id = user1))
  );
$$ language sql security definer stable;
