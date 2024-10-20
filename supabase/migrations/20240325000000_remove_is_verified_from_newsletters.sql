-- newslettersテーブルからis_verifiedカラムを削除
ALTER TABLE public.newsletters DROP COLUMN IF EXISTS is_verified;
