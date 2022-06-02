FROM node:latest
WORKDIR /app
ADD . .
RUN yarn
RUN yarn generate
RUN yarn build