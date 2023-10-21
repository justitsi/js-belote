FROM node:20
WORKDIR /usr/src/app

COPY package*.json ./
RUN npm ci

COPY . .
EXPOSE 8000
CMD [ "node", "index.js" ]