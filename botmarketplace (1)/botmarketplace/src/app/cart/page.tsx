'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ShoppingCart, Trash2, Plus, Minus, ArrowRight, Package } from 'lucide-react';
import { useStore } from '@/hooks/useStore';
import { formatPrice } from '@/lib/utils';

export default function CartPage() {
  const { cart, removeFromCart, updateQuantity, getCartTotal, clearCart } = useStore();

  if (cart.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-16">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center">
          <div className="w-20 h-20 bg-dark-800 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-white/5">
            <ShoppingCart className="w-10 h-10 text-gray-600" />
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">Корзина пуста</h1>
          <p className="text-gray-400 mb-6">Добавь ботов в корзину, чтобы оформить заказ</p>
          <Link href="/" className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-accent-cyan to-accent-purple text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-accent-cyan/25 transition-all">
            <Package className="w-4 h-4" />
            В каталог
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-3xl font-bold text-white mb-8">Корзина ({cart.length})</h1>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Items */}
            <div className="lg:col-span-2 space-y-4">
              {cart.map((item, i) => (
                <motion.div
                  key={item.bot.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="flex gap-4 p-4 bg-dark-800 border border-white/5 rounded-2xl"
                >
                  <img src={item.bot.image} alt={item.bot.name} className="w-24 h-24 rounded-xl object-cover flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-2">
                      <Link href={`/bot/${item.bot.id}`} className="text-lg font-semibold text-white hover:text-accent-cyan transition-colors truncate">
                        {item.bot.name}
                      </Link>
                      <button onClick={() => removeFromCart(item.bot.id)} className="p-1.5 text-gray-500 hover:text-red-400 transition-colors">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    <p className="text-sm text-gray-500 mb-3">{item.bot.category}</p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => updateQuantity(item.bot.id, item.quantity - 1)}
                          className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 transition-all"
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        <span className="w-8 text-center font-medium">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.bot.id, item.quantity + 1)}
                          className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 transition-all"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>
                      <span className="text-lg font-bold text-white">{formatPrice(item.bot.price * item.quantity)}</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Summary */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="lg:col-span-1"
            >
              <div className="sticky top-24 p-6 bg-dark-800 border border-white/5 rounded-2xl">
                <h2 className="text-lg font-bold text-white mb-6">Итого</h2>
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-gray-400">
                    <span>Товары</span>
                    <span>{formatPrice(getCartTotal())}</span>
                  </div>
                  <div className="flex justify-between text-gray-400">
                    <span>Скидка</span>
                    <span className="text-accent-green">-$0</span>
                  </div>
                  <div className="border-t border-white/5 pt-3 flex justify-between">
                    <span className="font-semibold text-white">Всего</span>
                    <span className="text-xl font-bold text-white">{formatPrice(getCartTotal())}</span>
                  </div>
                </div>
                <Link
                  href="/checkout"
                  className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-gradient-to-r from-accent-cyan to-accent-purple text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-accent-cyan/25 transition-all"
                >
                  Оформить заказ
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <button
                  onClick={clearCart}
                  className="w-full mt-3 px-6 py-3 bg-white/5 border border-white/10 text-gray-400 font-medium rounded-xl hover:bg-white/10 hover:text-white transition-all"
                >
                  Очистить корзину
                </button>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}