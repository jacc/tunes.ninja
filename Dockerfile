FROM node:latest
WORKDIR /app
ADD package.json .
ADD yarn.lock .
RUN yarn
ADD prisma .
RUN yarn generate
ADD . .
RUN yarn build
