-- 既存の主キー制約を削除（存在する場合）
ALTER TABLE public.reading_progress DROP CONSTRAINT IF EXISTS reading_progress_pkey;

-- id列を削除（存在する場合）
ALTER TABLE public.reading_progress DROP COLUMN IF EXISTS id;

-- 新しい主キー制約を追加
ALTER TABLE public.reading_progress
ADD CONSTRAINT reading_progress_pkey PRIMARY KEY (user_id, newsletter_id);

-- 既存のデータに対して重複を削除（必要な場合）
DELETE FROM public.reading_progress a USING public.reading_progress b
WHERE a.user_id = b.user_id 
  AND a.newsletter_id = b.newsletter_id 
  AND a.ctid < b.ctid;

-- インデックスを追加してパフォーマンスを向上（既に存在しない場合）
CREATE INDEX IF NOT EXISTS idx_reading_progress_user_newsletter ON public.reading_progress (user_id, newsletter_id);

-- コメントを追加
COMMENT ON TABLE public.reading_progress IS 'ユーザーごとのメルマガ読み進め位置を保存するテーブル';
