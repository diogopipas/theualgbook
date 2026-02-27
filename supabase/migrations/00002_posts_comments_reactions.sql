-- Posts table
create table public.posts (
  id uuid primary key default gen_random_uuid(),
  author_id uuid not null references profiles(id) on delete cascade,
  group_id uuid references groups(id) on delete cascade,
  content text not null,
  image_urls text[] default '{}',
  visibility text default 'friends' check (visibility in ('public', 'friends', 'only_me')),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create index idx_posts_author on posts(author_id, created_at desc);
create index idx_posts_group on posts(group_id, created_at desc);
create index idx_posts_created on posts(created_at desc);

-- Comments table
create table public.comments (
  id uuid primary key default gen_random_uuid(),
  post_id uuid not null references posts(id) on delete cascade,
  author_id uuid not null references profiles(id) on delete cascade,
  parent_id uuid references comments(id) on delete cascade,
  content text not null,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create index idx_comments_post on comments(post_id, created_at);

-- Reactions table
create table public.reactions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references profiles(id) on delete cascade,
  post_id uuid references posts(id) on delete cascade,
  comment_id uuid references comments(id) on delete cascade,
  type text not null check (type in ('like', 'love', 'haha', 'sad', 'angry')),
  created_at timestamptz default now(),
  unique (user_id, post_id),
  unique (user_id, comment_id),
  check (
    (post_id is not null and comment_id is null) or
    (post_id is null and comment_id is not null)
  )
);

-- RLS
alter table posts enable row level security;
alter table comments enable row level security;
alter table reactions enable row level security;

-- Posts policies
create policy "Posts viewable by authenticated" on posts for select to authenticated using (true);
create policy "Users can create posts" on posts for insert to authenticated with check (auth.uid() = author_id);
create policy "Users can update own posts" on posts for update to authenticated using (auth.uid() = author_id);
create policy "Users can delete own posts" on posts for delete to authenticated using (auth.uid() = author_id);

-- Comments policies
create policy "Comments viewable by authenticated" on comments for select to authenticated using (true);
create policy "Users can create comments" on comments for insert to authenticated with check (auth.uid() = author_id);
create policy "Users can delete own comments" on comments for delete to authenticated using (auth.uid() = author_id);

-- Reactions policies
create policy "Reactions viewable by authenticated" on reactions for select to authenticated using (true);
create policy "Users can manage own reactions" on reactions for insert to authenticated with check (auth.uid() = user_id);
create policy "Users can update own reactions" on reactions for update to authenticated using (auth.uid() = user_id);
create policy "Users can delete own reactions" on reactions for delete to authenticated using (auth.uid() = user_id);
