'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingCart, Menu, X, Shield, Bot, Search, MessageSquareText, LogOut, User } from 'lucide-react';
import { useStore } from '@/hooks/useStore';
import { useTelegramAuth } from '@/hooks/useTelegramAuth';

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const cartCount = useStore((s) => s.getCartCount());
  const isAdmin = useStore((s) => s.isAdmin);
  const { auth, isAuthenticated, logout } = useTelegramAuth();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-dark-900/80 backdrop-blur-xl border-b border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-accent-cyan to-accent-purple flex items-center justify-center group-hover:shadow-lg group-hover:shadow-accent-cyan/30 transition-all">
              <Bot className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">BotMarket</span>
          </Link>

          <div className="hidden md:flex items-center gap-8">
            <Link href="/" className="text-sm text-gray-400 hover:text-white transition-colors">Каталог</Link>
            <Link href="/cart" className="text-sm text-gray-400 hover:text-white transition-colors">Корзина</Link>
            <Link href="/support" className="text-sm text-gray-400 hover:text-white transition-colors">Поддержка</Link>
            {isAdmin && (
              <Link href="/admin" className="text-sm text-accent-cyan hover:text-accent-cyan/80 transition-colors flex items-center gap-1">
                <Shield className="w-3.5 h-3.5" />
                Админ
              </Link>
            )}
          </div>

          <div className="flex items-center gap-3">
            {isAuthenticated && auth && (
              <div className="hidden sm:flex items-center gap-2 mr-2">
                <div className="w-7 h-7 rounded-full bg-accent-cyan/20 flex items-center justify-center text-accent-cyan text-xs font-bold">
                  {auth.name.charAt(0)}
                </div>
                <span className="text-xs text-gray-400">{auth.name}</span>
              </div>
            )}
            <button onClick={() => setSearchOpen(!searchOpen)} className="p-2 text-gray-400 hover:text-white transition-colors">
              <Search className="w-5 h-5" />
            </button>
            <Link href="/cart" className="relative p-2 text-gray-400 hover:text-white transition-colors">
              <ShoppingCart className="w-5 h-5" />
              {cartCount > 0 && (
                <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-accent-cyan text-dark-900 text-xs font-bold rounded-full flex items-center justify-center">
                  {cartCount}
                </motion.span>
              )}
            </Link>
            {isAuthenticated && (
              <button onClick={logout} className="p-2 text-gray-500 hover:text-red-400 transition-colors" title="Выйти">
                <LogOut className="w-4 h-4" />
              </button>
            )}
            <button onClick={() => setMenuOpen(!menuOpen)} className="md:hidden p-2 text-gray-400 hover:text-white transition-colors">
              {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {searchOpen && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="border-t border-white/5 overflow-hidden">
            <div className="max-w-7xl mx-auto px-4 py-3">
              <input type="text" placeholder="Поиск ботов..." className="w-full bg-dark-700 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-accent-cyan/50 focus:ring-1 focus:ring-accent-cyan/50" autoFocus />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {menuOpen && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="md:hidden border-t border-white/5 overflow-hidden bg-dark-900">
            <div className="px-4 py-4 space-y-3">
              {isAuthenticated && auth && (
                <div className="flex items-center gap-2 py-2 text-gray-400">
                  <User className="w-4 h-4" />
                  <span className="text-sm">{auth.name} (ID: {auth.telegramId})</span>
                </div>
              )}
              <Link href="/" onClick={() => setMenuOpen(false)} className="block text-gray-400 hover:text-white py-2">Каталог</Link>
              <Link href="/cart" onClick={() => setMenuOpen(false)} className="block text-gray-400 hover:text-white py-2">Корзина</Link>
              <Link href="/support" onClick={() => setMenuOpen(false)} className="block text-gray-400 hover:text-white py-2">Поддержка</Link>
              {isAdmin && (
                <Link href="/admin" onClick={() => setMenuOpen(false)} className="block text-accent-cyan py-2">Админ панель</Link>
              )}
              {isAuthenticated && (
                <button onClick={() => { logout(); setMenuOpen(false); }} className="block text-red-400 py-2 w-full text-left">Выйти</button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}