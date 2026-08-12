'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Search, Filter, MessageSquare, Clock, AlertCircle, CheckCircle2, Circle, ArrowRight } from 'lucide-react';
import { useTickets } from '@/hooks/useTickets';

const priorityConfig = {
  low: { label: 'Низкий', color: 'bg-gray-500/10 text-gray-400 border-gray-500/20' },
  medium: { label: 'Средний', color: 'bg-blue-500/10 text-blue-400 border-blue-500/20' },
  high: { label: 'Высокий', color: 'bg-amber-500/10 text-amber-400 border-amber-500/20' },
  urgent: { label: 'Критичный', color: 'bg-red-500/10 text-red-400 border-red-500/20' },
};

const statusConfig = {
  open: { label: 'Открыт', color: 'bg-green-500/10 text-green-400' },
  in_progress: { label: 'В работе', color: 'bg-blue-500/10 text-blue-400' },
  resolved: { label: 'Решён', color: 'bg-purple-500/10 text-purple-400' },
  closed: { label: 'Закрыт', color: 'bg-gray-500/10 text-gray-400' },
};

export default function AdminSupport() {
  const { tickets, loading, getUnreadCount } = useTickets();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');

  const filtered = tickets.filter((t) => {
    const matchesSearch =
      t.id.toLowerCase().includes(search.toLowerCase()) ||
      t.subject.toLowerCase().includes(search.toLowerCase()) ||
      t.clientName.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'all' || t.status === statusFilter;
    const matchesPriority = priorityFilter === 'all' || t.priority === priorityFilter;
    return matchesSearch && matchesStatus && matchesPriority;
  });

  const unreadCount = getUnreadCount();

  return (
    <div>
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-3xl font-bold text-white">Поддержка клиентов</h1>
            {unreadCount > 0 && (
              <span className="px-2.5 py-1 bg-red-500/10 text-red-400 text-xs font-bold rounded-lg border border-red-500/20">
                {unreadCount} новых
              </span>
            )}
          </div>
          <p className="text-gray-400">Тикеты, вопросы и чат с клиентами</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="px-4 py-2 bg-dark-800 border border-white/5 rounded-xl">
            <span className="text-sm text-gray-400">Открытых: </span>
            <span className="text-sm font-bold text-white">{tickets.filter((t) => t.status === 'open').length}</span>
          </div>
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
            placeholder="Поиск по тикету, клиенту..."
            className="w-full bg-dark-800 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-accent-cyan/50"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="bg-dark-800 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-gray-300 focus:outline-none focus:border-accent-cyan/50"
        >
          <option value="all">Все статусы</option>
          <option value="open">Открыты</option>
          <option value="in_progress">В работе</option>
          <option value="resolved">Решённые</option>
          <option value="closed">Закрытые</option>
        </select>
        <select
          value={priorityFilter}
          onChange={(e) => setPriorityFilter(e.target.value)}
          className="bg-dark-800 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-gray-300 focus:outline-none focus:border-accent-cyan/50"
        >
          <option value="all">Все приоритеты</option>
          <option value="urgent">Критичный</option>
          <option value="high">Высокий</option>
          <option value="medium">Средний</option>
          <option value="low">Низкий</option>
        </select>
      </div>

      {/* Tickets List */}
      <div className="space-y-3">
        {loading ? (
          [1, 2, 3].map((i) => (
            <div key={i} className="h-24 bg-dark-800 rounded-2xl animate-pulse" />
          ))
        ) : filtered.length === 0 ? (
          <div className="text-center py-12 text-gray-500">Тикеты не найдены</div>
        ) : (
          filtered.map((ticket, i) => {
            const hasUnread = ticket.messages.some((m) => m.sender === 'client' && !m.read);
            const lastMsg = ticket.messages[ticket.messages.length - 1];
            const pcfg = priorityConfig[ticket.priority];
            const scfg = statusConfig[ticket.status];

            return (
              <motion.div
                key={ticket.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <Link
                  href={`/admin/support/${ticket.id}`}
                  className={`flex items-center gap-4 p-5 rounded-2xl border transition-all group ${
                    hasUnread
                      ? 'bg-accent-cyan/5 border-accent-cyan/20 hover:border-accent-cyan/40'
                      : 'bg-dark-800 border-white/5 hover:border-white/20'
                  }`}
                >
                  {/* Avatar */}
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                    hasUnread ? 'bg-accent-cyan/20' : 'bg-white/5'
                  }`}>
                    <MessageSquare className={`w-5 h-5 ${hasUnread ? 'text-accent-cyan' : 'text-gray-500'}`} />
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-mono text-gray-500">{ticket.id}</span>
                      {hasUnread && (
                        <span className="w-2 h-2 rounded-full bg-accent-cyan animate-pulse" />
                      )}
                    </div>
                    <h3 className={`font-semibold truncate ${hasUnread ? 'text-white' : 'text-gray-300'}`}>
                      {ticket.subject}
                    </h3>
                    <p className="text-sm text-gray-500 truncate mt-0.5">
                      {lastMsg.sender === 'client' ? '👤' : '🛡️'} {lastMsg.text}
                    </p>
                  </div>

                  {/* Meta */}
                  <div className="hidden sm:flex flex-col items-end gap-2 flex-shrink-0">
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-0.5 rounded-md text-[10px] font-medium border ${pcfg.color}`}>
                        {pcfg.label}
                      </span>
                      <span className={`px-2 py-0.5 rounded-md text-[10px] font-medium ${scfg.color}`}>
                        {scfg.label}
                      </span>
                    </div>
                    <div className="text-xs text-gray-500">
                      {ticket.clientName} · {new Date(ticket.updatedAt).toLocaleDateString('ru-RU')}
                    </div>
                  </div>

                  <ArrowRight className="w-4 h-4 text-gray-600 group-hover:text-accent-cyan transition-colors flex-shrink-0" />
                </Link>
              </motion.div>
            );
          })
        )}
      </div>
    </div>
  );
}