import apiClient, { authClient, setAccessToken } from './api';
import type { Cart, CartItem, Category, Character, Order, OrderItem, OrderStatus, Product, User } from '@/types';

type JsonApiRelation = {
  id: string;
  type: string;
};

type JsonApiResource = {
  id: string;
  type: string;
  attributes?: Record<string, unknown>;
  relationships?: Record<string, { data?: JsonApiRelation | JsonApiRelation[] }>;
};

type JsonApiDocument = {
  data: JsonApiResource | JsonApiResource[];
  included?: JsonApiResource[];
  meta?: Record<string, unknown>;
};

export interface CartDetails extends Cart {
  totalPrice: number;
  totalItems: number;
}

export interface OrderDetails extends Order {}

export interface AdminDashboardRecentOrder {
  id: string;
  status: OrderStatus;
  total_amount: number;
  shipping_address: string;
  created_at: string;
  updated_at: string;
  user?: {
    id: string;
    name: string;
    email: string;
  } | null;
}

export interface AdminDashboardStats {
  total_users: number;
  total_orders: number;
  total_products: number;
  total_characters: number;
  total_categories: number;
  total_revenue: number;
  pending_orders: number;
  recent_orders: AdminDashboardRecentOrder[];
}

type UserApiPayload = {
  id?: unknown;
  email?: unknown;
  name?: unknown;
  role?: unknown;
  image_url?: unknown;
  imageUrl?: unknown;
  created_at?: unknown;
  updated_at?: unknown;
};

function getAttributes(resource: JsonApiResource) {
  return resource.attributes ?? {};
}

function resolveImageUrl(attributes: Record<string, unknown>): string | null {
  const candidate = attributes.image_url ?? attributes.imageUrl ?? attributes.image;
  return candidate ? String(candidate) : null;
}

function mapUser(payload: UserApiPayload): User {
  return {
    id: String(payload.id ?? ''),
    email: String(payload.email ?? ''),
    name: String(payload.name ?? ''),
    role: (String(payload.role ?? 'user') as User['role']),
    imageUrl: resolveImageUrl(payload),
    createdAt: String(payload.created_at ?? ''),
    updatedAt: String(payload.updated_at ?? ''),
  };
}

function getRelation(resource: JsonApiResource, relationName: string): JsonApiRelation | JsonApiRelation[] | null {
  return resource.relationships?.[relationName]?.data ?? null;
}

function relationId(resource: JsonApiResource, relationName: string): string {
  const relation = getRelation(resource, relationName);
  if (!relation || Array.isArray(relation)) {
    return '';
  }

  return relation.id;
}

function relationIds(resource: JsonApiResource, relationName: string): string[] {
  const relation = getRelation(resource, relationName);
  if (!relation) {
    return [];
  }

  return Array.isArray(relation) ? relation.map((item) => item.id) : [relation.id];
}

function includedMap(included: JsonApiResource[] = []) {
  return new Map(included.map((resource) => [`${resource.type}:${resource.id}`, resource]));
}

function includedResource(
  included: Map<string, JsonApiResource>,
  type: string,
  id: string,
) {
  return included.get(`${type}:${id}`) ?? null;
}

function mapCharacter(resource: JsonApiResource): Character {
  const attributes = getAttributes(resource);

  return {
    id: resource.id,
    name: String(attributes.name ?? ''),
    description: attributes.description ? String(attributes.description) : null,
    imageUrl: resolveImageUrl(attributes),
    createdAt: String(attributes.created_at ?? ''),
    updatedAt: String(attributes.updated_at ?? ''),
  };
}

function mapCategory(resource: JsonApiResource): Category {
  const attributes = getAttributes(resource);

  return {
    id: resource.id,
    name: String(attributes.name ?? ''),
    description: attributes.description ? String(attributes.description) : null,
    createdAt: String(attributes.created_at ?? ''),
    updatedAt: String(attributes.updated_at ?? ''),
  };
}

function mapProduct(resource: JsonApiResource, included: Map<string, JsonApiResource>): Product {
  const attributes = getAttributes(resource);
  const characterId = relationId(resource, 'character');
  const categoryId = relationId(resource, 'category') || null;
  const characterResource = characterId ? includedResource(included, 'character', characterId) : null;
  const categoryResource = categoryId ? includedResource(included, 'category', categoryId) : null;

  return {
    id: resource.id,
    characterId,
    categoryId,
    name: String(attributes.name ?? ''),
    description: attributes.description ? String(attributes.description) : null,
    price: Number(attributes.price ?? 0),
    stock: Number(attributes.stock ?? 0),
    imageUrl: resolveImageUrl(attributes),
    character: characterResource ? mapCharacter(characterResource) : undefined,
    category: categoryResource ? mapCategory(categoryResource) : undefined,
    createdAt: String(attributes.created_at ?? ''),
    updatedAt: String(attributes.updated_at ?? ''),
  };
}

