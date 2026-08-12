'use client';

import { motion } from 'framer-motion';
import { TrendingUp, Mic, Shield, Workflow, FileText, MessageSquare } from 'lucide-react';

const cats = [
  { name: 'Trading', icon: TrendingUp, count: 1, color: 'from-amber-500/20 to-orange-500/20', iconColor: 'text-amber-400' },
  { name: 'Voice AI', icon: Mic, count: 1, color: 'from-cyan-500/20 to-blue-500/20', iconColor: 'text-cyan-400' },
  { name: 'Security', icon: Shield, count: 1, color: 'from-red-500/20 to-pink-500/20', iconColor: 'text-red-400' },
  { name: 'Automation', icon: Workflow, count: 1, color: 'from-green-500/20 to-emerald-500/20', iconColor: 'text-green-400' },
  { name: 'Content', icon: FileText, count: 1, color: 'from-violet-500/20 to-purple-500/20', iconColor: 'text-violet-400' },
  { name: 'Moderation', icon: MessageSquare, count: 1, color: 'from-rose-500/20 to-orange-500/20', iconColor: 'text-rose-400' },
];

export default function Categories() {
  return (
    <section id="categories" className="py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl font-bold text-white mb-3">Категории</h2>
          <p className="text-gray-400">Выбери бота по назначению</p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {cats.map((cat, i) => (
            <motion.button
              key={cat.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              whileHover={{ scale: 1.05, y: -5 }}
              className={`p-6 rounded-2xl bg-gradient-to-br ${cat.color} border border-white/5 hover:border-white/20 transition-all text-center group`}
            >
              <cat.icon className={`w-8 h-8 ${cat.iconColor} mx-auto mb-3 group-hover:scale-110 transition-transform`} />
              <div className="text-sm font-semibold text-white mb-1">{cat.name}</div>
              <div className="text-xs text-gray-500">{cat.count} бот</div>
            </motion.button>
          ))}
        </div>
      </div>
    </section>
  );
}