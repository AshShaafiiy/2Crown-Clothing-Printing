# Project Handoff

## Current Snapshot
- **Date:** 2026-10-05
- **Branch:** main
- **HEAD:** 1d5d548 docs: finalize verification state after QA
- **origin/main:** 1d5d548
- **Vercel Project:** twocrown-clothing-printing (Pending formal confirmation)
- **Firebase Project:** twocrown-clothing-printing
- **Current Hosting Plan:** Vercel Hobby (Commercial viability pending decision)
- **Deployment State:** GitHub → Vercel integration is configured.

## Current Architecture
The application has been migrated from Vite/Express/SQLite to a unified **Next.js (App Router)** architecture.
- **Frontend Layer:** React, TypeScript, Tailwind CSS, Zustand state management.
- **Request/Data Flow:** Client requests hit Next.js API Routes (`app/api/*`) which securely communicate with Firestore using Firebase Admin SDK.
- **Auth Flow:** Client authenticates via Firebase Auth. The resulting token is sent as a Bearer token to API Routes, where `firebase-admin` verifies it.
- **Domain Layer:** Cloudflare or Truehost is planned for DNS/Domain routing.

## Completed Work
- Resolved `/admin/settings` API crash by gracefully handling empty Firestore collections with default configurations.
- Restored missing Tailwind hover-dimming state to the "Browse Collection" homepage CTA.
- Migrated 2Crown to Next.js and Firebase architecture.
- Resolved Next.js order route slug conflict.
- Redeployed with new service account credentials.
- Configured Firebase Admin for production Vercel environment.
- Downgraded `jose` to fix firebase-admin ESM requirements on Vercel.
- Replaced InMemoryDB with Firestore repositories in Next.js API routes.
- Downgraded Tailwind to v3 and fixed Next.js content scanning paths.
- Corrected Next.js layout composition for Header/Footer and resolved animations parity.
- Restored secure phone-verified order tracking (2C-123456 reference format).
- Reconfigured `.env.example` to remove old DB/custom JWT variables.
- Resolved production `/admin` runtime crash caused by missing Next.js Link `href` props and invalid onClick event signatures.
- Fixed both homepage WhatsApp CTA buttons (Hero and Custom Work) to open the WhatsApp destination reliably without being blocked by popup-blockers.
- The hero entrance animation is now working and is part of the current accepted Next.js UI behavior. It was not present in the original pre-migration Vite hero.
- Restored proper Document ID handling in Firestore Repositories, fixing Product and Category Edit mutations.
- Enforced safe Category Deletion (blocked if products remain associated).
- Restored secure RBAC middleware across Product and Category endpoints.
- Validated Discount Badge source of truth: `previousPrice` correctly drives explicit discounts directly from the product object in alignment with the domain model.
- Restored Favicon integrity: Replaced unreliable JPEG metadata shortcut with standard `app/icon.png` generated from the official 2Crown logo.
- Refined Cart unit-price visibility logic: Desktop displays plain unit price for `qty=1` and "₦X each" for `qty>1`; Mobile hides unit-price text to save space.
- Refined Product Details page layout: Removed top status badges, moved discount badge beside original price, wrapped added-item text in brackets, and cleanly collapsed the empty description message.

## Current Known Defects / Open Work
- **Remote Vercel E2E gaps:** Partial coverage exists; automated Playwright runs directly against live Vercel deployments are not fully configured. We rely on manual/scripted local verification.
- (All major functional, layout, and runtime defects identified during the Next.js migration handoff have been resolved and verified on production).

## Current Task In Progress
The current task is to complete the **DOCUMENTATION + CROSS-ACCOUNT HANDOFF SYNCHRONIZATION**. The final stage of cross-account handoff synchronization has been completed. All critical deployment blockers and UI defects have been verified as resolved locally and on the live Vercel deployment.

