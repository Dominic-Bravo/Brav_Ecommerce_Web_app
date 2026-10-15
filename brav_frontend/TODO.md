# BRAV E-Commerce — Implementation Plan

## Status: Phase 1–6 Complete

---

## Phase 1: Core Infrastructure Setup 🔧

### 1.1 Create `lib/utils.ts` — Unified Class Builder

* [x] Implement `cn(...)` using `class-variance-authority`, `clsx`, and `tailwind-merge`.
* [x] Support consistent class merging without conflicting Tailwind utilities.

### 1.2 Create `store/useCartStore.ts` — Zustand Cart Store

* [x] Implement lightweight Zustand state management for immediate cart UI updates.
* [x] Treat the backend as the source of truth for authenticated users' carts and prices.
* [x] Synchronize cart state with backend responses and invalidate relevant queries after mutations.

### 1.3 Configure QueryClient Global Settings

* [x] Set `staleTime: 5 * 60 * 1000`.
* [x] Set `gcTime: 10 * 60 * 1000`.
* [x] Set `refetchOnWindowFocus: false`.

### 1.4 Update Theme Tokens in `app/globals.css`

* [x] Replace `--color-brav-*` with `--color-brand-*`.
* [x] Apply primary, secondary, accent, and UI background tokens.

### 1.5 Sync Cart State with Backend

* [x] Create `lib/api/cart.ts` with configured Orval cart endpoints and React Query hooks.
* [x] Update `store/useCartStore.ts` to sync cart state with backend responses and invalidate queries after mutations.

---

## Phase 2: Authentication & API Layer 🔐

### 2.1 Fix Auth API Layer Issues

* [x] Move authentication-related types to `types/auth.ts`.
* [x] Update `lib/api/auth.ts` imports.

### 2.2 Fix Categories API

* [x] Update category API integration to pass the correct Axios instance to Orval hooks.

### 2.3 Fix `Can` Component Export

* [x] Change `Can` to a named export.
* [x] Update existing component imports.

### 2.4 Verify Authentication Integration

* [x] Verify the existing login and registration flows.
* [x] Retrieve the current user through `GET /api/v1/users/me/`.
* [x] Handle loading, authenticated, and unauthenticated states.
* [x] Handle expired sessions and unauthorized API responses.
* [x] Verify that browser authentication credentials are stored and transmitted securely.
* [x] Confirm logout clears or invalidates authentication credentials according to the backend's authentication strategy.

---

## Phase 3: Customer-Facing Pages Implementation 🛍️

### 3.1 Home Page (`app/page.tsx`)

* [x] Replace the Next.js default template with the BRAV E-Commerce landing page.
* [x] Add featured products and collections.
* [x] Add category entry points.
* [x] Add navigation to the product catalog, login, and registration pages.
* [x] Allow visitors to access the home page without authentication.
* [x] Display appropriate navigation options for guests and authenticated users.

### 3.2 Authentication Pages

* [x] Login page (`app/login/page.tsx`) and signup page (`app/signup/page.tsx`) exist with existing implementations.
* [x] Auth UI updated to match main page design (`app/page.tsx`) and BRAV design tokens from `DESIGN.md`:
  - Primary buttons: champagne gold (`--color-brand-accent`) with charcoal text (per DESIGN.md section 14)
  - Form controls use `--color-brand-*` tokens for consistency
  - Error messages use `--color-ui-danger`/`--color-ui-danger-bg`
  - Brand panel in auth layout uses `--color-brand-accent` for primary actions
* [x] Form validation and error messages already implemented
* [x] Redirect logic in place (login → `/dashboard`, signup redirects appropriately)
* [x] Routing consistent (no duplicate registration pages)

### 3.3 Public Product Listing (`app/products/page.tsx`)

* [x] Create the public product catalog.
* [x] Allow authenticated and unauthenticated visitors to browse active products.
* [x] Display product images, names, prices, categories, and availability.
* [x] Support product search.
* [x] Support category filtering.
* [ ] Support pagination — pending backend implementation (planned for later).
* [x] Add loading, empty, and error states.
* [x] Use the existing Orval-generated product hooks where available.
* [x] Ensure product listing does not require authentication.

### 3.4 Product Details (`app/products/[id]/page.tsx`)

* [x] Create the dynamic product details page.
* [x] Display product images, descriptions, prices, categories, and stock availability.
* [x] Allow guests to view product details without authentication.
* [x] Add an Add to Cart action.
* [x] If a guest attempts to add an item to the cart, direct them to login or registration.
* [x] Preserve the intended destination so the user can return to the product after authentication.
* [x] Require a successful backend operation before treating an item as added to the cart.

