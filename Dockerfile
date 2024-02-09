# Use uma imagem Node.js como base
FROM node:18.19.0-alpine

WORKDIR /src

ADD package.json /src

RUN npm install -g npm@10.4.0

RUN npm install --force

ADD . /src

EXPOSE 3000
