FROM node:18-alpine AS builder
  
WORKDIR /app

COPY package.json yarn.lock ./
COPY ./packages/server/package.json ./packages/server/package.json
COPY ./packages/reference/package.json ./packages/reference/package.json
COPY .yarnrc.yml .yarnrc.yml
COPY .yarn .yarn

RUN yarn install
RUN yarn workspaces foreach --all run install

COPY . .
RUN yarn workspaces foreach --all run build

CMD ["yarn", "workspace", "server", "start:prod"]