# Weather Manager (Backend)

## Стек технологій

- **Runtime:** Node.js (CommonJS)
- **Фреймворк:** Express 5
- **База даних:** PostgreSQL (`pg` pool)
- **Безпека та авторизація:** JSON Web Tokens (JWT), bcrypt
- **Валідація запитів:** Yup
- **CORS:** cors
- **Середовище:** dotenv

---

## Архітектура та функціонал

- `src/controllers/` — обробка бізнес-логіки користувачів (`user.js`) та збереження локацій (`favourites.js`).
- `src/db/` — підключення до PostgreSQL.
- `src/middlewares/` — перевірка JWT-токенів (`authenticate`), валідація схем (`validate`) та глобальний перехоплювач помилок (`errorHandler`).
- `src/routes/` — маршрутизація для авторизації, профілю та обраного.
- `src/validation/` — схеми перевірки вхідних даних Yup.
- `dump.sql` — схема та ініціалізація бази даних.

---

## 🚀 Встановлення та запуск

# 1. Клонування репозиторію та перехід у папку
```bash
git clone https://github.com/javidoru02-byte/Weather-manager-back.git
cd Weather-manager-back
```

# 2. Встановлення залежностей
```bash
npm install
```

# 3. Розгортання бази даних PostgreSQL (використовуючи dump.sql)
```bash
psql -U postgres -d weather_db -f dump.sql
```

# 4. Налаштування змінних середовища (.env)
```bash
cat <<EOF> .env
PORT=5000
JWT_SECRET=super_secret_jwt_key
PG_USER=postgres
PG_HOST=localhost
PG_DATABASE=weather_db
PG_PASSWORD=your_password
PG_PORT=5432
EOF
```

# 5. Запуск сервера для розробки
```bash
npm run dev
```

# (Або запуск у продакшн режимі: npm start)
