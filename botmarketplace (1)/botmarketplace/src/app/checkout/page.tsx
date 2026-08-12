'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowLeft, CreditCard, Bitcoin, Wallet, Check, Loader2 } from 'lucide-react';
import { useStore } from '@/hooks/useStore';
import { useTelegramAuth } from '@/hooks/useTelegramAuth';
import { notifyNewOrder, notifyPaymentReceived } from '@/lib/telegram';
import { formatPrice } from '@/lib/utils';

export default function CheckoutPage() {
  const { cart, getCartTotal, clearCart } = useStore();
  const { auth, isAuthenticated } = useTelegramAuth();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);
  const [form, setForm] = useState({
    name: auth?.name || '',
    email: '',
    method: 'crypto'
  });

  const handleSubmit = async () => {
    setLoading(true);

    // Generate order ID
    const orderId = 'ORD-' + Math.random().toString(36).substring(2, 8).toUpperCase();
    const botName = cart.map((item) => item.bot.name).join(', ');
    const amount = getCartTotal();

    // Send Telegram notification to admin
    await notifyNewOrder({
      order_id: orderId,
      bot_name: botName,
      amount,
      buyer_name: form.name || auth?.name || 'Unknown',
      buyer_email: form.email || 'N/A',
      payment_method: form.method === 'crypto' ? 'USDT/BTC/ETH' : form.method === 'card' ? 'Card' : 'E-Wallet',
    });

    // Simulate payment processing
    await new Promise((r) => setTimeout(r, 2500));

    // Notify payment received (mock)
    await notifyPaymentReceived({
      order_id: orderId,
      bot_name: botName,
      amount,
      buyer_name: form.name || auth?.name || 'Unknown',
      tx_hash: form.method === 'crypto' ? '0x' + Math.random().toString(36).substring(2, 14) : undefined,
    });

    setLoading(false);
    setOrderComplete(true);
    clearCart();
  };

  if (cart.length === 0 && !orderComplete) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-16">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-2">Корзина пуста</h1>
          <Link href="/" className="text-accent-cyan hover:underline">← В каталог</Link>
        </div>
      </div>
    );
  }

  if (orderComplete) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-16">
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center max-w-md mx-auto px-4">
          <div className="w-20 h-20 bg-accent-green/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <Check className="w-10 h-10 text-accent-green" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-3">Заказ оформлен!</h1>
          <p className="text-gray-400 mb-4">Мы отправили детали на твою почту. Админ получил уведомление в Telegram.</p>
          {auth && (
            <p className="text-sm text-gray-500 mb-8">Telegram ID: <code className="text-accent-cyan">{auth.telegramId}</code></p>
          )}
          <Link href="/" className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-accent-cyan to-accent-purple text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-accent-cyan/25 transition-all">
            Вернуться в каталог
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-20">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link href="/cart" className="inline-flex items-center gap-2 text-gray-400 hover:text-white mb-8 transition-colors">
          <ArrowLeft className="w-4 h-4" />
          Назад в корзину
        </Link>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-3xl font-bold text-white mb-8">Оформление заказа</h1>

          {/* Auth status */}
          {isAuthenticated && auth && (
            <div className="mb-6 p-4 bg-accent-cyan/5 border border-accent-cyan/20 rounded-xl flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-accent-cyan/20 flex items-center justify-center text-accent-cyan text-sm font-bold">
                {auth.name.charAt(0)}
              </div>
              <div>
                <p className="text-sm text-white font-medium">Авторизован через Telegram</p>
                <p className="text-xs text-gray-500">{auth.name} · ID: {auth.telegramId}</p>
              </div>
            </div>
          )}

          {/* Progress */}
          <div className="flex items-center gap-4 mb-10">
            {[1, 2, 3].map((s) => (
              <div key={s} className="flex items-center gap-4 flex-1">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all ${
                  step >= s ? 'bg-gradient-to-r from-accent-cyan to-accent-purple text-white' : 'bg-dark-800 border border-white/10 text-gray-500'
                }`}>
                  {step > s ? <Check className="w-5 h-5" /> : s}
                </div>
                {s < 3 && <div className={`flex-1 h-0.5 ${step > s ? 'bg-gradient-to-r from-accent-cyan to-accent-purple' : 'bg-dark-800'}`} />}
              </div>
            ))}
          </div>

          {/* Step 1: Contact */}
          {step === 1 && (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Имя</label>
                <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full bg-dark-800 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-accent-cyan/50 focus:ring-1 focus:ring-accent-cyan/50"
                  placeholder="Твоё имя" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Email</label>
                <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="w-full bg-dark-800 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-accent-cyan/50 focus:ring-1 focus:ring-accent-cyan/50"
                  placeholder="email@example.com" />
              </div>
              <button onClick={() => setStep(2)} disabled={!form.name || !form.email}
                className="w-full py-4 bg-gradient-to-r from-accent-cyan to-accent-purple text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-accent-cyan/25 transition-all disabled:opacity-50">
                Продолжить
              </button>
            </motion.div>
          )}

          {/* Step 2: Payment */}
          {step === 2 && (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
              {[
                { id: 'crypto', label: 'Криптовалюта (USDT/BTC/ETH)', icon: Bitcoin, desc: 'Быстро и анонимно' },
                { id: 'card', label: 'Банковская карта', icon: CreditCard, desc: 'Visa, Mastercard' },
                { id: 'wallet', label: 'Электронный кошелёк', icon: Wallet, desc: 'PayPal, WebMoney' },
              ].map((method) => (
                <button key={method.id} onClick={() => setForm({ ...form, method: method.id })}
                  className={`w-full flex items-center gap-4 p-5 rounded-2xl border transition-all text-left ${
                    form.method === method.id ? 'border-accent-cyan/50 bg-accent-cyan/5' : 'border-white/5 bg-dark-800 hover:border-white/20'
                  }`}>
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${form.method === method.id ? 'bg-accent-cyan/20' : 'bg-white/5'}`}>
                    <method.icon className={`w-6 h-6 ${form.method === method.id ? 'text-accent-cyan' : 'text-gray-500'}`} />
                  </div>
                  <div className="flex-1">
                    <div className="font-semibold text-white">{method.label}</div>
                    <div className="text-sm text-gray-500">{method.desc}</div>
                  </div>
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${form.method === method.id ? 'border-accent-cyan' : 'border-gray-600'}`}>
                    {form.method === method.id && <div className="w-2.5 h-2.5 rounded-full bg-accent-cyan" />}
                  </div>
                </button>
              ))}
              <div className="flex gap-3 pt-4">
                <button onClick={() => setStep(1)} className="flex-1 py-4 bg-white/5 border border-white/10 text-white font-semibold rounded-xl hover:bg-white/10 transition-all">Назад</button>
                <button onClick={() => setStep(3)} className="flex-1 py-4 bg-gradient-to-r from-accent-cyan to-accent-purple text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-accent-cyan/25 transition-all">Продолжить</button>
              </div>
            </motion.div>
          )}

          {/* Step 3: Confirm */}
          {step === 3 && (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
              <div className="p-6 bg-dark-800 border border-white/5 rounded-2xl space-y-4">
                <h3 className="font-semibold text-white mb-4">Заказ</h3>
                {cart.map((item) => (
                  <div key={item.bot.id} className="flex justify-between text-sm">
                    <span className="text-gray-400">{item.bot.name} × {item.quantity}</span>
                    <span className="text-white font-medium">{formatPrice(item.bot.price * item.quantity)}</span>
                  </div>
                ))}
                <div className="border-t border-white/5 pt-4 flex justify-between">
                  <span className="font-semibold text-white">Итого</span>
                  <span className="text-xl font-bold text-white">{formatPrice(getCartTotal())}</span>
                </div>
              </div>

              <div className="p-6 bg-dark-800 border border-white/5 rounded-2xl space-y-3">
                <div className="flex justify-between text-sm"><span className="text-gray-400">Имя</span><span className="text-white">{form.name}</span></div>
                <div className="flex justify-between text-sm"><span className="text-gray-400">Email</span><span className="text-white">{form.email}</span></div>
                <div className="flex justify-between text-sm"><span className="text-gray-400">Способ оплаты</span><span className="text-white capitalize">{form.method}</span></div>
                {isAuthenticated && <div className="flex justify-between text-sm"><span className="text-gray-400">Telegram</span><span className="text-accent-cyan">{auth?.name} ({auth?.telegramId})</span></div>}
              </div>

              <div className="flex gap-3">
                <button onClick={() => setStep(2)} className="flex-1 py-4 bg-white/5 border border-white/10 text-white font-semibold rounded-xl hover:bg-white/10 transition-all">Назад</button>
                <button onClick={handleSubmit} disabled={loading}
                  className="flex-1 py-4 bg-gradient-to-r from-accent-cyan to-accent-purple text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-accent-cyan/25 transition-all disabled:opacity-70 flex items-center justify-center gap-2">
                  {loading ? <><Loader2 className="w-5 h-5 animate-spin" />Обработка...</> : <>Оплатить {formatPrice(getCartTotal())}</>}
                </button>
              </div>
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  );
}