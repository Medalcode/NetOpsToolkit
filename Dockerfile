# Multi-stage Dockerfile for NetOpsToolkit
# Stage 1: Build
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy source files
COPY . .

# Build production assets via Vite
RUN npm run build

# Stage 2: Serve via NGINX
FROM nginx:alpine AS runner

# Copy built assets to NGINX HTML directory
COPY --from=builder /app/dist /usr/share/nginx/html

# Expose port 80
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
