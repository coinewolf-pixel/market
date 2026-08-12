import asyncio
import json
import logging
from datetime import datetime

from aiogram import Bot, Dispatcher, F, Router
from aiogram.types import Message, CallbackQuery, InlineKeyboardMarkup, InlineKeyboardButton, WebAppInfo
from aiogram.filters import Command
from aiogram.enums import ParseMode

from config import BOT_TOKEN, ADMIN_CHAT_ID, WEBAPP_URL_FULL, API_SECRET

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

bot = Bot(token=BOT_TOKEN, parse_mode=ParseMode.HTML)
dp = Dispatcher()
router = Router()
dp.include_router(router)

# ═══════════════════════════════════════════════════════
# HELPER FUNCTIONS
# ═══════════════════════════════════════════════════════

def get_auth_keyboard(user_id: int, first_name: str, username: str = None):
    """Generate WebApp auth button"""
    # Pass user data in start_param for deep linking
    user_data = json.dumps({
        "id": user_id,
        "name": first_name,
        "username": username or ""
    })

    return InlineKeyboardMarkup(inline_keyboard=[
        [InlineKeyboardButton(
            text="🚀 Авторизоваться в BotMarket",
            web_app=WebAppInfo(url=f"{WEBAPP_URL_FULL}?user={user_data}")
        )],
        [InlineKeyboardButton(
            text="🛒 Открыть каталог",
            web_app=WebAppInfo(url=f"{WEBAPP_URL_FULL}?user={user_data}&page=catalog")
        )],
        [InlineKeyboardButton(
            text="🆘 Поддержка",
            web_app=WebAppInfo(url=f"{WEBAPP_URL_FULL}?user={user_data}&page=support")
        )]
    ])

# ═══════════════════════════════════════════════════════
# COMMANDS
# ═══════════════════════════════════════════════════════

@router.message(Command("start"))
async def cmd_start(message: Message):
    """Welcome message with auth button"""
    user = message.from_user

    welcome_text = f"""👋 <b>Привет, {user.first_name}!</b>

Добро пожаловать в <b>BotMarket</b> — маркетплейс AI-ботов.

🔹 Покупай готовых ботов для трейдинга, автоматизации, модерации
🔹 Мгновенная доставка после оплаты
🔹 Оплата криптой и картами
🔹 Поддержка 24/7

<b>Нажми кнопку ниже, чтобы войти:</b>"""

    await message.answer(
        welcome_text,
        reply_markup=get_auth_keyboard(user.id, user.first_name, user.username)
    )

@router.message(Command("help"))
async def cmd_help(message: Message):
    help_text = """<b>📖 Команды бота:</b>

/start — Авторизация и вход
/catalog — Открыть каталог ботов
/support — Написать в поддержку
/orders — Мои заказы
/status — Статус последнего заказа

<b>Админ-команды:</b>
/admin — Панель администратора
/notify_on — Включить уведомления
/notify_off — Выключить уведомления"""
    await message.answer(help_text)

@router.message(Command("catalog"))
async def cmd_catalog(message: Message):
    user = message.from_user
    await message.answer(
        "🛒 <b>Каталог ботов</b>

Нажми кнопку, чтобы открыть:",
        reply_markup=InlineKeyboardMarkup(inline_keyboard=[
            [InlineKeyboardButton(
                text="🛍️ Открыть каталог",
                web_app=WebAppInfo(url=f"{WEBAPP_URL_FULL}?user={json.dumps({'id':user.id,'name':user.first_name})}&page=catalog")
            )]
        ])
    )

@router.message(Command("support"))
async def cmd_support(message: Message):
    user = message.from_user
    await message.answer(
        "🆘 <b>Поддержка</b>

Опиши свою проблему или открой чат поддержки:",
        reply_markup=InlineKeyboardMarkup(inline_keyboard=[
            [InlineKeyboardButton(
                text="💬 Написать в поддержку",
                web_app=WebAppInfo(url=f"{WEBAPP_URL_FULL}?user={json.dumps({'id':user.id,'name':user.first_name})}&page=support")
            )]
        ])
    )

@router.message(Command("orders"))
async def cmd_orders(message: Message):
    # In production: fetch from DB
    await message.answer(
        "📦 <b>Твои заказы</b>

"
        "<i>Пока нет заказов. Купи своего первого бота!</i>

"
        "Нажми кнопку, чтобы открыть каталог:",
        reply_markup=InlineKeyboardMarkup(inline_keyboard=[
            [InlineKeyboardButton(text="🛒 В каталог", web_app=WebAppInfo(url=WEBAPP_URL_FULL))]
        ])
    )

# ═══════════════════════════════════════════════════════
# ADMIN COMMANDS
# ═══════════════════════════════════════════════════════

