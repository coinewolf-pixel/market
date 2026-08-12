'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { LayoutDashboard, Package, ShoppingBag, MessageSquareText, Settings, LogOut, Bot } from 'lucide-react';
import { useStore } from '@/hooks/useStore';
import { useTickets } from '@/hooks/useTickets';
import { useRouter } from 'next/navigation';

const navItems = [
  { href: '/admin', label: 'Дашборд', icon: LayoutDashboard },
  { href: '/admin/bots', label: 'Боты', icon: Package },
  { href: '/admin/orders', label: 'Заказы', icon: ShoppingBag },
  { href: '/admin/support', label: 'Поддержка', icon: MessageSquareText },
  { href: '/admin/settings', label: 'Настройки', icon: Settings },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { setIsAdmin } = useStore();
  const { getUnreadCount } = useTickets();
  const router = useRouter();
  const unreadCount = getUnreadCount();

  const logout = () => {
    setIsAdmin(false);
    router.push('/');
  };

  return (
    <div className="min-h-screen pt-16 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-dark-800 border-r border-white/5 fixed h-full pt-16 top-0 left-0 z-40 hidden lg:block">
        <div className="p-6">
          <div className="flex items-center gap-2 mb-8">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-accent-cyan to-accent-purple flex items-center justify-center">
              <Bot className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-white">Admin</span>
          </div>

          <nav className="space-y-1">
            {navItems.map((item) => {
              const isSupport = item.href === '/admin/support';
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                    pathname === item.href || pathname.startsWith(item.href + '/')
                      ? 'bg-accent-cyan/10 text-accent-cyan border border-accent-cyan/20'
                      : 'text-gray-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <item.icon className="w-4 h-4" />
                  <span className="flex-1">{item.label}</span>
                  {isSupport && unreadCount > 0 && (
                    <span className="px-1.5 py-0.5 bg-red-500 text-white text-[10px] font-bold rounded-md min-w-[18px] text-center">
                      {unreadCount}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>

          <button
            onClick={logout}
            className="mt-8 w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-red-400 hover:bg-red-500/10 transition-all"
          >
            <LogOut className="w-4 h-4" />
            Выйти
          </button>
        </div>
      </aside>

      {/* Mobile header */}
      <div className="lg:hidden fixed top-16 left-0 right-0 z-30 bg-dark-800 border-b border-white/5 px-4 py-3 flex gap-2 overflow-x-auto">
        {navItems.map((item) => {
          const isSupport = item.href === '/admin/support';
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap ${
                pathname === item.href || pathname.startsWith(item.href + '/')
                  ? 'bg-accent-cyan/10 text-accent-cyan'
                  : 'text-gray-400'
              }`}
            >
              <item.icon className="w-4 h-4" />
              {item.label}
              {isSupport && unreadCount > 0 && (
                <span className="px-1.5 py-0.5 bg-red-500 text-white text-[10px] font-bold rounded-md">
                  {unreadCount}
                </span>
              )}
            </Link>
          );
        })}
      </div>

      {/* Content */}
      <main className="flex-1 lg:ml-64 pt-16 lg:pt-0">
        <div className="p-6 lg:p-10">{children}</div>
      </main>
    </div>
  );
}