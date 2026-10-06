import {
  loginUser,
  logoutUser,
  refreshAccessToken,
} from "@/lib/api/auth";

import type {
  LoginFormData,
  User,
} from "@/types/auth";

class AuthManager {
  private accessToken: string | null = null;

  private user: User | null = null;

  getAccessToken() {
    return this.accessToken;
  }

  setAccessToken(accessToken: string) {
  this.accessToken = accessToken;
  }

  getUser() {
    return this.user;
  }

  async login(data: LoginFormData) {
    const response = await loginUser(data);

    this.accessToken = response.access;

    this.user = response.user;

    return response;
  }

  setUser(user: User) {
    this.user = user;
  }

  async refresh() {
    const accessToken =
      await refreshAccessToken();

    this.accessToken = accessToken;

    return accessToken;
  }

  async logout() {
    if (this.accessToken) {
      try {
        await logoutUser(this.accessToken);
      } catch {
        // Clear local auth even if
        // the server request fails.
      }
    }

    this.accessToken = null;
    this.user = null;
  }

  clear() {
    this.accessToken = null;
    this.user = null;
  }
}

export const authManager =
  new AuthManager();