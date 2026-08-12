# 🤖 BotMarket — Маркетплейс AI-ботов

## 🚀 Быстрый старт

### 1. Next.js приложение
```bash
cd botmarketplace
npm install
npm run dev
```

### 2. Telegram бот
```bash
cd telegram-bot
pip install -r requirements.txt
# Создай .env с токеном от @BotFather
python bot.py
```

## 🔑 Настройка Telegram бота

1. Напиши [@BotFather](https://t.me/BotFather), создай бота, получи токен
2. Установи WebApp URL:
   ```
   /setmenubutton
   ```
   Или настрой через API:
   ```bash
   curl -X POST "https://api.telegram.org/bot<TOKEN>/setChatMenuButton"      -H "Content-Type: application/json"      -d '{"menu_button":{"type":"web_app","text":"🚀 BotMarket","url":"https://your-domain.com/telegram-auth"}}'
   ```
3. Получи свой Chat ID: напиши [@userinfobot](https://t.me/userinfobot)
4. Заполни `.env`:
   ```
   TELEGRAM_BOT_TOKEN=your_token
   ADMIN_CHAT_ID=your_chat_id
   WEBAPP_URL=https://your-domain.com
   ```

## 📋 Функционал

### Клиент
- 🔐 Авторизация через Telegram (1 клик, уникальный ID)
- 🛒 Каталог ботов с фильтрами и сортировкой
- 🛍️ Корзина и оформление заказа
- 💳 Оплата криптой / картой / кошельком
- 🆘 Поддержка через тикеты
- 📱 Telegram бот с WebApp

### Админ
- 📊 Дашборд с аналитикой
- 📦 CRUD ботов (добавление, цены, статус)
- 📋 Управление заказами (смена статуса, детали)
- 💬 Поддержка клиентов (тикеты + чат)
- 🔔 Уведомления в Telegram о новых заказах и тикетах

## 🔌 Подключение Supabase

SQL для таблиц:
```sql
create table bots (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  description text,
  fullDescription text,
  price numeric not null,
  oldPrice numeric,
  category text,
  tags text[],
  image text,
  features text[],
  status text default 'active',
  stock int default 0,
  sold int default 0,
  rating numeric default 0,
  reviews int default 0,
  created_at timestamp default now()
);

create table orders (
  id uuid default gen_random_uuid() primary key,
  bot_id uuid references bots(id),
  bot_name text,
  buyer_email text,
  buyer_name text,
  telegram_id bigint,
  amount numeric,
  currency text default 'USD',
  status text default 'pending',
  payment_method text,
  payment_id text,
  tx_hash text,
  created_at timestamp default now()
);

create table tickets (
  id text primary key,
  subject text not null,
  client_name text,
  client_email text,
  telegram_id bigint,
  status text default 'open',
  priority text default 'medium',
  category text,
  bot_name text,
  order_id text,
  created_at timestamp default now(),
  updated_at timestamp default now()
);

create table messages (
  id uuid default gen_random_uuid() primary key,
  ticket_id text references tickets(id),
  sender text check (sender in ('client', 'admin')),
  text text not null,
  read boolean default false,
  created_at timestamp default now()
);

create table users (
  id uuid default gen_random_uuid() primary key,
  telegram_id bigint unique,
  name text,
  username text,
  photo_url text,
  auth_token text,
  role text default 'customer',
  created_at timestamp default now()
);
```

## 🔔 Уведомления в Telegram

При новом заказе админ получает:
```
🛒 НОВЫЙ ЗАКАЗ!
📦 Бот: NEXUS Trading Bot
💰 Сумма: $299
👤 Покупатель: Алексей
📧 Email: alex@mail.com
💳 Способ: USDT (TRC20)
```

При новом тикете:
```
🆘 НОВЫЙ ТИКЕТ ПОДДЕРЖКИ!
🔴 Приоритет: HIGH
📌 Тема: Не получил доступ
👤 Клиент: Алексей
💬 Сообщение: ...
```

## 🛡️ Админ-панель

Вход: `/admin/settings` → пароль `admin123`

После входа в навигации появляется ссылка "Админ".

## 📦 Деплой

### Vercel (Next.js)
```bash
npm run build
# Задеплой на Vercel
```

### Сервер для бота (Railway / VPS)
```bash
# Установи Python 3.11+
pip install -r requirements.txt
python bot.py
```

Или используй Docker:
```dockerfile
FROM python:3.11-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt
COPY . .
CMD ["python", "bot.py"]
```

## 📄 Лицензия

MIT
