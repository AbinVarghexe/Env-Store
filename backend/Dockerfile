FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

FROM node:20-alpine
WORKDIR /app
RUN addgroup -g 1001 -S nodejs && adduser -S devvault -u 1001
COPY --from=builder /app/node_modules ./node_modules
COPY . .
USER devvault
EXPOSE 5000
ENV NODE_ENV=production
CMD ["node", "src/server.js"]
