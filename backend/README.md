# 2Crown Backend

## Architecture
This is a lightweight Node.js/Express backend implemented in TypeScript. 
It strictly implements the OpenAPI contract defined in `/openapi.yaml` at the project root.

## Technical Choices
- **Node.js & Express**: Keeps the full stack strictly TypeScript, ensuring smooth development and type consistency. Node.js is widely supported on $0/month serverless and free-tier hostings (e.g. Render).
- **Zod**: Used for runtime validation of request bodies to guarantee strict OpenAPI schema compliance.
- **In-Memory Store**: Currently uses a simple in-memory array-based datastore as required for Phase 4. All data is reset upon restart.

## Commands
- **Test**: `npm run test` runs the backend test suite using Vitest.

## Authentication
Root Super Admin credentials for testing:
- **Email**: annarsjay3@gmail.com
- **Password**: password123
