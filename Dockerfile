# Multi-stage build for optimal image size and security
FROM node:18-alpine AS frontend-builder

# Set working directory for frontend build
WORKDIR /app/adk-ui

# Copy package files and install dependencies
COPY adk-ui/package*.json ./
RUN npm ci --only=production

# Copy frontend source and build
COPY adk-ui/ ./
RUN npm run build

# Python runtime stage
FROM python:3.11-slim AS backend

# Set environment variables
ENV PYTHONUNBUFFERED=1 \
    PYTHONDONTWRITEBYTECODE=1 \
    PIP_NO_CACHE_DIR=1 \
    PIP_DISABLE_PIP_VERSION_CHECK=1

# Install system dependencies
RUN apt-get update && apt-get install -y \
    curl \
    nodejs \
    npm \
    && rm -rf /var/lib/apt/lists/*

# Create non-root user for security
RUN groupadd -r appuser && useradd -r -g appuser appuser

# Set working directory
WORKDIR /app

# Copy Python requirements and install dependencies
COPY requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt

# Copy Python source code
COPY gmap-buddy/ ./gmap-buddy/

# Copy built frontend from previous stage
COPY --from=frontend-builder /app/adk-ui/.next ./adk-ui/.next
COPY --from=frontend-builder /app/adk-ui/public ./adk-ui/public
COPY --from=frontend-builder /app/adk-ui/package*.json ./adk-ui/
COPY --from=frontend-builder /app/adk-ui/node_modules ./adk-ui/node_modules

# Create startup script
COPY docker-entrypoint.sh ./
RUN chmod +x docker-entrypoint.sh

# Change ownership to non-root user
RUN chown -R appuser:appuser /app
USER appuser

# Expose port (Cloud Run uses PORT environment variable)
EXPOSE 8080

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=30s --retries=3 \
    CMD curl -f http://localhost:8080/ || exit 1

# Start the application
ENTRYPOINT ["./docker-entrypoint.sh"]
