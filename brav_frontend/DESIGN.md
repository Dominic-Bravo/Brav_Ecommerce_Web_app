# BRAV — Core UI Design System

This document defines the **visual design and user-interface behavior** for BRAV, a minimalist-luxury e-commerce storefront. It focuses only on the appearance, layout, reusable UI components, responsive behavior, and interaction states of the interface.

**Visual direction:** understated luxury, editorial product photography, generous whitespace, clear product information, and restrained champagne-gold accents.

---

## 1. Visual Principles

1. **Minimalist luxury:** use a calm, uncluttered layout with generous spacing and carefully chosen typography.
2. **Product-first presentation:** product photography, names, prices, and availability should be easy to scan.
3. **Clear hierarchy:** each screen should have one obvious primary heading and one primary action.
4. **Consistent components:** use shared buttons, inputs, badges, cards, dialogs, and layout patterns rather than creating one-off styles.
5. **Responsive by default:** design for small screens first, then expand layouts for tablet and desktop.
6. **Subtle interaction:** prefer short color, opacity, and transform transitions over flashy effects.
7. **Accessible presentation:** use readable contrast, visible focus states, useful labels, and comfortable touch targets.

Avoid cluttered dashboards, excessive gradients, heavy shadows, decorative icon overload, and multiple competing accent colors.

---

## 2. Color System — 60 / 30 / 10

Use a restrained palette to maintain a premium storefront feel.

- **60% — Main surfaces:** white `#FFFFFF` and soft neutral `#F9FAFB`.
- **30% — Structure and typography:** deep charcoal `#111827` with muted gray supporting text.
- **10% — Accent:** muted champagne gold `#C5A880`, reserved for important purchase actions and meaningful selected states.

### Color tokens

Keep the existing `--color-brand-*` token naming in `app/globals.css`. Components should use these tokens rather than scattering raw hex values throughout the UI.

| Token | Suggested value | Visual use |
|---|---|---|
| `--color-brand-primary` | `#111827` | Main text, headings, dark controls |
| `--color-brand-primary-hover` | `#1F2937` | Hover state for dark controls |
| `--color-brand-secondary` | `#6B7280` | Supporting text and secondary labels |
| `--color-brand-accent` | `#C5A880` | Primary shopping actions and selected states |
| `--color-brand-accent-hover` | `#B3966E` | Hover state for accent actions |
| `--color-ui-bg` | `#FFFFFF` | Main page surface |
| `--color-ui-bg-muted` | `#F9FAFB` | Image frames and subtle section backgrounds |
| `--color-ui-border` | `#E5E7EB` | Borders, dividers, input outlines |
| `--color-ui-danger` | `#B91C1C` | Error and destructive-action feedback |
| `--color-ui-success` | `#166534` | Success feedback |

### Color rules

- Use **charcoal text on champagne-gold buttons**; avoid small white text on gold if contrast is insufficient.
- Do not use gold for long body copy or every icon.
- Use accent color sparingly so purchase actions remain noticeable.
- Use status colors only to communicate meaningful states, not as decoration.
- Pair status colors with text or icons; never rely on color alone.
- If the palette changes, update the central theme tokens rather than introducing a second color system.

---

## 3. Typography

Use an editorial pairing: a clean sans-serif for interface text and an elegant serif for selected brand headlines and product titles.

| Element | Mobile | Desktop |
|---|---|---|
| Hero heading | `text-3xl` to `text-4xl` | `md:text-5xl` to `lg:text-6xl` |
| Section heading | `text-2xl` | `md:text-3xl` to `md:text-4xl` |
| Product title | `text-base` to `text-lg` | `md:text-lg` to `md:text-xl` |
| Body text | `text-sm leading-relaxed` | `text-sm` to `text-base leading-relaxed` |
| Eyebrow / metadata | `text-xs uppercase tracking-widest` | Same, used sparingly |
| Form label | `text-sm font-medium` | Same |
| Button label | `text-sm font-medium` | Same |
| Price | `text-base font-medium` | `text-lg font-medium` where prominent |

Typography rules:

- Use serif typography for selected editorial headings, not every text element.
- Keep paragraphs comfortably readable and avoid long uppercase sentences.
- Establish a clear size and weight hierarchy between headings, descriptions, prices, and metadata.
- Avoid using too many font weights or font families on a single page.

---

## 4. Layout, Grid, and Spacing

### Containers

