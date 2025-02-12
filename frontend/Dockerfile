FROM node:22.13.1-slim as builder

WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    make \
    g++ \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Copy configuration files first
COPY package*.json .
COPY vite.config.js .
COPY tailwind.config.js .
COPY postcss.config.js .
COPY .env .

# Install dependencies
RUN npm ci && npm cache clean --force

# Copy source code
COPY . .

# Build application
RUN npm run build

# Production stage
FROM node:22.13.1-slim

WORKDIR /app

# Install curl for health check
RUN apt-get update && apt-get install -y \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Create non-root user
RUN adduser --disabled-password --gecos '' appuser && \
    chown -R appuser:appuser /app

# Copy built assets from builder
COPY --from=builder /app/dist ./dist

# Install serve for production
RUN npm install -g serve@14.2.1 && npm cache clean --force

USER appuser

# Environment variables
ENV NODE_ENV=production \
    PORT=5173

# Expose port
EXPOSE 5173

# Health check
HEALTHCHECK --interval=30s --timeout=30s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:5173/ || exit 1

# Run application
CMD ["serve", "-s", "dist", "-l", "5173"]