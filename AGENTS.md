# 2Crown Clothing & Printing - Agent Instructions

Welcome, future coding agents! This file dictates the absolute rules and context for developing this project.

## 1. Project Purpose
2Crown Clothing & Printing is a premium e-commerce platform built for a Nigerian custom clothing and printing business.
The visual identity is strictly **Black, Gold, and White**. The UI must feel premium, modern, professional, and clean.

## 2. Current Stack & Architecture
- **Stack**: Next.js (App Router), React, TypeScript, Tailwind CSS, Zustand.
- **Architecture Pattern**: Component → Hook/State → Next.js API Routes → Firebase Admin SDK → Firestore.
- **Current state**: Next.js and Firebase migration complete. Preparing for Vercel deployment. **NOT PUBLICLY DEPLOYED**.

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
- **Target Production Infrastructure**: Vercel (Hobby/Pro evaluation pending) + Firebase (Spark plan) or equivalents. Target $0/month where possible.
- The only mandatory paid expense is the custom domain.
- **DO NOT INTRODUCE**: AWS, Paid Databases, or any billing-heavy infrastructure without explicit instruction.
- **DO NOT INTRODUCE**: Customer file storage (e.g., S3). The website only uses Admin-managed media.

## 5. Release Boundary
Keep the implemented Next.js/Firebase architecture and secure production boot chain. Current work is release-candidate verification and documentation; public domain deployment remains future work. Do not add a new database or backend architecture without explicit instruction.

## 6. Testing & Quality
- Run tests via `npm run test` (Vitest).
- Check types via `npx tsc -b`.
- Build via `npm run build`.

## 7. Strict Prohibitions
- Do NOT fabricate fake product images or UI sections not approved by the user.
- Do NOT reintroduce the "Shop by Category", "How Custom Orders Work", or "Testimonials" sections to the Homepage.
- Do NOT replace the existing Firestore/Firebase backend or restore the old Express/SQLite backend.


## 8. Development Workflow
- **Mandatory Three-Role Workflow**: All complex tasks must be processed through a strict three-role subagent loop:
  1. **Full-Stack Developer**: Implements the feature or fix.
  2. **Software Engineer**: Independently reviews architecture, constraints, and security.
  3. **QA Tester**: Verifies end-to-end functionality via tests or live validation.
  - Any FAIL at any stage loops back to the developer until all three roles PASS.

## 9. Git Safety Rule
- **NEVER** use `git push --force` or `git push -f` against `main` during normal 2Crown work.
- Do not rewrite shared `main` history.
- **NO** destructive reset without explicit authorization.
- If an accidental commit needs correction, prefer a new corrective commit.
- Force-push may only occur with explicit user authorization for that specific operation.

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
