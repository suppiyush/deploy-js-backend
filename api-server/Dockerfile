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
ARG DATABASE_URL
ENV DATABASE_URL=$DATABASE_URL
COPY --chown=node:node tsconfig.json ./
COPY --chown=node:node prisma.config.ts ./
COPY --chown=node:node prisma/ prisma/
COPY --chown=node:node src/ src/
RUN npx prisma generate
RUN npm run build

# Final runtime image
FROM node:20-alpine AS final
RUN apk add --no-cache dumb-init
USER node
WORKDIR /app
COPY --chown=node:node --from=deps /app/node_modules ./node_modules
COPY --chown=node:node --from=build /app/node_modules/.prisma ./node_modules/.prisma
COPY --chown=node:node --from=build /app/dist ./dist
COPY --chown=node:node --from=build /app/package.json ./
COPY --chown=node:node src/client/kafka.pem ./dist/client/kafka.pem
CMD ["dumb-init", "node", "dist/index.js"]
