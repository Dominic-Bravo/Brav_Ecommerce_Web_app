# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Tech Stack & Commands
- Next.js 16+, TS, Tailwind v4 (@theme in app/globals.css). UI uses cn() via lib/utils.ts.
- Install: `npm install` | Dev: `npm run dev` | Build: `npm run build`
- Quality: `npm run lint` | `npm run type-check`
- Orval API generation: `orval` (when API schema changes)

## Architecture & Data Fetching (STRICT)
- **API Client:** Auto-generated via Orval inside `api/generated/`.
- **Rule:** NEVER write custom fetch/axios manually. Import TanStack Query (v5) hooks from `api/generated/` or auth endpoints from `lib/api/auth.ts`.
- **Query Config:** staleTime 5m, gcTime 10m, refetchOnWindowFocus: false. Always call `queryClient.invalidateQueries` in mutation `onSuccess`.

## State & Auth Architecture
- **State Split:** Server data -> TanStack Query. Global UI/Cart -> Zustand (`store/useCartStore.ts`). Catalog filters/search -> URL search params (`useSearchParams`).
- **Auth Provider:** `context/AuthContext.tsx` is single source of truth. Init via `/v1/users/me/`.
- **Tokens/Cookies:** Log in via `/v1/users/login/` with `credentials: "include"`. Access token lives in `lib/auth/AuthManager` (`authManager`) and context. Never read/write `localStorage`.
- **Guards:** Component-level only (NO middleware) using `<ProtectedRoute>` or `<Can>` from `components/auth/`.

## Directory Structure
### Core Application
- **Root Layout:** `app/layout.tsx` - Wraps app with AuthProvider, CartProvider, QueryClientProvider
- **Global Styles:** `app/globals.css` - Tailwind configuration with `--color-brand-*` tokens
- **Providers:** `components/providers/` - QueryClientProvider and CartProvider wrappers
- **Context:** `context/AuthContext.tsx` - Authentication state management

### Customer-Facing Pages (Authentication-aware)
- **Home/Landing:** `app/page.tsx` - Public brand landing page
- **Product Catalog:** `app/products/page.tsx` - Public product grid (auth optional)
- **Product Details:** `app/products/[slug]/page.tsx` - Public product detail (auth optional)
- **Cart:** `app/cart/page.tsx` - Requires authentication, displays user's cart
- **Authentication:** `app/login/page.tsx`, `app/signup/page.tsx` - Public access
- **Profile:** `app/profile/page.tsx` - Requires authentication, user profile management
- **Addresses:** `app/addresses/page.tsx` - Requires authentication, address management
- **Google Callback:** `app/accounts/google/login/callback/page.tsx` - OAuth redirect handler

### Admin Functionality (Partial Implementation)
- **Dashboard:** `app/dashboard/page.tsx` - Admin dashboard (protection needed)
- **Admin Components:** 
  - `components/products/AdminProductsPanel.tsx` - Product management UI
  - `components/products/AdminCategoriesPanel.tsx` - Category management UI  
  - `components/profile/AdminProductsSection.tsx` - Admin product section in profile
  - `components/dashboard/` - Dashboard layout components
- **Note:** Dedicated admin routes (`app/admin/`) are not yet implemented; admin features are integrated within customer-facing routes with `<Can>` guards.

### Components by Feature
- **Address:** `components/address/` - Address forms, lists, cards
- **Auth:** `components/auth/` - Login/Signup forms, logout button, guards (ProtectedRoute, Can, RoleGuard)
- **Cart:** `components/cart/` - Cart items, summary, page components
- **Dashboard:** `components/dashboard/` - Layout, header, sidebar, stats, recent orders
- **Home:** `components/home/` - Hero section, featured products, category grid, navigation
- **Products:** `components/products/` - Product cards, forms, grids, content panels (public/admin variants)
- **Profile:** `components/profile/` - Profile content, forms, admin sections, alerts
- **UI:** `components/ui/` - Reusable Button, Input, Select with Tailwind integration

### Supporting Files
- **Utilities:** `lib/utils.ts` - `cn()` function for class merging
- **API:** 
  - `lib/api/` - Custom API wrappers (auth.ts, cart.ts, etc.)
  - `api/generated/` - Orval-generated React Query hooks and types
- **Store:** `store/useCartStore.ts` - Zustand cart synchronization with backend
- **Types:** `types/auth.ts` - Authentication-related TypeScript types
- **Config:** `config/permissions.ts` - Permission checking utilities
- **Schemas:** `schemas/auth.ts` - Auth validation schemas
- **Lib:** `lib/auth/` - AuthManager, authorization helpers, Google OAuth
- **Hooks:** `lib/hooks.ts` - Custom React hooks

## Key Development Rules
1. **Data Fetching:** Use Orval-generated hooks from `api/generated/` exclusively for backend communication
2. **State Management:** 
   - Server/cart data → TanStack Query (via Orval hooks)
   - UI/cart state → Zustand (`store/useCartStore.ts`) with backend as source of truth
3. **Authentication:** 
   - Check `useAuth()` from `context/AuthContext` 
   - Use `<ProtectedRoute>` for page-level protection
   - Use `<Can permission="...">` for component-level conditional rendering
   - Never access tokens directly; use `authManager` from `lib/auth/AuthManager`
4. **Styling:** 
   - Use Tailwind CSS with `--color-brand-*` tokens from `app/globals.css`
   - Use `cn()` utility from `lib/utils.ts` for conditional class merging
   - Primary buttons: `--color-brand-accent` background with `--color-brand-primary` text
   - Error states: `--color-ui-danger` and `--color-ui-danger-bg`
5. **Forms:** Use React Hook Form with zod validation from `@hookform/resolvers` and `zod`
6. **Navigation:** Use `useRouter()` from `next/navigation` for programmatic navigation
7. **Cart Operations:** 
   - Always validate quantities/availability via backend responses
   - Use `queryClient.invalidateQueries()` after mutations
   - Synchronize Zustand store with backend via `loadFromBackend()` on success

## graphify

This project has a knowledge graph at graphify-out/ with god nodes, community structure, and cross-file relationships.

Rules:
- When graphify-out/graph.json exists, run `graphify query "<question>"` before your first grep, search or source-file read for a codebase question, and put this rule in every subagent prompt that explores code. Read raw files only for lines the graph or an earlier read already located. Use `graphify path "<A>" "<B>"` for relationships and `graphify explain "<concept>"` for focused concepts. These return a scoped subgraph, usually much smaller than GRAPH_REPORT.md or raw grep output.
- If graphify-out/wiki/index.md exists, use it for broad navigation instead of raw source browsing.
- Read graphify-out/GRAPH_REPORT.md only for broad architecture review or when query/path/explain do not surface enough context.
- After modifying code, run `graphify update .` to keep the graph current (AST-only, no API cost).
- A committed graphify-out/graph.json is rewritten whole on every build, so a large diff to it in a pull request is expected. Do not flag it as churn or suggest skipping the graph rebuild or its hooks.

graphify . --code-only --exclude .next,node_modules
