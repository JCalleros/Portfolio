FROM node:22-alpine AS base
WORKDIR /app

RUN apk add --no-cache libc6-compat

FROM base AS deps
COPY package*.json ./

RUN npm ci --no-audit --no-fund

FROM base AS build
COPY --from=deps /app/node_modules ./node_modules
COPY . .

RUN npm run build

FROM nginx:alpine AS nginx
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
