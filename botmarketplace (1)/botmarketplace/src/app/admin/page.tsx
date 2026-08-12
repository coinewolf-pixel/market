'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Package, ShoppingBag, MessageSquareText, TrendingUp, DollarSign, AlertCircle, ArrowRight, Clock, CheckCircle, User } from 'lucide-react';
import { useBots } from '@/hooks/useBots';
import { useTickets } from '@/hooks/useTickets';

export default function AdminDashboard() {
  const { bots } = useBots();
  const { tickets, getUnreadCount } = useTickets();

  const totalRevenue = 1153; // mock
  const totalOrders = 7;
  const totalBots = bots.length;
  const openTickets = tickets.filter((t) => t.status === 'open').length;
  const unreadCount = getUnreadCount();

  const recentOrders = [
    { id: 'ORD-001', bot: 'NEXUS Trading Bot', buyer: 'Алексей К.', amount: 299, status: 'paid' as const },
    { id: 'ORD-002', bot: 'Echo Voice AI', buyer: 'Мария С.', amount: 149, status: 'pending' as const },
    { id: 'ORD-003', bot: 'Sentinel Security', buyer: 'DevCorp', amount: 199, status: 'delivered' as const },
  ];

  const recentTickets = tickets.slice(0, 3);

  const stats = [
    { label: 'Выручка', value: `$${totalRevenue}`, icon: DollarSign, color: 'from-emerald-500/20 to-green-500/20', iconColor: 'text-emerald-400', change: '+12%' },
    { label: 'Заказов', value: totalOrders.toString(), icon: ShoppingBag, color: 'from-blue-500/20 to-cyan-500/20', iconColor: 'text-blue-400', change: '+3' },
    { label: 'Ботов', value: totalBots.toString(), icon: Package, color: 'from-purple-500/20 to-pink-500/20', iconColor: 'text-purple-400', change: '' },
    { label: 'Тикетов', value: openTickets.toString(), icon: MessageSquareText, color: 'from-amber-500/20 to-orange-500/20', iconColor: 'text-amber-400', change: unreadCount > 0 ? `${unreadCount} новых` : '' },
  ];

  return (
    <div>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-3xl font-bold text-white mb-2">Дашборд</h1>
        <p className="text-gray-400 mb-8">Обзор магазина в реальном времени</p>

        {/* Stats Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className={`p-6 rounded-2xl bg-gradient-to-br ${stat.color} border border-white/5`}
            >
              <div className="flex items-center justify-between mb-4">
                <stat.icon className={`w-6 h-6 ${stat.iconColor}`} />
                {stat.change && (
                  <span className="text-xs font-medium text-gray-400">{stat.change}</span>
                )}
              </div>
              <div className="text-2xl font-bold text-white mb-1">{stat.value}</div>
              <div className="text-sm text-gray-400">{stat.label}</div>
            </motion.div>
          ))}
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Recent Orders */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-dark-800 border border-white/5 rounded-2xl p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-white">Последние заказы</h2>
              <Link href="/admin/orders" className="text-sm text-accent-cyan hover:underline flex items-center gap-1">
                Все <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
            <div className="space-y-3">
              {recentOrders.map((order) => (
                <div key={order.id} className="flex items-center justify-between p-3 bg-dark-900/50 rounded-xl border border-white/5">
                  <div className="flex items-center gap-3">
                    <div className={`w-2 h-2 rounded-full ${
                      order.status === 'paid' ? 'bg-blue-400' : order.status === 'delivered' ? 'bg-green-400' : 'bg-amber-400'
                    }`} />
                    <div>
                      <div className="text-sm font-medium text-white">{order.bot}</div>
                      <div className="text-xs text-gray-500">{order.buyer}</div>
                    </div>
                  </div>
                  <span className="text-sm font-bold text-white">${order.amount}</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Recent Tickets */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-dark-800 border border-white/5 rounded-2xl p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-white">Тикеты поддержки</h2>
                {unreadCount > 0 && (
                  <span className="px-2 py-0.5 bg-red-500/10 text-red-400 text-xs font-bold rounded-md border border-red-500/20">
                    {unreadCount}
                  </span>
                )}
              </div>
              <Link href="/admin/support" className="text-sm text-accent-cyan hover:underline flex items-center gap-1">
                Все <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
            <div className="space-y-3">
              {recentTickets.map((ticket) => {
                const hasUnread = ticket.messages.some((m) => m.sender === 'client' && !m.read);
                const lastMsg = ticket.messages[ticket.messages.length - 1];
                return (
                  <Link
                    key={ticket.id}
                    href={`/admin/support/${ticket.id}`}
                    className={`flex items-center gap-3 p-3 rounded-xl border transition-all ${
                      hasUnread
                        ? 'bg-accent-cyan/5 border-accent-cyan/20 hover:border-accent-cyan/40'
                        : 'bg-dark-900/50 border-white/5 hover:border-white/20'
                    }`}
                  >
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                      hasUnread ? 'bg-accent-cyan/20' : 'bg-white/5'
                    }`}>
                      <MessageSquareText className={`w-4 h-4 ${hasUnread ? 'text-accent-cyan' : 'text-gray-500'}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-white truncate">{ticket.subject}</span>
                        {hasUnread && <span className="w-1.5 h-1.5 rounded-full bg-accent-cyan flex-shrink-0" />}
                      </div>
                      <p className="text-xs text-gray-500 truncate">{lastMsg.text}</p>
                    </div>
                    <span className={`text-[10px] px-1.5 py-0.5 rounded border flex-shrink-0 ${
                      ticket.priority === 'urgent' ? 'bg-red-500/10 text-red-400 border-red-500/20' :
                      ticket.priority === 'high' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' :
                      'bg-gray-500/10 text-gray-400 border-gray-500/20'
                    }`}>
                      {ticket.priority === 'urgent' ? 'Критично' : ticket.priority === 'high' ? 'Высоко' : 'Норм'}
                    </span>
                  </Link>
                );
              })}
            </div>
          </motion.div>
        </div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-6 grid sm:grid-cols-3 gap-4"
        >
          <Link href="/admin/bots" className="p-5 bg-dark-800 border border-white/5 rounded-2xl hover:border-accent-cyan/30 transition-all group">
            <Package className="w-6 h-6 text-accent-cyan mb-3 group-hover:scale-110 transition-transform" />
            <h3 className="font-semibold text-white mb-1">Управление ботами</h3>
            <p className="text-sm text-gray-500">Добавляй, редактируй цены и описания</p>
          </Link>
          <Link href="/admin/orders" className="p-5 bg-dark-800 border border-white/5 rounded-2xl hover:border-accent-purple/30 transition-all group">
            <ShoppingBag className="w-6 h-6 text-accent-purple mb-3 group-hover:scale-110 transition-transform" />
            <h3 className="font-semibold text-white mb-1">Заказы</h3>
            <p className="text-sm text-gray-500">Отслеживай статусы и связывайся с клиентами</p>
          </Link>
          <Link href="/admin/support" className="p-5 bg-dark-800 border border-white/5 rounded-2xl hover:border-accent-pink/30 transition-all group">
            <MessageSquareText className="w-6 h-6 text-accent-pink mb-3 group-hover:scale-110 transition-transform" />
            <h3 className="font-semibold text-white mb-1">Поддержка</h3>
            <p className="text-sm text-gray-500">Отвечай на тикеты и помогай клиентам</p>
          </Link>
        </motion.div>
      </motion.div>
    </div>
  );
}