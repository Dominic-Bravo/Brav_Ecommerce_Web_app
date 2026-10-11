# Brav E-commerce — Standalone D2C Frontend Project

## 🏗️ Core Architecture Business Model
- **Model:** Standalone Single-Store Direct-to-Consumer (D2C) platform (e.g., like Nike, Apple, or an independent brand storefront).
- **Framework:** Next.js (v16+), TypeScript, Tailwind CSS (v4+).
- **API Client:** Auto-generated via Orval using Axios and TanStack React Query (v5+).
- **API Files Location:** Strictly located inside `api/generated/`.
- **Data Fetching Rule:** Always scan `api/generated/` to find existing hooks, queries, mutations, and TypeScript definitions. Never write custom fetch or axios functions manually. Import directly from the hooks exposed in this directory.

## 🛠️ Development Commands
- **Install dependencies:** `npm install`
- **Run dev server:** `npm run dev`
- **Build production app:** `npm run build`
- **Lint code:** `npm run lint`
- **Type-check:** `npm run type-check`

## 🎨 UI & Design Requirements (Tailwind CSS v4 Global Engine)
- **Guidelines:** Responsive across all screen sizes, clean layout metrics, consistent spacing, easy to navigate, and mobile-friendly first.
- **Theme Adjustments Token Maps:** Tailwind v4 uses CSS `@theme` variables located in `app/globals.css`. Adjust global appearance using these exact tokens:
  - `--color-brand-primary`: Core accent color (Default: `#4f46e5` Indigo).
  - `--color-brand-primary-hover`: Interactive hover states (`#4338ca`).
  - `--color-brand-secondary`: Deep typography/dark accents (`#0f172a`).
  - `--color-brand-accent`: Highlights or inventory state alerts (`#f59e0b`).
  - `--color-ui-bg` / `--color-ui-bg-muted`: Screen surface states.
- **Component Cleanliness:** Use `class-variance-authority` (CVA) + `clsx` + `tailwind-merge` via our custom unified class builder inside `lib/utils.ts` (`cn(...)`) to handle responsive modifiers without class collisions.

## ⚡ Performance, Caching & State Management Best Practices
### 📡 Fetching & Data Caching (TanStack Query Global Settings)
- **Stale Configuration:** Remote resource `staleTime` is set globally to 5 minutes (`5 * 60 * 1000`). Data stays cached without causing screen flashes or redundant server pings.
- **Garbage Collection:** Unused queries remain in memory cache for 10 minutes (`gcTime: 10 * 60 * 1000`) before removal.
- **Focus Events:** `refetchOnWindowFocus: false` is strictly locked to prevent unneeded background requests when switching desktop tabs.
- **Cache Invalidation Rules:** Always call `queryClient.invalidateQueries` inside the `onSuccess` block of a mutation hook (e.g., changing items inside a cart, administrative status edits) to instantly update the UI.

### 🧠 State Isolation Patterns
1. **Server Sync:** Keep backend database entities inside TanStack React Query contexts exclusively. Do not duplicate server payloads inside local client state files.
2. **Local Global UI State:** Use lightweight synchronous `Zustand` stores (e.g., `store/useCartStore.ts`) to manage high-speed front-facing actions like immediate shopping cart addition, quantity updates, or menu toggles.
3. **Product Search Discovery:** Keep catalog search inputs, pagination indices, and filter category types directly managed inside the URL search parameter layout state (`useSearchParams`). This allows users to bookmark or share exact query views.

## 🔒 Auth Architecture Patterns (STRICTLY FOLLOW THESE)
### State Management
- `context/AuthContext.tsx` is the single source of truth for auth state.
- `AuthProvider` wraps the entire app in `app/layout.tsx`.
- State shape: `{ user: User | null; isLoading: boolean; isAuthenticated: boolean }`.
- Initialize auth on mount by calling `/v1/users/me/` — if it fails, clear state; if ok, set user.

