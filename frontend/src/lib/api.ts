import axios, { InternalAxiosRequestConfig, AxiosError } from 'axios';

const publicBase = process.env.NEXT_PUBLIC_API_URL ?? '';
const internalBase = process.env.NEXT_INTERNAL_API_URL ?? publicBase;
const runtimeBase = typeof window === 'undefined' ? internalBase : publicBase;
const baseURL = runtimeBase ? runtimeBase.replace(/\/$/, '') + '/api/v1' : '/api/v1';

let accessToken: string | null = null;
let isRefreshing = false;
let refreshPromise: Promise<string | null> | null = null;

function isAuthEndpoint(url?: string) {
  return Boolean(url && url.startsWith('/auth/'));
}

const apiClient = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // allow sending cookies (refresh token)
});

export const authClient = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

export function setAccessToken(token: string | null) {
  accessToken = token;
}

async function refreshAccessToken(): Promise<string | null> {
  if (isRefreshing && refreshPromise) {
    return refreshPromise;
  }

  isRefreshing = true;
  refreshPromise = authClient
    .post('/auth/refresh')
    .then((res) => {
      const token = res.data?.token ?? null;
      accessToken = token;
      return token;
    })
    .catch(() => {
      accessToken = null;
      return null;
    })
    .finally(() => {
      isRefreshing = false;
      refreshPromise = null;
    });

  return refreshPromise;
}

// リクエストインターセプター：アクセストークンがなければリフレッシュを試みる
apiClient.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    if (!config.headers) {
      config.headers = {} as any;
    }

    if (isAuthEndpoint(config.url)) {
      return config;
    }

    if (!accessToken) {
      // try refresh
      const newToken = await refreshAccessToken();
      if (newToken) {
        config.headers.Authorization = `Bearer ${newToken}`;
        return config;
      }
    }

    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// レスポンスインターセプター：401を受けたら1回だけリフレッシュして再試行
apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError & { config?: InternalAxiosRequestConfig }) => {
    const originalRequest = error.config;

    if (originalRequest && isAuthEndpoint(originalRequest.url)) {
      return Promise.reject(error);
    }

    if (error.response?.status === 401 && originalRequest && !(originalRequest as any)._retry) {
      (originalRequest as any)._retry = true;
      const newToken = await refreshAccessToken();
      if (newToken) {
        originalRequest.headers = originalRequest.headers ?? ({} as any);
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return apiClient(originalRequest);
      }
      // リフレッシュ失敗 => サインアウトフローは呼び出し元で扱う
    }

    return Promise.reject(error);
  }
);

export default apiClient;
