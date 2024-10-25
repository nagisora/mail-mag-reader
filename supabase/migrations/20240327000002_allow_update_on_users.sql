-- Migration: Allow update on users table
-- Description: Adds an RLS policy to allow authenticated users to update their own user data.

-- Drop existing policy if it exists to avoid conflicts
drop policy if exists "Users can update their own data" on public.users;

-- Create RLS policy for updating user data
create policy "Users can update their own data" on public.users
  for update using (auth.uid() = id)
  with check (auth.uid() = id);
