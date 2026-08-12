'use client';

import { use, useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Send, User, Shield, Clock, Check, CheckCheck, Paperclip, Bot, Mail, Tag, AlertCircle } from 'lucide-react';
import { useTickets } from '@/hooks/useTickets';

export default function TicketChatPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { getTicketById, sendMessage, updateTicketStatus, updateTicketPriority, markAsRead } = useTickets();
  const ticket = getTicketById(id);
  const [message, setMessage] = useState('');
  const [showInfo, setShowInfo] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (ticket) {
      markAsRead(ticket.id);
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [ticket?.messages.length]);

  const handleSend = () => {
    if (!message.trim() || !ticket) return;
    sendMessage(ticket.id, message.trim());
    setMessage('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  if (!ticket) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-2">Тикет не найден</h1>
          <Link href="/admin/support" className="text-accent-cyan hover:underline">← Назад к тикетам</Link>
        </div>
      </div>
    );
  }

  const priorityConfig: Record<string, { label: string; color: string }> = {
    low: { label: 'Низкий', color: 'bg-gray-500/10 text-gray-400 border-gray-500/20' },
    medium: { label: 'Средний', color: 'bg-blue-500/10 text-blue-400 border-blue-500/20' },
    high: { label: 'Высокий', color: 'bg-amber-500/10 text-amber-400 border-amber-500/20' },
    urgent: { label: 'Критичный', color: 'bg-red-500/10 text-red-400 border-red-500/20' },
  };

  const statusConfig: Record<string, { label: string; color: string }> = {
    open: { label: 'Открыт', color: 'bg-green-500/10 text-green-400' },
    in_progress: { label: 'В работе', color: 'bg-blue-500/10 text-blue-400' },
    resolved: { label: 'Решён', color: 'bg-purple-500/10 text-purple-400' },
    closed: { label: 'Закрыт', color: 'bg-gray-500/10 text-gray-400' },
  };

  const pcfg = priorityConfig[ticket.priority];
  const scfg = statusConfig[ticket.status];

  return (
    <div className="h-[calc(100vh-64px)] flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 lg:p-6 border-b border-white/5 bg-dark-800/50">
        <div className="flex items-center gap-4">
          <Link href="/admin/support" className="p-2 text-gray-500 hover:text-white rounded-lg hover:bg-white/5 transition-all">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-bold text-white">{ticket.subject}</h1>
              <span className={`px-2 py-0.5 rounded-md text-[10px] font-medium border ${pcfg.color}`}>{pcfg.label}</span>
              <span className={`px-2 py-0.5 rounded-md text-[10px] font-medium ${scfg.color}`}>{scfg.label}</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-gray-500 mt-0.5">
              <span>{ticket.id}</span>
              <span>·</span>
              <span>{ticket.clientName}</span>
              <span>·</span>
              <span>{ticket.category}</span>
            </div>
          </div>
        </div>
        <button
          onClick={() => setShowInfo(!showInfo)}
          className="p-2 text-gray-500 hover:text-white rounded-lg hover:bg-white/5 transition-all lg:hidden"
        >
          <AlertCircle className="w-5 h-5" />
        </button>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Chat */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 lg:p-6 space-y-4">
            {/* Ticket Info Message */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex justify-center"
            >
              <div className="px-4 py-2 bg-dark-800 border border-white/5 rounded-xl text-center">
                <p className="text-xs text-gray-500">
                  Тикет создан {new Date(ticket.createdAt).toLocaleString('ru-RU')}
                  {ticket.botName && ` · Бот: ${ticket.botName}`}
                  {ticket.orderId && ` · Заказ: ${ticket.orderId}`}
                </p>
              </div>
            </motion.div>

            {ticket.messages.map((msg, i) => {
              const isAdmin = msg.sender === 'admin';
              const showAvatar = i === 0 || ticket.messages[i - 1].sender !== msg.sender;

              return (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${isAdmin ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`flex gap-3 max-w-[80%] ${isAdmin ? 'flex-row-reverse' : 'flex-row'}`}>
                    {showAvatar && (
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                        isAdmin ? 'bg-accent-purple/20' : 'bg-accent-cyan/20'
                      }`}>
                        {isAdmin ? <Shield className="w-4 h-4 text-accent-purple" /> : <User className="w-4 h-4 text-accent-cyan" />}
                      </div>
                    )}
                    {!showAvatar && <div className="w-8 flex-shrink-0" />}

                    <div className={`group relative ${isAdmin ? 'items-end' : 'items-start'} flex flex-col`}>
                      <div className={`px-4 py-3 rounded-2xl text-sm leading-relaxed ${
                        isAdmin
                          ? 'bg-gradient-to-br from-accent-purple/20 to-accent-cyan/10 border border-accent-purple/20 text-white'
                          : 'bg-dark-800 border border-white/10 text-gray-200'
                      }`}>
                        {msg.text}
                      </div>
                      <div className={`flex items-center gap-1 mt-1 ${isAdmin ? 'flex-row-reverse' : ''}`}>
                        <span className="text-[10px] text-gray-600">
                          {new Date(msg.createdAt).toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })}
                        </span>
                        {isAdmin && (
                          <CheckCheck className="w-3 h-3 text-accent-cyan" />
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-4 lg:p-6 border-t border-white/5 bg-dark-800/50">
            <div className="flex items-end gap-3">
              <button className="p-3 text-gray-500 hover:text-white rounded-xl hover:bg-white/5 transition-all flex-shrink-0">
                <Paperclip className="w-5 h-5" />
              </button>
              <div className="flex-1 relative">
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Напиши ответ клиенту..."
                  rows={1}
                  className="w-full bg-dark-800 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-accent-cyan/50 resize-none max-h-32"
                  style={{ minHeight: '48px' }}
                />
              </div>
              <button
                onClick={handleSend}
                disabled={!message.trim()}
                className="p-3 bg-gradient-to-r from-accent-cyan to-accent-purple text-white rounded-xl hover:shadow-lg hover:shadow-accent-cyan/25 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
            <p className="text-[10px] text-gray-600 mt-2 text-center">Enter — отправить, Shift+Enter — новая строка</p>
          </div>
        </div>

        {/* Sidebar Info */}
        <AnimatePresence>
          {(showInfo || true) && (
            <motion.div
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 320, opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              className="hidden lg:block border-l border-white/5 bg-dark-800/30 overflow-y-auto"
            >
              <div className="p-6 space-y-6">
                {/* Client */}
                <div>
                  <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Клиент</h3>
                  <div className="flex items-center gap-3 p-3 bg-dark-800 border border-white/5 rounded-xl">
                    <div className="w-10 h-10 rounded-full bg-accent-cyan/20 flex items-center justify-center">
                      <User className="w-5 h-5 text-accent-cyan" />
                    </div>
                    <div>
                      <div className="text-sm font-medium text-white">{ticket.clientName}</div>
                      <a href={`mailto:${ticket.clientEmail}`} className="text-xs text-gray-500 hover:text-accent-cyan transition-colors">
                        {ticket.clientEmail}
                      </a>
                    </div>
                  </div>
                </div>

                {/* Details */}
                <div>
                  <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Детали</h3>
                  <div className="space-y-2">
                    {ticket.botName && (
                      <div className="flex items-center justify-between p-3 bg-dark-800 border border-white/5 rounded-xl">
                        <div className="flex items-center gap-2 text-sm text-gray-400">
                          <Bot className="w-4 h-4" />
                          Бот
                        </div>
                        <span className="text-sm text-white">{ticket.botName}</span>
                      </div>
                    )}
                    {ticket.orderId && (
                      <div className="flex items-center justify-between p-3 bg-dark-800 border border-white/5 rounded-xl">
                        <div className="flex items-center gap-2 text-sm text-gray-400">
                          <Tag className="w-4 h-4" />
                          Заказ
                        </div>
                        <Link href={`/admin/orders`} className="text-sm text-accent-cyan hover:underline">
                          {ticket.orderId}
                        </Link>
                      </div>
                    )}
                    <div className="flex items-center justify-between p-3 bg-dark-800 border border-white/5 rounded-xl">
                      <div className="flex items-center gap-2 text-sm text-gray-400">
                        <Clock className="w-4 h-4" />
                        Создан
                      </div>
                      <span className="text-sm text-white">{new Date(ticket.createdAt).toLocaleDateString('ru-RU')}</span>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div>
                  <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Действия</h3>
                  <div className="space-y-2">
                    <div>
                      <label className="text-xs text-gray-500 mb-1 block">Статус</label>
                      <select
                        value={ticket.status}
                        onChange={(e) => updateTicketStatus(ticket.id, e.target.value as any)}
                        className="w-full bg-dark-800 border border-white/10 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-accent-cyan/50"
                      >
                        <option value="open">Открыт</option>
                        <option value="in_progress">В работе</option>
                        <option value="resolved">Решён</option>
                        <option value="closed">Закрыт</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-xs text-gray-500 mb-1 block">Приоритет</label>
                      <select
                        value={ticket.priority}
                        onChange={(e) => updateTicketPriority(ticket.id, e.target.value as any)}
                        className="w-full bg-dark-800 border border-white/10 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-accent-cyan/50"
                      >
                        <option value="low">Низкий</option>
                        <option value="medium">Средний</option>
                        <option value="high">Высокий</option>
                        <option value="urgent">Критичный</option>
                      </select>
                    </div>
                    <a
                      href={`mailto:${ticket.clientEmail}`}
                      className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-white/5 border border-white/10 text-white rounded-xl hover:bg-white/10 transition-all text-sm font-medium"
                    >
                      <Mail className="w-4 h-4" />
                      Написать на email
                    </a>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}