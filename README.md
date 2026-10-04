# 2Crown Clothing & Printing - Custom E-Commerce Platform

A premium, high-performance React application tailored specifically for a Nigerian custom clothing and printing business. Built with an architecture designed for zero-infrastructure scaling (Phase 1-8).
## Release Candidate Status

**LOCAL RELEASE CANDIDATE ACCEPTED — VERCEL-READY**

Verification passed: 120 backend tests (on PostgreSQL), 72 frontend tests, backend/frontend builds, Postgres data migration, Vercel routing adaptation, and security/rate-limiting gateways.

Admin E2E: PASS

The site is **NOT PUBLICLY DEPLOYED**.
Vercel Pro project provisioning, Neon Postgres setup, and custom domain configuration remain future deployment steps. No such public infrastructure is active.

## Current Phase: Phase 8B (Production Container + Deployment Preparation)
**Phase 8A (Production Architecture & $0/Month Hosting Audit) is COMPLETED.**
**Production boot-chain repair: live Docker runtime verification VERIFIED (2026-09-27).**
**NOT PUBLICLY DEPLOYED.** Oracle VM, Cloudflare Tunnel, and custom-domain setup remain future deployment steps.

### Recent Milestones & Accomplishments (Phase 8B):
* **Production Containerization**:
  * Implemented a multi-stage `Dockerfile` optimizing image size by removing unnecessary development tooling and serving the built React static files directly from the Express backend, with resource usage still requiring runtime measurement.
  * Created `docker-compose.yml` defining the application and a zero-cost Caddy reverse proxy for automated HTTPS generation and routing.
* **Security & Infrastructure Hardening**:
  * Integrated `helmet` for HTTP security headers and `express-rate-limit` to protect public and administrative endpoints.
  * Enforced database file security by ensuring the SQLite `.sqlite3` files and backup directories live strictly outside the Express static serving boundaries.
  * Centralized environment configurations via an explicitly documented `.env.example` while securing secrets mapping.
* **Database Persistence & Safety**:
  * Enabled SQLite Write-Ahead Logging (WAL) mode for optimal concurrent read performance.
  * Implemented safe schema migration paths and added an explicit SQLite online-backup procedure; cron automation is not configured.
  * Programmed graceful HTTP and database shutdown handlers (SIGTERM, SIGINT) for safe container redeployments.
* **Persistent Database Architecture**:
  * Successfully migrated the Express backend from in-memory arrays to a robust **SQLite** repository layer (`sqlite3` and `knex`).
  * Implemented an isolated schema migration and seeding system.
  * Configured named-volume SQLite persistence; container restart/persistence passed live verification.
  * Tests default to in-memory SQLite; independent bootstrap concurrency tests allocate disposable SQLite files. Arbitrary test database path overrides are rejected.
* **Full E2E System Acceptance**:
  * Complete end-to-end integration verified: customer shopping flow, cart, checkout, local delivery calculations, database order creation, WhatsApp order routing, and order tracking timeline retrieval.
  * Admin dashboard securely retrieves real database aggregates, tracking total orders, products, and strictly computing total sales exclusively from orders in terminal delivered/picked up states.
  * Regression passed for Authentication, Authorization, RBAC, Password Policies, responsive tables, and zero-alert custom toast notifications.

### Phase Roadmap
- **Phase 1**: Frontend + Mock Services + Tests (Completed)
  - _Recent Update: Category `CreatedAt` Data Architecture. Investigated and fixed the missing Category creation timestamps. Updated `CategorySchema` and database seed files to persist real timestamps, ensured new category creation automatically populates `createdAt` server-side, and maintained UI single-line responsiveness. Successfully QA'd full CRUD (Create, Read, Edit preserving original date, Search, and Delete) through live browser automation (Playwright/CDP) across 14 responsive viewports. No layout wrapping or clipping detected._
  - _Recent Update: Administrator Last Login tracking. Updated backend login flow and frontend UI to correctly record and display authentic authentication timestamps instead of "Never" for all administrator roles._
  - _Recent Update: Admin Product Modal UI Refinement. Completely overhauled the layout and responsiveness of the product creation/editing modal. Implemented a fluid grid structure, sticky header and footer, responsive dual-column pricing fields, a polished drag-and-drop image zone, and verified layout resilience across a comprehensive range of viewport widths (320px–1920px) and heights (568px–1080px). Confirmed complete absence of inventory fields. Validated through rigorous Playwright CDP tests on the live browser._
  - _Recent Update: Final end-to-end QA verification passed using Playwright over Chrome DevTools Protocol (CDP), testing the live Vite frontend and Express backend. All 10 acceptance criteria for Store Pickup and Local Delivery lifecycles were successfully verified in-browser._
  - _Recent Update: Centralized Business Settings. Added `Business Address` and exposed `WhatsApp Number` in the Admin UI. Verified all contact data flows dynamically to customer-facing views (e.g. Footer). Ensured copyright year is dynamic._
  - _Recent Update: Integrated official 2Crown logo as the primary branding asset across Customer Navbar, Footer, Admin Sidebar, Admin Login, and browser Favicon._
