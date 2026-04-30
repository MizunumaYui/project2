# セットアップスクリプト使用ガイド

このプロジェクトの Docker コンテナおよびデータベースを管理するための PowerShell スクリプト集です。

## 📋 前提条件

- **Docker Desktop** がインストール済み
- **PowerShell 5.1 以上**
- **Git** がインストール済み

## 🚀 初回セットアップ

### ステップ 1: PowerShell 実行ポリシーの設定

Windows PowerShell は、セキュリティのためデフォルトではローカルスクリプト実行が制限されています。

**PowerShell を管理者として実行** し、以下を実行してください：

```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

プロンプトで `Y` を入力して確認します。

### ステップ 2: セットアップスクリプト実行

プロジェクトルート (`c:\Users\tmsa5\Desktop\PG\project2`) で PowerShell を開き、以下を実行：

```powershell
.\setup.ps1
```

このスクリプトが以下を実行します：
1. ✅ Docker イメージをビルド
2. ✅ すべてのコンテナを起動（PostgreSQL, Redis, MinIO, Rails, Next.js）
3. ✅ Rails マイグレーション実行
4. ✅ 初期データ投入（Seed）

### ステップ 3: アクセス確認

セットアップが完了したら、以下にアクセスできます：

| サービス | URL | 説明 |
|---------|-----|------|
| フロントエンド | http://localhost:3000 | Next.js アプリケーション |
| バックエンド API | http://localhost:3001 | Rails API |
| MinIO コンソール | http://localhost:9001 | ファイルストレージ |
| PostgreSQL | localhost:5432 | データベース |

### テストアカウント

シード完了後、以下のテストアカウントが自動作成されます：

- **ユーザー**: `user@example.com` / `password123`
- **管理者**: `admin@example.com` / `password123`

---

## 📚 スクリプト一覧

### `setup.ps1` - フル初期化
**用途**: 初回セットアップ、または完全な再構築

```powershell
.\setup.ps1
```

実行内容：
- Docker イメージビルド
- コンテナ起動
- DB マイグレーション
- 初期データ投入

---

### `start.ps1` - コンテナ起動（DB処理なし）
**用途**: コンテナの再起動（DB初期化が不要な場合）

```powershell
.\start.ps1
```

既存のDB内容を保持したまま、コンテナを起動します。

---

### `stop.ps1` - コンテナ停止
**用途**: 開発終了時、コンテナを停止

```powershell
.\stop.ps1
```

コンテナは停止しますが、データベースデータは保持されます。

---

### `cleanup.ps1` - 完全初期化（⚠️ 危険）
**用途**: すべてを削除して初期状態に戻す

```powershell
.\cleanup.ps1
```

⚠️ **警告**: 以下が削除されます：
- すべての Docker コンテナ
- すべての Docker イメージ
- すべてのボリューム（**データベースデータ含む**）

実行時に確認が入ります。

---

### `reseed.ps1` - データベース再投入
**用途**: 既存DBを保持しながら、初期データをリセット

```powershell
.\reseed.ps1
```

テーブル内の既存データを削除して、種(seeds.rb)から新たに投入します。

---

### `console.ps1` - Rails コンソール
**用途**: Rails コンソールでインタラクティブに操作

```powershell
.\console.ps1
```

例：
```
irb(main):001:0> User.all
irb(main):002:0> Character.count
irb(main):003:0> exit
```

---

## 🔍 ログ確認

コンテナのログをリアルタイムで確認：

```powershell
# バックエンド（Rails）ログ
docker-compose logs -f backend

# フロントエンド（Next.js）ログ
docker-compose logs -f frontend

# データベースログ
docker-compose logs -f db

# すべてのログ
docker-compose logs -f
```

ログ確認を終了：`Ctrl+C`

---

## 🛠️ トラブルシューティング

### ポート競合エラー
別のアプリケーションがポート 3000, 3001 などを使用している場合：

```powershell
# ポート使用状況を確認
Get-NetTCPConnection -LocalPort 3000

# そのプロセスを終了（例）
Stop-Process -Id <PID>
```

### Docker デーモン起動エラー
Docker Desktop が起動していることを確認してください。

### マイグレーション失敗
以下を試してください：

```powershell
# 状態をリセット
.\cleanup.ps1

# 再セットアップ
.\setup.ps1
```

### Rails gem インストール失敗
バックエンド Dockerfile を確認し、Gemfile の依存関係を確認：

```powershell
docker-compose exec backend bundle install
```

---

## 📝 開発フロー例

### 1. 朝、開発開始
```powershell
.\start.ps1  # コンテナ起動
```

### 2. 開発作業
ブラウザで http://localhost:3000 にアクセス

### 3. DB操作が必要な場合
```powershell
.\console.ps1  # Rails コンソール

# コンソール内で操作
User.create(email: "test@example.com", ...)
```

### 4. テストデータをリセット
```powershell
.\reseed.ps1
```

### 5. 開発終了
```powershell
.\stop.ps1
```

---

## 🔐 環境変数

`.env` ファイルで以下をカスタマイズできます：

```env
RAILS_ENV=development
DATABASE_USERNAME=postgres
DATABASE_PASSWORD=postgres
JWT_SECRET_KEY=your-secret-key
MINIO_ROOT_USER=minioadmin
MINIO_ROOT_PASSWORD=minioadmin
```

---

## 📞 その他のコマンド

### DB マイグレーション（手動）
```powershell
docker-compose exec -T backend bundle exec rails db:migrate
```

### マイグレーション状態確認
```powershell
docker-compose exec -T backend bundle exec rails db:migrate:status
```

### 特定マイグレーションをロールバック
```powershell
docker-compose exec -T backend bundle exec rails db:rollback STEP=1
```

### テスト実行
```powershell
docker-compose exec backend bundle exec rspec
```

---

## ✅ セットアップ完了チェック

すべてが正常に動作しているか確認：

```powershell
# 1. ブラウザで確認
http://localhost:3000           # Next.js フロントエンド
http://localhost:3001/api/v1/health  # Rails ヘルスチェック

# 2. Rails コンソールで確認
.\console.ps1
# コンソール内で
User.count
Character.count
Category.count
Product.count
```

すべてが表示されれば、セットアップは成功です！ 🎉
