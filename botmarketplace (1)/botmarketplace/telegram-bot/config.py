import os
from dotenv import load_dotenv

load_dotenv()

BOT_TOKEN = os.getenv("TELEGRAM_BOT_TOKEN", "YOUR_BOT_TOKEN_HERE")
ADMIN_CHAT_ID = os.getenv("ADMIN_CHAT_ID", "YOUR_ADMIN_CHAT_ID")
WEBAPP_URL = os.getenv("WEBAPP_URL", "https://your-domain.com")
API_SECRET = os.getenv("API_SECRET", "your-secret-key-for-api")

# Inline keyboard for WebApp auth
WEBAPP_BUTTON_TEXT = "🚀 Авторизоваться в BotMarket"
WEBAPP_URL_FULL = f"{WEBAPP_URL}/telegram-auth