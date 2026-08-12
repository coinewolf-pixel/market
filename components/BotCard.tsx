'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ShoppingCart, Star, Tag, ExternalLink } from 'lucide-react';
import { Bot } from '@/types';
import { useStore } from '@/hooks/useStore';
import { formatPrice } from '@/lib/utils';

interface BotCardProps {
  bot: Bot;
  index?: number;
}

export default function BotCard({ bot, index = 0 }: BotCardProps) {
  const addToCart = useStore((s) => s.addToCart);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="group relative bg-dark-800 border border-white/5 rounded-2xl overflow-hidden hover:border-accent-cyan/30 transition-all duration-500 hover:shadow-xl hover:shadow-accent-cyan/5"
    >
      {/* Image */}
      <div className="relative h-48 overflow-hidden">
        <img
          src={bot.image}
          alt={bot.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-dark-800 via-transparent to-transparent" />

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-wrap gap-2">
          {bot.oldPrice && (
            <span className="px-2.5 py-1 bg-accent-pink/90 text-white text-xs font-semibold rounded-lg">
              -{Math.round((1 - bot.price / bot.oldPrice) * 100)}%
            </span>
          )}
          {bot.status === 'sold_out' && (
            <span className="px-2.5 py-1 bg-red-500/90 text-white text-xs font-semibold rounded-lg">
              Распродано
            </span>
          )}
        </div>

        {/* Category */}
        <div className="absolute bottom-3 left-3">
          <span className="px-3 py-1 bg-dark-900/80 backdrop-blur-sm text-accent-cyan text-xs font-medium rounded-lg border border-accent-cyan/20">
            {bot.category}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        <div className="flex items-start justify-between mb-2">
          <h3 className="text-lg font-bold text-white group-hover:text-accent-cyan transition-colors line-clamp-1">
            {bot.name}
          </h3>
          <div className="flex items-center gap-1 text-amber-400">
            <Star className="w-4 h-4 fill-current" />
            <span className="text-sm font-medium">{bot.rating}</span>
          </div>
        </div>

        <p className="text-sm text-gray-400 mb-4 line-clamp-2">{bot.description}</p>

        {/* Tags */}
        <div className="flex flex-wrap gap-1.5 mb-4">
          {bot.tags.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="inline-flex items-center gap-1 px-2 py-0.5 bg-white/5 text-gray-500 text-xs rounded-md"
            >
              <Tag className="w-3 h-3" />
              {tag}
            </span>
          ))}
        </div>

        {/* Price & Actions */}
        <div className="flex items-center justify-between">
          <div className="flex items-baseline gap-2">
            <span className="text-xl font-bold text-white">{formatPrice(bot.price)}</span>
            {bot.oldPrice && (
              <span className="text-sm text-gray-500 line-through">{formatPrice(bot.oldPrice)}</span>
            )}
          </div>
          <div className="flex items-center gap-2">
            <Link
              href={`/bot/${bot.id}`}
              className="p-2.5 bg-white/5 border border-white/10 rounded-xl text-gray-400 hover:text-white hover:bg-white/10 transition-all"
            >
              <ExternalLink className="w-4 h-4" />
            </Link>
            <button
              onClick={() => addToCart(bot)}
              disabled={bot.status === 'sold_out'}
              className="p-2.5 bg-gradient-to-r from-accent-cyan to-accent-purple rounded-xl text-white hover:shadow-lg hover:shadow-accent-cyan/25 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ShoppingCart className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}