# Obsolete PostgreSQL/Vercel Files

The following files were created or modified for the Vercel/PostgreSQL migration and will be completely removed once the Firebase/Netlify migration passes:

1. `vercel.json` (Vercel routing config)
2. `api/[...path].ts` (Vercel serverless entrypoint for Express)
3. `backend/knexfile.cjs` (PostgreSQL/SQLite configuration)
4. `backend/src/db/*` (Knex instance, migrations, and seeds)
5. `scripts/migrate-to-postgres.cjs` (SQL data migration script)
6. `backend/src/utils/KnexRateLimitStore.ts` (PostgreSQL rate limit store)
7. `backend/src/repositories/*` (SQL-specific data repositories)
8. `backend/package.json` (`pg`, `knex` dependencies)
