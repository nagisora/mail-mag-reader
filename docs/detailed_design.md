# メルマガリーダー詳細設計書

## 1. システム構成

### 1.1 フロントエンド
- Next.js (TypeScript)
- Shadcn/ui
- **npx shadcn@latestを使用**

### 1.2 バックエンド
- Supabase (認証、データベース)
- Google Apps Script (GAS) for Gmail処理

### 1.3 ホスティング
- Vercel

## 2. データベース設計 (Supabase)

### 2.1 ユーザーテーブル (users)
- id: uuid (primary key)
- email: string (unique)
- created_at: timestamp

### 2.2 メルマガテーブル (newsletters)
- id: uuid (primary key)
- title: string
- content: text (Markdown形式)
- created_at: timestamp
- updated_at: timestamp
- is_master: boolean (マスターメルマガかどうかを示すフラグ)

### 2.3 読み進め位置テーブル (reading_progress)
- user_id: uuid (foreign key to users.id)
- newsletter_id: uuid (foreign key to newsletters.id)
- position: integer
- is_verified: boolean (ユーザーがこのメルマガを照合済みかどうかを示すフラグ)
- updated_at: timestamp

## 3. API設計

### 3.1 認証API
- POST /api/auth/register
- POST /api/auth/login
- POST /api/auth/logout

### 3.2 メルマガAPI
- GET /api/newsletters
- GET /api/newsletters/:id
- POST /api/newsletters
- PUT /api/newsletters/:id
- DELETE /api/newsletters/:id

### 3.3 読み進め位置API
- POST /api/reading-progress
- GET /api/reading-progress/:newsletter_id

### 3.4 Gmail取得API (GAS)
- Google Apps Script (GAS)を使用して、Gmailから特定のラベルを持つメルマガを自動的に取得し、Supabaseに保存します。

### 3.5 メルマガ照合API
- POST /api/newsletters/verify

## 4. コンポーネント設計

### 4.1 ページコンポーネント
- HomePage
- LoginPage
- RegisterPage
- NewsletterListPage
- NewsletterDetailPage
- NewsletterVerificationPage (新規追加)

### 4.2 共通コンポーネント
- Header
- Footer
- NewsletterCard
- MarkdownRenderer
- ReadingProgressBar
- NewsletterVerificationForm (新規追加)

## 5. 認証フロー

1. ユーザーがログインページにアクセス
2. メールアドレスとパスワードを入力
3. Supabaseの認証APIを使用して認証
4. 認証成功時、JWTトークンをローカルストレージに保存
5. 認証済みユーザーのみがメルマガにアクセス可能

## 6. メルマガ取得フロー (GAS)

1. GASスクリプトが定期的に実行 (例: 1時間ごと)
2. 特定のラベルが付いたメールを検索
3. メールの内容をパース
4. 受信したデータをマスターメルマガとしてSupabaseに保存

## 7. 読み進め位置の保存と復元

1. ユーザーがメルマガを読む
2. スクロール位置が変更されるたびに位置情報を一時保存
3. ユーザーが読み終わる、または一定時間経過後に保存APIを呼び出し
4. 次回メルマガを開く際、保存された位置情報を取得
5. 取得した位置にスクロール

## 8. メルマガ照合フロー

1. ユーザーが自身のメルマガ本文をフォームに入力
2. システムが入力されたメルマガ本文とDBの各メルマガを照合
3. 95%以上の一致度を判定するアルゴリズムを使用
4. 一致度が95%以上のメルマガが見つかった場合、そのメルマガの閲覧を許可
5. 一致するメルマガが見つからない場合、エラーメッセージを表示

## 9. UI/UXデザイン

- Shadcn/uiを使用してモダンでクリーンなデザインを実装
- ダークモード対応
- レスポンシブデザイン (モバイルファースト)
- スマートフォンでの閲覧を最優先し、PCよりもスマホで見て快適なUIを設計
- タップしやすい大きめのボタンやフォントサイズの使用
- スワイプジェスチャーの活用（例：メルマガリストのページネーション）

## 10. セキュリティ対策

- Supabaseの認証システムを使用してユーザー情報を保護
- APIエンドポイントに認証ミドルウェアを実装
- クロスサイトスクリプティング (XSS) 対策
- クロスサイトリクエストフォージェリ (CSRF) 対策
- メルマガ照合機能による不正アクセス防止

## 11. パフォーマンス最適化

- Next.jsの静的生成とサーバーサイドレンダリングを適切に使用
- 画像の最適化
- コードの分割とレイジーローディング
- モバイルデバイス向けのパフォーマンス最適化（画像の遅延読み込みなど）

## 12. テスト計画

- 単体テスト: Jest
- 統合テスト: React Testing Library
- E2Eテスト: Cypress
- メルマガ照合アルゴリズムのユニットテスト

## 13. デプロイメントフロー

1. GitHubリポジトリにコードをプッシュ
2. Vercelの自動デプロイメントが起動
3. ビルドとテストを実行
4. 成功した場合、本番環境にデプロイ

## 14. 今後の拡張性

- ユーザープロフィール機能
- メルマガの検索機能
- お気に入りメルマガの管理
- 複数のメールソースからのメルマガ取得
- メルマガ照合アルゴリズムの精度向上
