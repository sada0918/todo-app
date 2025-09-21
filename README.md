# TodoApp

シンプルで使いやすいタスク管理アプリケーション

## 概要

このプロジェクトは、Nx monorepoとNext.jsを使用したTodoアプリケーションです。ユーザー認証機能を備え、安全にタスクを管理できます。

## 主な機能

- ✅ タスクの作成・編集・削除
- 🔐 ユーザー認証（ログイン・新規登録）
- 📱 レスポンシブデザイン
- 🎨 モダンなUI/UX

## 技術スタック

- **フレームワーク**: Next.js 15.x
- **状態管理**: Jotai
- **モノレポ管理**: Nx
- **TypeScript**: 5.8.x
- **スタイリング**: CSS Modules

## 開発環境のセットアップ

### 必要条件

- Node.js 20.x以上
- npm または yarn

### インストール

```bash
npm install
```

## タスクの実行

### 開発サーバーの起動

```sh
npx nx dev client
```

ブラウザで http://localhost:4200 を開いてアプリケーションを確認できます。

### プロダクションビルド

```sh
npx nx build client
```

### テストの実行

```sh
npx nx test client
```

### E2Eテストの実行

```sh
npx nx e2e client-e2e
```

## Vercelへのデプロイ

### 前提条件

1. [Vercel](https://vercel.com)アカウントを作成
2. Vercel CLIをインストール（オプション）

```bash
npm i -g vercel
```

### デプロイ手順

#### 方法1: Vercel CLI（推奨）

```bash
# プロジェクトルートで実行
vercel

# 初回は以下の質問に答える
# - Set up and deploy "~/todo-app"? [Y/n] → Y
# - Which scope do you want to deploy to? → 自分のアカウントを選択
# - Link to existing project? [y/N] → N
# - What's your project's name? → todo-app
# - In which directory is your code located? → ./
# - Want to modify these settings? [y/N] → N

# プロダクションデプロイ
vercel --prod
```

#### 方法2: GitHubと連携（自動デプロイ）

1. GitHubにリポジトリをプッシュ
2. [Vercel Dashboard](https://vercel.com/new)にアクセス
3. "Import Git Repository"を選択
4. リポジトリを選択
5. プロジェクト設定（`vercel.json`が自動的に読み込まれます）
6. "Deploy"をクリック

### 環境変数の設定

Vercel Dashboardで以下の環境変数を設定してください:

- `NEXT_PUBLIC_API_URL`: APIのエンドポイントURL（デフォルト: https://todo.g.kuroco.app）

## プロジェクト構成

```
todo-app/
├── apps/
│   ├── client/              # Next.jsアプリケーション
│   │   ├── src/
│   │   │   ├── app/         # App Router
│   │   │   ├── features/    # 機能別コンポーネント
│   │   │   └── lib/         # ユーティリティ
│   │   └── public/          # 静的ファイル
│   └── client-e2e/          # E2Eテスト
├── vercel.json              # Vercel設定
└── package.json
```

## その他のコマンド

### プロジェクトの詳細を表示

```sh
npx nx show project client
```

### プロジェクトグラフの表示

```sh
npx nx graph
```

### 新しいライブラリの追加

```sh
npx nx g @nx/react:lib mylib
```

## サポート

問題が発生した場合は、GitHubのIssuesセクションで報告してください。

## ライセンス

MIT