- **Phase 2**: Repository & Documentation Restructuring (Current)
- **Phase 3**: OpenAPI Contract
- **Phase 4**: Real Backend
- **Phase 5**: Database Persistence
- **Phase 6**: Frontend/Backend Integration
- **Phase 7**: Integration/E2E Testing
- **Phase 8**: Free-Tier Production Deployment + Custom Domain

## Architecture Overview
The application is built using React, TypeScript, and Vite, utilizing Tailwind CSS for styling and Zustand for state management. 

Data fetching is strictly decoupled through an **Interface-based Service Layer** (`src/services/interfaces`). Currently, the application consumes **Mock Implementations** (`src/services/mock`), allowing the entire UI and routing to function fully without a real backend.

## Features Implemented

* **Admin Dashboard Metrics**:
  * **Total Sales**: Converted from "Estimated Sales" to "Total Sales". Strictly calculates aggregate value `subtotal - discount + deliveryFee` exclusively from orders in a final successful fulfilment state (`Delivered` or `Picked Up`). Canceled and non-terminal orders are bypassed entirely.
  * **Pending Action**: Synchronized tightly with the order state machine. Dynamically flags all active orders that require explicit administrative or delivery action (excluding terminal states).
  * **System Integrity**: All data fields (Total Orders, Total Products) are rigorously pulled from authoritative sources to eradicate UI duplication and prevent race-condition double counting on refresh.
* **Storefront & Catalogue Refinements**:
  * **Responsive Product Grid**: Upgraded mobile layout on Home (Featured Products) and Shop to neatly display a two-column grid (`grid-cols-2`) down to 320px without horizontal overflow, text clipping, or broken images. Re-aligned the Featured Products header and "View All" link on the same row using responsive flex layouts.
  * **Admin Product Modal UI**: Refined the product creation and editing modal for admins. Enhanced layout responsiveness with a fluid container and flexbox body that gracefully handles scrolling while maintaining a fixed sticky header and footer. Included a polished single-image drag-and-drop zone, optimized dual-column pricing layout, and proper spacing conventions across the form.
  * **Inventory/Stock Removal**: Aligned the platform strictly to the on-demand production business model. All inventory, stock counters, stock badges (Out of Stock, Low Stock), and stock-based purchasing restrictions were completely audited and purged from the domain models, backend APIs, frontend schemas, and administrative views. Quantity selectors remain fully functional for customer requests.
  * **Rating System Refinement**: End-to-end audit and repair of the product rating system. Enabled successful rating submission, integration of custom toast notifications (success/error state), correct state aggregation and fetching via the service layer, and enforced strict value validations (1-5 stars) without requiring user authentication.