- Main content: `mx-auto w-full max-w-7xl`.
- Page gutters: `px-4 sm:px-6 lg:px-8 xl:px-12`.
- Use consistent vertical rhythm between page sections.
- Align section headings, product grids, and page controls to a shared content edge.
- Prevent horizontal overflow on narrow screens and at enlarged text sizes.

### Responsive breakpoints

Use mobile-first responsive rules. Do not force every screen into a fixed column count.

| Screen | Layout guidance |
|---|---|
| Small mobile | One or two product columns based on usable card width |
| Large mobile / small tablet | Usually two columns |
| Tablet | Two or three columns |
| Desktop | Three or four columns when cards remain comfortably readable |
| Wide desktop | Keep content constrained; do not stretch content edge to edge |

### Spacing

- Use generous spacing around hero content and major sections.
- Keep related controls close together and separate unrelated groups.
- Use consistent gaps in cards, forms, toolbars, and navigation.
- Avoid making every section equally dense; promotional and editorial areas may have more breathing room.

---

## 5. Global Header and Navigation

### Desktop header

Include:

- BRAV wordmark or logo.
- Primary navigation for the shop and product categories.
- Search access where it fits the design.
- Account entry point.
- Cart icon with a visible item-count indicator when appropriate.

Keep the header clean, aligned, and visually light. Use a subtle bottom border if separation from the page is needed.

### Mobile header

Include:

- Menu trigger using a Lucide icon.
- Brand mark positioned consistently.
- Cart access.
- Account access when space allows, or within the menu.

Use Lucide icons instead of text glyphs such as `☰`. Icon-only controls must have accessible names and visible focus states.

### Navigation behavior

- Clearly identify the current section or selected category.
- Keep menu labels short and familiar.
- Use a mobile drawer or menu panel that is easy to dismiss and does not obscure essential controls.
- Show a subtle hover and focus state rather than a strong decorative treatment.

---

## 6. Home Page UI (`app/page.tsx`)

The home page should feel like a curated storefront rather than a generic SaaS landing page.

Suggested section order:

1. **Hero:** strong editorial headline, concise supporting copy, tasteful image, and one clear shop CTA.
2. **Featured categories or collections:** image-led cards that lead to relevant product listings.
3. **Featured products:** a compact product grid using the shared product-card component.
4. **Brand/story section:** a short brand statement with supporting imagery, if useful for the brand.
5. **Trust or service highlights:** concise details such as delivery, customer support, or returns only when those claims are accurate.
6. **Footer:** shop navigation, help links, contact details, and social links where available.

Home page rules:

- Avoid filling every available space with content.
- Keep the hero CTA visually distinct but not oversized.
- Use consistent image ratios for category and product imagery.
- Do not add fake reviews, unsupported trust badges, or unverified promotional claims.
- Visitors should be able to understand what the store offers immediately.

---

## 7. Product Listing UI (`/products`)

### Listing header

- Show a clear page title and brief description if useful.
- Display the number of results when available.
- Provide visible search, category filter, price filter, and sort controls when supported.
- On mobile, filters may open in a drawer or popover to preserve space.

### Product grid

- Use a consistent image ratio, suggested `aspect-[4/5]`.
- Keep product name, price, and availability aligned consistently.
- Make the product image and title easy to select.
- Use subtle image hover zoom on pointer-capable devices only.
- Use consistent card spacing and avoid unnecessary boxed panels around every card.

### Listing states

Design clear states for:

- Loading: skeleton cards that preserve the grid layout.
- No results: concise explanation and a way to clear filters.
- Error: friendly message and a retry action where appropriate.
- Unavailable product: a readable label rather than color alone.

The listing should remain useful on narrow screens; do not allow filter controls or long product names to cause horizontal overflow.

---

## 8. Product Card

A product card should prioritize the product itself.

Recommended content:

- Product image.
- Product name.
- Price.
- Optional category or brief metadata.
- Optional sale or availability label when accurate.

Visual rules:

- Image wrapper: neutral background, `aspect-[4/5]`, subtle border, and restrained corner radius.
- Keep card borders and shadows light; avoid making each item look like a dashboard tile.
- Use a smooth image transition such as `transition-transform duration-500 ease-out` with a restrained hover scale.
- Do not rely on hover to reveal essential product information; touch devices do not have hover in the same way.
- Provide meaningful alt text for product images.
- Keep price formatting consistent throughout the site.

---

