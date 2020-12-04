FROM node:12

WORKDIR /dev_app

COPY ./package.json .
COPY ./package-lock.json .
COPY ./env.json ../

RUN npm install -g
RUN npm ci

COPY . .

EXPOSE 8005
CMD ["npm","start"]