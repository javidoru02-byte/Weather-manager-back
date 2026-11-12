-- Weather Manager — схема бази даних + тестові дані
-- Імпорт: psql -U postgres -d weather_manager -f dump.sql
-- Скрипт можна запускати повторно: він перестворює таблиці з нуля.

DROP TABLE IF EXISTS favourite_weather;
DROP TABLE IF EXISTS users;

CREATE TABLE users (
    id         SERIAL PRIMARY KEY,
    email      VARCHAR(255) NOT NULL,
    password   VARCHAR(255) NOT NULL,
    name       VARCHAR(255) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    CONSTRAINT users_email_key UNIQUE (email)
);

CREATE TABLE favourite_weather (
    user_id    INTEGER NOT NULL REFERENCES users (id) ON DELETE CASCADE,
    city_id    INTEGER NOT NULL,
    name       VARCHAR(255) NOT NULL,
    lat        NUMERIC(9, 6) NOT NULL,
    lon        NUMERIC(9, 6) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    CONSTRAINT favourite_weather_pkey PRIMARY KEY (user_id, city_id)
);

CREATE INDEX idx_favourite_weather_user_id ON favourite_weather (user_id);

-- Тестові користувачі. Пароль для обох: password123
INSERT INTO users (email, password, name) VALUES
    ('ivan.petrenko@example.com', '$2b$10$60K/q5AxEmjc3uts7U6poue4nXKKQZbc.YGIy5bNhZOYbmeSIPwIW', 'Ivan Petrenko'),
    ('olha.kovalenko@example.com', '$2b$10$60K/q5AxEmjc3uts7U6poue4nXKKQZbc.YGIy5bNhZOYbmeSIPwIW', 'Olha Kovalenko');

INSERT INTO favourite_weather (user_id, city_id, name, lat, lon) VALUES
    (1, 702550, 'Ternopil', 49.553520, 25.594770),
    (1, 703448, 'Kyiv', 50.450100, 30.523400),
    (2, 702550, 'Ternopil', 49.553520, 25.594770),
    (2, 702634, 'Lviv', 49.839680, 24.029700);
