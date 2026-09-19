# Architecture

## Current Frontend Architecture
The application is a Single Page Application (SPA) built with:
- **React 18**
- **TypeScript**
- **Vite**
- **React Router v6**
- **Tailwind CSS** (Styling framework)
- **Zustand** (Global state management)

## The Service Interface Pattern
To ensure the frontend is completely decoupled from the future backend implementation, the application uses an **Interface-Based Service Pattern**.
All data operations (fetching products, placing orders, reading business settings) are defined as strict TypeScript interfaces inside `src/services/interfaces/index.ts`.

Components and hooks do **not** make direct `fetch()` or `axios` calls to external APIs. Instead, they interact entirely with the central `services` export object.

## Mock Implementation Pattern
Because the project is currently in **Phase 1 & 2**, the `services` object is wired to a Mock Implementation layer located in `src/services/mock/`. 
This layer uses localized memory, `localStorage`, and deliberate artificial delays to perfectly simulate a live backend environment. 

When Phase 6 (Frontend/Backend Integration) arrives, a new `src/services/api/` layer will be built, and the central `services` export will simply be swapped to point to the new API classes. The React components will not require any changes.

## Data Flow & State Management
- **Local Component State**: Handled natively via `useState` and `useEffect`.
- **Global Cart State**: Handled via `Zustand` (`src/store/cartStore.ts`). It persists cart data using `localStorage` so customers do not lose items on refresh.
- **Form Handling**: Currently managed via native HTML forms and controlled inputs.
- **Routing**: React Router (`src/App.tsx`) handles public customer pages and protected Admin dashboard routes.

## Special WSL2 Configuration
The project is configured to run smoothly in a WSL2 environment mounted to a Windows file system (`/mnt/c/...`). The `vite.config.ts` explicitly enables `server.watch.usePolling: true` to guarantee Hot Module Replacement (HMR) safely detects file edits.
