# 2Crown Clothing & Printing

A premium e-commerce platform for a Nigerian custom clothing and printing business. Visual identity: **Black, Gold, White**.

## Current Architecture

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript |
| UI | React 19, Tailwind CSS 3 |
| State | Zustand |
| Auth | Firebase Authentication (Email/Password) |
| Database | Cloud Firestore |
| Server SDK | Firebase Admin SDK |
| Hosting | Vercel (GitHub integration) |
| Image CDN | ImageKit |
| Email | Resend (deferred — not yet wired) |
| Domain | Cloudflare + Truehost (planned, not configured) |
| Testing | Vitest, Playwright |

### Request / Data Flow

```
Browser → Next.js Client Component → fetch() → Next.js API Route Handler
  → Firebase Admin SDK → Firestore
```

Admin authentication:
```
Browser → Firebase Client SDK signInWithEmailAndPassword()
  → Firebase ID Token → Authorization: Bearer <token>
  → API Route → Firebase Admin verifyIdToken()
  → Firestore user profile lookup → role + active check
```

## Repository Layout

```
app/                      # Next.js App Router
  (public)/               # Public routes (Home, Shop, Cart, Checkout, Track Order)
  admin/
    (protected)/          # Auth-guarded admin pages
    login/                # Admin login page
  api/                    # Next.js Route Handlers (server-side)
  globals.css             # Tailwind styles
  layout.tsx              # Root layout
src/
  backend/                # Server-side logic
    repositories/         # Firestore data access
    middleware/            # Auth middleware
    schemas/              # Validation schemas
    services/             # Business logic
    utils/                # Server utilities
  components/             # React components
    admin/                # Admin layout, protected route wrapper
    layout/               # Navbar, Footer
    ui/                   # Shared UI components
  domain/models/          # TypeScript domain types
  hooks/                  # Custom React hooks
  services/               # Client-side service layer
    api/                  # API-backed implementations
    interfaces/           # Service interfaces
    mock/                 # Mock implementations (tests only)
  store/                  # Zustand stores
  utils/                  # Client utilities (WhatsApp, transitions)
  views/                  # Page-level view components
    admin/                # Admin view components
    public/               # Public view components
tests/                    # Vitest + Playwright test files
firebase.json             # Firebase emulator config
firestore.rules           # Firestore security rules
firestore.indexes.json    # Firestore indexes
```

## Getting Started

### Prerequisites

- Node.js 18+
- npm 9+
- Firebase project with Auth + Firestore enabled

### Installation

```bash
npm install
```

### Environment Variables

Copy `.env.example` to `.env.local` and fill in the values.

**Firebase Client (browser-safe, NEXT_PUBLIC_ prefix):**
- `NEXT_PUBLIC_FIREBASE_API_KEY`
- `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
- `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
- `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`
- `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
- `NEXT_PUBLIC_FIREBASE_APP_ID`

**Application Security (server-only):**
- `BUYER_FINGERPRINT_SECRET` (HMAC buyer fingerprinting)
- `RATING_TOKEN_SECRET` (JWT rating verification token)

**Firebase Admin (server-only, never exposed to browser):**
- `FIREBASE_PROJECT_ID`
- `FIREBASE_CLIENT_EMAIL`
- `FIREBASE_PRIVATE_KEY`

**ImageKit (server & client):**
- `IMAGEKIT_PUBLIC_KEY` (Dynamic route auth)
- `IMAGEKIT_PRIVATE_KEY` (Server-only deletion/management)
- `IMAGEKIT_URL_ENDPOINT` (Base URL for images)

The Firebase service-account JSON is stored **outside the repository** at `~/.config/2crown/service-account.json` for local development. Never commit it.

### Development

```bash
npm run dev
```

### Testing

```bash
npm run test          # Vitest unit/integration tests
npm run test:e2e      # Playwright E2E tests
```

### Production Build

```bash
npm run build
npm run start
```

## Deployment

The repository is connected to Vercel via GitHub integration. Pushing to `main` triggers automatic deployment.

- **Vercel project**: `2crown-clothing-printing`
- **Production URL**: `https://2crown-clothing-printing.vercel.app`
- **Firebase project**: `twocrown-clothing-printing`
- **ImageKit**: Used for dynamic Product image uploads.

Vercel environment variables must be configured in the Vercel dashboard. The service-account private key and ImageKit private key are set as Vercel environment variables — they are never stored in the repository.

## Security Architecture

- **Authentication**: Firebase Auth (Email/Password). No custom JWT.
- **Authorization**: Three-tier RBAC — `root_super_admin`, `super_admin`, `admin`.
- **Root protection**: Backend-enforced. Root Super Admin cannot be deleted, deactivated, or demoted.
- **API security**: All admin API routes verify Firebase ID tokens via `firebase-admin` `verifyIdToken()`, then check Firestore user profile for `active === true` and appropriate role.
- **Firestore rules**: Default deny. Public reads allowed only for active products, categories, promotions, and settings.
- **Secrets**: No secrets in Git. `.env`, `.env.local`, and service-account files are gitignored.
- **Tracking privacy**: Order tracking returns sanitized DTO only. Malformed reference, unknown reference, and wrong phone number all return identical generic failure.

## Business Rules

See `AGENTS.md` for the complete, authoritative set of business rules that all developers and AI agents must follow.

Key rules:
- **Custom Work** → direct WhatsApp. No database record, no uploads, no pricing calculator.
- **Normal orders** → server-side order creation first, then WhatsApp continuation.
- **Order reference format**: `2C-123456` (6-digit numeric).
- **Track Order** requires both order reference and phone number.
- **Pickup fee**: ₦0. **Local delivery fee**: "To be confirmed" (set manually via WhatsApp).
- **Currency**: NGN only.
- **One product image**. No inventory/stock system.
- **No native alert/confirm/prompt** — use application dialogs/toasts.

## Historical Context

This project was originally built with Vite + Express + SQLite. It was migrated to Next.js + Firebase in October 2026. The old Express/SQLite/Knex/PostgreSQL architecture is fully replaced. Some legacy files remain in the repository for reference but are not used in production.

## Documentation

- `AGENTS.md` — Mandatory rules for AI coding agents
- `PROJECT_HANDOFF.md` — Live continuation document for cross-account handoff
- `docs/` — Historical domain documentation
- `.env.example` — Required environment variable template

## Image Storage Architecture

Product dynamic images use **ImageKit** via direct browser upload to avoid Vercel payload limits and proxying overhead.

**Upload Flow:**
1. Admin browser requests `/api/upload/imagekit-auth`
2. Server validates Firebase Auth & RBAC, returning token/signature using `imagekit` SDK
3. Browser uploads image directly to ImageKit using `@imagekit/javascript`
4. ImageKit returns `imageUrl` and `imageFileId`
5. Frontend attaches metadata to the final Product save request
6. Firestore stores the reference.

**Constraints:**
- Allowed MIME types: `image/jpeg`, `image/png`, `image/webp`.
- Maximum File Size: `5 MB`.
- Legacy Firebase Storage `imageUrl` values remain fully render-compatible.
