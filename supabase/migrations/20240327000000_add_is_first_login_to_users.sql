-- Add is_first_login column to users table
ALTER TABLE public.users ADD COLUMN is_first_login BOOLEAN DEFAULT TRUE;

-- Update existing users to set is_first_login to false
UPDATE public.users SET is_first_login = FALSE WHERE is_first_login IS NULL;