@router.message(Command("admin"))
async def cmd_admin(message: Message):
    """Admin panel via bot"""
    if str(message.from_user.id) != str(ADMIN_CHAT_ID):
        await message.answer("⛔ У тебя нет доступа к админ-панели.")
        return

    admin_text = """<b>🛡️ Админ-панель BotMarket</b>

Выбери действие:"""

    keyboard = InlineKeyboardMarkup(inline_keyboard=[
        [InlineKeyboardButton(text="📊 Дашборд", web_app=WebAppInfo(url=f"{WEBAPP_URL_FULL}?admin=true"))],
        [InlineKeyboardButton(text="📦 Управление ботами", callback_data="admin_bots")],
        [InlineKeyboardButton(text="📋 Заказы", callback_data="admin_orders")],
        [InlineKeyboardButton(text="🆘 Тикеты поддержки", callback_data="admin_tickets")],
    ])

    await message.answer(admin_text, reply_markup=keyboard)

@router.callback_query(F.data == "admin_bots")
async def admin_bots(callback: CallbackQuery):
    if str(callback.from_user.id) != str(ADMIN_CHAT_ID):
        await callback.answer("Нет доступа", show_alert=True)
        return
    await callback.message.edit_text(
        "📦 <b>Управление ботами</b>

Открой админ-панель на сайте для полного управления.",
        reply_markup=InlineKeyboardMarkup(inline_keyboard=[
            [InlineKeyboardButton(text="🌐 Открыть админку", web_app=WebAppInfo(url=f"{WEBAPP_URL_FULL}?admin=true&tab=bots"))]
        ])
    )

@router.callback_query(F.data == "admin_orders")
async def admin_orders_cb(callback: CallbackQuery):
    if str(callback.from_user.id) != str(ADMIN_CHAT_ID):
        await callback.answer("Нет доступа", show_alert=True)
        return
    await callback.message.edit_text(
        "📋 <b>Заказы</b>

Последние заказы:

"
        "<code>ORD-001</code> — NEXUS Trading Bot — $299 ✅ Оплачен
"
        "<code>ORD-002</code> — Echo Voice AI — $149 ⏳ Ожидание
"
        "<code>ORD-003</code> — Sentinel Security — $199 ✅ Доставлен

"
        "Открой админку для полного управления.",
        reply_markup=InlineKeyboardMarkup(inline_keyboard=[
            [InlineKeyboardButton(text="🌐 Управление заказами", web_app=WebAppInfo(url=f"{WEBAPP_URL_FULL}?admin=true&tab=orders"))]
        ])
    )

@router.callback_query(F.data == "admin_tickets")
async def admin_tickets_cb(callback: CallbackQuery):
    if str(callback.from_user.id) != str(ADMIN_CHAT_ID):
        await callback.answer("Нет доступа", show_alert=True)
        return
    await callback.message.edit_text(
        "🆘 <b>Тикеты поддержки</b>

"
        "🔴 <b>TKT-001</b> — Не получил доступ (Алексей)
"
        "🟡 <b>TKT-003</b> — Запрос на возврат (Дмитрий)

"
        "<i>2 открытых тикета требуют внимания!</i>",
        reply_markup=InlineKeyboardMarkup(inline_keyboard=[
            [InlineKeyboardButton(text="💬 Ответить на тикеты", web_app=WebAppInfo(url=f"{WEBAPP_URL_FULL}?admin=true&tab=support"))]
        ])
    )

# ═══════════════════════════════════════════════════════
# NOTIFICATION FUNCTIONS (called from Next.js API)
# ═══════════════════════════════════════════════════════

async def notify_new_order(order_data: dict):
    """Send notification to admin about new order"""
    if not ADMIN_CHAT_ID:
        logger.warning("ADMIN_CHAT_ID not set")
        return

    text = f"""🛒 <b>НОВЫЙ ЗАКАЗ!</b>

📦 <b>Бот:</b> {order_data.get('bot_name', 'Unknown')}
💰 <b>Сумма:</b> ${order_data.get('amount', 0)}
👤 <b>Покупатель:</b> {order_data.get('buyer_name', 'Unknown')}
📧 <b>Email:</b> {order_data.get('buyer_email', 'N/A')}
💳 <b>Способ оплаты:</b> {order_data.get('payment_method', 'N/A')}
🆔 <b>ID заказа:</b> <code>{order_data.get('order_id', 'N/A')}</code>

⏰ {datetime.now().strftime('%d.%m.%Y %H:%M')}"""

    keyboard = InlineKeyboardMarkup(inline_keyboard=[
        [InlineKeyboardButton(text="📋 Открыть заказ", web_app=WebAppInfo(url=f"{WEBAPP_URL_FULL}?admin=true&tab=orders&order={order_data.get('order_id', '')}"))],
        [InlineKeyboardButton(text="💬 Написать покупателю", url=f"mailto:{order_data.get('buyer_email', '')}")]
    ])

    try:
        await bot.send_message(ADMIN_CHAT_ID, text, reply_markup=keyboard)
        logger.info(f"Order notification sent for {order_data.get('order_id')}")
    except Exception as e:
        logger.error(f"Failed to send order notification: {e}")

