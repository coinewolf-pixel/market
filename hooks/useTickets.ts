'use client';

import { useState, useEffect } from 'react';

export interface TicketMessage {
  id: string;
  ticketId: string;
  sender: 'client' | 'admin';
  text: string;
  createdAt: string;
  read: boolean;
}

export interface Ticket {
  id: string;
  subject: string;
  clientName: string;
  clientEmail: string;
  status: 'open' | 'in_progress' | 'resolved' | 'closed';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  category: string;
  createdAt: string;
  updatedAt: string;
  messages: TicketMessage[];
  botName?: string;
  orderId?: string;
}

const MOCK_TICKETS: Ticket[] = [
  {
    id: 'TKT-001',
    subject: 'Не получил доступ к боту после оплаты',
    clientName: 'Алексей К.',
    clientEmail: 'alex@mail.com',
    status: 'open',
    priority: 'high',
    category: 'Доступ',
    createdAt: '2026-08-12T10:30:00Z',
    updatedAt: '2026-08-12T10:30:00Z',
    orderId: 'ORD-001',
    botName: 'NEXUS Trading Bot',
    messages: [
      {
        id: 'msg-1',
        ticketId: 'TKT-001',
        sender: 'client',
        text: 'Здравствуйте! Я оплатил NEXUS Trading Bot 2 часа назад, но до сих пор не получил инструкции по установке. Помогите, пожалуйста.',
        createdAt: '2026-08-12T10:30:00Z',
        read: false,
      },
    ],
  },
  {
    id: 'TKT-002',
    subject: 'Вопрос по настройке Echo Voice AI',
    clientName: 'Мария С.',
    clientEmail: 'maria@gmail.com',
    status: 'in_progress',
    priority: 'medium',
    category: 'Настройка',
    createdAt: '2026-08-11T14:20:00Z',
    updatedAt: '2026-08-12T09:15:00Z',
    botName: 'Echo Voice AI',
    messages: [
      {
        id: 'msg-2',
        ticketId: 'TKT-002',
        sender: 'client',
        text: 'Добрый день! Подскажите, как подключить бота к моему Discord серверу? Я не нашла инструкцию в документации.',
        createdAt: '2026-08-11T14:20:00Z',
        read: true,
      },
      {
        id: 'msg-3',
        ticketId: 'TKT-002',
        sender: 'admin',
        text: 'Здравствуйте, Мария! Отправляю вам пошаговую инструкцию. Перейдите в раздел Integrations → Discord → Connect. Нужна помощь с конкретным шагом?',
        createdAt: '2026-08-11T15:00:00Z',
        read: true,
      },
      {
        id: 'msg-4',
        ticketId: 'TKT-002',
        sender: 'client',
        text: 'Спасибо! Сейчас попробую. Если что-то не получится — напишу.',
        createdAt: '2026-08-12T09:15:00Z',
        read: false,
      },
    ],
  },
  {
    id: 'TKT-003',
    subject: 'Запрос на возврат средств',
    clientName: 'Дмитрий В.',
    clientEmail: 'dima@corp.ru',
    status: 'open',
    priority: 'urgent',
    category: 'Возврат',
    createdAt: '2026-08-12T08:00:00Z',
    updatedAt: '2026-08-12T08:00:00Z',
    orderId: 'ORD-005',
    botName: 'Sentinel Security Bot',
    messages: [
      {
        id: 'msg-5',
        ticketId: 'TKT-003',
        sender: 'client',
        text: 'Купил бота, но он не подходит под мои задачи. Хочу вернуть деньги. Оплачивал USDT.',
        createdAt: '2026-08-12T08:00:00Z',
        read: false,
      },
    ],
  },
  {
    id: 'TKT-004',
    subject: 'Баг в Flow Automator',
    clientName: 'Анна П.',
    clientEmail: 'anna@dev.io',
    status: 'resolved',
    priority: 'medium',
    category: 'Баг',
    createdAt: '2026-08-10T16:45:00Z',
    updatedAt: '2026-08-11T11:30:00Z',
    botName: 'Flow Automator',
    messages: [
      {
        id: 'msg-6',
        ticketId: 'TKT-004',
        sender: 'client',
        text: 'При создании workflow с Telegram webhook падает ошибка 500. Логи прикрепляю.',
        createdAt: '2026-08-10T16:45:00Z',
        read: true,
      },
      {
        id: 'msg-7',
        ticketId: 'TKT-004',
        sender: 'admin',
        text: 'Спасибо за репорт! Исправили баг в версии 2.1.3. Обновите бота через панель управления.',
        createdAt: '2026-08-11T11:30:00Z',
        read: true,
      },
    ],
  },
  {
    id: 'TKT-005',
    subject: 'Предложение по улучшению Neural Writer',
    clientName: 'Сергей М.',
    clientEmail: 'serg@blog.com',
    status: 'closed',
    priority: 'low',
    category: 'Фича',
    createdAt: '2026-08-09T09:00:00Z',
    updatedAt: '2026-08-09T12:00:00Z',
    botName: 'Neural Content Writer',
    messages: [
      {
        id: 'msg-8',
        ticketId: 'TKT-005',
        sender: 'client',
        text: 'Было бы круто добавить экспорт в Notion напрямую. Спасибо за отличный продукт!',
        createdAt: '2026-08-09T09:00:00Z',
        read: true,
      },
      {
        id: 'msg-9',
        ticketId: 'TKT-005',
        sender: 'admin',
        text: 'Отличная идея! Добавили в roadmap на Q4. Спасибо за фидбек!',
        createdAt: '2026-08-09T12:00:00Z',
        read: true,
      },
    ],
  },
];

