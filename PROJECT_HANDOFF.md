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
