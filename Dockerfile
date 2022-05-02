FROM node:16

RUN npm i -g @nestjs/cli

COPY package.json .

RUN npm install

COPY . .

EXPOSE 3001

CMD ["nest", "start"]