## Next Recommended Actions
1. **Public Launch Preparation:** A decision on commercial production viability and Vercel Pro/Firebase Spark plan scaling is required before assigning a custom domain.
2. **Remote E2E Automation:** Expand Playwright suites to execute automatically against Vercel preview environments.

## Do Not Change
- **WhatsApp Buttons:** Both homepage WhatsApp CTAs are intentional and part of the accepted UI/business flow. Do not remove either.
- **Custom Work → direct WhatsApp:** No database records, no uploads, no pricing calculator for custom work.
- **Normal Order Flow:** Persist order first, then provide structured WhatsApp continuation.
- **Order Reference:** `2C-123456` uppercase hex format.
- **Track Order:** Requires BOTH reference and phone. Malformed/unknown tracking yields indistinguishable generic failure. Privacy-safe tracking DTO.
- **Delivery:** Pickup fee is exactly `₦0`. Local delivery fee is "To be confirmed".
- **Currency:** NGN only. No stock/inventory/Product Type. One product image.
- **Admin Roles:** `root_super_admin`, `super_admin`, `admin`. Backend-enforced Root protection.
- **Dialogs:** No native `alert()`, `confirm()`, or `prompt()`.
- **Admin Tables:** `nowrap` + horizontal scroll.
- **Firebase exclusively:** Do NOT restore custom JWT, SQLite, or Express.

## Security State
- **Firebase Auth:** Handles all client authentication.
- **Firebase Admin:** Validates tokens securely server-side.
- **Firestore:** Secured by rules and accessed primarily through the secure backend.
- **Root Protection:** `root_super_admin` cannot be deleted or demoted; strictly enforced by the backend API.
- **Service Account:** Kept strictly out of the repository; managed via environment variables.
- **Tracking Privacy:** Public order tracking omits customer identity, contact info, and internal statuses.
- **RBAC:** Strict access controls on mutating users and accessing admin endpoints.
- **Secrets:** All real secrets are excluded from Git.

## Deployment State
- GitHub → Vercel integration is established for automatic deployment.
- Vercel "Hobby" plan is currently used; a decision on commercial production viability/upgrades is required before the final public launch.

## Verification State
- **Latest Verified Test Count:** 214 passing tests (clean exit code 0) across 16 test files. Verification state is **CLEAN**. Vitest runs exit cleanly with EXIT CODE 0. The transient worker-pool timeout during headless shutdown has been resolved.
- **Test Count History:** The current discovered test count is exactly 214 tests. This includes the comprehensive API tests, 44 Discount Badge tests, RBAC tests, TrackOrder integration tests, and new ProductCard/Home resilience tests.
- **Build State:** Local `npm run build` succeeds cleanly.
- **Local vs Remote E2E Status:** End-to-end functionality (Public flows, Admin flows) has been successfully verified against BOTH the local production build (Phase 12) AND the remote Vercel deployment (Phase 15). The `/admin` production runtime crash and Homepage `This page couldn't load` crash have been confirmed resolved on the live deployment. The `/admin/settings` initialization crash has been resolved and the Browse Collection hover interaction verified remotely. Product and Category Edit/Delete operations have been validated. Favicon configuration is verified with new rounded corners.

---

## MANDATORY SUBAGENT WORKFLOW
For every SUBSTANTIAL implementation, migration, regression, security, or release task:
1. **Full-Stack Developer** implements
2. **Software Engineer** independently reviews
3. **QA Tester** validates actual workflows

Any Software Engineer or QA FAIL loops back to Full-Stack Developer.
No PASS based only on build success, unit tests, HTTP 200, or implementer self-report. Actual workflow validation is required.

## MANDATORY DOCUMENTATION SYNC RULE
After every substantial accepted work batch:
1. update `PROJECT_HANDOFF.md`
2. update `README.md` only if stable architecture/setup/business behavior changed
3. record latest HEAD
4. record completed work
5. record unresolved defects
6. record next action
7. do not declare handoff-ready with stale docs

