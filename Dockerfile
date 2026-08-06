### Stage 1 — build the frontend (static SPA)
FROM node:20-alpine AS client-builder
WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm install --legacy-peer-deps --no-audit --no-fund

COPY client ./client
COPY shared ./shared
COPY vite.config.ts tsconfig.json tsconfig.node.json components.json ./

# No VITE_API_BASE set on purpose: the built frontend calls the API with
# relative paths (/api/chat/stream, same-origin WS) so it works unmodified
# whichever host ends up serving it — here, the same Cloud Run service.
RUN npm run build:client


### Stage 2 — build the server bundle
FROM node:20-alpine AS builder
WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm install --legacy-peer-deps --no-audit --no-fund

COPY server ./server
COPY scripts/build-server.mjs ./scripts/build-server.mjs

RUN node scripts/build-server.mjs


### Stage 3 — slim runtime: API + static frontend, one Cloud Run service
FROM node:20-alpine AS runtime
WORKDIR /app
ENV NODE_ENV=production
ENV PORT=8080

# Install ONLY runtime deps (express, ws, @google/genai)
COPY package.json package-lock.json* ./
RUN npm install --omit=dev --legacy-peer-deps --no-audit --no-fund \
  && npm cache clean --force

# Copy bundled server + prompts from builder, and the built static site
COPY --from=builder /app/dist/server ./dist/server
COPY --from=client-builder /app/dist/public ./dist/public

EXPOSE 8080

# Cloud Run sends SIGTERM; the server handles graceful shutdown
CMD ["node", "dist/server/index.mjs"]
