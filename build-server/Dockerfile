# Use the official Node Alpine image - it's tiny (~50MB)
FROM node:24-alpine

# 1. Install system dependencies (git, bash, and build tools)
# We use --no-cache to keep the image small
RUN apk add --no-cache git bash

WORKDIR /home/app

# 2. Copy dependency files first to use Docker layer caching
COPY package*.json ./
RUN npm install --omit=dev

# 3. Copy the rest of your application
COPY main.sh .
COPY deployment-platform.json .
COPY script.js .


# 4. Set permissions
RUN chmod +x main.sh script.js

# Ensure the output directory exists for the clone
RUN mkdir -p /home/app/output

ENTRYPOINT [ "/home/app/main.sh" ]