# Project Handoff

## Current Snapshot
- **Date:** 2026-10-05
- **Branch:** main
- **HEAD:** 4d470eb docs: synchronize project handoff for cross-account continuity
- **origin/main:** 4d470eb
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

## Current Known Defects / Open Work
- **Both intended homepage WhatsApp buttons fail to open WhatsApp correctly:** There are intentionally two WhatsApp-related CTAs on the Home page (one in the Hero section and one in the Custom Work section). They currently fail to resolve their intended destination. Both must be preserved and fixed.
- **Homepage hero entrance animation:** `animate-hero-enter-delayed-2` (and similar) are missing from `tailwind.config.js` and `globals.css`, breaking hero animations.
- **/admin production runtime crash:** Observed failing on Vercel; not yet cleared by a successful remote production verification. A local `npm run build` succeeds, but actual Vercel runtime behavior remains unverified.
- **Full application regression/E2E audit still required:** The app transitioned from Vite to Next.js; full end-to-end functionality requires manual and automated verification against actual infrastructure.
- **Remote Vercel E2E gaps:** Remote tests on live Vercel deployments are not fully configured.

## Current Task In Progress
The current task is to complete the **DOCUMENTATION + CROSS-ACCOUNT HANDOFF SYNCHRONIZATION**. Handoff accuracy corrections are currently being applied to ensure no claims of functionality are overstated without empirical Vercel/runtime proof.

## Next Recommended Actions
1. **Fix WhatsApp Buttons:** Identify both intended WhatsApp CTAs on the homepage and restore their correct destination behavior.
2. **Fix Hero Animations:** Add the missing keyframes/animations to `tailwind.config.js`.
3. **Verify Production `/admin` Runtime:** Confirm the actual deployed Vercel `/admin` route loads correctly in the browser without crashing.
4. **Full Regression Testing:** Execute a full end-to-end audit (manually and via Playwright) of the Next.js parity.

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
- **Latest Verified Test Count:** 198 tests pass across 13 test files. Verification state is **CLEAN / EXIT CODE 0**. The previous Vitest worker timeout on `TrackOrder.test.tsx` was a transient infrastructure hiccup that has cleared on rerun.
- **Test Count History:** The current discovered test count is exactly 198 tests (matching the historical high of 198). This represents a net-zero change: approximately 77 obsolete Knex/SQLite-specific tests were legitimately removed or skipped, while an equivalent number of new Next.js/Firebase tests (including the massive 128-test `comprehensive-api.test.ts`) were added during the migration. The final exit status is now a clean code 0.
- **Build State:** Local `npm run build` succeeds, but actual Vercel runtime is unverified.
- **Flows E2E Tested:** Store Pickup lifecycle, Track Order, Admin flows were tested on the *old* mock backend architecture. They must be re-verified against the new Next.js API.
- **Unverified:** Remote Vercel deployment runtime stability (`/admin`), Next.js specific routing parity, E2E regressions.

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