export function useTickets() {
  const [tickets, setTickets] = useState<Ticket[]>(MOCK_TICKETS);
  const [loading, setLoading] = useState(false);

  const fetchTickets = async () => {
    setLoading(true);
    setTimeout(() => {
      setTickets(MOCK_TICKETS);
      setLoading(false);
    }, 400);
  };

  const updateTicketStatus = (id: string, status: Ticket['status']) => {
    setTickets((prev) =>
      prev.map((t) => (t.id === id ? { ...t, status, updatedAt: new Date().toISOString() } : t))
    );
  };

  const updateTicketPriority = (id: string, priority: Ticket['priority']) => {
    setTickets((prev) =>
      prev.map((t) => (t.id === id ? { ...t, priority, updatedAt: new Date().toISOString() } : t))
    );
  };

  const sendMessage = (ticketId: string, text: string) => {
    const newMsg: TicketMessage = {
      id: 'msg-' + Math.random().toString(36).substring(2, 8),
      ticketId,
      sender: 'admin',
      text,
      createdAt: new Date().toISOString(),
      read: true,
    };
    setTickets((prev) =>
      prev.map((t) =>
        t.id === ticketId
          ? { ...t, messages: [...t.messages, newMsg], updatedAt: new Date().toISOString() }
          : t
      )
    );
  };

  const markAsRead = (ticketId: string) => {
    setTickets((prev) =>
      prev.map((t) =>
        t.id === ticketId
          ? { ...t, messages: t.messages.map((m) => ({ ...m, read: true })) }
          : t
      )
    );
  };

  const getTicketById = (id: string) => tickets.find((t) => t.id === id);

  const getUnreadCount = () =>
    tickets.reduce(
      (sum, t) => sum + t.messages.filter((m) => m.sender === 'client' && !m.read).length,
      0
    );

  useEffect(() => {
    fetchTickets();
  }, []);

  return {
    tickets,
    loading,
    fetchTickets,
    updateTicketStatus,
    updateTicketPriority,
    sendMessage,
    markAsRead,
    getTicketById,
    getUnreadCount,
  };
}