### Token & Cookie Flow (STRICT)
- **Login:** POST `/v1/users/login/` with `credentials: "include"` → server sets HttpOnly `refresh` cookie + returns JWT `access` token in body.
- **Access token:** Stored in `lib/auth/AuthManager` singleton (`authManager`) and in `AuthContext`.
- **API calls:** Always use `credentials: "include"` so the browser auto-sends the refresh cookie.
- **Never manually read/write tokens** from `localStorage` or `sessionStorage`.

### Route Guarding (Component-Level Only — NO middleware)
- `components/auth/ProtectedRoute.tsx` — wraps routes; if `!isAuthenticated` after init, redirects to `/login`.
- `components/auth/Can.tsx` — checks role permissions via `config/permissions.ts`.

---

## 📋 System Feature Requirements (D2C Flow)

### 👤 Customer Capabilities
- **Account:** Register, login, logout, view and edit profile.
- **Browsing:** Browse product catalog, search products, filter items by category, view detailed product pages.
- **Cart:** Add products, increase/decrease quantities, remove products, clear cart entirely, see items subtotal and total counts.
- **Checkout:** Enter shipping information (Full name, Phone number, Address, City, Postal code) and place the final order.
- **Orders:** View overall order history log and individual transaction order details.

### 👑 Admin Capabilities (Single-Store Owner)
- **Access:** Secure admin area login and primary dashboard view.
- **Catalog Management:** Create, edit, and delete/archive products and categories.
- **Operations:** View all global orders, update processing order status, and view customer information.

### 📦 Data Models & Schema Targets
- **Product Entity:** Name, Description, Price, Image, Category, Stock quantity, Active/inactive status.
- **Customer Product View:** Name, Image, Price, Category, Description, Availability status.
- **Order Entity:** Created order record, saved snapshots of purchased products, quantities, prices-at-purchase, overall total calculation, and status assignment. Reduces product inventory stock upon successful creation.

---

## 🗺️ Site Map & D2C Routing Structure

### 🛍️ Customer Facing Pages
- `Home` (`app/page.tsx`) — Brand landing page, featured collections, and category entry points.
- `Products Catalog` (`app/products/page.tsx`) — Infinite or paginated grid with search and category filters.
- `Product Details` (`app/products/[id]/page.tsx`) — Full image, descriptions, inventory status, and "Add to Cart" action.
- `Cart` (`app/cart/page.tsx`) — Manage items, change quantities, view order subtotal.
- `Checkout` (`app/checkout/page.tsx`) — Single shipping form step and purchase execution.
- `Orders History` (`app/orders/page.tsx`) — Personal list of past purchases.
- `Order Details Receipt` (`app/orders/[id]/page.tsx`) — Post-purchase breakdown and tracking.
- `Login` / `Register` (`app/login/page.tsx`, `app/register/page.tsx`) — Auth forms.
- `Profile` (`app/profile/page.tsx`) — Update personal account fields.

### 🛡️ Store Admin Pages (Wrapped with Role Guards)
- `Dashboard` (`app/admin/dashboard/page.tsx`) — Revenue stats, top items, and platform metrics.
- `Products Management` (`app/admin/products/page.tsx`) — Main table lists, create form, update states.
- `Categories Management` (`app/admin/categories/page.tsx`) — Manage brand catalog organizational hierarchy.
- `Orders Operations` (`app/admin/orders/page.tsx`) — Track transactions and manipulate shipping status.
- `Customers List` (`app/admin/customers/page.tsx`) — Database customer register directory.

---

## 🚨 STRICT Rules for Future Work
1. **Never** write custom `fetch` or `axios` calls for auth or database entities — always use `lib/api/auth.ts` or Orval-generated hooks from `api/generated/`.
2. **Always** check `api/generated/` first to verify existing types match your forms before typing variables manually.
3. **Always** wrap protected sections or routes utilizing the specified `<ProtectedRoute>` or `<Can>` constraints.
