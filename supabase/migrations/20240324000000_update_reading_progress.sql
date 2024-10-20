-- reading_progressテーブルを更新
ALTER TABLE public.reading_progress
ADD COLUMN IF NOT EXISTS is_verified BOOLEAN DEFAULT FALSE;

-- 既存の主キー制約を削除（存在する場合）
ALTER TABLE public.reading_progress DROP CONSTRAINT IF EXISTS reading_progress_pkey;

-- 新しい主キー制約を追加
ALTER TABLE public.reading_progress
ADD CONSTRAINT reading_progress_pkey PRIMARY KEY (user_id, newsletter_id);

-- コメントを追加
COMMENT ON COLUMN public.reading_progress.is_verified IS 'ユーザーがこのメルマガを照合済みかどうかを示すフラグ';