async def notify_new_ticket(ticket_data: dict):
    """Send notification to admin about new support ticket"""
    if not ADMIN_CHAT_ID:
        return

    priority_emoji = {"urgent": "🔴", "high": "🟠", "medium": "🟡", "low": "🟢"}
    priority = ticket_data.get('priority', 'medium')

    text = f"""🆘 <b>НОВЫЙ ТИКЕТ ПОДДЕРЖКИ!</b>

{priority_emoji.get(priority, '🟡')} <b>Приоритет:</b> {priority.upper()}
📌 <b>Тема:</b> {ticket_data.get('subject', 'Unknown')}
👤 <b>Клиент:</b> {ticket_data.get('client_name', 'Unknown')}
📧 <b>Email:</b> {ticket_data.get('client_email', 'N/A')}
🏷️ <b>Категория:</b> {ticket_data.get('category', 'N/A')}
🆔 <b>ID:</b> <code>{ticket_data.get('ticket_id', 'N/A')}</code>

💬 <b>Сообщение:</b>
<i>{ticket_data.get('message', 'Нет текста')[:300]}</i>

⏰ {datetime.now().strftime('%d.%m.%Y %H:%M')}"""

    keyboard = InlineKeyboardMarkup(inline_keyboard=[
        [InlineKeyboardButton(text="💬 Ответить в тикете", web_app=WebAppInfo(url=f"{WEBAPP_URL_FULL}?admin=true&tab=support&ticket={ticket_data.get('ticket_id', '')}"))],
        [InlineKeyboardButton(text="📧 Написать клиенту", url=f"mailto:{ticket_data.get('client_email', '')}")]
    ])

    try:
        await bot.send_message(ADMIN_CHAT_ID, text, reply_markup=keyboard)
        logger.info(f"Ticket notification sent for {ticket_data.get('ticket_id')}")
    except Exception as e:
        logger.error(f"Failed to send ticket notification: {e}")

async def notify_payment_received(order_data: dict):
    """Notify admin that payment was received"""
    if not ADMIN_CHAT_ID:
        return

    text = f"""✅ <b>ОПЛАТА ПОЛУЧЕНА!</b>

🆔 <b>Заказ:</b> <code>{order_data.get('order_id')}</code>
📦 <b>Бот:</b> {order_data.get('bot_name')}
💰 <b>Сумма:</b> ${order_data.get('amount')}
👤 <b>Покупатель:</b> {order_data.get('buyer_name')}
🔗 <b>TX Hash:</b> <code>{order_data.get('tx_hash', 'N/A')}</code>

⚡ Не забудь отправить доступ покупателю!"""

    keyboard = InlineKeyboardMarkup(inline_keyboard=[
        [InlineKeyboardButton(text="📋 Открыть заказ", web_app=WebAppInfo(url=f"{WEBAPP_URL_FULL}?admin=true&tab=orders&order={order_data.get('order_id', '')}"))]
    ])

    try:
        await bot.send_message(ADMIN_CHAT_ID, text, reply_markup=keyboard)
    except Exception as e:
        logger.error(f"Failed to send payment notification: {e}")

# ═══════════════════════════════════════════════════════
# API ENDPOINT (for Next.js to call)
# ═══════════════════════════════════════════════════════

from aiohttp import web

async def handle_notify(request):
    """HTTP endpoint for receiving notifications from Next.js"""
    try:
        data = await request.json()
        secret = request.headers.get('X-API-Secret')

        if secret != API_SECRET:
            return web.Response(status=401, text='Unauthorized')

        notify_type = data.get('type')

        if notify_type == 'new_order':
            await notify_new_order(data)
        elif notify_type == 'new_ticket':
            await notify_new_ticket(data)
        elif notify_type == 'payment_received':
            await notify_payment_received(data)
        else:
            return web.Response(status=400, text='Unknown notification type')

        return web.Response(status=200, text='OK')
    except Exception as e:
        logger.error(f"API error: {e}")
        return web.Response(status=500, text=str(e))

async def start_api():
    """Start aiohttp server for receiving webhooks"""
    app = web.Application()
    app.router.add_post('/notify', handle_notify)
    runner = web.AppRunner(app)
    await runner.setup()
    site = web.TCPSite(runner, 'localhost', 8081)
    await site.start()
    logger.info("Notification API started on http://localhost:8081")

# ═══════════════════════════════════════════════════════
# MAIN
# ═══════════════════════════════════════════════════════

async def main():
    # Start API server in background
    asyncio.create_task(start_api())

    # Start bot
    logger.info("Starting BotMarket Telegram Bot...")
    await dp.start_polling(bot)

if __name__ == "__main__":
    asyncio.run(main())