* **Order Lifecycle System (QA Verified & Refined)**:
  * **Fulfilment Lifecycle**: Admin fulfilment workflow begins clearly at `Confirmed`. Pre-confirmation statuses (`WhatsApp Pending`, `Customer Contacted`, `Quotation Sent`) are preserved in the backend but appropriately categorized as Order Activity / Communication rather than fulfilment steps.
  * **Delivery & Pickup Workflows**:
    * Local Delivery: `Confirmed -> Processing -> Ready for Delivery -> Out for Delivery -> Delivered`.
    * Store Pickup: `Confirmed -> Processing -> Ready for Pickup -> Picked Up`.
  * **Customer Tracking**: The public Track Order timeline strictly hides internal operational statuses. The customer-facing timeline begins gracefully at `Awaiting Confirmation` and follows the exact fulfilment steps above based on their delivery method. Track Order search input placeholder is clearly formatted (e.g. `2C-123456`) and full order details are now displayed including Ordered products, quantities, prices, variants, Subtotal, Discount, Delivery Fee, Total, Delivery method, and Delivery address/instructions.
  * **Delivery Fee Functionality**: Admins can now explicitly enter a numeric `deliveryFee` for Local Delivery orders. Store Pickup permanently enforces a `₦0` fee.
  * **Total Calculation Behavior**: Totals (`subtotal - discount + deliveryFee`) are centralized and accurately propagated to the Admin Orders table, Admin Order Details, Track Order, and the WhatsApp generation utility. Checkout preserves the initial `To be confirmed` state before an admin sets the fee.
  * Status History (Audit Trail) records the delivery fee updates seamlessly.
  * Confirmation dialogs via `useConfirm` implemented for sensitive order actions.
  * Relevant Files: `src/pages/admin/Orders.tsx`, `src/pages/public/TrackOrder.tsx`, `src/utils/orderTransitions.ts`, `src/utils/whatsapp.ts`, `src/domain/models/index.ts`.
  * Regression passed for Cart, Checkout, Shop, Track Order, Admin Orders, and WhatsApp integrations. Tested locally with Vitest (`src/services/mock/OrderService.test.ts`, `src/utils/whatsapp.test.ts`). Manual browser verification simulated and logic audited for rendering updates on mobile/desktop.
* **Admin Panel UI/UX**:
  * **Global Password Visibility Standard**: Implemented a universal `PasswordInput` shared component across the entire application to enforce strict UI/UX consistency for all password fields (including `/admin/login`, `/admin/profile`, and `/admin/administrators`). The eye icon dynamically mounts only when a password is typed, seamlessly toggles visibility, correctly unmounts and resets state when the field is cleared, and maintains strictly independent visibility state per field. Keyboard accessibility, form submission preservation, and responsiveness across all mobile and desktop viewports are guaranteed. E2E tests have been written (`tests/global-password-toggle.spec.ts`) and browser QA validated.
  * **Global Table Responsiveness**: Implemented strict responsiveness rules across all admin tables (Dashboard, Orders, Products, Categories, Customers, Administrators). Ensured table cell data and action buttons do not wrap into multiple lines on narrow screens by applying `whitespace-nowrap` to table headers and cells. Wrapped all tables in `overflow-x-auto` containers and applied proper intrinsic width rules (`min-w-full`, `min-w-max`) to prefer horizontal scrolling over unreadable wrapping. Preserved status badge single-line integrity.
* **Centralized Toast System**: Unified notification providers by resolving a duplicate `react-hot-toast` `<Toaster />` mount in nested layouts, ensuring UI consistency across the public and admin views.
* **API Integration & Admin CRUD Audit**:
  * **Security & RBAC Hardening**:
    * Implemented a centralized, unified password policy (`evaluatePasswordStrength`) enforcing length, entropy, and complexity synchronously across both the React frontend and Express backend.
    * Integrated a real-time `PasswordStrengthMeter` UI providing immediate user feedback during Administrator creation and Profile password updates.
    * Server-side current-password cryptographic verification strictly enforced before any profile password modification.
    * Strict hierarchical RBAC natively enforced in backend routes (`admins.routes.ts`): Root Super Admins have full control, Super Admins can manage regular Admins but cannot bypass root protection, and regular Admins are restricted from all administrator-management tasks.
  * **Frontend/Backend Synchronization**: Conducted a deep audit comparing frontend `apiClient` usage against the actual Express backend routes.
  * **Delivery Fee API**: Added missing `PATCH /orders/:id/delivery-fee` backend route, ensuring that admin delivery fee updates successfully save and recalculate the order total in the database.
  * **Administrator Management**: Resolved `404 Not Found` errors by refactoring `Administrators.tsx` to use the `services.rbac` service layer and fixing the corresponding backend HTTP methods (`PATCH /admins/:id/role` and `PATCH /admins/:id/status`).
  * **Role-Based Access Control**: Verified and strictly enforced root admin protections preventing deletion or status modifications of the super admin account.
  * **Administrator Last Login**: Fixed the "Last Login" functionality to accurately track and display successful authentication timestamps, ensuring failed attempts do not update the record.
  * **Comprehensive QA Validation**: Validated end-to-end CRUD for Products, Categories, Settings, and Profiles against both frontend mocked interfaces and the Express backend API. Verified persistence and responsive layouts without introducing duplicate toast notifications.
