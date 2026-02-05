# キャラクターEC アプリケーション

キャラクターグッズを販売するECサイトです。

## 技術スタック

### フロントエンド
- React 18.x
- Next.js 14.x
- TypeScript 5.x
- Tailwind CSS 3.x
- Zustand (状態管理)

### バックエンド
- Ruby 3.3.x
- Ruby on Rails 7.x (API モード)
- PostgreSQL 16.x
- Redis 7.x

### インフラ
- Docker / Docker Compose
- MinIO (S3互換ストレージ)

## ディレクトリ構成

```
project/
├── frontend/              # Next.js フロントエンド
│   ├── src/
│   │   ├── app/           # App Router
│   │   ├── components/    # コンポーネント
│   │   ├── hooks/         # カスタムフック
│   │   ├── lib/           # ユーティリティ
│   │   ├── stores/        # 状態管理
│   │   └── types/         # 型定義
│   └── public/            # 静的ファイル
│
├── backend/               # Rails API バックエンド
│   ├── app/
│   │   ├── controllers/   # コントローラー
│   │   ├── models/        # モデル
│   │   ├── services/      # サービスオブジェクト
│   │   ├── serializers/   # JSONシリアライザー
│   │   └── policies/      # 認可ポリシー
│   ├── config/            # 設定ファイル
│   ├── db/                # データベース関連
│   └── spec/              # テスト
│
├── doc/                   # ドキュメント
├── docker-compose.yml     # Docker Compose 設定
└── README.md
```

## セットアップ

### 前提条件
- Docker Desktop がインストールされていること
- Git がインストールされていること

### 1. リポジトリをクローン

```bash
git clone <repository-url>
cd project2
```

### 2. 環境変数を設定

```bash
cp .env.example .env
```

必要に応じて `.env` ファイルを編集してください。

### 3. Docker コンテナを起動

```bash
# 初回起動（ビルド含む）
docker-compose up --build

# 2回目以降
docker-compose up
```

### 4. データベースのセットアップ

別のターミナルで以下を実行:

```bash
# マイグレーション実行
docker-compose exec backend bundle exec rails db:migrate

# 初期データ投入
docker-compose exec backend bundle exec rails db:seed
```

### 5. アクセス

- **フロントエンド**: http://localhost:3000
- **バックエンドAPI**: http://localhost:3001
- **MinIO コンソール**: http://localhost:9001

## ローカル開発（Docker なし）

### フロントエンド

```bash
cd frontend
npm install
npm run dev
```

### バックエンド

```bash
cd backend
bundle install
rails db:create db:migrate db:seed
rails server -p 3001
```

## API エンドポイント

### 認証
- `POST /api/v1/auth/register` - 新規登録
- `POST /api/v1/auth/login` - ログイン
- `DELETE /api/v1/auth/logout` - ログアウト
- `GET /api/v1/auth/me` - 現在のユーザー情報

### キャラクター
- `GET /api/v1/characters` - 一覧
- `GET /api/v1/characters/:id` - 詳細

### 商品
- `GET /api/v1/products` - 一覧
- `GET /api/v1/products/:id` - 詳細

### カート
- `GET /api/v1/cart` - カート取得
- `POST /api/v1/cart/add_item` - アイテム追加
- `PATCH /api/v1/cart/update_item` - 数量更新
- `DELETE /api/v1/cart/remove_item` - アイテム削除
- `DELETE /api/v1/cart/clear` - カートクリア

### 注文
- `GET /api/v1/orders` - 注文履歴
- `GET /api/v1/orders/:id` - 注文詳細
- `POST /api/v1/orders` - 注文作成

## テストユーザー

| 種類 | メールアドレス | パスワード |
|------|---------------|-----------|
| 管理者 | admin@example.com | password123 |
| 一般ユーザー | user@example.com | password123 |

## コマンド一覧

### Docker

```bash
# コンテナ起動
docker-compose up

# コンテナ起動（バックグラウンド）
docker-compose up -d

# コンテナ停止
docker-compose down

# ログ確認
docker-compose logs -f

# バックエンドコンテナでコマンド実行
docker-compose exec backend <command>

# フロントエンドコンテナでコマンド実行
docker-compose exec frontend <command>
```

### Rails

```bash
# マイグレーション
docker-compose exec backend bundle exec rails db:migrate

# シード投入
docker-compose exec backend bundle exec rails db:seed

# コンソール
docker-compose exec backend bundle exec rails console

# テスト
docker-compose exec backend bundle exec rspec
```

### Next.js

```bash
# 開発サーバー
npm run dev

# ビルド
npm run build

# 本番起動
npm run start

# Lint
npm run lint
```

## ライセンス

MIT License
