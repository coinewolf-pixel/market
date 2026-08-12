'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Hero from '@/components/Hero';
import BotCard from '@/components/BotCard';
import Categories from '@/components/Categories';
import Features from '@/components/Features';
import { useBots } from '@/hooks/useBots';
import { SlidersHorizontal } from 'lucide-react';

export default function Home() {
  const { bots, loading } = useBots();
  const [filter, setFilter] = useState('all');
  const [sortBy, setSortBy] = useState('popular');

  const filtered = bots
    .filter((b) => (filter === 'all' ? true : b.category === filter))
    .sort((a, b) => {
      if (sortBy === 'price-low') return a.price - b.price;
      if (sortBy === 'price-high') return b.price - a.price;
      if (sortBy === 'newest') return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      return b.sold - a.sold;
    });

  const categories = ['all', ...Array.from(new Set(bots.map((b) => b.category)))];

  return (
    <>
      <Hero />
      <Categories />

      {/* Catalog */}
      <section id="catalog" className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10"
          >
            <div>
              <h2 className="text-3xl font-bold text-white mb-2">Каталог ботов</h2>
              <p className="text-gray-400">{filtered.length} ботов доступно</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 bg-dark-800 border border-white/10 rounded-xl px-3 py-2">
                <SlidersHorizontal className="w-4 h-4 text-gray-500" />
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="bg-transparent text-sm text-gray-300 focus:outline-none"
                >
                  <option value="popular">Популярные</option>
                  <option value="price-low">Цена: низкая → высокая</option>
                  <option value="price-high">Цена: высокая → низкая</option>
                  <option value="newest">Новые</option>
                </select>
              </div>
            </div>
          </motion.div>

          {/* Category Filter */}
          <div className="flex flex-wrap gap-2 mb-8">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setFilter(cat)}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                  filter === cat
                    ? 'bg-gradient-to-r from-accent-cyan to-accent-purple text-white shadow-lg shadow-accent-cyan/20'
                    : 'bg-dark-800 border border-white/5 text-gray-400 hover:text-white hover:border-white/20'
                }`}
              >
                {cat === 'all' ? 'Все' : cat}
              </button>
            ))}
          </div>

          {/* Grid */}
          {loading ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-96 bg-dark-800 rounded-2xl animate-pulse" />
              ))}
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map((bot, i) => (
                <BotCard key={bot.id} bot={bot} index={i} />
              ))}
            </div>
          )}
        </div>
      </section>

      <Features />
    </>
  );
}