* **Responsive Grid System**: `ProductCard` component leverages CSS Grid for optimal layout across all devices.
* **Modern CSS Reset**: Eliminates cross-browser inconsistencies.
* **Navigation Drawer**: Smooth, intuitive mobile menu implementation.
* **Fluid Typography**: Dynamic font scaling based on viewport width.
* **Touch-Optimized Interactions**: Generous tap targets (min 44px) and smooth gestures.
* **Optimized Rendering**: Lazy loading for off-screen components and images.

### Key Features
- **Premium UI**: Black, Gold, and White visual identity.
- **Shop & Cart**: Full e-commerce product flow, variation selection, and subtotal calculation.
- **WhatsApp Integration**: Orders are successfully placed by dynamically generating a formatted WhatsApp message to the centralized business number (`+234 906 174 7646`). 
- **Custom Work & Delivery**: Tailored business rules for custom requests (handled directly via WhatsApp, zero website uploads) and localized delivery routing.

## Documentation
Comprehensive documentation of the domain models, business rules, development setup, and phase roadmap can be found in the `docs/` directory. 
The strict API contract that the frontend expects is defined at `/openapi.yaml`. 
If you are an AI assistant, please refer to `AGENTS.md` before writing code.

## Development Setup

### Requirements
- Node.js (v18+ recommended)
- npm (v9+ recommended)

### Installation
```bash
npm install
```

### Running the Development Server
```bash
npm run dev
```
*(Note for WSL2 users: Vite uses polling configuration to ensure file changes are reliably detected across the Windows file mount).*

### Testing
To run the Vitest suite:
```bash
npx vitest run
```

To run the TypeScript compiler check:
```bash
npx tsc -b
```

### Building for Production
```bash
npm run build
```

## Backend authorization and public tracking hardening

Independently reviewed and verified on 2026-09-27: administrator list/detail reads require Super Admin or Root; manager mutations and Root-only role changes are enforced by backend RBAC, with existing Root protections preserved. Administrator responses use an explicit safe DTO. New order references use 128 cryptographic random bits in `2C-XXXXXXXX-XXXXXXXX-XXXXXXXX-XXXXXXXX` uppercase hexadecimal format; lowercase input is canonicalized and reference collisions retry at most three attempts. Public creation/tracking responses omit customer identity/contact/address, internal IDs, and audit metadata. The public timeline contains fulfillment statuses and timestamps only, excluding internal communication and same-status audit events. Older short references require the original phone through the legacy POST tracking flow; responses remain minimized.

Public tracking shares a dedicated limit of 30 requests per client IP per 15 minutes and consistent malformed/unknown 404 responses. Express keeps `trust proxy` disabled, preventing forwarded-header spoofing; local Caddy therefore uses a conservative shared bucket. Revalidate trusted proxy configuration and client-IP behavior before any Cloudflare deployment. Independent gates passed: 107 backend tests, 46 focused authorization/tracking tests, 7 Track Order frontend tests, backend/frontend builds, and bounded production Docker/Caddy authentication/tracking smoke checks. Existing Docker volumes and backup/restore artifacts were retained. **NOT PUBLICLY DEPLOYED.**

## Production HTTP hardening

Independently reviewed and verified: unexpected errors return only HTTP 500 `{"error":"Internal server error"}` in production, development, and tests. Server logs retain structured timestamps, methods, route templates, redacted diagnostic messages, and basename stack locations; request body/header/query/parameter values, SQL error details, and full filesystem paths are redacted. Expected validation, authorization, business, and rate-limit responses retain their safe API behavior. Sensitive API responses use `Cache-Control: no-store`; unknown API routes return JSON 404 while normal SPA routes remain available. Static serving denies environment, database, backup, source, and deployment artifacts.

CORS uses exact validated origins from `CORS_ALLOWED_ORIGINS`, rejecting wildcard/malformed configuration. Production defaults to denying browser origins unless configured; Compose defaults to `http://localhost,http://127.0.0.1`, and development permits only localhost/127.0.0.1 on port 5173. Clients without Origin remain supported. Authentication uses bearer tokens, with no CORS credentials. Express and Caddy enforce matching CSP: scripts/connect default to self, objects and framing are prohibited, and styles allow inline styling for existing React/toast behavior only. Images permit self, HTTPS, data, and blob sources for existing media behavior. Headers include nosniff, frame DENY, no-referrer, and restricted permissions; server banners are removed. HSTS and insecure-request upgrading remain disabled for the current HTTP-only local stack.

