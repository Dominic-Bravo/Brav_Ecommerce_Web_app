import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";
import { authManager } from "@/lib/auth/AuthManager";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "";
const baseURL = API_URL.replace(/\/api$/, "");

/**
 * Centralized Axios instance for all API calls.
 * Handles:
 * - Base URL stripping
 * - Credentials (cookies) inclusion
 * - Automatic Bearer token injection via AuthManager
 * - Automatic 401 token refresh and request retrying
 */
export const axiosInstance = axios.create({
  baseURL,
  withCredentials: true,
  headers: {
    Accept: "application/json",
  },
});

// ─── Request Interceptor: Inject Token ──────────────────────────────────────────

axiosInstance.interceptors.request.use((config) => {
  const accessToken = authManager.getAccessToken();
  if (accessToken && config.headers) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
});

// ─── Response Interceptor: Handle 401 & Refresh ──────────────────────────────────

let refreshPromise: Promise<string> | null = null;

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    // If the error is a 401 and we haven't retried this request yet
    if (error.response?.status === 401 && originalRequest && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // Ensure only one refresh request is in flight at a time
        if (!refreshPromise) {
          refreshPromise = authManager.refresh().finally(() => {
            refreshPromise = null;
          });
        }

        const newToken = await refreshPromise;

        // Update the failed request with the new token and retry
        if (originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
        }

        return axiosInstance(originalRequest);
      } catch (refreshError) {
        // If refresh fails, clear authentication state
        authManager.clear();
        return Promise.reject(refreshError);
      }
    }

    // For any other error (or if retries failed), reject
    return Promise.reject(error);
  }
);

// ─── Backward Compatibility Wrappers ──────────────────────────────────────────

/**
 * A wrapper around axiosInstance to maintain compatibility with existing code
 * using the apiFetch/apiClient signature.
 */
export async function apiFetch<T = any>(
  endpoint: string,
  options: any = {}
): Promise<Response> {
  // Note: This returns a Response object to satisfy existing code expecting standard fetch behavior.
  // This is a temporary bridge during the refactor.
  try {
    const response = await axiosInstance({
      url: endpoint,
      method: options.method || "GET",
      data: options.body,
      headers: options.headers,
    });

    // Simulate Response object
    return new Response(JSON.stringify(response.data), {
      status: response.status,
      headers: { "Content-Type": "application/json" },
    }) as unknown as Response;
  } catch (error: any) {
    // Simulate failed Response object
    const status = error.response?.status || 500;
    const message = error.response?.data?.detail || error.response?.data?.message || error.message || "Request failed";

    return new Response(JSON.stringify({ detail: message }), {
      status,
      headers: { "Content-Type": "application/json" },
    }) as unknown as Response;
  }
}

/**
 * A wrapper around axiosInstance that returns the parsed data directly.
 */
export async function apiClient<T>(
  endpoint: string,
  options: any = {}
): Promise<T> {
  const response = await axiosInstance({
    url: endpoint,
    method: options.method || "GET",
    data: options.body,
    headers: options.headers,
  });

  return response.data as T;
}
