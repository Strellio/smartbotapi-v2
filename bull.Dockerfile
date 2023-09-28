# Use the official lightweight Node.js 12 image.
# https://hub.docker.com/_/node
FROM node:19.0.1

# Create and change to the app directory.
WORKDIR /usr/src/app

# Copy application dependency manifests to the container image.
# A wildcard is used to ensure both package.json AND package-lock.json are copied.
# Copying this separately prevents re-running npm install on every code change.
COPY package*.json ./

# # COPY .npmrc
# COPY .npmrc* ./

# Install dependencies.
# If you add a package-lock.json speed your build by switching to 'npm ci'.
# RUN npm ci --only=production && npm i typescript
RUN npm i --legacy-peer-deps && npm i typescript --legacy-peer-deps

# Copy local code to the container image.
COPY . ./

RUN npm run build:js



# Run the web service on container startup.
CMD ["node", "dist/workers/bull-and-events/index.js"]