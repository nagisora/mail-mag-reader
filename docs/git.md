# 個人開発者向けGitブランチ運用ガイド（最適化版）

## 主要ブランチ関係性

| ブランチタイプ | 作成元 | マージ先 | 用途                  | 命名例               | ライフサイクル          |
|----------------|--------|----------|-----------------------|----------------------|-------------------------|
| **main**       | -      | -        | 本番環境コード        | `main`               | 永続存在                |
| **feature/**   | main   | main     | 新機能開発            | `feat/dark-mode`     | 機能完了後削除          |
| **hotfix/**    | main   | main     | 緊急修正              | `hotfix/login-bug`   | 修正反映後削除          |

### 関係性ルール
1. **feature → main**  
   - 機能開発時の基本フロー
2. **hotfix → main**  
   - 本番環境への直接修正

### 禁止事項
- hotfixブランチで新機能開発を行わない
- mainブランチへの直接コミット（保護ルール推奨）

## ブランチ命名ルール

### プレフィックス方式
| プレフィックス | 用途                  | 命名例                  |
|----------------|-----------------------|-------------------------|
| `feat/`        | 新機能開発            | `feat/user-profile`     |
| `fix/`         | バグ修正              | `fix/login-error`       |
| `refactor/`    | リファクタリング      | `refactor/api-client`   |
| `docs/`        | ドキュメント更新      | `docs/arch-design`      |
| `chore/`       | ビルド/ツール関連     | `chore/ci-config`       |

**命名ルール**:  
- プレフィックスは小文字で統一  
- スラッシュ以降はケバブケース（例: `feat/chat-function`）  
- スコープを追加可能（例: `feat(ui)/dark-mode`）

## ワークフロー図解
```mermaid
gitGraph
    commit id: "Initialize"
    branch feat/search
    checkout feat/search
    commit id: "Add search UI"
    commit id: "Implement API"
    checkout main
    merge feat/search
    tag v1.0.0
    branch hotfix/validation
    checkout hotfix/validation
    commit id: "Fix input validation"
    checkout main
    merge hotfix/validation
    tag v1.0.1
```

### 指示プロンプト
```markdown
以下のルールに従い、ブランチ名を作成してください。
```

## コミットメッセージ規範（Conventional Commits）

### メッセージ例

#### 一行コミット
```markdown
feat(auth): パスワードリセット機能を追加する #123
``` 
※Issue番号がある場合は末尾に記載する

#### 複数行
```markdown
feat(auth): パスワードリセット機能を追加する

- リセットトークン生成を実装する
- パスワードリセット用メールテンプレートを追加する
- リセットフローのAPIエンドポイントを作成する

Closes #45
```

### 指示プロンプト
```markdown
コード差分を参照し、以下の例を参考に、一行コミットメッセージを作成してください。

feat(auth): パスワードリセット機能を追加する #123
``` 

### 基本フォーマット
```markdown
<type>(<scope>): <subject>

<body>

<footer>
```
※一行目以降は省略可能

### 必須要素
| 要素      | 説明                                                                 |
|-----------|----------------------------------------------------------------------|
| `type`    | コミットの種類（feat, fix, choreなど）                               |
| `subject` | 変更内容の簡潔な説明（現在形、50文字以内）                           |
| `body`    | 変更の詳細説明（現在形、任意・72文字折返し）                         |
| `footer`  | 重大な変更（BREAKING CHANGE）やIssue参照（Closes #123）              |

### タイプ一覧
| タイプ     | 説明                                     |
|------------|------------------------------------------|
| `feat`     | 新機能追加                               |
| `fix`      | バグ修正                                 |
| `docs`     | ドキュメント変更                         |
| `style`    | 書式設定（コードの動作に影響なし）       |
| `refactor` | リファクタリング                         |
| `test`     | テスト関連                               |
| `chore`    | ビルドプロセス/ツールの変更              |
| `ci`       | CI設定関連                               |
| `perf`     | パフォーマンス改善                       |
| `build`    | ビルドシステム/依存関係の変更            |

## リリース管理手法
```bash
# 新機能リリース例
git checkout -b feat/new-feature
# 開発作業...
git commit -m "feat(core): 新機能を追加する"
git checkout main
git merge --no-ff feat/new-feature
git tag -a v1.1.0 -m "新機能リリース"

# ホットフィックス例
git checkout -b hotfix/critical-bug
# 修正作業...
git commit -m "fix(core): 重大なバグを修正する"
git checkout main
git merge --no-ff hotfix/critical-bug
git tag -a v1.1.1 -m "緊急修正リリース"
```

## 推奨設定
1. **ブランチ保護ルール**（GitHub/GitLab）：
   - mainブランチへの直接push禁止
   - マージ前のCIパイプライン成功必須
2. **.gitconfig設定例**：
   ```ini
   [alias]
       lol = log --graph --decorate --pretty=oneline --abbrev-commit
       recent = log -n5 --since='1 days ago'
   ```

## 発展テクニック
- **インタラクティブリベース**：`git rebase -i HEAD~3`
- **コミット修正**：`git commit --amend`
- **変更履歴検索**：`git log -S "検索文字列"`
- **差分分析**：`git diff --stat commit1 commit2`

> **Tip**  
> チーム開発に移行する際はdevelopブランチとPR運用を再導入してください。  
> 毎週金曜日に`git gc --aggressive`でリポジトリ最適化を推奨します。

## 参考リンク
- [Conventional Commits 公式](https://www.conventionalcommits.org/)
- [コミットメッセージのベストプラクティス](https://qiita.com/itosho/items/9565c6ad2ffc24c09364)