JSON bodies are limited to 100 KB; URL-encoded bodies to 16 KB and 100 parameters. Malformed, oversized, and unsupported bodies return safe 400/413/415 responses. Dedicated limits are ten failed login attempts and ten password attempts per IP per 15 minutes; the global 1,000-request limit and public tracking 30-request limit remain separate. Limiters use memory for the current single instance. `trust proxy` remains false, so forwarded headers cannot spoof client identity; Caddy clients share conservative buckets. At future Cloudflare/HTTPS deployment, revalidate trusted proxy hops, actual client IP and Cloudflare headers, exact HTTPS origins, CSP connect sources, HTTPS/HSTS policy, and rate-limit client identity before enabling proxy trust.

Verified gates: 119 backend tests, 12 focused HTTP-security tests, backend/frontend builds, bounded Docker/Caddy smoke checks, and browser homepage/Shop/login/admin, JavaScript/image/API checks with no natural CSP violations, and HTTP order-tracking regression. Existing volumes and backup/restore artifacts were preserved. **NOT PUBLICLY DEPLOYED.**

## Contract cleanup and artifact hygiene

Independently reviewed and verified: the obsolete `/gallery` operation and `GalleryItem` schema were removed from OpenAPI and direct gallery documentation. The 50 remaining local schema references resolve, and all other documented operations/schemas remain unchanged. Unused upload components, stale generated JavaScript test copies, one-off import/debug probes, and the unrelated `Dockerfile.test` were removed only after independent approval and verified external archival. Products retain one image each and the existing administrator single-image input; customers do not upload files.

Local SQLite/WAL/SHM state, runtime files, browser captures, backups, and inspected historical probes are ignored and excluded from production build context. Existing data and accepted backup/restore artifacts remain preserved. [Artifact classification](docs/ArtifactClassification.md) records per-file decisions and the verified archive at `/home/ash-shaafi-iy/2crown-artifact-archive/contract-cleanup-20260928/`. Maintained gates remain backend Vitest/build, frontend build/focused tests, and the existing Playwright configuration/specs; `run-qa-final.cjs` remains historical evidence, not a current release gate. Verification passed: 119 backend tests, 7 Track Order tests, backend/frontend builds, OpenAPI reference/operation checks, and production Docker/browser smoke checks. **NOT PUBLICLY DEPLOYED.**

## Deployment Architecture (Vercel + PostgreSQL)

The repository is currently **Vercel-ready** and **GitHub deployment-ready**, targeting a **PostgreSQL/Neon** database.

**IMPORTANT STATUS:**
LOCAL RELEASE CANDIDATE ACCEPTED — VERCEL-READY.
**NOT PUBLICLY DEPLOYED** until actually deployed.

### Commercial Production Note
The current codebase is technically Vercel-compatible. However, Vercel's free "Hobby" plan is **not suitable for commercial production websites** under their terms of service. The choice of a production plan, account, and billing configuration for both Vercel and Neon Postgres must be made separately prior to public deployment.

### Architecture Changes
- **Frontend**: React + Vite built as static assets for Vercel CDN.
- **Backend**: Existing Express application adapted to run as a Vercel Serverless Function via `api/[...path].ts`.
- **Database**: PostgreSQL (Neon) replaces SQLite for production. SQLite remains supported for local testing.
- **Connection Model**: Serverless-safe configuration with `max: 1` pooling to prevent Neon connection exhaustion.
- **Routing**: `vercel.json` correctly rewrites API requests and provides SPA fallback.

### Data Migration
A safe migration path from SQLite to PostgreSQL has been created (`scripts/migrate-to-postgres.js`). It must be run locally with environment variables pointing to both databases to preserve data integrity, perform idempotent inserts, and validate row counts and schemas.

### Backup / Recovery
Production backups must be managed via PostgreSQL logical exports (e.g. `pg_dump`) rather than SQLite file copies. Do not rely on Neon Free tier Point-in-Time Recovery (PITR) for long-term retention; paid plans are required for 7+ day retention, or automated offsite logical backups must be established.
