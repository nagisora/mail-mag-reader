-- Migration: Add is_verified column to newsletters table
-- Description: Adds a boolean column to track verification status of newsletters

-- Add is_verified column to newsletters table
alter table public.newsletters
add column is_verified boolean not null default false;

-- Add comment to explain the purpose of the is_verified column
comment on column public.newsletters.is_verified is 'Indicates whether the newsletter has been verified by a user';

-- Update existing RLS policies to include the new column
drop policy if exists "Authenticated users can view newsletters" on public.newsletters;
create policy "Authenticated users can view newsletters" on public.newsletters
  for select using (auth.role() = 'authenticated');

drop policy if exists "Authenticated users can insert newsletters" on public.newsletters;
create policy "Authenticated users can insert newsletters" on public.newsletters
  for insert with check (auth.role() = 'authenticated');

drop policy if exists "Authenticated users can update newsletters" on public.newsletters;
create policy "Authenticated users can update newsletters" on public.newsletters
  for update using (auth.role() = 'authenticated');

-- Add a new policy to allow updating is_verified column
create policy "Authenticated users can update is_verified" on public.newsletters
  for update to authenticated
  using (true)
  with check (auth.uid() is not null);

-- Add an index to improve query performance on is_verified column
create index idx_newsletters_is_verified on public.newsletters (is_verified);
