'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquarePlus, Send, ArrowLeft, User, Shield } from 'lucide-react';
import { useTickets } from '@/hooks/useTickets';
import { useTelegramAuth } from '@/hooks/useTelegramAuth';
import { notifyNewTicket } from '@/lib/telegram';

export default function ClientSupportPage() {
  const { tickets, sendMessage, getTicketById } = useTickets();
  const { auth, isAuthenticated } = useTelegramAuth();
  const [activeTicket, setActiveTicket] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [newTicket, setNewTicket] = useState({ subject: '', message: '', category: 'Доступ' });
  const [reply, setReply] = useState('');

  const myTickets = tickets;
  const ticket = activeTicket ? getTicketById(activeTicket) : null;

  const handleCreateTicket = async () => {
    if (!newTicket.subject.trim() || !newTicket.message.trim()) return;

    const ticketId = 'TKT-' + Math.random().toString(36).substring(2, 6).toUpperCase();

    // Send Telegram notification to admin
    await notifyNewTicket({
      ticket_id: ticketId,
      subject: newTicket.subject,
      client_name: auth?.name || 'Гость',
      client_email: auth ? `tg_${auth.telegramId}@botmarket.local` : 'guest@botmarket.local',
      priority: 'medium',
      category: newTicket.category,
      message: newTicket.message,
    });

    setShowForm(false);
    setNewTicket({ subject: '', message: '', category: 'Доступ' });
    alert('Тикет создан! Админ получил уведомление в Telegram.');
  };

  const handleReply = () => {
    if (!reply.trim() || !ticket) return;
    sendMessage(ticket.id, reply.trim());
    setReply('');
  };

  if (activeTicket && ticket) {
    return (
      <div className="min-h-screen pt-24 pb-20">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <button onClick={() => setActiveTicket(null)} className="inline-flex items-center gap-2 text-gray-400 hover:text-white mb-6 transition-colors">
            <ArrowLeft className="w-4 h-4" />
            Назад к тикетам
          </button>

          <div className="bg-dark-800 border border-white/5 rounded-2xl p-6 mb-6">
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-xl font-bold text-white">{ticket.subject}</h1>
              <span className={`px-2 py-0.5 rounded-md text-[10px] font-medium ${
                ticket.status === 'open' ? 'bg-green-500/10 text-green-400' :
                ticket.status === 'in_progress' ? 'bg-blue-500/10 text-blue-400' :
                ticket.status === 'resolved' ? 'bg-purple-500/10 text-purple-400' :
                'bg-gray-500/10 text-gray-400'
              }`}>
                {ticket.status === 'open' ? 'Открыт' : ticket.status === 'in_progress' ? 'В работе' : ticket.status === 'resolved' ? 'Решён' : 'Закрыт'}
              </span>
            </div>
            <div className="text-sm text-gray-500">{ticket.id} · {ticket.category}</div>
          </div>

          <div className="space-y-4 mb-6">
            {ticket.messages.map((msg) => {
              const isAdmin = msg.sender === 'admin';
              return (
                <motion.div key={msg.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className={`flex ${isAdmin ? 'justify-start' : 'justify-end'}`}>
                  <div className={`flex gap-3 max-w-[80%] ${isAdmin ? 'flex-row' : 'flex-row-reverse'}`}>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${isAdmin ? 'bg-accent-purple/20' : 'bg-accent-cyan/20'}`}>
                      {isAdmin ? <Shield className="w-4 h-4 text-accent-purple" /> : <User className="w-4 h-4 text-accent-cyan" />}
                    </div>
                    <div className={`px-4 py-3 rounded-2xl text-sm leading-relaxed ${isAdmin ? 'bg-dark-800 border border-white/10 text-gray-200' : 'bg-gradient-to-br from-accent-cyan/20 to-accent-purple/10 border border-accent-cyan/20 text-white'}`}>
                      {msg.text}
                      <div className={`text-[10px] text-gray-600 mt-1 ${isAdmin ? '' : 'text-right'}`}>
                        {new Date(msg.createdAt).toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {ticket.status !== 'closed' && (
            <div className="flex items-end gap-3">
              <div className="flex-1">
                <textarea value={reply} onChange={(e) => setReply(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleReply(); }}}
                  placeholder="Напиши сообщение..." rows={2} className="w-full bg-dark-800 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-accent-cyan/50 resize-none" />
              </div>
              <button onClick={handleReply} disabled={!reply.trim()} className="p-3 bg-gradient-to-r from-accent-cyan to-accent-purple text-white rounded-xl hover:shadow-lg hover:shadow-accent-cyan/25 transition-all disabled:opacity-50">
                <Send className="w-5 h-5" />
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-20">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">Поддержка</h1>
              <p className="text-gray-400">Создай тикет — админ получит уведомление в Telegram</p>
            </div>
            <button onClick={() => setShowForm(true)} className="flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-accent-cyan to-accent-purple text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-accent-cyan/25 transition-all">
              <MessageSquarePlus className="w-4 h-4" />
              Новый тикет
            </button>
          </div>

          {/* Auth status */}
          {isAuthenticated && auth && (
            <div className="mb-6 p-4 bg-accent-cyan/5 border border-accent-cyan/20 rounded-xl flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-accent-cyan/20 flex items-center justify-center text-accent-cyan text-sm font-bold">
                {auth.name.charAt(0)}
              </div>
              <div>
                <p className="text-sm text-white font-medium">Авторизован через Telegram</p>
                <p className="text-xs text-gray-500">{auth.name} · ID: {auth.telegramId}</p>
              </div>
            </div>
          )}

          <div className="space-y-3">
            {myTickets.map((t) => {
              const lastMsg = t.messages[t.messages.length - 1];
              const hasAdminReply = t.messages.some((m) => m.sender === 'admin');
              return (
                <motion.button key={t.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} onClick={() => setActiveTicket(t.id)}
                  className="w-full flex items-center gap-4 p-5 bg-dark-800 border border-white/5 rounded-2xl hover:border-white/20 transition-all text-left">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${hasAdminReply ? 'bg-accent-cyan/20' : 'bg-white/5'}`}>
                    <MessageSquarePlus className={`w-5 h-5 ${hasAdminReply ? 'text-accent-cyan' : 'text-gray-500'}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-semibold text-white truncate">{t.subject}</span>
                      <span className={`px-2 py-0.5 rounded-md text-[10px] font-medium ${
                        t.status === 'open' ? 'bg-green-500/10 text-green-400' : t.status === 'in_progress' ? 'bg-blue-500/10 text-blue-400' : t.status === 'resolved' ? 'bg-purple-500/10 text-purple-400' : 'bg-gray-500/10 text-gray-400'
                      }`}>
                        {t.status === 'open' ? 'Открыт' : t.status === 'in_progress' ? 'В работе' : t.status === 'resolved' ? 'Решён' : 'Закрыт'}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500 truncate">{lastMsg.text}</p>
                  </div>
                  <div className="text-xs text-gray-600 flex-shrink-0">{new Date(t.updatedAt).toLocaleDateString('ru-RU')}</div>
                </motion.button>
              );
            })}
          </div>
        </motion.div>
      </div>

      <AnimatePresence>
        {showForm && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4" onClick={() => setShowForm(false)}>
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} onClick={(e) => e.stopPropagation()}
              className="w-full max-w-lg bg-dark-800 border border-white/10 rounded-2xl p-6">
              <h2 className="text-xl font-bold text-white mb-6">Новый тикет</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Тема</label>
                  <input value={newTicket.subject} onChange={(e) => setNewTicket({ ...newTicket, subject: e.target.value })} className="w-full bg-dark-700 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-accent-cyan/50" placeholder="Кратко опиши проблему" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Категория</label>
                  <select value={newTicket.category} onChange={(e) => setNewTicket({ ...newTicket, category: e.target.value })} className="w-full bg-dark-700 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-accent-cyan/50">
                    <option value="Доступ">Проблема с доступом</option>
                    <option value="Настройка">Помощь в настройке</option>
                    <option value="Баг">Баг / Ошибка</option>
                    <option value="Возврат">Возврат средств</option>
                    <option value="Фича">Предложение</option>
                    <option value="Другое">Другое</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Описание</label>
                  <textarea value={newTicket.message} onChange={(e) => setNewTicket({ ...newTicket, message: e.target.value })} rows={4} className="w-full bg-dark-700 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-accent-cyan/50 resize-none" placeholder="Подробно опиши ситуацию..." />
                </div>
              </div>
              <div className="flex gap-3 mt-6">
                <button onClick={() => setShowForm(false)} className="flex-1 py-3 bg-white/5 border border-white/10 text-white rounded-xl hover:bg-white/10 transition-all">Отмена</button>
                <button onClick={handleCreateTicket} className="flex-1 py-3 bg-gradient-to-r from-accent-cyan to-accent-purple text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-accent-cyan/25 transition-all">Создать тикет</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}