# stage 1 building the code
FROM node:16-alpine as builder

WORKDIR /usr/app

COPY package*.json ./
COPY startup.sh ./

RUN yarn install

COPY . .

RUN yarn prisma:generate

RUN yarn build



# stage 2

FROM node:16-alpine as development

WORKDIR /usr/app

RUN apk add --no-cache netcat-openbsd

COPY --from=builder /usr/app/ .


COPY .env .


EXPOSE 4000

CMD ["sh", "-c", "while ! nc -z db 5432; do sleep 1; done && yarn prisma:migrate && yarn start:dev"]


# stage 3

FROM node:16-alpine as production

WORKDIR /usr/app

COPY --from=builder /usr/app/ .
COPY --from=builder /usr/app/startup.sh .

COPY .env .

CMD ["sh", "-c", "while ! nc -z db 5432; do sleep 1; done && yarn prisma:migrate:run && yarn start:prod"]
