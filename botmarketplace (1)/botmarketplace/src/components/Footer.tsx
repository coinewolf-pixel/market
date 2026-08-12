'use client';

import Link from 'next/link';
import { Bot, Github, Twitter, MessageCircle, Send } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="border-t border-white/5 bg-dark-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          <div className="md:col-span-2">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-accent-cyan to-accent-purple flex items-center justify-center">
                <Bot className="w-4 h-4 text-white" />
              </div>
              <span className="text-lg font-bold text-white">BotMarket</span>
            </Link>
            <p className="text-sm text-gray-500 max-w-sm">
              Маркетплейс AI-ботов для бизнеса и личного использования.
              Покупай готовых ботов с мгновенной доставкой.
            </p>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-white mb-4">Навигация</h4>
            <ul className="space-y-2">
              <li><Link href="/" className="text-sm text-gray-500 hover:text-accent-cyan transition-colors">Каталог</Link></li>
              <li><Link href="/cart" className="text-sm text-gray-500 hover:text-accent-cyan transition-colors">Корзина</Link></li>
              <li><Link href="/support" className="text-sm text-gray-500 hover:text-accent-cyan transition-colors">Поддержка</Link></li>
              <li><Link href="/admin" className="text-sm text-gray-500 hover:text-accent-cyan transition-colors">Админ</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-white mb-4">Контакты</h4>
            <div className="flex gap-3 mb-4">
              <a href="#" className="p-2 bg-white/5 rounded-lg text-gray-500 hover:text-accent-cyan hover:bg-white/10 transition-all">
                <Twitter className="w-4 h-4" />
              </a>
              <a href="#" className="p-2 bg-white/5 rounded-lg text-gray-500 hover:text-accent-cyan hover:bg-white/10 transition-all">
                <MessageCircle className="w-4 h-4" />
              </a>
              <a href="#" className="p-2 bg-white/5 rounded-lg text-gray-500 hover:text-accent-cyan hover:bg-white/10 transition-all">
                <Github className="w-4 h-4" />
              </a>
            </div>
            <a 
              href="https://t.me/your_bot_username" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 bg-[#0088cc]/10 border border-[#0088cc]/20 rounded-xl text-[#0088cc] text-sm font-medium hover:bg-[#0088cc]/20 transition-all"
            >
              <Send className="w-4 h-4" />
              Наш Telegram бот
            </a>
          </div>
        </div>
        <div className="pt-8 border-t border-white/5 text-center">
          <p className="text-xs text-gray-600">© 2024 BotMarket. Все права защищены.</p>
        </div>
      </div>
    </footer>
  );
}