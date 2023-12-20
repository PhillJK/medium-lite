## Перед тем как запустить сервер

```bash
  #Создаем .env файл в корневой директории
  $ touch .env
```

.env файл должен содержать следующие поля

```env
# Все <VARIABLE> должны быть заменены на соотвествующие значения

DATABASE_URL="postgresql://<USER>:<PASSWORD>@<HOST>:<PORT>/<DATABASE>?schema=public"
ACCESS_TOKEN_SECRET=<ACCESS_TOKEN_SECRET>
REFRESH_TOKEN_SECRET=<REFRESH_TOKEN_SECRET>
PORT=<PORT>;
```

Для генерации JWT секретов можно использовать следующую комманду

```bash
  $ openssl rand -hex 32
```

После этого выполняем следующие комманды

```bash
  $ npm install
  $ npx prisma db push
  $ npx prisma generate
```

## Запустить сервер

```bash
# Запустить сервер
$ npm run start

# Запустить сервер в "наблюдающем режиме"
$ npm run start:dev

# Запустить сервер в продакшн режиме
$ npm run start:prod
```

## Docker

К сожалению, во время запуска контейнера, есть неполадки, которых я не успел починить

```bash
# Запустить сервер через Docker
$ docker compose up
```
