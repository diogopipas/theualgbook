-- Notifications table
create table public.notifications (
  id uuid primary key default gen_random_uuid(),
  recipient_id uuid not null references profiles(id) on delete cascade,
  actor_id uuid not null references profiles(id) on delete cascade,
  type text not null check (type in (
    'friend_request', 'friend_accepted',
    'post_reaction', 'comment', 'comment_reaction',
    'group_invite', 'group_post',
    'message'
  )),
  entity_id uuid,
  entity_type text,
  is_read boolean default false,
  created_at timestamptz default now()
);

create index idx_notifications_recipient on notifications(recipient_id, is_read, created_at desc);

-- RLS
alter table notifications enable row level security;

create policy "Users see own notifications" on notifications for select to authenticated
  using (recipient_id = auth.uid());
create policy "Users can insert notifications" on notifications for insert to authenticated
  with check (true);
create policy "Users can update own notifications" on notifications for update to authenticated
  using (recipient_id = auth.uid());

-- Enable realtime
alter publication supabase_realtime add table notifications;