function mapCartItem(resource: JsonApiResource, included: Map<string, JsonApiResource>): CartItem {
  const attributes = getAttributes(resource);
  const productId = relationId(resource, 'product');
  const productResource = productId ? includedResource(included, 'product', productId) : null;

  return {
    id: resource.id,
    cartId: relationId(resource, 'cart'),
    productId,
    quantity: Number(attributes.quantity ?? 0),
    product: productResource ? mapProduct(productResource, included) : undefined,
    createdAt: String(attributes.created_at ?? ''),
  };
}

function mapOrderItem(resource: JsonApiResource, included: Map<string, JsonApiResource>): OrderItem {
  const attributes = getAttributes(resource);
  const productId = relationId(resource, 'product');
  const productResource = productId ? includedResource(included, 'product', productId) : null;

  return {
    id: resource.id,
    orderId: relationId(resource, 'order'),
    productId,
    quantity: Number(attributes.quantity ?? 0),
    price: Number(attributes.price ?? 0),
    product: productResource ? mapProduct(productResource, included) : undefined,
    createdAt: String(attributes.created_at ?? ''),
  };
}

function mapOrder(resource: JsonApiResource, included: Map<string, JsonApiResource>): OrderDetails {
  const attributes = getAttributes(resource);
  const orderItemIds = relationIds(resource, 'order_items');
  const userId = relationId(resource, 'user');
  const userResource = userId ? includedResource(included, 'user', userId) : null;
  const orderItems = orderItemIds
    .map((orderItemId) => includedResource(included, 'order_item', orderItemId))
    .filter((item): item is JsonApiResource => Boolean(item))
    .map((item) => mapOrderItem(item, included));

  return {
    id: resource.id,
    userId,
    user: userResource ? mapUser({ id: userResource.id, ...(getAttributes(userResource) as UserApiPayload) }) : undefined,
    status: String(attributes.status ?? 'pending') as OrderStatus,
    totalAmount: Number(attributes.total_amount ?? 0),
    shippingAddress: String(attributes.shipping_address ?? ''),
    items: orderItems,
    createdAt: String(attributes.created_at ?? ''),
    updatedAt: String(attributes.updated_at ?? ''),
  };
}

async function fetchSingleProduct(identifier: string) {
  try {
    const response = await apiClient.get<JsonApiDocument>(`/products/${encodeURIComponent(identifier)}`);
    const document = response.data;
    const resources = Array.isArray(document.data) ? document.data : [document.data];
    const map = includedMap(document.included);
    return resources.length > 0 ? mapProduct(resources[0], map) : null;
  } catch {
    const response = await apiClient.get<JsonApiDocument>('/products', {
      params: { per_page: 1000 },
    });
    const document = response.data;
    const resources = Array.isArray(document.data) ? document.data : [document.data];
    const map = includedMap(document.included);
    const match = resources.find((resource) => resource.id === identifier || String(getAttributes(resource).name ?? '') === identifier);
    return match ? mapProduct(match, map) : null;
  }
}

async function fetchSingleCharacter(identifier: string) {
  try {
    const response = await apiClient.get<JsonApiDocument>(`/characters/${encodeURIComponent(identifier)}`);
    const document = response.data;
    const resources = Array.isArray(document.data) ? document.data : [document.data];
    const map = includedMap(document.included);
    return resources.length > 0 ? mapCharacter(resources[0]) : null;
  } catch {
    const response = await apiClient.get<JsonApiDocument>('/characters', {
      params: { per_page: 1000 },
    });
    const document = response.data;
    const resources = Array.isArray(document.data) ? document.data : [document.data];
    const match = resources.find((resource) => resource.id === identifier || String(getAttributes(resource).name ?? '') === identifier);
    return match ? mapCharacter(match) : null;
  }
}

export async function fetchCharacters() {
  const response = await apiClient.get<JsonApiDocument>('/characters', {
    params: { per_page: 1000 },
  });
  const document = response.data;
  const resources = Array.isArray(document.data) ? document.data : [document.data];
  return resources.map(mapCharacter);
}

