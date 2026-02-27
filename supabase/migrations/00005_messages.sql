-- Conversations
create table public.conversations (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Conversation participants
create table public.conversation_participants (
  id uuid primary key default gen_random_uuid(),
  conversation_id uuid not null references conversations(id) on delete cascade,
  user_id uuid not null references profiles(id) on delete cascade,
  last_read_at timestamptz default now(),
  unique (conversation_id, user_id)
);

create index idx_conv_participants_user on conversation_participants(user_id);

-- Messages
create table public.messages (
  id uuid primary key default gen_random_uuid(),
  conversation_id uuid not null references conversations(id) on delete cascade,
  sender_id uuid not null references profiles(id) on delete cascade,
  content text not null,
  image_url text,
  created_at timestamptz default now()
);

create index idx_messages_conv on messages(conversation_id, created_at);

-- RLS
alter table conversations enable row level security;
alter table conversation_participants enable row level security;
alter table messages enable row level security;

create policy "Participants can view conversations" on conversations for select to authenticated
  using (exists (select 1 from conversation_participants where conversation_id = conversations.id and user_id = auth.uid()));
create policy "Users can create conversations" on conversations for insert to authenticated
  with check (true);
create policy "Participants can update conversations" on conversations for update to authenticated
  using (exists (select 1 from conversation_participants where conversation_id = conversations.id and user_id = auth.uid()));

create policy "Participants can view own conversations" on conversation_participants for select to authenticated
  using (user_id = auth.uid() or exists (
    select 1 from conversation_participants cp where cp.conversation_id = conversation_participants.conversation_id and cp.user_id = auth.uid()
  ));
create policy "Users can insert participants" on conversation_participants for insert to authenticated
  with check (true);

create policy "Messages viewable by participants" on messages for select to authenticated
  using (exists (select 1 from conversation_participants where conversation_id = messages.conversation_id and user_id = auth.uid()));
create policy "Participants can send messages" on messages for insert to authenticated
  with check (auth.uid() = sender_id and exists (select 1 from conversation_participants where conversation_id = messages.conversation_id and user_id = auth.uid()));

-- Enable realtime
alter publication supabase_realtime add table messages;
