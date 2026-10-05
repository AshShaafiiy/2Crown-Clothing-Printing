# 2Crown Clothing & Printing

## Project Overview
2Crown Clothing & Printing is a premium e-commerce platform built for a Nigerian custom clothing and printing business. The visual identity is strictly **Black, Gold, and White**. The UI is designed to feel premium, modern, professional, and clean.

## Current Stack
- **Framework**: Next.js (App Router / API Routes)
- **UI Library**: React
- **Language**: TypeScript
- **Styling**: Tailwind CSS (v3)
- **Authentication**: Firebase Auth
- **Database**: Firestore (Production Persistence)
- **Admin SDK**: Firebase Admin (Server-side)
- **Deployment**: Vercel
- **Domain Layer**: Cloudflare / Truehost (Planned)

*(Note: ImageKit and Resend integrations are currently deferred unless active code requires them.)*

## Repository Layout
- `/src/app`: Next.js App Router (Pages, Layouts, API Routes).
- `/src/components`: Reusable UI components.
- `/src/services`: Application services layer.
- `/src/hooks`: Custom React hooks.
- `/src/utils`: Utilities and helpers.
- `/public`: Static assets.

## Development Setup

### Requirements
- Node.js (v18+ recommended)
- npm (v9+ recommended)

### Installation
```bash
npm install
```

### Environment Variables
To run the application, provide the following environment variables (Do NOT track real values in Git). See `.env.example` for templates.

**Required:**
- `NEXT_PUBLIC_FIREBASE_API_KEY`
- `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
- `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
- `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`
- `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
- `NEXT_PUBLIC_FIREBASE_APP_ID`
- `FIREBASE_PROJECT_ID`
- `FIREBASE_CLIENT_EMAIL`
- `FIREBASE_PRIVATE_KEY` (MUST be properly formatted with line breaks `\n`)

### Running the Development Server
```bash
npm run dev
```

## Testing
To run the Vitest suite:
```bash
npm run test
```

To run the TypeScript compiler check:
```bash
npx tsc -b
```

## Production Build
```bash
npm run build
```

## Firebase Architecture & Production Persistence
The backend architecture is entirely driven by **Firebase**. 
- **Firestore** handles all production persistence (replacing obsolete SQLite/InMemoryDB).
- **Firebase Admin** is used server-side (Next.js API routes) to validate tokens and securely query/mutate data.
- **Firebase Auth** manages client-side authentication and session state.

## Security Model
- **Authentication**: Firebase Auth exclusively. (Custom JWT is NOT used).
- **Admin Authorization**: Strict Role-Based Access Control (RBAC). Roles include `root_super_admin`, `super_admin`, and `admin`.
- **Root Protection**: Backend enforces root protection, preventing unauthorized deletion or modification of the Root Super Admin.
- **Service Account Security**: The Firebase service account key (`FIREBASE_PRIVATE_KEY`) is stored entirely outside the repository as a secure environment variable on Vercel. Secrets are strictly excluded from Git tracking.
- **Tracking Privacy**: The public Order Tracking timeline contains fulfillment statuses and timestamps only. It explicitly excludes customer identity, contact info, address, internal IDs, and internal communication/audit events.

## Deployment Model
- The application is deployed on **Vercel** via **GitHub Deployment Integration**.
- Automatic deployments are triggered upon pushes to the main branch.
- Domain layer routing/DNS is planned via Cloudflare / Truehost.

## Important Stable Business Rules
- **Custom Work Flow**: The "Custom Work" link navigates directly to `#custom-work`. The CTA button triggers WhatsApp. **NO Customer File Uploads**, NO Custom Work DB record, NO Custom Work admin table, and NO Custom Work pricing calculator.
- **Normal Product Ordering**: Shop → Product Details → Add to Cart → Cart → Checkout → Save Order (persisted first) → Structured WhatsApp continuation.
- **Order Reference**: The reference format is `2C-123456` (128 cryptographic random bits in uppercase hex, or equivalent secure format).
- **Track Order**: Requires BOTH order reference + phone number.
- **Privacy Safe**: Tracking DTO is privacy-safe. Unknown/malformed reference or wrong phone yields an indistinguishable generic failure.
- **Delivery Rules**: 
  - Store Pickup fee = `₦0`.
  - Local Delivery fee = "To be confirmed".
- **Currency**: NGN (`₦`) only.
- **Catalog**: One product image per product. No stock/inventory management. No Product Type (unless explicitly reintroduced). Do not duplicate automatic badges.
- **UI Dialogs**: Use existing application dialog/toast UI; no native `alert()`, `confirm()`, or `prompt()`.
- **Admin Tables**: Use `nowrap` + horizontal scroll.

## Obsolete Architecture References
The following technologies and architectures are historically deprecated and should NOT be used:
- Express (Production), SQLite, Knex, PostgreSQL, Oracle, InMemoryDB.
- Netlify, Old Vite Production Architecture.
- Custom JWT.
- Old UUID-style references, reference-only tracking.