export async function fetchCharacter(identifier: string) {
  return fetchSingleCharacter(identifier);
}



interface AdminCharacterInput {
  name: string;
  description?: string;
  imageFile?: File | null;
}

export async function createAdminCharacter(data: { name: string; description?: string }): Promise<any> {
  // 画像処理を削除し、データのみ送信
  const response = await apiClient.post('/admin/characters', data);
  return response.data;
}

export async function updateAdminCharacter(id: string, data: { name: string; description?: string }): Promise<any> {
  // 画像処理を削除し、データのみ送信
  const response = await apiClient.put(`/admin/characters/${id}`, data);
  return response.data;
}

export async function uploadCharacterImage(id: string, imageFile: File): Promise<any> {
  const formData = new FormData();
  formData.append('file', imageFile);

  const response = await apiClient.post(`/admin/characters/${id}/upload_image`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return response.data;
}

export async function fetchCategories() {
  const response = await apiClient.get<JsonApiDocument>('/categories');
  const document = response.data;
  const resources = Array.isArray(document.data) ? document.data : [document.data];
  return resources.map(mapCategory);
}

export async function fetchProducts() {
  const response = await apiClient.get<JsonApiDocument>('/products', {
    params: { per_page: 1000 },
  });
  const document = response.data;
  const resources = Array.isArray(document.data) ? document.data : [document.data];
  const map = includedMap(document.included);
  return resources.map((resource) => mapProduct(resource, map));
}

export async function fetchProduct(identifier: string) {
  return fetchSingleProduct(identifier);
}

export async function fetchAdminCharacters() {
  const response = await apiClient.get<JsonApiDocument>('/admin/characters', {
    params: { per_page: 1000 },
  });
  const document = response.data;
  const resources = Array.isArray(document.data) ? document.data : [document.data];
  return resources.map(mapCharacter);
}

export async function fetchAdminProducts() {
  const response = await apiClient.get<JsonApiDocument>('/admin/products', {
    params: { per_page: 1000 },
  });
  const document = response.data;
  const resources = Array.isArray(document.data) ? document.data : [document.data];
  const map = includedMap(document.included);
  return resources.map((resource) => mapProduct(resource, map));
}

export async function fetchAdminOrders() {
  const response = await apiClient.get<JsonApiDocument>('/admin/orders', {
    params: { per_page: 1000 },
  });
  const document = response.data;
  const resources = Array.isArray(document.data) ? document.data : [document.data];
  const map = includedMap(document.included);
  return resources.map((resource) => mapOrder(resource, map));
}

export async function fetchAdminDashboard() {
  const response = await apiClient.get<{ data: { statistics: AdminDashboardStats } }>('/admin/dashboard');
  return response.data.data.statistics;
}

export async function fetchCart() {
  const response = await apiClient.get<JsonApiDocument>('/cart');
  const document = response.data;
  const cart = Array.isArray(document.data) ? document.data[0] : document.data;
  const map = includedMap(document.included);
  const cartItemIds = relationIds(cart, 'cart_items');
  const cartItems = cartItemIds
    .map((cartItemId) => includedResource(map, 'cart_item', cartItemId))
    .filter((item): item is JsonApiResource => Boolean(item))
    .map((item) => mapCartItem(item, map));

  const hydratedItems = await Promise.all(
    cartItems.map(async (item) => {
      if (item.product) {
        return item;
      }

      const product = item.productId ? await fetchProduct(item.productId) : null;
      return {
        ...item,
        product: product ?? undefined,
      };
    }),
  );

  const attributes = getAttributes(cart);

  return {
    id: cart.id,
    userId: '',
    items: hydratedItems,
    createdAt: String(attributes.created_at ?? ''),
    updatedAt: String(attributes.updated_at ?? ''),
    totalPrice: Number(attributes.total_price ?? 0),
    totalItems: Number(attributes.total_items ?? 0),
  } satisfies CartDetails;
}

export async function fetchOrders() {
  const response = await apiClient.get<JsonApiDocument>('/orders', {
    params: { per_page: 100 },
  });
  const document = response.data;
  const resources = Array.isArray(document.data) ? document.data : [document.data];
  const map = includedMap(document.included);
  const orders = resources.map((resource) => mapOrder(resource, map));

  return Promise.all(
    orders.map(async (order) => {
      const hydratedItems = await Promise.all(
        order.items.map(async (item) => {
          if (item.product) {
            return item;
          }

          const product = item.productId ? await fetchProduct(item.productId) : null;
          return {
            ...item,
            product: product ?? undefined,
          };
        }),
      );

      return {
        ...order,
        items: hydratedItems,
      };
    }),
  );
}

// ============================================
// Auth API
// ============================================

export interface AuthResponse {
  user: User;
  token: string;
}

export async function login(email: string, password: string): Promise<AuthResponse> {
  const response = await authClient.post<{ user: UserApiPayload; token: string }>('/auth/login', {
    email,
    password,
  });
  return {
    user: mapUser(response.data.user),
    token: response.data.token,
  };
}

export async function register(email: string, password: string, password_confirmation: string, name: string): Promise<AuthResponse> {
  const response = await authClient.post<{ user: UserApiPayload; token: string }>('/auth/register', {
    email,
    password,
    password_confirmation,
    name,
  });
  return {
    user: mapUser(response.data.user),
    token: response.data.token,
  };
}

export async function logout(): Promise<void> {
  await authClient.delete('/auth/logout');
  // clear in-memory access token
  setAccessToken(null);
}

export async function getCurrentUser() {
  const response = await apiClient.get<{ user: UserApiPayload }>('/auth/me');
  return mapUser(response.data.user);
}

export async function updateProfile(data: { name?: string; email?: string; image_url?: string | null; password?: string; password_confirmation?: string; }) {
  const response = await apiClient.patch<{ user: UserApiPayload }>('/users/profile', data);
  return mapUser(response.data.user);
}

export async function uploadProfileImage(file: File): Promise<{ user: User; imageUrl: string }> {
  const formData = new FormData();
  formData.append('image', file);

  const response = await apiClient.post<{ user: UserApiPayload; image_url?: string }>('/users/profile/image', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

  return {
    user: mapUser(response.data.user),
    imageUrl: String(response.data.image_url ?? response.data.user.image_url ?? ''),
  };
}

// ============================================
// Cart API
// ============================================

export async function addCartItem(productId: string, quantity: number): Promise<CartDetails> {
  const response = await apiClient.post<JsonApiDocument>('/cart/add_item', {
    product_id: productId,
    quantity,
  });
  const document = response.data;
  const cart = Array.isArray(document.data) ? document.data[0] : document.data;
  const map = includedMap(document.included);
  const cartItemIds = relationIds(cart, 'cart_items');
  const cartItems = cartItemIds
    .map((cartItemId) => includedResource(map, 'cart_item', cartItemId))
    .filter((item): item is JsonApiResource => Boolean(item))
    .map((item) => mapCartItem(item, map));

  const hydratedItems = await Promise.all(
    cartItems.map(async (item) => {
      if (item.product) return item;
      const product = item.productId ? await fetchProduct(item.productId) : null;
      return { ...item, product: product ?? undefined };
    }),
  );

  const attributes = getAttributes(cart);

  return {
    id: cart.id,
    userId: '',
    items: hydratedItems,
    createdAt: String(attributes.created_at ?? ''),
    updatedAt: String(attributes.updated_at ?? ''),
    totalPrice: Number(attributes.total_price ?? 0),
    totalItems: Number(attributes.total_items ?? 0),
  };
}

export async function updateCartItem(productId: string, quantity: number): Promise<CartDetails> {
  const response = await apiClient.patch<JsonApiDocument>('/cart/update_item', {
    product_id: productId,
    quantity,
  });
  const document = response.data;
  const cart = Array.isArray(document.data) ? document.data[0] : document.data;
  const map = includedMap(document.included);
  const cartItemIds = relationIds(cart, 'cart_items');
  const cartItems = cartItemIds
    .map((cartItemId) => includedResource(map, 'cart_item', cartItemId))
    .filter((item): item is JsonApiResource => Boolean(item))
    .map((item) => mapCartItem(item, map));

  const hydratedItems = await Promise.all(
    cartItems.map(async (item) => {
      if (item.product) return item;
      const product = item.productId ? await fetchProduct(item.productId) : null;
      return { ...item, product: product ?? undefined };
    }),
  );

  const attributes = getAttributes(cart);

  return {
    id: cart.id,
    userId: '',
    items: hydratedItems,
    createdAt: String(attributes.created_at ?? ''),
    updatedAt: String(attributes.updated_at ?? ''),
    totalPrice: Number(attributes.total_price ?? 0),
    totalItems: Number(attributes.total_items ?? 0),
  };
}

export async function removeCartItem(productId: string): Promise<CartDetails> {
  const response = await apiClient.delete<JsonApiDocument>('/cart/remove_item', {
    data: {
      product_id: productId,
    },
  });
  const document = response.data;
  const cart = Array.isArray(document.data) ? document.data[0] : document.data;
  const map = includedMap(document.included);
  const cartItemIds = relationIds(cart, 'cart_items');
  const cartItems = cartItemIds
    .map((cartItemId) => includedResource(map, 'cart_item', cartItemId))
    .filter((item): item is JsonApiResource => Boolean(item))
    .map((item) => mapCartItem(item, map));

  const hydratedItems = await Promise.all(
    cartItems.map(async (item) => {
      if (item.product) return item;
      const product = item.productId ? await fetchProduct(item.productId) : null;
      return { ...item, product: product ?? undefined };
    }),
  );

  const attributes = getAttributes(cart);

  return {
    id: cart.id,
    userId: '',
    items: hydratedItems,
    createdAt: String(attributes.created_at ?? ''),
    updatedAt: String(attributes.updated_at ?? ''),
    totalPrice: Number(attributes.total_price ?? 0),
    totalItems: Number(attributes.total_items ?? 0),
  };
}

export async function clearCart(): Promise<CartDetails> {
  const response = await apiClient.delete<JsonApiDocument>('/cart/clear');
  const document = response.data;
  const cart = Array.isArray(document.data) ? document.data[0] : document.data;
  const map = includedMap(document.included);
  const cartItemIds = relationIds(cart, 'cart_items');
  const cartItems = cartItemIds
    .map((cartItemId) => includedResource(map, 'cart_item', cartItemId))
    .filter((item): item is JsonApiResource => Boolean(item))
    .map((item) => mapCartItem(item, map));

  const hydratedItems = await Promise.all(
    cartItems.map(async (item) => {
      if (item.product) return item;
      const product = item.productId ? await fetchProduct(item.productId) : null;
      return { ...item, product: product ?? undefined };
    }),
  );

  const attributes = getAttributes(cart);

  return {
    id: cart.id,
    userId: '',
    items: hydratedItems,
    createdAt: String(attributes.created_at ?? ''),
    updatedAt: String(attributes.updated_at ?? ''),
    totalPrice: Number(attributes.total_price ?? 0),
    totalItems: Number(attributes.total_items ?? 0),
  };
}

// ============================================
// Orders API
// ============================================

export async function createOrder(shippingAddress: string): Promise<OrderDetails> {
  const response = await apiClient.post<JsonApiDocument>('/orders', {
    shipping_address: shippingAddress,
  });
  const document = response.data;
  const resources = Array.isArray(document.data) ? document.data : [document.data];
  const map = includedMap(document.included);
  const orderResource = resources[0];
  return mapOrder(orderResource, map);
}

// ============================================
// Favorites API
// ============================================

export interface UserFavorite {
  id: string;
  characterId: string;
  character?: Character;
  createdAt: string;
}

function mapUserFavorite(resource: JsonApiResource, included: Map<string, JsonApiResource>): UserFavorite {
  const characterId = relationId(resource, 'character');
  const characterResource = characterId ? includedResource(included, 'character', characterId) : null;

  return {
    id: resource.id,
    characterId,
    character: characterResource ? mapCharacter(characterResource) : undefined,
    createdAt: String(getAttributes(resource).created_at ?? ''),
  };
}

export async function fetchFavorites(): Promise<UserFavorite[]> {
  const response = await apiClient.get<JsonApiDocument>('/favorites');
  const document = response.data;
  const resources = Array.isArray(document.data) ? document.data : [document.data];
  const map = includedMap(document.included);
  return resources.map((resource) => mapUserFavorite(resource, map));
}

export async function addFavorite(characterId: string): Promise<UserFavorite> {
  const response = await apiClient.post<JsonApiDocument>('/favorites', {
    character_id: characterId,
  });
  const document = response.data;
  const resources = Array.isArray(document.data) ? document.data : [document.data];
  const map = includedMap(document.included);
  return mapUserFavorite(resources[0], map);
}

export async function removeFavorite(favoriteId: string): Promise<void> {
  await apiClient.delete(`/favorites/${favoriteId}`);
}


//管理者画面キャラクター削除
export async function deleteAdminCharacter(id: string): Promise<void> {
  await apiClient.delete(`/admin/characters/${id}`);
}