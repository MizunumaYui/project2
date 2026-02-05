# キャラクターEC アプリケーション API設計書

## 1. API概要

### 1.1 基本情報
- **ベースURL**: `https://api.example.com/v1`
- **認証方式**: Bearer Token (JWT)
- **レスポンス形式**: JSON

### 1.2 共通ヘッダー

```
Content-Type: application/json
Authorization: Bearer <access_token>  # 認証が必要なエンドポイント
```

### 1.3 共通レスポンス形式

**成功時**
```json
{
  "success": true,
  "data": { ... },
  "message": "Success"
}
```

**エラー時**
```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "エラーメッセージ"
  }
}
```

### 1.4 HTTPステータスコード

| コード | 説明 |
|--------|------|
| 200 | 成功 |
| 201 | 作成成功 |
| 400 | リクエスト不正 |
| 401 | 認証エラー |
| 403 | 権限エラー |
| 404 | リソースが見つからない |
| 500 | サーバーエラー |

---

## 2. 認証 API

### 2.1 会員登録

```
POST /auth/register
```

**リクエスト**
```json
{
  "email": "user@example.com",
  "password": "SecurePassword123",
  "name": "山田太郎"
}
```

**レスポンス (201)**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "email": "user@example.com",
      "name": "山田太郎",
      "role": "user",
      "createdAt": "2026-01-22T10:00:00Z"
    },
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

### 2.2 ログイン

```
POST /auth/login
```

**リクエスト**
```json
{
  "email": "user@example.com",
  "password": "SecurePassword123"
}
```

**レスポンス (200)**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "email": "user@example.com",
      "name": "山田太郎",
      "role": "user"
    },
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

### 2.3 トークン更新

```
POST /auth/refresh
```

