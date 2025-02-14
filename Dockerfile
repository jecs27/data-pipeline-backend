# Build stage
FROM node:18-alpine AS builder

WORKDIR /app

COPY package*.json ./
# Add --unsafe-perm flag and ensure proper ownership
RUN npm ci --legacy-peer-deps --unsafe-perm=true

COPY . .
RUN npm run build

# Production stage
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
# Modified npm install commands with proper flags
RUN npm install -g typescript ts-node tsconfig-paths --unsafe-perm=true && \
    npm install -D tsconfig-paths --unsafe-perm=true && \
    npm ci --legacy-peer-deps --unsafe-perm=true

# Copy all source files needed for migrations
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/src ./src
COPY tsconfig.json ./tsconfig.json

# COPY .env.example to create .env if it doesn't exist
COPY .env.example ./.env.example
RUN cp .env.example .env

# Add user for security
RUN addgroup -S appgroup && adduser -S appuser -G appgroup

USER appuser

EXPOSE 3000

# Run migrations and start app
CMD ["sh", "-c", "npm run migration:run && npm run start:prod"]