# Base
FROM node:20-alpine as base
WORKDIR /src

# Build
FROM base as build
COPY package*.json ./
RUN npm install
COPY . .
RUN npm prune

# Run
FROM base
ENV PORT=3000
ENV HOST=0.0.0.0
COPY --from=build /src/.output /src/.output
CMD [ "node", ".output/server/index.mjs" ]