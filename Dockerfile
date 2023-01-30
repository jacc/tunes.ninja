FROM node:latest
WORKDIR /app
ADD package.json .
ADD yarn.lock .
RUN yarn
ADD prisma .
ADD . .
RUN yarn generate
RUN yarn build
