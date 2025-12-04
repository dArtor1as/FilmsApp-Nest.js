# базовий образ Node.js
FROM node:20-alpine

# Встановлюємо OpenSSL для роботи Prisma
RUN apk add --no-cache openssl python3 make g++
# Робоча папка всередині контейнера
WORKDIR /usr/src/app

# 1. Копіюємо файли конфігурації npm
COPY package*.json ./

# 2. Копіюємо папку prisma (там твоя схема БД)
COPY prisma ./prisma/

# 3. Встановлюємо залежності
RUN npm install

# 4. Генеруємо клієнт Prisma (критично важливо!)
RUN npx prisma generate

# 5. Копіюємо весь інший код
COPY . .

# 6. Білдимо NestJS проєкт
RUN npm run build

# Відкриваємо порт
EXPOSE 3000

# Команда запуску 
CMD ["node", "dist/src/main"]