### 3.5 Cart (`app/cart/page.tsx`)

* [x] Create the shopping cart page.
* [x] Require authentication to access the customer's cart.
* [x] Display cart items from the authenticated user's backend cart.
* [x] Use Zustand for responsive UI state where appropriate.
* [x] Allow quantity updates and item removal.
* [x] Display item subtotals, total item count, and cart subtotal.
* [x] Validate quantities and availability using backend responses.
* [x] Handle empty cart and API error states.

### 3.6 Checkout (`app/checkout/page.tsx`)

* [x] Create a single-page checkout form.
* [x] Require authentication before accessing checkout.
* [x] Collect shipping information:

  * Full name
  * Phone number
  * Street address
  * City
  * Postal code
* [x] Display an order summary.
* [x] Submit checkout requests to the backend.
* [x] Let the backend calculate the authoritative order total.
* [x] Handle insufficient stock and validation errors.
* [x] Display confirmation after successful order creation.

### 3.7 Orders History (`app/orders/page.tsx`)

* [x] Create the customer's order history page.
* [x] Require authentication.
* [x] Display only the authenticated customer's orders.
* [x] Show order number, date, total, and status.
* [x] Include useful loading, empty, and error states.

### 3.8 Order Details (`app/orders/[id]/page.tsx`)

* [x] Create the dynamic order details page.
* [x] Require authentication.
* [x] Display order items, quantities, prices, totals, shipping information, and status.
* [x] Handle missing orders and unauthorized access.
* [x] Never assume that hiding an order link prevents unauthorized access; the backend must enforce ownership.

### 3.9 Authentication-Aware Actions and Routing

* [x] Allow guests to browse public pages freely.
* [x] Require authentication for cart operations, checkout, order placement, order history, and profile management.
* [x] Redirect unauthenticated users to login or registration when they attempt a protected action.
* [x] Provide a clear explanation when authentication is required.
* [x] Preserve the intended destination using a validated internal return path.
* [x] Use `<ProtectedRoute>` for protected pages.
* [x] Handle expired authentication without creating redirect loops.
* [x] Keep backend permissions as the actual security boundary.

> **Fixed:** Added `<ProtectedRoute>` wrapper to `app/orders/[id]/page.tsx`. Added `<Can permission="access_admin">` guards to all admin pages (`app/admin/dashboard/page.tsx`, `app/admin/products/page.tsx`, `app/admin/categories/page.tsx`).

---

## Phase 4: Admin Pages Implementation 👑

**Important:** Admin product management must use `app/admin/products/page.tsx`. The public catalog remains at `app/products/page.tsx`.

### 4.1 Admin Dashboard (`app/admin/dashboard/page.tsx`)

* [x] Create the admin dashboard.
* [x] Display total products, customers, orders, and sales.
* [x] Display recent orders and low-stock products.
* [x] Require admin authorization.

### 4.2 Product Management (`app/admin/products/page.tsx`)

* [x] Create the admin product table.
* [x] Implement product creation.
* [x] Implement product editing.
* [x] Implement product deletion or archival.
* [x] Manage product images, prices, categories, and stock.
* [x] Use existing Orval-generated hooks.
* [x] Invalidate relevant product queries after mutations.
* [x] Restrict access to authorized administrators.

### 4.3 Categories Management (`app/admin/categories/page.tsx`)

* [x] Create category management.
* [x] Create and edit categories.
* [x] Delete or deactivate categories where appropriate.
* [x] Support parent-child category organization if provided by the backend.
* [x] Restrict management operations to admins.

### 4.4 Orders Operations (`app/admin/orders/page.tsx`)

* [x] Display all orders for administrators.
* [x] Support filtering by order status.
* [x] Display order details.
* [x] Allow valid order status updates.
* [x] Handle failed updates and invalid state transitions.
* [x] Restrict access to admins.

### 4.5 Customers List (`app/admin/customers/page.tsx`)

* [x] Display the customer directory — implemented using `getUsersApi()` from `lib/api/users.ts`, fetching real data from `/v1/users/`.
* [x] Display relevant account information — name, email, phone, role, and active/inactive status displayed in table format.
* [ ] Support search and pagination if provided by the API — pending backend implementation (API currently returns all users without search/pagination support).
* [x] Avoid displaying unnecessary sensitive information — only shows name, email, phone, role, and status; no passwords or sensitive fields exposed.
* [x] Restrict access to admins — authenticated admin check with `<Can permission="access_admin">` guards and access-denied fallback for non-admin users.

### 4.6 Admin Authorization

