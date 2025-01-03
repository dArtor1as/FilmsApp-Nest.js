# Встановлюємо базовий образ
FROM node:20-alpine

# Встановлюємо робочу директорію
WORKDIR /usr/src/app

# Копіюємо package.json та встановлюємо залежності
COPY package*.json ./
RUN npm install

# Копіюємо весь код до контейнера
COPY . .

# Збираємо застосунок
RUN npm run build

# Встановлюємо порт
EXPOSE 3000

# Команда для запуску
CMD ["node", "dist/main"]
