FROM node:22-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

FROM node:22-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000

COPY package*.json ./
RUN npm ci --only=production

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/server.ts ./server.ts
COPY --from=builder /app/schema.sql ./schema.sql
COPY --from=builder /app/README.md ./README.md
COPY --from=builder /app/tsconfig.json ./tsconfig.json
COPY --from=builder /app/data ./data

EXPOSE 3000

CMD ["npm", "start"]
