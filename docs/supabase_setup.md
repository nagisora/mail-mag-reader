 # Supabase セットアップガイド

このガイドでは、メルマガリーダーアプリケーションのためのSupabaseのセットアップ方法について説明します。

## 1. Supabaseプロジェクトの作成

1. [Supabase](https://supabase.com/)にアクセスし、アカウントを作成またはログインします。
2. ダッシュボードから「New Project」をクリックします。
3. プロジェクト名、データベースパスワード、リージョンを設定し、プロジェクトを作成します。

## 2. データベーステーブルの作成

以下のテーブルを作成します：

### users テーブル
- `id`: uuid (primary key)
- `email`: text (unique)
- `created_at`: timestamp with time zone

### newsletters テーブル
- `id`: uuid (primary key)
- `title`: text
- `content`: text
- `created_at`: timestamp with time zone
- `updated_at`: timestamp with time zone

### reading_progress テーブル
- `id`: uuid (primary key)
- `user_id`: uuid (foreign key to users.id)
- `newsletter_id`: uuid (foreign key to newsletters.id)
- `position`: integer
- `updated_at`: timestamp with time zone

## SQLコマンド例
以下のSQLコマンドを使用して、テーブルを作成できます：

```sql
CREATE TABLE users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  created_at timestamp with time zone DEFAULT now()
);

CREATE TABLE newsletters (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  content text NOT NULL,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

CREATE TABLE reading_progress (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id),
  newsletter_id uuid REFERENCES newsletters(id),
  position integer,
  updated_at timestamp with time zone DEFAULT now()
);
```

## 3. 認証設定

1. Supabaseダッシュボードの「Authentication」セクションに移動します。
2. 「Settings」タブで、必要な認証プロバイダー（Email/Password）を有効にします。

## 4. API キーの取得

1. Supabaseダッシュボードの「Settings」→「API」に移動します。
2. 「Project API keys」セクションから以下の情報をコピーします：
   - Project URL
   - anon public key

## 5. 環境変数の設定

プロジェクトのルートディレクトリに`.env.local`ファイルを作成し、以下の環境変数を設定します：

NEXT_PUBLIC_SUPABASE_URL=your_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_public_key

## 6. Supabaseクライアントの初期化

`src/lib/supabase.ts`ファイルを作成し、以下のコードを追加します：

typescript
import { createClient } from '@supabase/supabase-js'
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
export const supabase = createClient(supabaseUrl, supabaseAnonKey)

これで、アプリケーション内でSupabaseクライアントを使用する準備が整いました。

## 7. セキュリティ設定

1. Supabaseダッシュボードの「Authentication」→「Policies」に移動します。
2. 各テーブルに適切なRLSポリシーを設定し、認証されたユーザーのみがデータにアクセスできるようにします。

### RLSポリシーの設定手順

#### `users`テーブルのポリシー設定
- **ポリシー名**: Allow user registration
- **アクション**: `INSERT`
- **条件**: `auth.role() = 'authenticated'`

#### `newsletters`テーブルのポリシー設定
- **ポリシー名**: Allow read and write for authenticated users
- **アクション**: `SELECT`, `INSERT`, `UPDATE`, `DELETE`
- **条件**: `auth.role() = 'authenticated'`

#### `reading_progress`テーブルのポリシー設定
- **ポリシー名**: Allow read and write for authenticated users
- **アクション**: `SELECT`, `INSERT`, `UPDATE`, `DELETE`
- **条件**: `auth.role() = 'authenticated'`

以上の手順でSupabaseのセットアップが完了します。これにより、メルマガリーダーアプリケーションでSupabaseを使用する準備が整いました。

## 8. Supabase CLIのインストール

1. Supabase CLIをインストールします。以下のコマンドを実行してください：
   ```bash
   npm install supabase --save-dev
   ```

2. Supabaseプロジェクトを初期化します：
   ```bash
   npx supabase init
   ```

3. Supabaseプロジェクトにリンクします：
   ```bash
   npx supabase link --project-ref <your_project_ref>
   ```
   - `<your_project_ref>`は、SupabaseダッシュボードのプロジェクトURLから取得できます。

4. マイグレーションを適用します：
   ```bash
   npx supabase db push
   ```

5. リモートDBのリセットとマイグレーションを行うには、以下のコマンドを実行します：
   ```bash
   npx supabase db reset --linked
   ```
   - このコマンドは、リンクされたリモートデータベースをリセットし、マイグレーションを適用します。

6. Supabaseスタックを起動します（ローカルでデータベースを操作する場合）：
   ```bash
   npx supabase start
   ```

これで、ローカル環境でSupabaseを使用する準備が整いました。
