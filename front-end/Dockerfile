# === Stage 1: Build the Vite React app ===
FROM node:20-alpine AS builder

WORKDIR /app

# env variables

ARG VITE_USER_API_URL
ARG VITE_BACKEND_API_URL
ARG VITE_ENV
ARG VITE_REALM
ARG VITE_REALM_CLIENT

ENV VITE_USER_API_URL=$VITE_USER_API_URL
ENV VITE_BACKEND_API_URL=$VITE_BACKEND_API_URL
ENV VITE_ENV=$VITE_ENV
ENV VITE_REALM=$VITE_REALM
ENV VITE_REALM_CLIENT=$VITE_REALM_CLIENT


# Install pnpm and dependencies
COPY package.json pnpm-lock.yaml ./
RUN npm install -g pnpm && pnpm install

# Copy the rest of the project files
COPY . .

# Build the app
RUN pnpm run build

# === Stage 2: Serve with Nginx ===
FROM nginx:stable-alpine AS production

# Copy built files from builder stage
COPY --from=builder /app/dist /usr/share/nginx/html

# Add custom nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
