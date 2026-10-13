# BRAV E-Commerce — Implementation Plan

## Status: Phase 1 & 2 Complete | Phase 3–6 In Progress

---

## Phase 1: Core Infrastructure Setup 🔧

### 1.1 Create `lib/utils.ts` — Unified Class Builder

* [x] Implement `cn(...)` using `class-variance-authority`, `clsx`, and `tailwind-merge`.
* [x] Support consistent class merging without conflicting Tailwind utilities.

### 1.2 Create `store/useCartStore.ts` — Zustand Cart Store

* [x] Implement lightweight Zustand state management for immediate cart UI updates.
* [ ] Treat the backend as the source of truth for authenticated users' carts and prices.
* [ ] Synchronize cart state with backend responses and invalidate relevant queries after mutations.

### 1.3 Configure QueryClient Global Settings

* [x] Set `staleTime: 5 * 60 * 1000`.
* [x] Set `gcTime: 10 * 60 * 1000`.
* [x] Set `refetchOnWindowFocus: false`.

### 1.4 Update Theme Tokens in `app/globals.css`

* [x] Replace `--color-brav-*` with `--color-brand-*`.
* [x] Apply primary, secondary, accent, and UI background tokens.

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

* [ ] Create or finalize the registration page at `app/register/page.tsx`.
* [ ] Migrate or reuse the existing `app/signup/page.tsx` implementation.
* [ ] Ensure routing is consistent and does not create duplicate registration pages.
* [ ] Implement the login page using the existing authentication API.
* [ ] Validate forms and display useful error messages.
* [ ] Redirect authenticated users to their intended destination after successful login when appropriate.

### 3.3 Public Product Listing (`app/products/page.tsx`)

* [ ] Create the public product catalog.
* [ ] Allow authenticated and unauthenticated visitors to browse active products.
* [ ] Display product images, names, prices, categories, and availability.
* [ ] Support product search.
* [ ] Support category filtering.
* [ ] Support pagination.
* [ ] Add loading, empty, and error states.
* [ ] Use the existing Orval-generated product hooks where available.
* [ ] Ensure product listing does not require authentication.

### 3.4 Product Details (`app/products/[id]/page.tsx`)

* [ ] Create the dynamic product details page.
* [ ] Display product images, descriptions, prices, categories, and stock availability.
* [ ] Allow guests to view product details without authentication.
* [ ] Add an Add to Cart action.
* [ ] If a guest attempts to add an item to the cart, direct them to login or registration.
* [ ] Preserve the intended destination so the user can return to the product after authentication.
* [ ] Require a successful backend operation before treating an item as added to the cart.

### 3.5 Cart (`app/cart/page.tsx`)

* [ ] Create the shopping cart page.
* [ ] Require authentication to access the customer's cart.
* [ ] Display cart items from the authenticated user's backend cart.
* [ ] Use Zustand for responsive UI state where appropriate.
* [ ] Allow quantity updates and item removal.
* [ ] Display item subtotals, total item count, and cart subtotal.
* [ ] Validate quantities and availability using backend responses.
* [ ] Handle empty cart and API error states.

### 3.6 Checkout (`app/checkout/page.tsx`)

* [ ] Create a single-page checkout form.
* [ ] Require authentication before accessing checkout.
* [ ] Collect shipping information:

  * Full name
  * Phone number
  * Street address
  * City
  * Postal code
* [ ] Display an order summary.
* [ ] Submit checkout requests to the backend.
* [ ] Let the backend calculate the authoritative order total.
* [ ] Handle insufficient stock and validation errors.
* [ ] Display confirmation after successful order creation.

### 3.7 Orders History (`app/orders/page.tsx`)

* [ ] Create the customer's order history page.
* [ ] Require authentication.
* [ ] Display only the authenticated customer's orders.
* [ ] Show order number, date, total, and status.
* [ ] Include useful loading, empty, and error states.

### 3.8 Order Details (`app/orders/[id]/page.tsx`)

* [ ] Create the dynamic order details page.
* [ ] Require authentication.
* [ ] Display order items, quantities, prices, totals, shipping information, and status.
* [ ] Handle missing orders and unauthorized access.
* [ ] Never assume that hiding an order link prevents unauthorized access; the backend must enforce ownership.

### 3.9 Authentication-Aware Actions and Routing

