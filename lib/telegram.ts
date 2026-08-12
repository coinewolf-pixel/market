'use server';

const TELEGRAM_BOT_API = process.env.TELEGRAM_BOT_API_URL || 'http://localhost:8081/notify';
const API_SECRET = process.env.API_SECRET || 'super-secret-api-key-12345';

interface NotifyPayload {
  type: 'new_order' | 'new_ticket' | 'payment_received';
  [key: string]: any;
}

export async function sendTelegramNotification(payload: NotifyPayload) {
  try {
    const res = await fetch(TELEGRAM_BOT_API, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-API-Secret': API_SECRET,
      },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      console.error('Telegram notify failed:', await res.text());
      return false;
    }
    return true;
  } catch (e) {
    console.error('Telegram notify error:', e);
    return false;
  }
}

export async function notifyNewOrder(orderData: {
  order_id: string;
  bot_name: string;
  amount: number;
  buyer_name: string;
  buyer_email: string;
  payment_method: string;
}) {
  return sendTelegramNotification({
    type: 'new_order',
    ...orderData,
  });
}

export async function notifyNewTicket(ticketData: {
  ticket_id: string;
  subject: string;
  client_name: string;
  client_email: string;
  priority: string;
  category: string;
  message: string;
}) {
  return sendTelegramNotification({
    type: 'new_ticket',
    ...ticketData,
  });
}

export async function notifyPaymentReceived(orderData: {
  order_id: string;
  bot_name: string;
  amount: number;
  buyer_name: string;
  tx_hash?: string;
}) {
  return sendTelegramNotification({
    type: 'payment_received',
    ...orderData,
  });
}