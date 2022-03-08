FROM node:14

RUN mkdir /app

WORKDIR /app

COPY package* ./

RUN npm i

COPY . .

EXPOSE 9001

ENV NODE_ENV development
ENV PORT 9001
ENV JWT_SECRET asdasdfasdfasd

ENTRYPOINT [ "yarn", "dev" ]
