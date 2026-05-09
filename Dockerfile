FROM node:20-slim AS deps
WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm ci --ignore-scripts

FROM node:20-slim AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
ENV APP_BASE_URL=http://localhost:3000
ENV NEXT_PUBLIC_APP_URL=http://localhost:3000
ENV NEXT_SERVER_ACTIONS_ENCRYPTION_KEY=VGhpcy1hcHAtdXNlcy1hLXN0YWJsZS0zMmJ5dGUta2V5ISE=
ENV DEPLOYMENT_VERSION=local-build
RUN npm rebuild 2>/dev/null || true
RUN npm run build

FROM node:20-slim AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV PORT=3000
ENV HOSTNAME=0.0.0.0
ENV APP_BASE_URL=
ENV NEXT_PUBLIC_APP_URL=
ENV NEXT_SERVER_ACTIONS_ENCRYPTION_KEY=VGhpcy1hcHAtdXNlcy1hLXN0YWJsZS0zMmJ5dGUta2V5ISE=
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs
RUN mkdir -p /app/data && chown nextjs:nodejs /app/data
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/data ./data
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
USER nextjs
EXPOSE 3000
CMD ["sh", "-c", "HOSTNAME=0.0.0.0 exec node server.js"]
