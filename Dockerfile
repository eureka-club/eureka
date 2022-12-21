# Install dependencies only when needed
FROM node:16-alpine AS deps
# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
RUN apk add --no-cache libc6-compat curl openssl1.1-compat
WORKDIR /app

# Install dependencies based on the preferred package manager
COPY package.json yarn.lock* package-lock.json* pnpm-lock.yaml* ./
RUN \
  if [ -f yarn.lock ]; then yarn --frozen-lockfile; \
  elif [ -f package-lock.json ]; then npm ci; \
  elif [ -f pnpm-lock.yaml ]; then yarn global add pnpm && pnpm i; \
  else echo "Lockfile not found." && exit 1; \
  fi


# Rebuild the source code only when needed
FROM node:16-alpine AS builder
RUN apk add --no-cache libc6-compat curl openssl1.1-compat
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Next.js collects completely anonymous telemetry data about general usage.
# Learn more here: https://nextjs.org/telemetry
# Uncomment the following line in case you want to disable telemetry during the build.
# ENV NEXT_TELEMETRY_DISABLED 1

ARG DATABASE_URL
ENV DATABASE_URL=$DATABASE_URL
RUN echo "DATABASE_URL => $DATABASE_URL"


ARG NEXT_PUBLIC_GOOGLE_TAG_MANAGER_ID
ENV NEXT_PUBLIC_GOOGLE_TAG_MANAGER_ID=$NEXT_PUBLIC_GOOGLE_TAG_MANAGER_ID
RUN echo "NEXT_PUBLIC_GOOGLE_TAG_MANAGER_ID => $NEXT_PUBLIC_GOOGLE_TAG_MANAGER_ID"

ARG OPENAI_API_KEY
ENV OPENAI_API_KEY=$OPENAI_API_KEY
RUN echo "OPENAI_API_KEY => $OPENAI_API_KEY"

ARG NEXT_PUBLIC_AZURE_CDN_ENDPOINT
ENV NEXT_PUBLIC_AZURE_CDN_ENDPOINT=$NEXT_PUBLIC_AZURE_CDN_ENDPOINT
RUN echo "NEXT_PUBLIC_AZURE_CDN_ENDPOINT => $NEXT_PUBLIC_AZURE_CDN_ENDPOINT"

ARG NEXT_PUBLIC_WEBAPP_URL
ENV NEXT_PUBLIC_WEBAPP_URL=$NEXT_PUBLIC_WEBAPP_URL
RUN echo "NEXT_PUBLIC_WEBAPP_URL => $NEXT_PUBLIC_WEBAPP_URL"

ARG NEXT_PUBLIC_PUBLIC_ASSETS_STORAGE_MECHANISM
ENV NEXT_PUBLIC_PUBLIC_ASSETS_STORAGE_MECHANISM=$NEXT_PUBLIC_PUBLIC_ASSETS_STORAGE_MECHANISM
RUN echo "NEXT_PUBLIC_PUBLIC_ASSETS_STORAGE_MECHANISM => $NEXT_PUBLIC_PUBLIC_ASSETS_STORAGE_MECHANISM"

ENV NODE_ENV production
ENV NEXT_PUBLIC_AZURE_STORAGE_ACCOUNT_CONTAINER_NAME 'public-assets'

RUN yarn prisma generate
RUN yarn build

# If using npm comment out above and use below instead
# RUN npm run build

# Production image, copy all the files and run next
FROM node:16-alpine AS runner
RUN apk add --no-cache libc6-compat curl openssl1.1-compat
WORKDIR /app

# Uncomment the following line in case you want to disable telemetry during runtime.
# ENV NEXT_TELEMETRY_DISABLED 1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# You only need to copy next.config.js if you are NOT using the default configuration
COPY --from=builder /app/next.config.js ./
COPY --from=builder /app/public ./public
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/i18n.js ./i18n.js


# Automatically leverage output traces to reduce image size 
# https://nextjs.org/docs/advanced-features/output-file-tracing
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT 3000

CMD ["node", "server.js"]
