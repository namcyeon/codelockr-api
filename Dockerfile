FROM docker.io/library/node:16-alpine

# Create app directory
WORKDIR /app

COPY package*.json ./
RUN yarn install

# Bundle app source
COPY . .

RUN yarn global add pm2

CMD [ "pm2-runtime", "node", "--", "server.js" ]

EXPOSE 3000
