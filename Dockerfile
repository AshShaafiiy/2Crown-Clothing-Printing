# STAGE 1: Build Frontend
FROM node:20-slim@sha256:2cf067cfed83d5ea958367df9f966191a942351a2df77d6f0193e162b5febfc0 AS frontend-builder
WORKDIR /app/frontend
ENV PUPPETEER_SKIP_DOWNLOAD=true
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# STAGE 2: Build Backend
FROM node:20-slim@sha256:2cf067cfed83d5ea958367df9f966191a942351a2df77d6f0193e162b5febfc0 AS backend-builder
RUN apt-get update && apt-get install -y python3 make g++ && rm -rf /var/lib/apt/lists/*
WORKDIR /app/backend
COPY backend/package*.json ./
RUN npm ci
COPY backend/ .
RUN npm run build
# Remove devDependencies to prepare a clean node_modules for production
RUN npm ci --omit=dev --legacy-peer-deps

# STAGE 3: Production Image (Node Backend)
FROM node:20-slim@sha256:2cf067cfed83d5ea958367df9f966191a942351a2df77d6f0193e162b5febfc0 AS production
WORKDIR /app
ENV NODE_ENV=production

# Install sqlite3 runtime dependency (no build tools needed here)
RUN apt-get update && apt-get install -y sqlite3 && rm -rf /var/lib/apt/lists/*

# Copy built backend files and production node_modules from builder
COPY --chown=node:node --from=backend-builder /app/backend/dist ./backend/dist
COPY --chown=node:node --from=backend-builder /app/backend/package.json ./backend/
COPY --chown=node:node --from=backend-builder /app/backend/node_modules ./backend/node_modules

# Copy frontend static build (as a fallback for Node server if run standalone)
COPY --chown=node:node --from=frontend-builder /app/frontend/dist ./public

# Setup SQLite Data Directory
RUN mkdir -p /data && chown -R node:node /data
ENV DATABASE_URL=/data/prod.sqlite3
ENV FRONTEND_DIST_PATH=/app/public

# Switch to non-root user
USER node

EXPOSE 4000

CMD ["node", "backend/dist/src/index.js"]

# STAGE 4: Caddy Web Server
FROM caddy:2-alpine@sha256:6aeddd44c3078b0f9a35206472a11420648a79c184603ef95957d0a20044cb2b AS caddy_server
# Copy the frontend build to Caddy's serving directory
COPY --from=frontend-builder /app/frontend/dist /srv/public
# Copy the custom Caddyfile
COPY Caddyfile /etc/caddy/Caddyfile
