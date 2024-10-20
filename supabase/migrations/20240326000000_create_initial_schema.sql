-- Migration: Create initial schema for メルマガリーダー
-- Description: Creates users, newsletters, and reading_progress tables with RLS policies

-- Create users table
create table public.users (
  id uuid primary key default gen_random_uuid(),
  email text unique not null,
  auth_id uuid unique,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

comment on table public.users is 'Stores user information for メルマガリーダー application';

-- Enable RLS on users table
alter table public.users enable row level security;

-- Create RLS policies for users table
create policy "Users can view their own data" on public.users
  for select using (auth.uid() = id);

create policy "Users can insert their own data" on public.users
  for insert with check (auth.uid() = id);

-- Create newsletters table
create table public.newsletters (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  content text not null,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

comment on table public.newsletters is 'Stores newsletter content in Markdown format';

-- Enable RLS on newsletters table
alter table public.newsletters enable row level security;

-- Create RLS policies for newsletters table
create policy "Authenticated users can view newsletters" on public.newsletters
  for select using (auth.role() = 'authenticated');

create policy "Authenticated users can insert newsletters" on public.newsletters
  for insert with check (auth.uid() is not null);

create policy "Authenticated users can update newsletters" on public.newsletters
  for update using (auth.role() = 'authenticated');

create policy "Authenticated users can delete newsletters" on public.newsletters
  for delete using (auth.role() = 'authenticated');

-- Create reading_progress table
create table public.reading_progress (
  user_id uuid references public.users(id),
  newsletter_id uuid references public.newsletters(id),
  position integer not null,
  is_verified boolean default false,
  updated_at timestamp with time zone default now(),
  primary key (user_id, newsletter_id)
);

comment on table public.reading_progress is 'Tracks reading progress of users for each newsletter';
comment on column public.reading_progress.is_verified is 'ユーザーがこのメルマガを照合済みかどうかを示すフラグ';

-- Enable RLS on reading_progress table
alter table public.reading_progress enable row level security;

-- Create RLS policies for reading_progress table
create policy "Users can view their own reading progress" on public.reading_progress
  for select using (auth.uid() = user_id);

create policy "Users can insert their own reading progress" on public.reading_progress
  for insert with check (auth.uid() = user_id);

create policy "Users can update their own reading progress" on public.reading_progress
  for update using (auth.uid() = user_id);

create policy "Users can delete their own reading progress" on public.reading_progress
  for delete using (auth.uid() = user_id);

-- Create function to automatically update the updated_at column
create or replace function public.update_updated_at_column()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

-- Create trigger to update updated_at column for newsletters table
create trigger update_newsletters_updated_at
before update on public.newsletters
for each row
execute function public.update_updated_at_column();

-- Create trigger to update updated_at column for reading_progress table
create trigger update_reading_progress_updated_at
before update on public.reading_progress
for each row
execute function public.update_updated_at_column();

-- Create trigger to update updated_at column for users table
create trigger update_users_updated_at
before update on public.users
for each row
execute function public.update_updated_at_column();

-- Create function to sync users data
create or replace function sync_users()
returns trigger as $$
begin
  insert into public.users (id, email, created_at, auth_id)
  values (new.id, new.email, new.created_at, new.id)
  on conflict (auth_id) do update
  set email = excluded.email, updated_at = now();
  return new;
end;
$$ language plpgsql security definer;

-- Create trigger to sync users data
create trigger on_auth_user_created
  after insert or update on auth.users
  for each row execute function sync_users();

-- Create index for performance optimization
create index idx_reading_progress_user_newsletter on public.reading_progress (user_id, newsletter_id);