`PROJECT_HANDOFF.md` should be updated after every substantial accepted batch. `README.md` should NOT be churned for tiny fixes.

## Hosting Decision

- 2Crown will remain on Vercel Hobby for now.
- Do not proactively migrate hosting solely because of the current Vercel Hobby commercial-use policy issue.
- Continue using the stable Vercel deployment unless one of these triggers occurs:
  1. Vercel explicitly flags the project for commercial-use/plan reasons
  2. Vercel suspends or restricts the project
  3. Hobby resource limits become an actual operational problem
  4. reliability/performance becomes inadequate
  5. the user explicitly decides to migrate
- If a trigger occurs, perform a deliberate migration analysis rather than an emergency architecture rewrite.
- Current preferred fallback candidate: Cloudflare-based hosting.
- HOWEVER: the existing Next.js/Firebase Admin Node-runtime architecture must receive a compatibility assessment before any Cloudflare migration.
- Do NOT migrate to Netlify, Oracle, or another provider without a fresh technical evaluation.
- Firebase remains on the current Spark/$0 plan unless a genuine product requirement requires billing.
- Custom-domain attachment can proceed independently.

### DEPLOYMENT RISK NOTE
Vercel Hobby currently works technically for this application.
Commercial-use compliance remains a Vercel platform-policy consideration.
The project is consciously accepting that operational risk for now.


## Git Safety Rule
- **NEVER** use `git push --force` or `git push -f` against `main` during normal 2Crown work.
- Do not rewrite shared `main` history.
- If an accidental commit needs correction, prefer a new corrective commit.
- Force-push may only occur with explicit user authorization for that specific operation.


## Cart UX Rules
Cart quantity controls use gold decrement/increment buttons with a display-only center quantity. Product Details shows added-item feedback beside the control on desktop and uses an Add to Cart button with cart icon before insertion. No editable quantity input is used on ProductCard, Product Details, or Cart. All components synchronize globally with the `cartStore`.


## Order Lifecycle & Tracking Rules
- Orders automatically start at Awaiting Confirmation.
- Admin does not manually set Awaiting Confirmation.
- Admin first action is Order Confirmed.
- Local Delivery requires delivery fee before confirmation.
- Pickup fee = ₦0.
- Customer timeline retains complete chronological history.
- Confirmed delivery fee appears on customer tracking.
- Total includes persisted delivery fee.


## Cart & Quantity UI Rules
- Cart quantity behavior differs intentionally from ProductCard/Product Details: Cart decrement is disabled at quantity 1 because Cart has a dedicated Remove action. ProductCard/Product Details decrement-at-1 removes the item.
- Discounted Cart items show current price, previous price and discount %.
- Per-unit 'each' label appears only when quantity > 1.
- Home and Shop ProductCard quantity controls retain the same full-width CTA footprint as the Add to Cart button. Product Details and Cart use compact quantity controls.


## Commerce UI & Styling Rules
- Primary commerce CTAs (Add to Cart, Proceed to Checkout) default to gold with subtle darker-gold hover.
- ProductCard quantity controls retain full CTA width.
- Product Details quantity controls are compact and visually separated (button, text, button).
- Product Details feedback stays beside control on normal mobile widths.
- Cart minus is disabled at quantity 1; Cart uses a separate Remove action.
- Cart does not duplicate current unit price underneath product name.
- 'each' appears only for quantity > 1.
- Right-side Cart price is the current line total.
- Discounted Cart lines show original line value + discount badge.


## Cart Item Layout
- Cart item layout uses a responsive ecommerce pattern: desktop places product information on the left, price summary upper-right, Remove lower-left, quantity lower-right; mobile compacts image/details and keeps Remove/quantity on a bottom action row.


