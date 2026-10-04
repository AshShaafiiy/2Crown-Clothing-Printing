# Architecture

## Current Frontend Architecture
The application is a Single Page Application (SPA) built with:
- **React 19**
- **TypeScript**
- **Vite**
- **React Router v7**
- **Tailwind CSS** (Styling framework)
- **Zustand** (Global state management)

## The Service Interface Pattern
The frontend uses an **Interface-Based Service Pattern** to keep components independent of the active API or test mock implementation.
All data operations (fetching products, placing orders, reading business settings) are defined as strict TypeScript interfaces inside `src/services/interfaces/index.ts`.

Components and hooks do **not** make direct `fetch()` or `axios` calls to external APIs. Instead, they interact entirely with the central `services` export object.

## API and mock implementations
`src/services/index.ts` selects `src/services/api` for development and production. Tests use `src/services/mock` by default, and `VITE_USE_MOCK_SERVICES=true` opts into mocks deliberately. The API client sends bearer tokens to the Express routes; repositories use Knex with persistent SQLite. The production-like stack builds React assets and serves them through Caddy, which proxies API routes to Express. The site is not publicly deployed.

## Data Flow & State Management
- **Local Component State**: Handled natively via `useState` and `useEffect`.
- **Global Cart State**: Handled via `Zustand` (`src/store/cartStore.ts`). It persists cart data using `localStorage` so customers do not lose items on refresh.
- **Form Handling**: Currently managed via native HTML forms and controlled inputs.
- **Routing**: React Router (`src/App.tsx`) handles public customer pages and protected Admin dashboard routes.

## Special WSL2 Configuration
The project is configured to run smoothly in a WSL2 environment mounted to a Windows file system (`/mnt/c/...`). The `vite.config.ts` explicitly enables `server.watch.usePolling: true` to guarantee Hot Module Replacement (HMR) safely detects file edits.