* [ ] Allow guests to browse public pages freely.
* [ ] Require authentication for cart operations, checkout, order placement, order history, and profile management.
* [ ] Redirect unauthenticated users to login or registration when they attempt a protected action.
* [ ] Provide a clear explanation when authentication is required.
* [ ] Preserve the intended destination using a validated internal return path.
* [ ] Use `<ProtectedRoute>` for protected pages.
* [ ] Handle expired authentication without creating redirect loops.
* [ ] Keep backend permissions as the actual security boundary.

---

## Phase 4: Admin Pages Implementation 👑

**Important:** Admin product management must use `app/admin/products/page.tsx`. The public catalog remains at `app/products/page.tsx`.

### 4.1 Admin Dashboard (`app/admin/dashboard/page.tsx`)

* [ ] Create the admin dashboard.
* [ ] Display total products, customers, orders, and sales.
* [ ] Display recent orders and low-stock products.
* [ ] Require admin authorization.

### 4.2 Product Management (`app/admin/products/page.tsx`)

* [ ] Create the admin product table.
* [ ] Implement product creation.
* [ ] Implement product editing.
* [ ] Implement product deletion or archival.
* [ ] Manage product images, prices, categories, and stock.
* [ ] Use existing Orval-generated hooks.
* [ ] Invalidate relevant product queries after mutations.
* [ ] Restrict access to authorized administrators.

### 4.3 Categories Management (`app/admin/categories/page.tsx`)

* [ ] Create category management.
* [ ] Create and edit categories.
* [ ] Delete or deactivate categories where appropriate.
* [ ] Support parent-child category organization if provided by the backend.
* [ ] Restrict management operations to admins.

### 4.4 Orders Operations (`app/admin/orders/page.tsx`)

* [ ] Display all orders for administrators.
* [ ] Support filtering by order status.
* [ ] Display order details.
* [ ] Allow valid order status updates.
* [ ] Handle failed updates and invalid state transitions.
* [ ] Restrict access to admins.

### 4.5 Customers List (`app/admin/customers/page.tsx`)

* [ ] Display the customer directory.
* [ ] Display relevant account information.
* [ ] Support search and pagination if provided by the API.
* [ ] Avoid displaying unnecessary sensitive information.
* [ ] Restrict access to admins.

### 4.6 Admin Authorization

* [ ] Use the existing `<Can>` component for conditional UI.
* [ ] Use `<ProtectedRoute>` for protected pages.
* [ ] Keep role-based authorization in the backend.
* [ ] Verify that customer accounts cannot perform administrative operations, even when directly calling the API.

---

## Phase 5: Type Safety & Imports 🔐

### 5.1 Fix Profile Components

* [x] Fix `components/profile/Can.tsx` import.
* [x] Fix imports in admin category/product components.
* [ ] Fix `AccountInfoForm.tsx` role type issues.

### 5.2 Fix Product Components

* [ ] Fix `ProductCard.tsx` Button component props.
* [ ] Fix `ProductForm.tsx` Product and SKU imports/types.
* [ ] Fix `CategoryForm.tsx` Category import.
* [ ] Verify product cards work for unauthenticated visitors.
* [ ] Ensure Add to Cart invokes the authentication flow for guests.

### 5.3 Fix UI Components

* [x] Update `components/ui/Button.tsx` to support `size`.
* [x] Update `components/ui/Select.tsx` to use `cn(...)` for class merging.

---

## Phase 6: Data Fetching Modernization (Orval + React Query) 📡

### 6.1 Products

* [x] Use Orval-generated hooks from `api/generated/products/`.
* [x] Apply the configured TanStack Query cache settings.
* [x] Invalidate relevant caches after create/update/delete mutations.
* [ ] Verify that product list and detail queries work for unauthenticated visitors.
* [ ] Ensure public product queries do not incorrectly require credentials.

### 6.2 Categories

* [x] Migrate product and category forms to Orval-generated hooks.
* [x] Apply the configured cache settings.
* [ ] Verify public category queries work without authentication.

### 6.3 Cart and Order Data

* [ ] Use the authenticated user's backend cart as the source of truth.
* [ ] Synchronize Zustand state after successful cart operations.
* [ ] Refresh relevant queries after checkout and order creation.
* [ ] Ensure customer order queries return only the current user's orders.

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
