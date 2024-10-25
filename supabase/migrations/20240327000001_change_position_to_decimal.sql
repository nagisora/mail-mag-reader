-- Migration: Change position column type from integer to decimal in reading_progress table
-- Description: Updates the position column to accept decimal values for more precise tracking of reading progress.

-- Alter the reading_progress table to change the position column type
alter table public.reading_progress
  alter column position type decimal(5, 2) using position::decimal(5, 2);
