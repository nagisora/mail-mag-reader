-- usersテーブルを更新
ALTER TABLE public.users
ADD COLUMN IF NOT EXISTS auth_id UUID UNIQUE,
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT now();

-- 既存のユーザーデータを同期するためのファンクションを作成
CREATE OR REPLACE FUNCTION sync_users()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email, created_at, auth_id)
  VALUES (NEW.id, NEW.email, NEW.created_at, NEW.id)
  ON CONFLICT (auth_id) DO UPDATE
  SET email = EXCLUDED.email, updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- トリガーを作成
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT OR UPDATE ON auth.users
  FOR EACH ROW EXECUTE FUNCTION sync_users();

-- 既存のauth.usersデータをpublic.usersに同期
INSERT INTO public.users (id, email, created_at, auth_id)
SELECT id, email, created_at, id
FROM auth.users
ON CONFLICT (auth_id) DO UPDATE
SET email = EXCLUDED.email, updated_at = now();
