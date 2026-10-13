# Brav E-commerce (D2C Frontend)

## Tech Stack & Commands
- Next.js 16+, TS, Tailwind v4 (@theme in app/globals.css). UI uses cn() via lib/utils.ts.
- Install: `npm install` | Dev: `npm run dev` | Build: `npm run build`
- Quality: `npm run lint` | `npm run type-check`

## Architecture & Data Fetching (STRICT)
- **API Client:** Auto-generated via Orval inside `api/generated/`.
- **Rule:** NEVER write custom fetch/axios manually. Import TanStack Query (v5) hooks from `api/generated/` or auth endpoints from `lib/api/auth.ts`.
- **Query Config:** staleTime 5m, gcTime 10m, refetchOnWindowFocus: false. Always call `queryClient.invalidateQueries` in mutation `onSuccess`.

## State & Auth Architecture
- **State Split:** Server data -> TanStack Query. Global UI/Cart -> Zustand (`store/useCartStore.ts`). Catalog filters/search -> URL search params (`useSearchParams`).
- **Auth Provider:** `context/AuthContext.tsx` is single source of truth. Init via `/v1/users/me/`.
- **Tokens/Cookies:** Log in via `/v1/users/login/` with `credentials: "include"`. Access token lives in `lib/auth/AuthManager` (`authManager`) and context. Never read/write `localStorage`.
- **Guards:** Component-level only (NO middleware) using `<ProtectedRoute>` or `<Can>`.

## Directory Paths
- **Customer Pages:** `app/(home|products|cart|checkout|orders|login|register|profile)`
- **Admin Pages:** `app/admin/(dashboard|products|categories|orders|customers)`
- **Full map & data schema available in skill: `.claude/skills/d2c-spec/SKILL.md`**
