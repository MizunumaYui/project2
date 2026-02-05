// ユーザー
export interface User {
  id: string;
  email: string;
  name: string;
  role: 'user' | 'admin';
  createdAt: string;
  updatedAt: string;
}

// キャラクター
export interface Character {
  id: string;
  name: string;
  description: string | null;
  imageUrl: string | null;
  createdAt: string;
  updatedAt: string;
}

// カテゴリ
export interface Category {
  id: string;
  name: string;
  description: string | null;
  createdAt: string;
  updatedAt: string;
}

// 商品
export interface Product {
  id: string;
  characterId: string;
  categoryId: string | null;
  name: string;
  description: string | null;
  price: number;
  stock: number;
  imageUrl: string | null;
  character?: Character;
  category?: Category;
  createdAt: string;
  updatedAt: string;
}

// カートアイテム
export interface CartItem {
  id: string;
  cartId: string;
  productId: string;
  quantity: number;
  product?: Product;
  createdAt: string;
}

// カート
export interface Cart {
  id: string;
  userId: string;
  items: CartItem[];
  createdAt: string;
  updatedAt: string;
}

// 注文ステータス
export type OrderStatus =
  | 'pending'
  | 'paid'
  | 'preparing'
  | 'shipped'
  | 'delivered'
  | 'cancelled';

// 注文アイテム
export interface OrderItem {
  id: string;
  orderId: string;
  productId: string;
  quantity: number;
  price: number;
  product?: Product;
  createdAt: string;
}

// 注文
export interface Order {
  id: string;
  userId: string;
  status: OrderStatus;
  totalAmount: number;
  shippingAddress: string;
  items: OrderItem[];
  createdAt: string;
  updatedAt: string;
}

// お気に入り
export interface UserFavorite {
  id: string;
  userId: string;
  characterId: string;
  character?: Character;
  createdAt: string;
}
