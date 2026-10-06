import { authManager } from "@/lib/auth/AuthManager";

const API_URL = process.env.NEXT_PUBLIC_API_URL;


let refreshPromise: Promise<string> | null = null;

export async function apiFetch(
  endpoint: string,
  options: RequestInit = {},
  retry = true
): Promise<Response> {

  const accessToken =
    authManager.getAccessToken();

  const headers = new Headers(
    options.headers
  );

  headers.set(
    "Accept",
    "application/json"
  );

  if (accessToken) {
    headers.set(
      "Authorization",
      `Bearer ${accessToken}`
    );
  }

  let response = await fetch(
    `${API_URL}${endpoint}`,
    {
      ...options,
      headers,
      credentials: "include",
    }
  );

  // Request succeeded.
  if (response.status !== 401) {
    return response;
  }

  // Prevent infinite retry loops.
  if (!retry) {
    authManager.clear();

    return response;
  }

  try {

    /*
     * If several requests receive 401
     * at the same time, only one refresh
     * request will be sent.
     */
    if (!refreshPromise) {
      refreshPromise =
        authManager.refresh()
          .finally(() => {
            refreshPromise = null;
          });
    }

    const newAccessToken =
      await refreshPromise;

    /*
     * Retry the original request
     * with the new access token.
     */
    const retryHeaders =
      new Headers(options.headers);

    retryHeaders.set(
      "Accept",
      "application/json"
    );

    retryHeaders.set(
      "Authorization",
      `Bearer ${newAccessToken}`
    );

    response = await fetch(
      `${API_URL}${endpoint}`,
      {
        ...options,
        headers: retryHeaders,
        credentials: "include",
      }
    );

    /*
     * If the new token also fails,
     * authentication is no longer valid.
     */
    if (response.status === 401) {
      authManager.clear();
    }

    return response;

  } catch {

    authManager.clear();

    return response;
  }
}


export async function apiClient<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,

    credentials: "include",

    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
  });

  let data: unknown = null;

  try {
    data = await response.json();
  } catch {
    data = null;
  }

  if (!response.ok) {
    const errorData = data as {
      detail?: string;
      message?: string;
    } | null;

    throw new Error(
      errorData?.detail ||
        errorData?.message ||
        `Request failed with status ${response.status}`
    );
  }

  return data as T;
}