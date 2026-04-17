FROM node:22-alpine

# Set working directory inside the container
WORKDIR /app

# Copy the monolithic package.json files
COPY package*.json ./
COPY frontend/package*.json ./frontend/

# Install backend dependencies
RUN npm ci

# Install frontend dependencies (forcing dev mode to ensure Vite installs)
RUN npm install --prefix frontend --include=dev

# Copy all the source code
COPY . .

# Build the React frontend using Vite
RUN npm run build --prefix frontend

# Move the built dist folder into the backend's public folder
RUN rm -rf public && mv frontend/dist public

# Set environment variables for production
ENV NODE_ENV=production
ENV PORT=5000

# Expose the port
EXPOSE 5000

# Start the Node.js Express server
CMD ["node", "server.js"]
