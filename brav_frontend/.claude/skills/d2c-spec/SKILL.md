---
name: d2c-spec
description: Use this skill when generating new pages, creating admin/customer capabilities, or matching UI mockups to data models.
version: 1.0.0
---

# Brav D2C Feature & Data Specifications

## Customer Capabilities
- Account: Register, login, logout, edit profile.
- Browsing: Catalog grid, search, category filters, detail pages.
- Cart: Add, change quantities, remove items, clear, view subtotal/total.
- Checkout: Shipping form (Name, Phone, Address, City, Postal code) + execution.
- Orders: Order history log and individual transaction receipts.

## Admin Capabilities (Single-Store Owner)
- Access: Secure admin area login and dashboard.
- Catalog: Create, edit, delete/archive products and categories.
- Operations: View global orders, update shipping status, view customer register directory.

## Data Models & Schema Targets
- Product: Name, Description, Price, Image, Category, Stock quantity, Active/inactive status.
- Order: Created record, item snapshots, quantities, prices-at-purchase, total calculation, status. Reduces stock inventory upon successful creation.

## Detailed Routing Structure
- `app/page.tsx` — Brand landing page
- `app/products/page.tsx` — Catalog grid with filters
- `app/products/[id]/page.tsx` — Product details & "Add to Cart"
- `app/cart/page.tsx` — Cart management
- `app/checkout/page.tsx` — Checkout execution
- `app/orders/page.tsx` & `app/orders/[id]/page.tsx` — Order logs and receipt breakdowns
- `app/admin/dashboard/page.tsx` — Revenue metrics dashboard
- `app/admin/products/page.tsx` & `app/admin/categories/page.tsx` — Catalog tables & forms
- `app/admin/orders/page.tsx` & `app/admin/customers/page.tsx` — Ops management