## 9. Product Details UI (`/products/[id]`)

### Desktop layout

Use a two-column editorial layout:

- **Gallery column:** large primary image and secondary thumbnails.
- **Information column:** category, product name, price, concise description, availability, quantity selector if applicable, and primary action.

### Mobile layout

- Stack the image gallery above product information.
- Keep the product title, price, and availability close together.
- Use comfortable spacing for quantity and purchase controls.
- A sticky purchase bar may be used on small screens only when it improves usability and does not obscure content or browser safe areas. Add enough bottom padding when it is present.

### Action states

- Default: clear primary purchase action.
- Pending: show a spinner or progress label and prevent accidental repeated taps.
- Unavailable: show a disabled action and explain the stock state.
- Guest action: show a small sign-in/register prompt or dialog explaining that an account is needed for the action.
- Success or failure: show clear feedback without abruptly shifting the entire layout.

Keep the guest prompt visually calm; do not block public product browsing with a forced login modal.

---

## 10. Cart and Checkout UI

### Cart (`/cart`)

- Use a clear page heading and concise empty-cart state.
- Show each item's image, name, unit price, quantity control, subtotal, and remove action.
- Present the subtotal in a visually distinct summary area.
- On desktop, the summary may sit beside the item list; on mobile, place it after the items.
- Use a clear primary checkout action.
- Quantity controls must be keyboard accessible and have useful labels.

### Empty cart

- Use a simple illustration or product icon only if it matches the visual language.
- Explain that the cart is empty.
- Provide a clear link back to the catalog.

### Checkout (`/checkout`)

- Use a focused layout that minimizes distractions.
- Group shipping fields logically and maintain consistent field widths.
- Show an order summary beside the form on desktop and below it on mobile.
- Label each input visibly; do not rely on placeholders as labels.
- Clearly distinguish editable shipping details from the order summary.
- Show field-level validation and form-level submission errors.
- During submission, show a pending state and prevent duplicate clicks.
- Keep totals, shipping details, and the final action easy to review before submission.

---

## 11. Orders and Account UI

### Order history (`/orders`)

- Use a clear page title and a simple list or table depending on viewport width.
- Show order number, date, total, and status.
- Use compact status badges with both text and suitable contrast.
- On mobile, transform wide tables into stacked order cards rather than forcing horizontal scrolling.
- Provide a helpful empty state with a link to browse products.

### Order details (`/orders/[id]`)

- Show the order number and current status prominently.
- Group purchased items, price breakdown, shipping address, and order details into clear sections.
- Keep the price summary easy to scan.
- Use a simple status timeline only if the available status data supports it.

### Profile and account forms

- Use a straightforward single-column form where practical.
- Group related information under concise headings.
- Use clear Save and Cancel actions.
- Show success and error feedback close to the form.

---

## 12. Login and Registration UI

- Keep the layout focused and visually consistent with the storefront.
- Use a clear page heading, short explanatory text, and a readable form width.
- Provide visible labels for email and password fields.
- Use appropriate password visibility controls where helpful.
- Include links between login and registration pages.
- Display validation feedback next to the relevant fields.
- Use a visible submit state to prevent repeated submission.
- When a guest is prompted to sign in during shopping, explain why and provide both login and registration options.
- Preserve the visual context of the shopping journey where possible, without making the authentication pages visually noisy.

---

## 13. Admin UI

Admin pages should share the same brand tokens but may prioritize information density over editorial whitespace.

### Admin shell

- Desktop: sidebar navigation plus a clear page header and content area.
- Mobile: collapsible navigation drawer and stacked content.
- Make the current admin section easy to identify.
- Keep page titles, primary actions, and filters in consistent positions.

### Dashboard

- Use a small set of metric cards for products, customers, orders, and sales.
- Place recent orders and low-stock items in readable tables or responsive list layouts.
- Avoid unnecessary charts or decorative graphs that do not help the user act.

### Product and category management

- Use readable tables with clear column headings, restrained separators, and consistent action placement.
- Use forms with grouped sections and clear validation.
- Make destructive actions visually distinct and ask for confirmation where appropriate.
- Provide empty, loading, and error states for tables and forms.

### Orders and customers

- Include search and status filters where useful.
- Keep order status labels consistent across customer and admin screens.
- Ensure dense data remains readable on mobile by using stacked cards or intentional horizontal scrolling for tables when necessary.

---

## 14. Buttons and Form Controls

