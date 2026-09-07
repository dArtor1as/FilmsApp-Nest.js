<p align="center">
  <a href="http://nestjs.com/" target="blank">
    <img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" />
  </a>
</p>

<p align="center">
  A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.
</p>

# My Cinema (React + NestJS)

Веб-застосунок для пошуку, перегляду інформації та оцінки фільмів. Проєкт реалізовано з використанням сучасної розділеної архітектури: клієнтська частина (SPA) побудована на React, а серверна — на базі NestJS, з використанням реляційної бази даних PostgreSQL та ORM Prisma.

---

## Функціонал

- **Каталог фільмів:** перегляд списку, детальна інформація, пошук та фільтрація за жанрами.
- **Інтеграція з TMDB API:** автоматичне отримання та збереження метаданих про фільми.
- **Автентифікація:** реєстрація та вхід користувачів з використанням JWT (JSON Web Tokens).
- **Взаємодія:**
  - створення та видалення рецензій;
  - коментування рецензій;
  - система оцінювання фільмів (із динамічним перерахунком середнього рейтингу);

---

## Технологічний стек

**Frontend:**

- React (Vite)
- Tailwind CSS v4 & shadcn/ui
- React Router
- Axios

**Backend & База даних:**

- NestJS
- TypeScript
- PostgreSQL
- Prisma ORM

**Інфраструктура & Тестування:**

- Docker, Docker Compose
- Nginx (для роздачі фронтенду)
- Jest, Supertest

---

# Налаштування та запуск

## Запуск через Docker (рекомендовано)

Завдяки Docker Compose ви можете підняти весь проєкт (базу даних, бекенд і фронтенд) однією командою.

### 1. Змінні оточення

Створіть файл `.env` у **кореневій директорії** проєкту (для бекенду та БД):

```env
# База даних для контейнерів
DB_HOST=postgres
DB_PORT=5432
DB_NAME=NestjsDB
DB_USER=postgres
DB_PASSWORD=MyPassword05

# API Key від TheMovieDB (TMDB)
TMDB_API_KEY=your_api_key

# Налаштування JWT
JWT_SECRET=your_super_secret_key
JWT_EXPIRES_IN=3600

# URL фронтенду (для налаштування CORS)
FRONTEND_URL=http://localhost:5173
```

Створіть файл `.env` у папці `frontend` (для клієнтської частини):

```env
VITE_API_URL=http://localhost:3000
```

### 2. Збірка та запуск

Виконайте команду в кореневій папці:

```bash
docker-compose up --build -d
```

Ця команда:

- запустить PostgreSQL;
- накотить міграції Prisma та автоматично наповнить базу тестовими даними (Seed);
- запустить бекенд NestJS на порту 3000;
- збере React-застосунок і запустить Nginx для його роздачі на порту 5173.

**Доступ до застосунку:**

- Фронтенд (інтерфейс користувача): http://localhost:5173
- Бекенд API: http://localhost:3000/api

### 3. Тестовий користувач

Після запуску база даних вже матиме тестові дані. Ви можете увійти, використовуючи ці облікові дані:

- Email: `admin@example.com`
- Пароль: `123456`

## Локальний запуск (без Docker)

Для локальної розробки вам знадобиться піднята база даних PostgreSQL.

### 1. Запуск бекенду

У кореневій папці:

```bash
# Встановлення залежностей
npm install

# У .env змініть DB_HOST на localhost та налаштуйте свій порт
# Запуск міграцій та сидування
npx prisma migrate dev
npx prisma db seed

# Запуск сервера
npm run start:dev
```

### 2. Запуск фронтенду

Відкрийте новий термінал:

```bash
cd frontend
npm install
npm run dev
```

---

## Тестування

Проєкт містить Unit та E2E тести для бекенд-частини.

#### запуск unit тестів

```
npm run test
```

#### запуск e2e тестів

```
npm run test:e2e
```

#### перевірка покриття коду тестами

```
npm run test:cov
```

---

## Ліцензія

Nest is MIT licensed.
