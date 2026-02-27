-- Profiles table (extends Supabase auth.users)
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text unique not null,
  username text unique not null,
  full_name text not null,
  avatar_url text,
  cover_url text,
  bio text,
  course text,
  course_type text check (course_type in ('Licenciatura', 'Mestrado', 'TeSP')),
  department text,
  enrollment_year int,
  is_online boolean default false,
  last_seen timestamptz default now(),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Enable RLS
alter table profiles enable row level security;

-- Policies
create policy "Profiles are viewable by authenticated users"
  on profiles for select to authenticated using (true);

create policy "Users can insert own profile"
  on profiles for insert to authenticated
  with check (auth.uid() = id);

create policy "Users can update own profile"
  on profiles for update to authenticated using (auth.uid() = id);

-- Trigger to auto-create profile on user signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, full_name, username, course, course_type)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1)),
    split_part(new.email, '@', 1),
    new.raw_user_meta_data->>'course',
    new.raw_user_meta_data->>'course_type'
  );
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Storage buckets (run in Supabase dashboard or via SQL editor)
-- insert into storage.buckets (id, name, public) values ('avatars', 'avatars', true);
-- insert into storage.buckets (id, name, public) values ('covers', 'covers', true);
-- insert into storage.buckets (id, name, public) values ('post-images', 'post-images', true);
