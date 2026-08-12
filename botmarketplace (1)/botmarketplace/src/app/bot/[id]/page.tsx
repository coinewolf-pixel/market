'use client';

import { use } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowLeft, ShoppingCart, Star, Check, Tag, ExternalLink } from 'lucide-react';
import { useBots } from '@/hooks/useBots';
import { useStore } from '@/hooks/useStore';
import { formatPrice } from '@/lib/utils';

export default function BotPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { getBotById } = useBots();
  const bot = getBotById(id);
  const addToCart = useStore((s) => s.addToCart);

  if (!bot) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-16">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-2">Бот не найден</h1>
          <Link href="/" className="text-accent-cyan hover:underline">← Вернуться в каталог</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link href="/" className="inline-flex items-center gap-2 text-gray-400 hover:text-white mb-8 transition-colors">
          <ArrowLeft className="w-4 h-4" />
          Назад в каталог
        </Link>

        <div className="grid lg:grid-cols-2 gap-12">
          <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} className="relative">
            <div className="aspect-video rounded-2xl overflow-hidden border border-white/5">
              <img src={bot.image} alt={bot.name} className="w-full h-full object-cover" />
            </div>
            <div className="absolute top-4 left-4 flex gap-2">
              <span className="px-3 py-1 bg-dark-900/80 backdrop-blur-sm text-accent-cyan text-sm font-medium rounded-lg border border-accent-cyan/20">
                {bot.category}
              </span>
              {bot.oldPrice && (
                <span className="px-3 py-1 bg-accent-pink/90 text-white text-sm font-medium rounded-lg">
                  Скидка {Math.round((1 - bot.price / bot.oldPrice) * 100)}%
                </span>
              )}
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}>
            <div className="flex items-center gap-3 mb-4">
              <div className="flex items-center gap-1 text-amber-400">
                <Star className="w-5 h-5 fill-current" />
                <span className="font-semibold">{bot.rating}</span>
              </div>
              <span className="text-gray-500">·</span>
              <span className="text-gray-400">{bot.reviews} отзывов</span>
              <span className="text-gray-500">·</span>
              <span className="text-gray-400">{bot.sold} продаж</span>
            </div>

            <h1 className="text-4xl font-bold text-white mb-4">{bot.name}</h1>
            <p className="text-gray-400 text-lg mb-6">{bot.description}</p>

            <div className="flex items-baseline gap-3 mb-8">
              <span className="text-4xl font-bold text-white">{formatPrice(bot.price)}</span>
              {bot.oldPrice && (
                <span className="text-xl text-gray-500 line-through">{formatPrice(bot.oldPrice)}</span>
              )}
            </div>

            <div className="flex gap-3 mb-10">
              <button
                onClick={() => addToCart(bot)}
                disabled={bot.status === 'sold_out'}
                className="flex-1 flex items-center justify-center gap-2 px-6 py-4 bg-gradient-to-r from-accent-cyan to-accent-purple text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-accent-cyan/25 transition-all disabled:opacity-50"
              >
                <ShoppingCart className="w-5 h-5" />
                {bot.status === 'sold_out' ? 'Распродано' : 'В корзину'}
              </button>
              {bot.demoLink && (
                <a href={bot.demoLink} className="px-6 py-4 bg-white/5 border border-white/10 text-white font-semibold rounded-xl hover:bg-white/10 transition-all flex items-center gap-2">
                  <ExternalLink className="w-5 h-5" />
                  Демо
                </a>
              )}
            </div>

            <div className="flex items-center gap-2 text-sm text-gray-400 mb-8">
              <div className={`w-2 h-2 rounded-full ${bot.stock > 5 ? 'bg-accent-green' : bot.stock > 0 ? 'bg-amber-400' : 'bg-red-500'}`} />
              {bot.stock > 5 ? `В наличии (${bot.stock} шт.)` : bot.stock > 0 ? `Осталось ${bot.stock} шт.` : 'Нет в наличии'}
            </div>

            <div className="flex flex-wrap gap-2 mb-8">
              {bot.tags.map((tag) => (
                <span key={tag} className="inline-flex items-center gap-1 px-3 py-1.5 bg-white/5 text-gray-400 text-sm rounded-lg border border-white/5">
                  <Tag className="w-3.5 h-3.5" />
                  {tag}
                </span>
              ))}
            </div>
          </motion.div>
        </div>

        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="mt-16 grid lg:grid-cols-2 gap-12">
          <div>
            <h2 className="text-2xl font-bold text-white mb-4">Описание</h2>
            <p className="text-gray-400 leading-relaxed">{bot.fullDescription}</p>
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white mb-4">Возможности</h2>
            <div className="space-y-3">
              {bot.features.map((feature) => (
                <div key={feature} className="flex items-center gap-3 p-3 rounded-xl bg-dark-800 border border-white/5">
                  <Check className="w-5 h-5 text-accent-green flex-shrink-0" />
                  <span className="text-gray-300">{feature}</span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}