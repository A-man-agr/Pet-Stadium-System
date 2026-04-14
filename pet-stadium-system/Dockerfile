# Stage 1: Build the React frontend
FROM node:18-alpine AS build

WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm install

COPY frontend/ ./
RUN npm run build

# Stage 2: Serve the unified app using the Express server
FROM node:18-alpine

WORKDIR /app

# Copy the backend code first for cache layer
COPY backend/package*.json ./
RUN npm install --production

COPY backend/ ./

# Copy the built React artifacts to the backend's "public" directory
COPY --from=build /app/frontend/dist ./public

# Cloud Run binds to whatever PORT environment variable it passes.
# We do not use EXPOSE since Cloud Run injects the port dynamically.

# Start the Node Express backend
CMD ["node", "server.js"]
