-- Groups table
create table public.groups (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text,
  cover_url text,
  privacy text default 'public' check (privacy in ('public', 'private')),
  created_by uuid not null references profiles(id) on delete cascade,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Group members
create table public.group_members (
  id uuid primary key default gen_random_uuid(),
  group_id uuid not null references groups(id) on delete cascade,
  user_id uuid not null references profiles(id) on delete cascade,
  role text default 'member' check (role in ('admin', 'moderator', 'member')),
  joined_at timestamptz default now(),
  unique (group_id, user_id)
);

create index idx_group_members_user on group_members(user_id);

-- RLS
alter table groups enable row level security;
alter table group_members enable row level security;

create policy "Groups viewable by authenticated" on groups for select to authenticated using (
  privacy = 'public'
  or exists (select 1 from group_members where group_id = groups.id and user_id = auth.uid())
);
create policy "Users can create groups" on groups for insert to authenticated with check (auth.uid() = created_by);
create policy "Admins can update groups" on groups for update to authenticated
  using (exists (select 1 from group_members where group_id = groups.id and user_id = auth.uid() and role = 'admin'));

create policy "Group members viewable" on group_members for select to authenticated using (
  exists (select 1 from groups where id = group_members.group_id and privacy = 'public')
  or exists (select 1 from group_members gm where gm.group_id = group_members.group_id and gm.user_id = auth.uid())
);
create policy "Users can join groups" on group_members for insert to authenticated with check (auth.uid() = user_id);
create policy "Users can leave groups" on group_members for delete to authenticated using (auth.uid() = user_id);