**リクエスト**
```json
{
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**レスポンス (200)**
```json
{
  "success": true,
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

---

## 3. キャラクター API

### 3.1 キャラクター一覧取得

```
GET /characters
```

**クエリパラメータ**
| パラメータ | 型 | 必須 | 説明 |
|------------|-----|------|------|
| page | number | No | ページ番号（デフォルト: 1） |
| limit | number | No | 取得件数（デフォルト: 20） |
| search | string | No | キーワード検索 |

**レスポンス (200)**
```json
{
  "success": true,
  "data": {
    "characters": [
      {
        "id": "550e8400-e29b-41d4-a716-446655440001",
        "name": "キャラクターA",
        "description": "人気キャラクターの説明文",
        "imageUrl": "https://storage.example.com/characters/001.jpg",
        "productCount": 15
      }
    ],
    "pagination": {
      "currentPage": 1,
      "totalPages": 5,
      "totalItems": 100,
      "itemsPerPage": 20
    }
  }
}
```

### 3.2 キャラクター詳細取得

```
GET /characters/:characterId
```

**レスポンス (200)**
```json
{
  "success": true,
  "data": {
    "character": {
      "id": "550e8400-e29b-41d4-a716-446655440001",
      "name": "キャラクターA",
      "description": "人気キャラクターの詳細な説明文",
      "imageUrl": "https://storage.example.com/characters/001.jpg",
      "createdAt": "2026-01-01T00:00:00Z",
      "products": [
        {
          "id": "prod-001",
          "name": "アクリルスタンド",
          "price": 1500,
          "imageUrl": "https://storage.example.com/products/001.jpg"
        }
      ]
    }
  }
}
```

### 3.3 キャラクター登録（管理者）

```
POST /admin/characters
```
**認証必須**: Admin権限

**リクエスト**
```json
{
  "name": "新キャラクター",
  "description": "キャラクターの説明",
  "imageUrl": "https://storage.example.com/characters/new.jpg"
}
```

**レスポンス (201)**
```json
{
  "success": true,
  "data": {
    "character": {
      "id": "550e8400-e29b-41d4-a716-446655440099",
      "name": "新キャラクター",
      "description": "キャラクターの説明",
      "imageUrl": "https://storage.example.com/characters/new.jpg",
      "createdAt": "2026-01-22T10:00:00Z"
    }
  }
}
```

### 3.4 キャラクター更新（管理者）

```
PUT /admin/characters/:characterId
```
**認証必須**: Admin権限

**リクエスト**
```json
{
  "name": "更新後の名前",
  "description": "更新後の説明"
}
```

### 3.5 キャラクター削除（管理者）

```
DELETE /admin/characters/:characterId
```
**認証必須**: Admin権限

---

## 4. 商品 API

### 4.1 商品一覧取得

```
GET /products
```

**クエリパラメータ**
| パラメータ | 型 | 必須 | 説明 |
|------------|-----|------|------|
| page | number | No | ページ番号 |
| limit | number | No | 取得件数 |
| characterId | string | No | キャラクターで絞り込み |
| categoryId | string | No | カテゴリで絞り込み |
| minPrice | number | No | 最低価格 |
| maxPrice | number | No | 最高価格 |
| search | string | No | キーワード検索 |
| sort | string | No | ソート（price_asc, price_desc, newest） |

**レスポンス (200)**
```json
{
  "success": true,
  "data": {
    "products": [
      {
        "id": "prod-001",
        "name": "アクリルスタンド キャラクターA",
        "description": "高さ約15cmのアクリルスタンド",
        "price": 1500,
        "stock": 50,
        "imageUrl": "https://storage.example.com/products/001.jpg",
        "character": {
          "id": "char-001",
          "name": "キャラクターA"
        },
        "category": {
          "id": "cat-001",
          "name": "アクリルスタンド"
        }
      }
    ],
    "pagination": {
      "currentPage": 1,
      "totalPages": 10,
      "totalItems": 200,
      "itemsPerPage": 20
    }
  }
}
```

### 4.2 商品詳細取得

```
GET /products/:productId
```

**レスポンス (200)**
```json
{
  "success": true,
  "data": {
    "product": {
      "id": "prod-001",
      "name": "アクリルスタンド キャラクターA",
      "description": "高さ約15cmのアクリルスタンド。クリアな素材で美しい仕上がり。",
      "price": 1500,
      "stock": 50,
      "imageUrl": "https://storage.example.com/products/001.jpg",
      "images": [
        "https://storage.example.com/products/001-1.jpg",
        "https://storage.example.com/products/001-2.jpg"
      ],
      "character": {
        "id": "char-001",
        "name": "キャラクターA",
        "imageUrl": "https://storage.example.com/characters/001.jpg"
      },
      "category": {
        "id": "cat-001",
        "name": "アクリルスタンド"
      },
      "createdAt": "2026-01-01T00:00:00Z"
    }
  }
}
```

### 4.3 商品登録（管理者）

```
POST /admin/products
```
**認証必須**: Admin権限

**リクエスト**
```json
{
  "characterId": "char-001",
  "categoryId": "cat-001",
  "name": "新商品",
  "description": "商品の説明",
  "price": 2000,
  "stock": 100,
  "imageUrl": "https://storage.example.com/products/new.jpg"
}
```

### 4.4 商品更新（管理者）

```
PUT /admin/products/:productId
```

### 4.5 在庫更新（管理者）

```
PATCH /admin/products/:productId/stock
```

**リクエスト**
```json
{
  "stock": 75
}
```

---

## 5. カート API

### 5.1 カート取得

```
GET /cart
```
**認証必須**

**レスポンス (200)**
```json
{
  "success": true,
  "data": {
    "cart": {
      "id": "cart-001",
      "items": [
        {
          "id": "item-001",
          "product": {
            "id": "prod-001",
            "name": "アクリルスタンド キャラクターA",
            "price": 1500,
            "imageUrl": "https://storage.example.com/products/001.jpg",
            "stock": 50
          },
          "quantity": 2,
          "subtotal": 3000
        }
      ],
      "totalItems": 2,
      "totalAmount": 3000
    }
  }
}
```

### 5.2 カートに商品追加

```
POST /cart/items
```
**認証必須**

**リクエスト**
```json
{
  "productId": "prod-001",
  "quantity": 1
}
```

### 5.3 カート商品数量更新

```
PUT /cart/items/:itemId
```
**認証必須**

**リクエスト**
```json
{
  "quantity": 3
}
```

### 5.4 カート商品削除

```
DELETE /cart/items/:itemId
```
**認証必須**

### 5.5 カートクリア

```
DELETE /cart
```
**認証必須**

---

## 6. 注文 API

### 6.1 注文作成

```
POST /orders
```
**認証必須**

**リクエスト**
```json
{
  "shippingAddress": {
    "postalCode": "100-0001",
    "prefecture": "東京都",
    "city": "千代田区",
    "address1": "丸の内1-1-1",
    "address2": "ABCビル 5F",
    "name": "山田太郎",
    "phone": "03-1234-5678"
  },
  "paymentMethod": "credit_card"
}
```

**レスポンス (201)**
```json
{
  "success": true,
  "data": {
    "order": {
      "id": "order-001",
      "orderNumber": "ORD-20260122-001",
      "status": "pending",
      "items": [...],
      "totalAmount": 3000,
      "shippingAddress": {...},
      "createdAt": "2026-01-22T10:00:00Z"
    },
    "paymentUrl": "https://payment.example.com/checkout/xxx"
  }
}
```

### 6.2 注文履歴取得

```
GET /orders
```
**認証必須**

**クエリパラメータ**
| パラメータ | 型 | 必須 | 説明 |
|------------|-----|------|------|
| page | number | No | ページ番号 |
| limit | number | No | 取得件数 |
| status | string | No | ステータスで絞り込み |

### 6.3 注文詳細取得

```
GET /orders/:orderId
```
**認証必須**

### 6.4 注文キャンセル

```
POST /orders/:orderId/cancel
```
**認証必須**（発送前のみ可能）

---

## 7. 管理者用 注文API

### 7.1 全注文一覧取得

```
GET /admin/orders
```
**認証必須**: Admin権限

### 7.2 注文ステータス更新

```
PATCH /admin/orders/:orderId/status
```
**認証必須**: Admin権限

**リクエスト**
```json
{
  "status": "shipped",
  "trackingNumber": "1234567890"
}
```

---

## 8. お気に入り API

### 8.1 お気に入り一覧取得

```
GET /favorites
```
**認証必須**

### 8.2 お気に入り追加

```
POST /favorites
```
**認証必須**

**リクエスト**
```json
{
  "characterId": "char-001"
}
```

### 8.3 お気に入り削除

```
DELETE /favorites/:characterId
```
**認証必須**

---

## 9. カテゴリ API

### 9.1 カテゴリ一覧取得

```
GET /categories
```

**レスポンス (200)**
```json
{
  "success": true,
  "data": {
    "categories": [
      {
        "id": "cat-001",
        "name": "アクリルスタンド",
        "description": "アクリル製のスタンド商品",
        "productCount": 45
      },
      {
        "id": "cat-002",
        "name": "フィギュア",
        "description": "キャラクターフィギュア",
        "productCount": 30
      }
    ]
  }
}
```
