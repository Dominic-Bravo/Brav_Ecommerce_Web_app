# Graph Report - brav_frontend  (2026-10-15)

## Corpus Check
- cluster-only mode — file stats not available

## Summary
- 653 nodes · 1626 edges · 23 communities (18 shown, 5 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS · INFERRED: 7 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `e656fb6b`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- Checkout Authentication
- Product Management Models
- Google OAuth Profile
- Shopping Cart Management
- Category Management
- Address UI Components
- Auth Pages (Signup/Login)
- Auth Services API
- Address Data Model
- Inventory Data Model
- TypeScript Configuration
- Reviews Management
- Core Utilities Config
- Profile Permissions & Testing
- User Profile & Me Data
- Application Dependencies
- User Data Models
- Development Dependencies
- Order Business Model
- Build & Dev Scripts
- ESLint Configuration
- Recent Orders Component

## God Nodes (most connected - your core abstractions)
1. `useAuth()` - 47 edges
2. `react` - 39 edges
3. `next` - 28 edges
4. `Button()` - 26 edges
5. `ProtectedRoute()` - 26 edges
6. `Can()` - 24 edges
7. `AddressContent()` - 23 edges
8. `Product` - 22 edges
9. `AuthManager` - 20 edges
10. `getCategories()` - 20 edges

## Surprising Connections (you probably didn't know these)
- `HeaderProps` --references--> `User`  [EXTRACTED]
  components/dashboard/Header.tsx → types/auth.ts
- `updateProduct()` --calls--> `getProducts()`  [EXTRACTED]
  lib/api/products.ts → api/generated/products/products.ts
- `ProductCardProps` --references--> `Product`  [EXTRACTED]
  components/products/ProductCard.tsx → api/generated/model/product.ts
- `ProductDetailsContentProps` --references--> `Product`  [EXTRACTED]
  components/products/ProductDetailsContent.tsx → api/generated/model/product.ts
- `ProductsGridProps` --references--> `Product`  [EXTRACTED]
  components/products/ProductsGrid.tsx → api/generated/model/product.ts

## Import Cycles
- 3-file cycle: `lib/api/auth.ts -> lib/api/client.ts -> lib/auth/AuthManager.ts -> lib/api/auth.ts`

## Communities (23 total, 5 thin omitted)

### Community 0 - "Checkout Authentication"
Cohesion: 0.07
Nodes (48): PatchedProductRequest, Product, ProductImage, ProductRequest, ProductStatusEnum, getProducts(), V1ProductsProductImagesCreateResult, V1ProductsProductImagesDestroyResult (+40 more)

### Community 1 - "Product Management Models"
Cohesion: 0.06
Nodes (49): GoogleCallbackPage(), handleGoogleCallback(), ProfilePage(), onSubmit(), AccountInfoForm(), handleSubmit(), AccountInfoFormProps, DeleteAccountSection() (+41 more)

### Community 2 - "Google OAuth Profile"
Cohesion: 0.07
Nodes (47): getCategories(), V1ProductsCategoriesCreateResult, V1ProductsCategoriesDestroyResult, V1ProductsCategoriesListResult, V1ProductsCategoriesPartialUpdateResult, V1ProductsCategoriesRetrieveResult, V1ProductsCategoriesUpdateResult, Category (+39 more)

### Community 3 - "Shopping Cart Management"
Cohesion: 0.09
Nodes (39): AddressesPage(), AdminCategoriesPage(), AdminCustomersPage(), loadCustomers(), CUSTOMER_ROLES, AdminDashboardPage(), initializeDashboard(), AdminOrdersPage() (+31 more)

### Community 4 - "Category Management"
Cohesion: 0.05
Nodes (46): LoginPage(), SignupPage(), AuthLayout(), AuthLayoutProps, GoogleLoginButton(), handleGoogleLogin(), GoogleLoginButtonProps, icons (+38 more)

### Community 5 - "Address UI Components"
Cohesion: 0.08
Nodes (39): getCart(), V1CartItemsCreateResult, V1CartItemsDestroyResult, V1CartItemsListResult, V1CartItemsPartialUpdateResult, V1CartItemsRetrieveResult, V1CartItemsUpdateResult, V1CartRetrieveResult (+31 more)

### Community 6 - "Auth Pages (Signup/Login)"
Cohesion: 0.09
Nodes (32): AddressAlert(), AddressAlertProps, AddressCard(), AddressCardProps, AddressContent(), handleDeleteConfirmed(), handleDeleteSelected(), AddressMessage (+24 more)

### Community 7 - "Auth Services API"
Cohesion: 0.12
Nodes (22): getAddresses(), CheckoutRequest, Order, OrderItem, OrderStatusEnum, PaymentStatusEnum, getOrders(), V1OrdersCheckoutCreateResult (+14 more)

### Community 8 - "Address Data Model"
Cohesion: 0.08
Nodes (24): dependencies, axios, class-variance-authority, clsx, @hookform/resolvers, lucide-react, next, react (+16 more)

### Community 9 - "Inventory Data Model"
Cohesion: 0.09
Nodes (9): V1UsersAuthFacebookCreateResult, V1UsersAuthGoogleCreateResult, V1UsersLoginCreateResult, V1UsersLogoutCreateResult, V1UsersRegisterCreateResult, V1UsersTokenRefreshCreateResult, LoginRequest, LogoutRequest (+1 more)

### Community 10 - "TypeScript Configuration"
Cohesion: 0.15
Nodes (10): V1ProductsInventoryLogsCreateResult, V1ProductsInventoryLogsDestroyResult, V1ProductsInventoryLogsListResult, V1ProductsInventoryLogsPartialUpdateResult, V1ProductsInventoryLogsRetrieveResult, V1ProductsInventoryLogsUpdateResult, InventoryLog, InventoryLogRequest (+2 more)

### Community 11 - "Reviews Management"
Cohesion: 0.11
Nodes (18): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib, module (+10 more)

### Community 12 - "Core Utilities Config"
Cohesion: 0.16
Nodes (10): V1UsersAddressesCreateResult, V1UsersAddressesDestroyResult, V1UsersAddressesListResult, V1UsersAddressesPartialUpdateResult, V1UsersAddressesRetrieveResult, V1UsersAddressesUpdateResult, Address, AddressRequest (+2 more)

### Community 13 - "Profile Permissions & Testing"
Cohesion: 0.12
Nodes (9): PatchedReviewRequest, Review, ReviewRequest, V1ReviewsCreateResult, V1ReviewsDestroyResult, V1ReviewsListResult, V1ReviewsPartialUpdateResult, V1ReviewsRetrieveResult (+1 more)

### Community 14 - "User Profile & Me Data"
Cohesion: 0.13
Nodes (7): ProfileRequest, V1UsersTestAdminOnlyRetrieveResult, V1UsersTestAnonymousRetrieveResult, V1UsersTestAuthenticatedRetrieveResult, V1UsersTestCustomerOnlyRetrieveResult, V1UsersMeDestroyResult, V1UsersMeProfileUpdateResult

### Community 15 - "Application Dependencies"
Cohesion: 0.13
Nodes (5): Login, Logout, PatchedProductImageRequest, ProductImageRequest, SocialLogin

### Community 16 - "User Data Models"
Cohesion: 0.13
Nodes (7): PatchedProfileRequest, Profile, V1UsersMePartialUpdateResult, V1UsersMeProfilePartialUpdateResult, V1UsersMeProfileRetrieveResult, V1UsersMeRetrieveResult, V1UsersMeUpdateResult

### Community 17 - "Development Dependencies"
Cohesion: 0.32
Nodes (6): PatchedUserMeRequest, RegisterRequest, RoleEnum, UserMe, UserMeRequest, UserResponse

## Knowledge Gaps
- **8 isolated node(s):** `orval`, `react-dom`, `tailwindcss`, `@tailwindcss/postcss`, `@types/node` (+3 more)
  These have ≤1 connection - possible missing edges. (Counts symbols only; 214 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **5 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `axios` connect `Auth Services API` to `Checkout Authentication`, `Product Management Models`, `Google OAuth Profile`, `Category Management`, `Address UI Components`, `Inventory Data Model`, `TypeScript Configuration`, `Core Utilities Config`, `Profile Permissions & Testing`, `User Profile & Me Data`, `User Data Models`?**
  _High betweenness centrality (0.138) - this node is a cross-community bridge._
- **What connects `orval`, `react-dom`, `tailwindcss` to the rest of the system?**
  _8 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Checkout Authentication` be split into smaller, more focused modules?**
  _Cohesion score 0.0656140350877193 - nodes in this community are weakly interconnected._
- **Why does `react` connect `Shopping Cart Management` to `Checkout Authentication`, `Product Management Models`, `Google OAuth Profile`, `Category Management`, `Address UI Components`, `Auth Pages (Signup/Login)`, `Auth Services API`?**
  _High betweenness centrality (0.135) - this node is a cross-community bridge._
- **Should `Product Management Models` be split into smaller, more focused modules?**
  _Cohesion score 0.060362173038229376 - nodes in this community are weakly interconnected._
- **Why does `next` connect `Checkout Authentication` to `Product Management Models`, `Google OAuth Profile`, `Shopping Cart Management`, `Category Management`, `Address UI Components`, `Auth Services API`?**
  _High betweenness centrality (0.051) - this node is a cross-community bridge._
- **Should `Google OAuth Profile` be split into smaller, more focused modules?**
  _Cohesion score 0.06874669487043893 - nodes in this community are weakly interconnected._