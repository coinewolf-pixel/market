'use client';

import { motion } from 'framer-motion';
import { Zap, Lock, Clock, Headphones, CreditCard, Download } from 'lucide-react';

const features = [
  { icon: Zap, title: 'Мгновенная доставка', desc: 'Получи доступ к боту сразу после оплаты' },
  { icon: Lock, title: 'Безопасная оплата', desc: 'Криптовалюта и карты через защищённый шлюз' },
  { icon: Clock, title: '24/7 Поддержка', desc: 'Техподдержка отвечает в любое время суток' },
  { icon: Headphones, title: 'Обновления', desc: 'Бесплатные обновления и новые фичи' },
  { icon: CreditCard, title: 'Гибкая оплата', desc: 'USDT, BTC, ETH, карты — выбирай удобный способ' },
  { icon: Download, title: 'Документация', desc: 'Полная документация и гайды по настройке' },
];

export default function Features() {
  return (
    <section id="how-it-works" className="py-20 bg-dark-800/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl font-bold text-white mb-3">Почему мы?</h2>
          <p className="text-gray-400 max-w-xl mx-auto">Всё, что нужно для покупки и использования AI-ботов</p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="p-6 rounded-2xl bg-dark-800 border border-white/5 hover:border-accent-cyan/20 transition-all group"
            >
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-accent-cyan/20 to-accent-purple/20 flex items-center justify-center mb-4 group-hover:from-accent-cyan/30 group-hover:to-accent-purple/30 transition-all">
                <f.icon className="w-6 h-6 text-accent-cyan" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">{f.title}</h3>
              <p className="text-sm text-gray-400">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}