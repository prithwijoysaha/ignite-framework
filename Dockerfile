FROM node:18.12.1

WORKDIR /usr/src/app

COPY ./package.json ./
COPY ./package-lock.json ./

RUN npm install -g npm@latest
RUN npm install

COPY . .

EXPOSE 5000

CMD ["npm","start"]