* [x] Use the existing `<Can>` component for conditional UI — all admin pages (`dashboard`, `products`, `categories`, `orders`, `customers`) use `<Can permission="access_admin">` for component-level guards.
* [x] Use `<ProtectedRoute>` for protected pages — admin pages now wrapped with `<ProtectedRoute>` for page-level authentication requirement, matching the pattern used by customer-facing protected pages (addresses, cart, checkout).
* [x] Keep role-based authorization in the backend — Django REST Framework enforces admin permissions independently; frontend guards are for UX.
* [x] Verify that customer accounts cannot perform administrative operations — confirmed: all admin pages check `user.role !== "admin"` and show access denied; `<Can>` and `<ProtectedRoute>` provide defense in depth.

---

## Phase 5: Type Safety & Imports 🔐

### 5.1 Fix Profile Components

* [x] Fix `components/profile/Can.tsx` import.
* [x] Fix imports in admin category/product components.
* [x] Fix `AccountInfoForm.tsx` role type issues.

### 5.2 Fix Product Components

* [x] Fix `ProductCard.tsx` Button component props.
* [x] Fix `ProductForm.tsx` Product and SKU imports/types.
* [x] Fix `CategoryForm.tsx` Category import.
* [x] Verify product cards work for unauthenticated visitors.
* [x] Ensure Add to Cart invokes the authentication flow for guests.

### 5.3 Fix UI Components

* [x] Update `components/ui/Button.tsx` to support `size`.
* [x] Update `components/ui/Select.tsx` to use `cn(...)` for class merging.

---

## Phase 6: Data Fetching Modernization (Orval + React Query) 📡

### 6.1 Products

* [x] Use Orval-generated hooks from `api/generated/products/`.
* [x] Apply the configured TanStack Query cache settings.
* [x] Invalidate relevant caches after create/update/delete mutations.
* [x] Verify that product list and detail queries work for unauthenticated visitors — public product listing (`app/products/page.tsx`) and product details (`app/products/[slug]/page.tsx`) already use the same Orval hooks as authenticated views and work without auth. The Add to Cart action handles authentication requirements separately.
* [x] Ensure public product queries do not incorrectly require credentials — the axios instances only add auth headers if an access token exists, so unauthenticated visitors get the public API responses.

### 6.2 Categories

* [x] Migrate product and category forms to Orval-generated hooks.
* [x] Apply the configured cache settings.
* [x] Verify public category queries work without authentication — public product catalog (`app/products/page.tsx`) uses `useCategories()` from `lib/api/products.ts`, which fetches categories from the Orval-generated hook and works without authentication (no token = no auth header sent).

### 6.3 Cart and Order Data

* [x] Use the authenticated user's backend cart as the source of truth.
* [x] Synchronize Zustand state after successful cart operations.
* [x] Refresh relevant queries after checkout and order creation.
* [x] Ensure customer order queries return only the current user's orders.

---

## Public Access and Authorization Rules

### Public — No Authentication Required

* Home page
* Product listing
* Product details
* Category listing and details, where implemented
* Product search, filtering, and pagination
* Login and registration pages

### Customer — Authentication Required

* Add to Cart
* View and manage personal cart
* Checkout and place orders
* View order history and order details
* Manage profile and saved addresses

### Admin — Admin Permissions Required

* Create, update, or delete products
* Manage categories
* Manage inventory
* View and update all orders
* View the customer directory
* Access the admin dashboard

The Django REST Framework backend must enforce these rules independently. Frontend guards and conditional UI are for user experience, not security.

---

## Running Notes

### Existing Completed Work

* Unified `cn(...)` utility.
* Zustand cart store.
* QueryClient global configuration.
* Brand color tokens.
* Authentication API type fixes.
* Categories API integration fixes.
* `Can` component export/import fixes.
* Existing `AuthContext.tsx` and `ProtectedRoute.tsx`.
* Orval-generated API hooks.
* Product and category data-fetching migrations.

### CLAUDE.md Rules

1. Use existing API clients and Orval-generated hooks instead of introducing ad hoc requests.
2. Check `api/generated/` for existing types and hooks before creating new ones.
3. Use `<ProtectedRoute>` for protected routes and `<Can>` for conditional UI.
4. Use `staleTime: 5 * 60 * 1000`, `gcTime: 10 * 60 * 1000`, and `refetchOnWindowFocus: false`.
5. Use `cn(...)` from `lib/utils.ts`.
6. Use Zustand for local cart UI state, but treat backend responses as authoritative.
7. Use the `--color-brand-*` theme tokens.
8. Keep Django responsible for authentication, authorization, order totals, and stock validation.
9. Allow anonymous product browsing while protecting customer and admin actions.
10. Avoid duplicate routes, authentication systems, and API abstractions.
