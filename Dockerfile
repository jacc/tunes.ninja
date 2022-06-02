FROM node:latest
WORKDIR /app
ADD samurai/ .
ADD .prisma ./.prisma/
RUN yarn
RUN yarn generate
RUN yarn build