'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Filter, Clock, CheckCircle, XCircle, Package, Truck, Eye, ChevronDown, RefreshCw, Download, DollarSign } from 'lucide-react';

interface Order {
  id: string;
  botName: string;
  botImage: string;
  buyerName: string;
  buyerEmail: string;
  amount: number;
  currency: string;
  status: 'pending' | 'paid' | 'processing' | 'delivered' | 'cancelled' | 'refunded';
  paymentMethod: string;
  txHash?: string;
  createdAt: string;
  notes?: string;
}

const mockOrders: Order[] = [
  { id: 'ORD-001', botName: 'NEXUS Trading Bot', botImage: 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=100', buyerName: 'Алексей К.', buyerEmail: 'alex@mail.com', amount: 299, currency: 'USD', status: 'paid', paymentMethod: 'USDT (TRC20)', txHash: '0x7a3f...9e2b', createdAt: '2026-08-12T10:30:00Z' },
  { id: 'ORD-002', botName: 'Echo Voice AI', botImage: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=100', buyerName: 'Мария С.', buyerEmail: 'maria@gmail.com', amount: 149, currency: 'USD', status: 'pending', paymentMethod: 'Card', createdAt: '2026-08-12T11:45:00Z' },
  { id: 'ORD-003', botName: 'Sentinel Security Bot', botImage: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=100', buyerName: 'DevCorp', buyerEmail: 'dev@corp.ru', amount: 199, currency: 'USD', status: 'delivered', paymentMethod: 'BTC', txHash: 'bc1q...x9m3', createdAt: '2026-08-11T09:20:00Z' },
  { id: 'ORD-004', botName: 'Flow Automator', botImage: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=100', buyerName: 'Анна П.', buyerEmail: 'anna@dev.io', amount: 79, currency: 'USD', status: 'processing', paymentMethod: 'ETH', txHash: '0x4b2c...1a7d', createdAt: '2026-08-11T16:00:00Z' },
  { id: 'ORD-005', botName: 'Neural Content Writer', botImage: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=100', buyerName: 'Сергей М.', buyerEmail: 'serg@blog.com', amount: 129, currency: 'USD', status: 'cancelled', paymentMethod: 'USDT (ERC20)', createdAt: '2026-08-10T14:30:00Z' },
  { id: 'ORD-006', botName: 'NEXUS Trading Bot', botImage: 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=100', buyerName: 'Дмитрий В.', buyerEmail: 'dima@corp.ru', amount: 299, currency: 'USD', status: 'refunded', paymentMethod: 'Card', createdAt: '2026-08-09T08:15:00Z', notes: 'Клиент запросил возврат — бот не подошёл' },
  { id: 'ORD-007', botName: 'Guardian Moderator', botImage: 'https://images.unsplash.com/photo-1614064641938-3bbee52942c7?w=100', buyerName: 'Иван П.', buyerEmail: 'ivan@tg.ru', amount: 59, currency: 'USD', status: 'paid', paymentMethod: 'USDT (TRC20)', txHash: '0x9c1d...4f8e', createdAt: '2026-08-12T13:00:00Z' },
];

const statusConfig: Record<string, { label: string; color: string; icon: any }> = {
  pending: { label: 'Ожидание', color: 'bg-amber-500/10 text-amber-400 border-amber-500/20', icon: Clock },
  paid: { label: 'Оплачен', color: 'bg-blue-500/10 text-blue-400 border-blue-500/20', icon: CheckCircle },
  processing: { label: 'В обработке', color: 'bg-purple-500/10 text-purple-400 border-purple-500/20', icon: Package },
  delivered: { label: 'Доставлен', color: 'bg-green-500/10 text-green-400 border-green-500/20', icon: Truck },
  cancelled: { label: 'Отменён', color: 'bg-red-500/10 text-red-400 border-red-500/20', icon: XCircle },
  refunded: { label: 'Возврат', color: 'bg-gray-500/10 text-gray-400 border-gray-500/20', icon: DollarSign },
};

const allStatuses = ['all', 'pending', 'paid', 'processing', 'delivered', 'cancelled', 'refunded'];

export default function AdminOrders() {
  const [orders, setOrders] = useState<Order[]>(mockOrders);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [statusMenuOpen, setStatusMenuOpen] = useState<string | null>(null);

  const filtered = orders.filter((o) => {
    const matchesSearch =
      o.id.toLowerCase().includes(search.toLowerCase()) ||
      o.botName.toLowerCase().includes(search.toLowerCase()) ||
      o.buyerName.toLowerCase().includes(search.toLowerCase()) ||
      o.buyerEmail.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'all' || o.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const updateStatus = (orderId: string, newStatus: Order['status']) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
    );
    setStatusMenuOpen(null);
  };

  const totalRevenue = orders.filter((o) => o.status === 'paid' || o.status === 'delivered').reduce((s, o) => s + o.amount, 0);

  return (
    <div>
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Заказы</h1>
          <p className="text-gray-400">Управляй заказами, меняй статусы, связывайся с клиентами</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="px-4 py-2 bg-dark-800 border border-white/5 rounded-xl">
            <span className="text-sm text-gray-400">Выручка: </span>
            <span className="text-sm font-bold text-white">${totalRevenue}</span>
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-sm text-gray-400 hover:text-white hover:bg-white/10 transition-all">
            <Download className="w-4 h-4" />
            Экспорт
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Поиск по ID, боту, покупателю..."
            className="w-full bg-dark-800 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-accent-cyan/50"
          />
        </div>
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          {allStatuses.map((s) => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`px-3 py-2 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
                statusFilter === s
                  ? 'bg-accent-cyan/10 text-accent-cyan border border-accent-cyan/20'
                  : 'bg-dark-800 border border-white/5 text-gray-400 hover:text-white hover:border-white/20'
              }`}
            >
              {s === 'all' ? 'Все' : statusConfig[s]?.label}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="bg-dark-800 border border-white/5 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left text-xs text-gray-500 border-b border-white/5 bg-dark-900/50 uppercase tracking-wider">
                <th className="px-5 py-4 font-medium">ID</th>
                <th className="px-5 py-4 font-medium">Бот</th>
                <th className="px-5 py-4 font-medium">Покупатель</th>
                <th className="px-5 py-4 font-medium">Сумма</th>
                <th className="px-5 py-4 font-medium">Статус</th>
                <th className="px-5 py-4 font-medium">Оплата</th>
                <th className="px-5 py-4 font-medium">Дата</th>
                <th className="px-5 py-4 font-medium"></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((order, i) => {
                const cfg = statusConfig[order.status];
                return (
                  <motion.tr
                    key={order.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: i * 0.03 }}
                    className="border-b border-white/5 last:border-0 hover:bg-white/[0.02] transition-colors"
                  >
                    <td className="px-5 py-4">
                      <span className="text-xs font-mono text-gray-400">{order.id}</span>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <img src={order.botImage} alt="" className="w-8 h-8 rounded-lg object-cover" />
                        <span className="text-sm text-white font-medium">{order.botName}</span>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <div>
                        <div className="text-sm text-white">{order.buyerName}</div>
                        <div className="text-xs text-gray-500">{order.buyerEmail}</div>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <span className="text-sm font-bold text-white">${order.amount}</span>
                    </td>
                    <td className="px-5 py-4">
                      <div className="relative">
                        <button
                          onClick={() => setStatusMenuOpen(statusMenuOpen === order.id ? null : order.id)}
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium border ${cfg.color} hover:opacity-80 transition-opacity`}
                        >
                          <cfg.icon className="w-3.5 h-3.5" />
                          {cfg.label}
                          <ChevronDown className="w-3 h-3" />
                        </button>
                        <AnimatePresence>
                          {statusMenuOpen === order.id && (
                            <motion.div
                              initial={{ opacity: 0, y: -5 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: -5 }}
                              className="absolute z-20 mt-1 left-0 bg-dark-700 border border-white/10 rounded-xl shadow-xl overflow-hidden min-w-[140px]"
                            >
                              {Object.entries(statusConfig).map(([key, scfg]) => (
                                <button
                                  key={key}
                                  onClick={() => updateStatus(order.id, key as Order['status'])}
                                  className="w-full flex items-center gap-2 px-3 py-2 text-xs text-gray-300 hover:bg-white/5 hover:text-white transition-colors"
                                >
                                  <scfg.icon className="w-3.5 h-3.5" />
                                  {scfg.label}
                                </button>
                              ))}
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <span className="text-xs text-gray-400">{order.paymentMethod}</span>
                      {order.txHash && (
                        <div className="text-[10px] text-gray-600 font-mono mt-0.5">{order.txHash}</div>
                      )}
                    </td>
                    <td className="px-5 py-4">
                      <span className="text-xs text-gray-500">{new Date(order.createdAt).toLocaleDateString('ru-RU')}</span>
                    </td>
                    <td className="px-5 py-4">
                      <button
                        onClick={() => setSelectedOrder(order)}
                        className="p-2 text-gray-500 hover:text-accent-cyan hover:bg-accent-cyan/10 rounded-lg transition-all"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    </td>
                  </motion.tr>
                );
              })}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && (
          <div className="text-center py-12 text-gray-500">Заказы не найдены</div>
        )}
      </div>

      {/* Order Detail Modal */}
      <AnimatePresence>
        {selectedOrder && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() => setSelectedOrder(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-lg bg-dark-800 border border-white/10 rounded-2xl p-6"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-white">{selectedOrder.id}</h2>
                <button onClick={() => setSelectedOrder(null)} className="p-2 text-gray-500 hover:text-white rounded-lg hover:bg-white/5">
                  ✕
                </button>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-4 p-4 bg-dark-900/50 rounded-xl border border-white/5">
                  <img src={selectedOrder.botImage} alt="" className="w-14 h-14 rounded-xl object-cover" />
                  <div>
                    <div className="font-semibold text-white">{selectedOrder.botName}</div>
                    <div className="text-sm text-gray-500">${selectedOrder.amount} · {selectedOrder.currency}</div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-dark-900/50 rounded-xl border border-white/5">
                    <div className="text-xs text-gray-500 mb-1">Покупатель</div>
                    <div className="text-sm text-white font-medium">{selectedOrder.buyerName}</div>
                    <div className="text-xs text-gray-500">{selectedOrder.buyerEmail}</div>
                  </div>
                  <div className="p-4 bg-dark-900/50 rounded-xl border border-white/5">
                    <div className="text-xs text-gray-500 mb-1">Оплата</div>
                    <div className="text-sm text-white font-medium">{selectedOrder.paymentMethod}</div>
                    {selectedOrder.txHash && <div className="text-[10px] text-gray-600 font-mono mt-1">{selectedOrder.txHash}</div>}
                  </div>
                </div>

                <div className="p-4 bg-dark-900/50 rounded-xl border border-white/5">
                  <div className="text-xs text-gray-500 mb-2">Статус</div>
                  <div className="flex flex-wrap gap-2">
                    {Object.entries(statusConfig).map(([key, scfg]) => (
                      <button
                        key={key}
                        onClick={() => {
                          updateStatus(selectedOrder.id, key as Order['status']);
                          setSelectedOrder({ ...selectedOrder, status: key as Order['status'] });
                        }}
                        className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
                          selectedOrder.status === key ? scfg.color : 'bg-transparent border-white/10 text-gray-500 hover:text-white'
                        }`}
                      >
                        <scfg.icon className="w-3.5 h-3.5 inline mr-1" />
                        {scfg.label}
                      </button>
                    ))}
                  </div>
                </div>

                {selectedOrder.notes && (
                  <div className="p-4 bg-amber-500/5 border border-amber-500/10 rounded-xl">
                    <div className="text-xs text-amber-400 mb-1">Примечание</div>
                    <div className="text-sm text-gray-300">{selectedOrder.notes}</div>
                  </div>
                )}

                <div className="flex gap-3 pt-2">
                  <a
                    href={`mailto:${selectedOrder.buyerEmail}`}
                    className="flex-1 text-center py-3 bg-white/5 border border-white/10 text-white rounded-xl hover:bg-white/10 transition-all text-sm font-medium"
                  >
                    Написать покупателю
                  </a>
                  <button
                    onClick={() => setSelectedOrder(null)}
                    className="flex-1 py-3 bg-gradient-to-r from-accent-cyan to-accent-purple text-white rounded-xl hover:shadow-lg hover:shadow-accent-cyan/25 transition-all text-sm font-medium"
                  >
                    Закрыть
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}