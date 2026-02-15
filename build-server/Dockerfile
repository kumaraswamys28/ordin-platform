FROM node:24-alpine

RUN apk add --no-cache git bash

WORKDIR /home/app

COPY package*.json ./
RUN npm install --omit=dev

COPY main.sh .
COPY deployment-platform.json .
COPY script.js .


RUN chmod +x main.sh script.js

RUN mkdir -p /home/app/output

ENTRYPOINT [ "/home/app/main.sh" ]