# 2Crown Clothing & Printing - Agent Instructions

Welcome, future coding agents! This file dictates the absolute rules and context for developing this project.

## 1. Project Purpose
2Crown Clothing & Printing is a premium e-commerce platform built for a Nigerian custom clothing and printing business.
The visual identity is strictly **Black, Gold, and White**. The UI must feel premium, modern, professional, and clean.

## 2. Current Stack & Architecture
- **Stack**: React, TypeScript, Vite, Vitest, Tailwind CSS, Zustand, React Router.
- **Architecture Pattern**: Component → Hook/State → Service Interface → API implementation → Express/Knex/SQLite.
- **Current state**: Phase 8 release candidate preparation; the production-like Docker/Caddy stack has been verified locally, but the site is **NOT PUBLICLY DEPLOYED**.
- **Service Layer**: `src/services/interfaces` is backed by `src/services/api` in development/production; `src/services/mock` is selected for tests or explicit `VITE_USE_MOCK_SERVICES=true`.

## 3. Important Business Rules
- **Custom Work Flow**:
  - The "Custom Work" link in the navbar/footer navigates directly to the `#custom-work` section on the Homepage.
  - The CTA button inside the `#custom-work` section triggers WhatsApp.
  - **No Customer File Uploads**: Customers do NOT upload custom design files, logos, or documents to the website. They send these via WhatsApp.
- **Normal Product Ordering**:
  - Shop → Product Details → Add to Cart → Cart → Checkout → Save Order → WhatsApp.
  - Normal product ordering remains separate from the Custom Work flow.
- **Delivery**:
  - **Store Pickup**: Delivery fee is exactly `₦0`. Estimated Total equals the product subtotal.
  - **Local Delivery**: The website does **not** calculate, estimate, or assume delivery fees. Delivery is determined manually via WhatsApp. The WhatsApp format is strictly `Delivery Fee: To be confirmed` and `Estimated Total: ₦[subtotal] + delivery`.
- **WhatsApp**:
  - The centralized business number is `+234 906 174 7646` (normalized to `2349061747646`). 
  - Do not scatter hardcoded numbers. Always use `services.settings.getBusinessSettings()`.
- **Rating System**:
  - Customer product feedback is **Star-Rating Only** (1-5 stars).
  - There are NO written reviews. Always use the terminology "rating(s)" instead of "review(s)".
- **Catalog**: One image per product. There is no inventory system or Product Type. Do not introduce multiple product images.
- **Custom Work data**: There is no customer Custom Work form, database order, or website upload flow; use WhatsApp.
- **Administrator hierarchy**: Root Super Admin → Super Admin → Admin. Enforce authorization in the backend and preserve Root protections.
- **Dialogs**: Use the existing application dialog/toast UI instead of native `alert`, `confirm`, or `prompt` for application flows.
- **Navigation**:
  - Normal links (Logo, Home, Shop, Track Order, Cart) must reset the scroll to the TOP of the page.
  - The Custom Work link must scroll to `#custom-work`.

## 4. Zero-Cost Infrastructure Requirement
- **Target Production Infrastructure**: $0/month.
- The only paid expense is the custom domain.
- **DO NOT INTRODUCE**: Firebase, Supabase, AWS, Cloudinary, Paid Databases, or any billing-dependent infrastructure.
- **DO NOT INTRODUCE**: Customer file storage (e.g., S3). The website only uses Admin-managed media (hosted locally or on a $0 static tier).

## 5. Release Boundary
Keep the implemented React/Express/Knex/SQLite architecture, secure production boot chain, and zero-cost requirement. Current work is release-candidate verification and documentation; public cloud/domain deployment remains future work. Do not add a new database, backend architecture, paid service, or customer upload flow without explicit instruction.

## 6. Testing & Quality
- Run tests via `npx vitest run`.
- Check types via `npx tsc -b`.
- Build via `npm run build`.
- Vite polling is enabled for WSL2 environments (`server.watch.usePolling: true`). Do not remove this.

## 7. Strict Prohibitions
- Do NOT fabricate fake product images or UI sections not approved by the user.
- Do NOT migrate to Next.js or other meta-frameworks.
- Do NOT reintroduce the "Shop by Category", "How Custom Orders Work", or "Testimonials" sections to the Homepage.
- Do NOT replace the existing SQLite backend or add another database/backend system without explicit instruction.
