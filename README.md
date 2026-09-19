# 2Crown Clothing & Printing

A premium e-commerce platform built for a Nigerian custom clothing and printing business. This repository contains the frontend application, currently driven by a mock service architecture.

## Project Status

**Current Phase: Phase 2 — Repository & Documentation Restructuring**

The frontend application (Phase 1) is fully functional and uses a simulated backend layer to handle data interactions, custom work routing, cart state, and order tracking. We are currently documenting and auditing the repository to prepare for the OpenAPI contract generation.

### Phase Roadmap
- **Phase 1**: Frontend + Mock Services + Tests (Completed)
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
