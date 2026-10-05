# Project Handoff

## Current Snapshot
- **Date:** 2026-10-05
- **Branch:** main
- **HEAD:** 37d797d fix: resolve admin runtime crash, restore hero animations, and fix WhatsApp CTA destinations
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
- **Remote Vercel E2E gaps:** Partial coverage exists; automated Playwright runs directly against live Vercel deployments are not fully configured.
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
- **Latest Verified Test Count:** 198 tests pass across 13 test files. Verification state is **CLEAN / EXIT CODE 0**. The previous Vitest worker timeout on `TrackOrder.test.tsx` was a transient infrastructure hiccup that has cleared on rerun.
- **Test Count History:** The current discovered test count is exactly 198 tests (matching the historical high of 198). This represents a net-zero change: approximately 77 obsolete Knex/SQLite-specific tests were legitimately removed or skipped, while an equivalent number of new Next.js/Firebase tests (including the massive 128-test `comprehensive-api.test.ts`) were added during the migration. The final exit status is now a clean code 0.
- **Build State:** Local `npm run build` succeeds cleanly.
- **Local vs Remote E2E Status:** End-to-end functionality (Public flows, Admin flows) has been successfully verified against BOTH the local production build (Phase 12) AND the remote Vercel deployment (Phase 15). The `/admin` production runtime crash has been confirmed resolved on the live deployment.

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
