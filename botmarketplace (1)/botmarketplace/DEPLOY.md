# 🚀 Деплой BotMarket

## Вариант 1: Vercel (РЕКОМЕНДУЕТСЯ) — 2 минуты

### Через GitHub (автоматический деплой)
1. Загрузи проект на GitHub
2. Зайди на [vercel.com](https://vercel.com) → Sign Up (через GitHub)
3. Нажми **"Add New Project"** → выбери репозиторий
4. В настройках добавь Environment Variables:
   ```
   ADMIN_PASSWORD_HASH=admin123
   API_SECRET=super-secret-key
   ```
5. Нажми **Deploy** — сайт будет live через 1-2 минуты

### Через Vercel CLI
```bash
npm i -g vercel
vercel login
vercel --prod
```

---

## Вариант 2: Cloudflare Pages (через Wrangler)

Ты получил ошибку потому что Cloudflare Pages требует адаптер `@cloudflare/next-on-pages`.

```bash
# Установи Wrangler
npm install -g wrangler

# Войди в Cloudflare
wrangler login

# Собери проект для Cloudflare
npm run pages:build

# Деплой
npm run pages:deploy
```

**Важно:** API Routes (`/api/notify`) в Cloudflare Pages работают как Edge Functions.

---

## Вариант 3: Статический хостинг (Netlify / Surge / GitHub Pages)

Если не нужны API Routes:

```js
// next.config.js
const nextConfig = {
  output: 'export',
  distDir: 'dist',
  images: { unoptimized: true }
}
```

```bash
npm run build
# Загрузи папку dist на хостинг
```

**Минусы:** Не работают API Routes, Telegram-уведомления нужно делать через отдельный бэкенд.

---

## 🤖 Деплой Telegram бота отдельно

### Railway (бесплатно)
1. Загрузи папку `telegram-bot/` на GitHub
2. Зайди на [railway.app](https://railway.app)
3. New Project → Deploy from GitHub repo
4. Add Variables:
   ```
   TELEGRAM_BOT_TOKEN=xxx
   ADMIN_CHAT_ID=xxx
   WEBAPP_URL=https://your-vercel-domain.vercel.app
   API_SECRET=xxx
   ```
5. Deploy

### Или VPS / Render
```bash
cd telegram-bot
pip install -r requirements.txt
python bot.py
```

---

## 🔗 После деплоя

1. Обнови `WEBAPP_URL` в `.env` бота на твой домен
2. Перезапусти бота
3. В @BotFather установи WebApp URL:
   ```
   /setdomain
   /setmenubutton
   ```