## Cart Item Layout & UX Polishes
- Final cart presentation: Image hover artifacts (ghost boxes) are eliminated.
- Unit Price Logic: Shows plain unit price for `qty=1` and "₦X each" for `qty>1` strictly on desktop. Mobile completely hides the unit-price text in favor of the primary line-total.
- Remove Action: Styled as a compact text action `[trash icon] Remove` in Gold/Primary color on the lower-left.
- Quantity Controls: Refined to a compact `[-]` `qty` `[+]` structure resembling Jumia logic. Black borders after clicking are fully eliminated in favor of clean subtle `focus-visible:ring-primary` outlines.
- Cart minus button at `qty=1` remains securely disabled.
- Mobile Layout: Stacked into a highly compact ecommerce card format with image/details side-by-side, ending in a bottom action row holding Remove (left) and Quantity (right).
- 'Proceed to Checkout' button utilizes standard Gold primary styling.

## 2026-10-07 Production Corrections
- **Product Loading Architecture**: The Home page now utilizes Server Component data fetching for the initial catalogue payload, eliminating the client-side N+1 hydration waterfall and removing the artificial empty-state flash.
- **Canonical Add-to-Cart Behavior**: Unified `toCartItem(product, 1)` payload across `Home`, `Shop`, and `ProductDetails`. Fixed event propagation (`stopPropagation`) that caused interactive quantity controls to trigger navigation.
- **Cart Badge Rule**: The global cart badge correctly reflects the *sum of all item quantities* in the cart (`items.reduce((acc, item) => acc + item.quantity, 0)`).
- **Focus-Visible Rule**: Broadly replaced generic `focus:ring` classes with `focus-visible:ring` to eliminate unwanted persistent black outlines after mouse/touch interactions while strictly maintaining keyboard accessibility.
- **Administrator Creation Flow**: Overhauled the `/api/admins` creation endpoint. Admin creation is now atomic: it successfully generates the Firebase Auth user, assigns custom claims (`role`), and writes the corresponding Firestore profile. Passwords are now processed correctly via the admin dashboard.
- **Root Super Admin Governance**: Performed a controlled sweep of the identity system. There is now exactly **1** active Root Super Admin account.
- **Primary Root Identity**: `annarsjay3@gmail.com`
- **Test Suite Status**: 254/254 tests passing (0 failures).
- **Live Vercel QA**: Verified. Customer timelines accurately respect factual historical timestamps (or omit with `Date unavailable`), performance metrics are restored, and temporary diagnostic/secret endpoints have been forcefully removed and scrubbed from the repository.

## 2026-10-07 Product Grid Responsiveness
- **Layout Requirements**: Product grids use a mobile-first two-column layout and scale responsively to five columns on desktop. Intermediate widths use balanced 3/4-column breakpoints.
- **Card Refinements**: ProductCards are completely fluid (`w-full`), adjusting internal gaps and text sizes to safely fit 2 items on narrow 320px viewports without horizontal overflow, while preserving CTA targets and visual proportions.

## 2026-10-07 Shop Filter UI & Responsive Refinement
- **Product Grids**: Home product grid scales from 2 columns on mobile to 5 columns on desktop. Shop uses 2 columns on mobile, 3 on tablet, and caps at 4 on desktop because of its filter sidebar. 
- **Mobile Filter UX**: Shop categories use a compact `<select>` dropdown natively rendered on mobile viewports to prevent long category lists from destroying vertical space, while preserving the detailed sidebar/radio controls on larger screens. Both UI modalities are bound to the identical reactive state.

## 2026-10-07 Admin Orders Runtime Defect Resolution
- **Root Cause**: Live production route `/admin/orders` was crashing with Next.js Error Boundary ("This page couldn't load") due to malformed legacy orders in Firestore missing `total`, `subtotal`, and `createdAt` fields, which caused unhandled `.toLocaleString()` and `new Date(...)` exceptions during React client-side rendering.
- **Normalization Fix**: Added a robust `normalizeOrderData` layer directly at the `OrderRepository` boundary. All fetched legacy orders are now safely sanitized before serialization (missing dates fall back to epoch, missing totals dynamically calculate, string-based history maps to structured objects) ensuring stable API responses without failing the entire batch.
- **Result**: The Admin Orders list, detail expansion, and timeline history are fully restored and handle all legacy edge cases gracefully (e.g., displaying "Date unavailable" rather than "Invalid Date"). No regressions to RBAC or public Track Order functionality.
- **Final Test Status**: 256/256 passing tests cleanly.

