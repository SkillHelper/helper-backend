FROM node:18-alpine AS builder

WORKDIR /app

COPY package.json yarn.lock ./
COPY ./packages/*/package.json ./packages/*/yarn.lock ./packages/

RUN yarn install

COPY . .
RUN yarn workspaces foreach --all run build

FROM node:18-alpine

WORKDIR /app

COPY --from=builder /app/package.json /app/yarn.lock ./
COPY --from=builder /app/packages/*/package.json /app/packages/*/yarn.lock ./packages/
COPY --from=builder /app/packages/*/dist ./packages/

CMD ["yarn", "workspace", "server", "start:prod"]