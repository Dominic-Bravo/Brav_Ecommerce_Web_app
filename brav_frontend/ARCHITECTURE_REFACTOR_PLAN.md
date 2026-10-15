# 🏗️ Architecture Refactor & SOLID Compliance Plan

This document tracks the systematic refactoring of the `brav_frontend` codebase to ensure strict adherence to SOLID principles, design pattern consistency, and our established architectural rules.

---

## 🔴 PHASE 1: CRITICAL - API & Auth Standardization
*Goal: Unify the data fetching layer and resolve core authentication circular dependencies.*

### 1.1 Standardize API Client
- [ ] **Unify on Axios:** Standardize all `lib/api/*.ts` files to use a single, configured `axiosInstance` from `lib/api/client.ts`.
- [ ] **Remove Raw Fetch:** Refactor `lib/api/auth.ts` to use the standardized `apiFetch` or `axiosInstance` instead of native `fetch()`.
- [ ] **Centralize Axios Config:** Move `API_URL` stripping and `axiosInstance` creation into `lib/api/client.ts` to prevent duplication in `categories.ts`, `orders.ts`, etc.

### 1.2 Resolve Auth Circular Dependency
- [ ] **Break Import Cycle:** Refactor `lib/auth/AuthManager.ts` so it does not import from `lib/api/`.
- [ ] **Decouple Interceptors:** Ensure `lib/api/client.ts` (the interceptor) is the only place that calls `authManager.getAccessToken()`.

---

## 🟠 PHASE 2: HIGH IMPACT - Admin & Checkout Refactoring
*Goal: Eliminate "God Components" and enforce the "Source of Truth" pattern in Admin areas.*

### 2.1 Admin Pattern Alignment (DIP & SRP)
- [ ] **Replace Manual State in Admin:** In `components/products/AdminProductsPanel.tsx` and `app/admin/customers/page.tsx`, replace `useState`/`useEffect` data fetching with Orval-generated TanStack Query hooks (e.g., `useProducts()`).
- [ ] **Remove Redundant Guards:** Remove manual `user.role` checks in Admin pages; rely exclusively on `<ProtectedRoute>` and `<Can>`.

### 2.2 Checkout Decomposition (SRP)
- [ ] **Decompose Checkout Page:** Break down `app/checkout/page.tsx` into smaller, focused components:
    - `AddressSelection`
    - `PaymentMethodForm`
    - `OrderSummary`

---

## 🟡 PHASE 3: MEDIUM - State & Pattern Refinement
*Goal: Improve robustness of state management and API abstraction layers.*

### 3.1 Robust Cart State (Zustand/Query Sync)
- [ ] **Fix Optimistic Rollbacks:** Refactor `store/useCartStore.ts` to use a safer rollback mechanism (capturing previous state) when backend mutations fail.
- [ ] **Refine Responsibility:** Ensure Zustand is used for immediate UI feedback (e.g., badge counts), while TanStack Query remains the authoritative source for server state.

### 3.2 API Layer Normalization
- [ ] **Standardize Unwrapping:** Create a consistent pattern for unwrapping backend "envelopes" (e.g., `{ data: ... }`) across all `lib/api/*.ts` files to avoid manual logic in every function.

---

## 🟢 PHASE 4: LOW - Governance & Consistency
*Goal: Long-term maintainability and code quality.*

### 4.1 Module Granularity (SRP)
- [ ] **Split Large API Files:** If `lib/api/*.ts` files grow too large, split them into `functions.ts` and `hooks.ts` within dedicated resource folders.

### 4.2 Extensible Authorization (OCP)
- [ ] **Enhance `<Can>` Component:** Refactor the permission logic to support more flexible evaluation strategies (e.g., attribute-based or dynamic permissions) without modifying the component core.

---

## 📝 Notes & Progress
*Use this section to document unexpected findings during refactoring.*

### Completed: Google OAuth Authentication Fixes (2026-10-15)
- **Fixed API Prefix Mismatches:** Corrected `/api` prefix missing on:
  - `lib/api/auth.ts` - Google login endpoint (`/api/v1/users/auth/google/`)
  - `lib/api/auth.ts` - Token refresh endpoint (`/api/v1/users/token/refresh/`)
  - `context/AuthContext.tsx` - User profile check (`/api/v1/users/me/`)
- **Fixed Auth State Restoration:** Updated `AuthContext` to restore access token from `AuthManager` on page load
- **Added Role-Based Routing:**
  - Google callback now redirects customers to `/` (main page)
  - Google callback redirects admins to `/admin/dashboard`
  - Regular login (email/password) already had role-based routing
- **Outcome:** Google OAuth login now works correctly and maintains authentication on page refresh for both customers and admins 