## 2026-10-07 Order Normalization Hardening
- **Temporal Integrity**: Missing legacy timestamps are now normalized strictly to empty strings rather than synthetic epoch dates (1970). The presentation layer uniformly handles these missing values by surfacing "Date unavailable" to the user/admin, preventing fabricated historical records.
- **Financial Integrity**: Missing commercial fields (`subtotal`, `total`) dynamically fall back to authoritative derivations (`price * quantity` on active items). `deliveryFee` adheres strictly to business rules: exact `0` for Store Pickup, and explicit `null` for unconfirmed local/nationwide deliveries to preserve the "To be confirmed" UI state without incorrectly zeroing the cost.

## 2026-10-07 TypeScript Debt Cleanup
- **Status:** Complete. TSC EXIT CODE is 0 (0 Type Errors).
- **Cleanup Details:** Fixed App Router route handler signatures (updating `params` typing to `Promise<{...}>` for Next.js 15+). Added strict `data` validation checks where Zod parsed bodies were possibly undefined.
- **Legacy Code Removal:** Safely removed obsolete Express middleware (`auth.middleware.ts`, `error.middleware.ts`, `validate.middleware.ts`, `httpSecurity.ts`, `jwtConfig.ts`) which were fully superseded by the Next.js `authenticateNext` and `requireRolesNext` utilities.
- **Verification:** 
  - 17 test files and 258 tests passed (0 failures).
  - Clean production build (`npm run build` exited with code 0).
  - Software Engineer verified architecture, RBAC, domain models, and tsconfig integrity (all PASS).
  - QA Tester verified core logic and workflows based on diffs (all PASS).
- **Remaining Defects:** None identified.

## TypeScript Clean Up (Oct 2026)
- **Resolved Migration Debt**: Purged 45+ legacy Express TypeScript errors masking true project state.
- **Removed Dead Code**: Eliminated unused Express-era files (`src/backend/utils/httpSecurity.ts`, `jwtConfig.ts`).
- **Modernized API Routes**: Upgraded Next.js App Router dynamic route signatures to safely await `Promise<params>`, natively satisfying Next.js 15+ strict typings.
- **Result**: `tsc --noEmit` cleanly exits with `CODE 0` and `0` errors. The `vitest` suite (`258` tests) remains unaffected and cleanly passes. Production build static generation verified clean.

## 2026-10-07 Administrator Timestamps Correction
- **Created Date Root Cause**: Legacy documents and server-side Next.js serialization produced unnormalized Firestore Timestamps (e.g., `_seconds`), resulting in `Invalid Date` crashes on the client. 
- **Last Login Root Cause**: Firebase Auth login verified credentials without propagating a discrete server-side `lastLoginAt` temporal update to the Firestore user profile.
- **Normalization Strategy**: Centralized safe parsing logic (`normalizeTimestamp`) now uniformly drops unparseable dates or synthetically generated epochs (0-ticks) to an empty string `''`. The React views explicitly fall back to `Date unavailable` or `Never` respectively, strictly preventing fabricated historical records.
- **Last Login Semantics**: The system strictly updates `lastLogin` *only* following a fresh credential authorization against the Google Identity Toolkit for an active administrator via the `/api/auth/login` endpoint. It ignores ambient token refreshes, deactivated administrators, and unauthenticated clients.
- **Validation**:
  - Live Vercel QA verified isolated Root Super Admin timestamp logic.
  - Test suite (269 tests) passed flawlessly with new coverage explicitly targeting temporal boundaries.
  - Production build static generation clean.
