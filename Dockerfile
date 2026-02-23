# ── Build stage ─────────────────────────────────────────
FROM node:22-alpine AS build

RUN corepack enable && corepack prepare pnpm@10.4.1 --activate

WORKDIR /app

# Dependencies first (cache layer)
COPY package.json pnpm-lock.yaml ./
COPY patches/ patches/
RUN pnpm install --frozen-lockfile

# Source code
COPY client/ client/
COPY server/ server/
COPY shared/ shared/
COPY tsconfig.json vite.config.ts ./

# Client-side Gemini API key (restricted by HTTP referrer + API scope)
ARG VITE_GEMINI_API_KEY
ENV VITE_GEMINI_API_KEY=$VITE_GEMINI_API_KEY

# Build frontend (dist/public/) + server (dist/index.js)
RUN pnpm build

# ── Runtime stage ───────────────────────────────────────
FROM node:22-alpine

RUN corepack enable && corepack prepare pnpm@10.4.1 --activate

WORKDIR /app

ENV NODE_ENV=production

# Production dependencies only
COPY package.json pnpm-lock.yaml ./
COPY patches/ patches/
RUN pnpm install --prod --frozen-lockfile && pnpm store prune

# Non-root user
RUN addgroup -S appgroup && adduser -S appuser -G appgroup

# Built artifacts from build stage
COPY --from=build /app/dist dist/

USER appuser

# Cloud Run sets PORT automatically (default 8080)
EXPOSE 8080

# Health check
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s \
  CMD wget -qO- http://localhost:${PORT:-8080}/ || exit 1

CMD ["node", "dist/index.js"]
