# Base stage: install all dependencies (including dev)
FROM node:20-alpine AS base
RUN apk add --no-cache dumb-init
USER node
WORKDIR /app
COPY --chown=node:node package.json package-lock.json ./
RUN npm ci

# Install production dependencies only
FROM node:20-alpine AS deps
USER node
WORKDIR /app
COPY --chown=node:node package.json package-lock.json ./
RUN npm ci --omit=dev

# Compile TypeScript sources
FROM base AS build
USER node
WORKDIR /app
COPY --chown=node:node tsconfig.json ./
COPY --chown=node:node src/ src/
RUN npm run build

# Final runtime image
FROM node:20-alpine AS final
RUN apk add --no-cache dumb-init
USER node
WORKDIR /app
COPY --chown=node:node --from=deps /app/node_modules ./node_modules
COPY --chown=node:node --from=build /app/dist ./dist
COPY --chown=node:node --from=build /app/package.json ./
CMD ["dumb-init", "node", "dist/index.js"]
