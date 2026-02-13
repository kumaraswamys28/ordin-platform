FROM ubuntu:focal

RUN apt-get update \
  && apt-get install -y curl ca-certificates \
  && curl -fsSL https://deb.nodesource.com/setup_24.x | bash - \
  && apt-get install -y nodejs \
  && node -v \
  && npm -v
RUN apt-get install git -y 
WORKDIR /home/app
COPY main.sh main.sh 
COPY script.js script.js
COPY package*.json .
RUN npm install

RUN chmod +x main.sh
RUN chmod +x script.js

ENTRYPOINT [ "/home/app/main.sh" ]