### Button hierarchy

- **Primary:** champagne-gold background with charcoal text; used for the main action on a screen.
- **Secondary:** white or neutral background with charcoal text and a subtle border.
- **Tertiary / text:** minimal styling for low-emphasis actions.
- **Destructive:** reserved danger color for actions such as delete or remove where the consequence is significant.

Avoid multiple equally prominent primary buttons in the same visual group.

### Button dimensions

- Standard button height: approximately 44–48 px.
- Use consistent horizontal padding and alignment.
- Icon-only buttons should have a comfortably sized hit area and an accessible name.

### Inputs

- Use a consistent height, border, radius, padding, and focus treatment.
- Use clear labels, helper text, and inline error messages.
- Ensure placeholder text is visibly secondary but still readable.
- Focus states must be visible without relying on hover.
- Disabled controls should remain legible and clearly appear unavailable.

---

## 15. Icons, Imagery, Borders, and Shadows

### Icons

- Use Lucide icons consistently.
- Prefer simple line icons with a consistent size and stroke weight.
- Avoid mixing emoji, text glyphs, and multiple icon families in the same interface.
- Give icon-only controls accessible labels.

### Imagery

- Use high-quality, consistent product photography.
- Keep crop ratios consistent across product cards.
- Use neutral image backgrounds where helpful.
- Avoid stretching images; preserve their aspect ratio and focal point.
- Provide a stable placeholder or skeleton while images load.

### Borders and shadows

- Prefer subtle borders to separate sections.
- Use shadows sparingly for floating menus, dialogs, or sticky elements.
- Avoid heavy shadows on every card.
- Use a consistent corner-radius scale across the site.

---

## 16. Motion and Interaction

- Prefer restrained transitions for color, opacity, and transform.
- Typical transition duration: 150–300 ms for UI controls; longer image transitions may be used sparingly.
- Avoid animation that delays navigation or essential actions.
- Respect `prefers-reduced-motion`.
- Provide visible feedback for click, focus, selected, loading, success, error, and disabled states.
- Do not rely solely on hover because many visitors use touch screens.

---

## 17. Accessibility and Responsive Quality

- Use semantic headings in a logical order.
- Use real buttons for actions and links for navigation.
- Maintain clear keyboard focus indicators.
- Ensure all form fields have visible labels and associated error text.
- Aim for at least 44 × 44 CSS pixels for common touch targets.
- Avoid conveying meaning through color alone.
- Check text contrast on white, gray, and champagne backgrounds.
- Make dialogs and mobile navigation keyboard accessible and easy to dismiss.
- Test pages at small mobile, large mobile, tablet, desktop, and wide desktop widths.
- Verify layouts with long product names, empty states, validation errors, and enlarged text.

---

## 18. Shared UI Component Inventory

Prefer shared components for repeating patterns, including:

- `SiteHeader`
- `MobileNavigation`
- `SiteFooter`
- `PageContainer`
- `SectionHeading`
- `ProductCard`
- `ProductGrid`
- `PriceDisplay`
- `StockBadge`
- `QuantitySelector`
- `Button`
- `Input`
- `Select`
- `FormField`
- `EmptyState`
- `ErrorState`
- `LoadingSkeleton`
- `ConfirmDialog`
- `StatusBadge`
- `AdminSidebar`
- `AdminPageHeader`

Keep component APIs consistent and avoid one-off visual variants unless there is a clear design reason.

---

## 19. UI Design Review Checklist

Before considering a page visually complete, check:

- [ ] Color tokens follow the BRAV palette.
- [ ] Typography hierarchy is clear and consistent.
- [ ] Main content aligns to the shared container and gutters.
- [ ] Layout adapts to mobile, tablet, and desktop.
- [ ] Product images use consistent framing.
- [ ] Primary and secondary actions are visually distinct.
- [ ] Loading, empty, error, disabled, and success states are designed.
- [ ] Forms have visible labels and inline validation styles.
- [ ] Keyboard focus and touch targets are usable.
- [ ] Icons, borders, shadows, and corner radii are consistent.
- [ ] No horizontal overflow or obstructed sticky controls exist.
- [ ] The page feels calm, premium, and product-focused rather than generic.

---

## Scope Note

This document is the visual and UI behavior reference for BRAV. It does not define backend architecture, API contracts, authentication implementation, authorization rules, database design, or development task sequencing. Those concerns should remain documented separately.
