# Build stage
FROM node:18-alpine AS builder

WORKDIR /usr/src/app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy source code
COPY . .

# Compile TypeScript to JavaScript
RUN npm run build

# Production stage
FROM node:18-alpine

WORKDIR /usr/src/app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install only production dependencies
RUN npm ci --only=production

# Copy compiled JavaScript from the build stage
COPY --from=builder /usr/src/app/build ./build

# Set NODE_ENV to production
ENV NODE_ENV production

# Command to run the application
CMD ["node", "build/src/index.js"]