# Case Rush - Telegram Mini App

## Overview
Полнофункциональное Telegram Mini App - игровая платформа "Case Rush" с азартными механиками, современным UX и интеграцией с Telegram Bot API. Платформа включает систему кейсов, игры (Апгрейд, PvP Монетка), реальный чат поддержки и полную систему баланса.

## Project Structure
- **Frontend**: React + Vite + TypeScript
  - Telegram Mini App SDK (@twa-dev/sdk)
  - UI: Radix UI components + Tailwind CSS
  - Routing: Wouter
  - State: TanStack Query (React Query)
  - Animations: Framer Motion
  - WebSocket: Socket.io-client для чата
  
- **Backend**: Express + TypeScript + Socket.IO
  - REST API для всех игровых операций
  - WebSocket сервер для чата поддержки
  - Provably Fair математика для честных игр
  - Rate limiting и защита от взлома
  - In-memory storage (готово для PostgreSQL)
  
- **Shared**: Общие схемы и типы

## Architecture
- Единый сервер на порту 5000 (API + Frontend)
- Telegram автоавторизация по InitData
- Real-time чат через WebSocket
- Провably Fair система для игр

## Recent Changes (November 3, 2025)
**Реализовано:**
1. ✅ Расширена схема БД (баланс, кейсы, инвентарь, игры, транзакции, чат)
2. ✅ Telegram Mini App SDK интеграция
3. ✅ Система авторизации (InitData validation)
4. ✅ Полная навигация (таб-бар: Кейсы, Игры, Кошелёк, Профиль)
5. ✅ Система баланса и транзакций
6. ✅ Кейсы с анимацией открытия
7. ✅ Игра "Апгрейд" с расчетом шансов
8. ✅ Игра "PvP Монетка" с лобби
9. ✅ Чат поддержки (WebSocket)
10. ✅ Защита бэкенда (rate limiting, provably fair)

## API Endpoints
**Авторизация:**
- POST `/api/auth/login` - Вход через Telegram

**Пользователь:**
- GET `/api/user/profile` - Профиль
- GET `/api/user/balance` - Баланс
- POST `/api/user/deposit` - Пополнение
- GET `/api/user/transactions` - История
- GET `/api/user/inventory` - Инвентарь

**Кейсы:**
- GET `/api/cases` - Все кейсы
- GET `/api/cases/:id` - Детали кейса
- POST `/api/cases/:id/open` - Открыть кейс

**Игры:**
- POST `/api/game/upgrade` - Апгрейд предмета
- GET `/api/game/coinflip/active` - Активные игры
- POST `/api/game/coinflip/create` - Создать игру
- POST `/api/game/coinflip/:id/join` - Присоединиться

**WebSocket:**
- `chat:join` - Подключиться к чату
- `chat:message` - Отправить сообщение
- `chat:typing` - Индикатор печати

## Frontend Routes
- `/` - Онбординг 1
- `/onboarding-2,3,4` - Онбординг шаги
- `/main` - Главная страница
- `/cases` - Каталог кейсов
- `/cases/:id` - Детали кейса
- `/games` - Список игр
- `/games/upgrade` - Игра Апгрейд
- `/games/coinflip` - PvP Монетка
- `/wallet` - Кошелёк
- `/profile` - Профиль
- `/support` - Чат поддержки

## Development
```bash
npm run dev    # Запуск dev сервера
npm run build  # Сборка для продакшн
npm check      # Проверка типов
```

## Security Features
- Telegram InitData валидация
- Rate limiting на всех эндпоинтах
- Provably Fair математика (server seed + client seed)
- Защита от копирования сайта
- Проверка баланса перед играми

## Environment Variables
- `TELEGRAM_BOT_TOKEN` - Токен Telegram бота
- `PORT` - Порт сервера (default: 5000)

## Notes
- Используется in-memory хранилище (можно заменить на PostgreSQL)
- Все игры работают по честной математике (provably fair)
- WebSocket чат работает в реальном времени
- Адаптивный дизайн под разные экраны
- Анимации 60 FPS через Framer Motion
