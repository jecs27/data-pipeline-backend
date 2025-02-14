# Build stage
FROM node:18-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci --legacy-peer-deps

COPY . .
RUN npm run build

# Production stage
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --legacy-peer-deps --only=production

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/.env ./.env
COPY --from=builder /app/src/database ./src/database

# Add user for security
RUN addgroup -S appgroup && adduser -S appuser -G appgroup

# Install netcat for wait-for-it script
RUN apk add --no-cache netcat-openbsd

# Copy wait-for-it script
COPY wait-for-it.sh /wait-for-it.sh
RUN chmod +x /wait-for-it.sh

USER appuser

EXPOSE 3000

# Run migrations and start app
CMD ["/bin/sh", "-c", "/wait-for-it.sh $DATABASE_HOST:$DATABASE_PORT -- npm run migration:run && npm run start:prod"]
