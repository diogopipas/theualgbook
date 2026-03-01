-- Add extra profile fields (Basic Info, Personal Info, Education Info, Work Info)
alter table public.profiles
  add column if not exists birthday date,
  add column if not exists hometown text,
  add column if not exists relationship_status text check (
    relationship_status in ('Solteiro/a', 'Numa relação', 'Comprometido/a', 'Casado/a', 'Complicado')
  ),
  add column if not exists activities text,
  add column if not exists interests text,
  add column if not exists favorite_music text,
  add column if not exists favorite_books text,
  add column if not exists favorite_quotes text,
  add column if not exists high_school text,
  add column if not exists work_company text,
  add column if not exists work_period text,
  add column if not exists work_description text;
