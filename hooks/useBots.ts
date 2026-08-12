'use client';

import { useState, useEffect } from 'react';
import { Bot } from '@/types';

const MOCK_BOTS: Bot[] = [
  {
    id: '1',
    name: 'NEXUS Trading Bot',
    description: 'AI-powered crypto trading bot with 94% win rate. Fully automated strategies.',
    fullDescription: 'NEXUS is an advanced AI trading bot designed for cryptocurrency markets. It uses machine learning algorithms to analyze market trends, execute trades, and maximize profits. Features include: automated portfolio rebalancing, risk management, multi-exchange support, real-time analytics dashboard, and 24/7 operation.',
    price: 299,
    oldPrice: 499,
    category: 'Trading',
    tags: ['AI', 'Crypto', 'Automation', 'Premium'],
    image: 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=800',
    features: ['AI Market Analysis', 'Auto-Trading', 'Risk Management', 'Multi-Exchange', 'Real-time Alerts', 'Portfolio Tracking'],
    status: 'active',
    stock: 15,
    sold: 234,
    rating: 4.8,
    reviews: 89,
    created_at: '2024-01-15T10:00:00Z',
    updated_at: '2024-12-01T10:00:00Z',
    demoLink: '#',
    documentation: '#',
  },
  {
    id: '2',
    name: 'Echo Voice AI',
    description: 'Human-like voice bot for customer service. Supports 50+ languages.',
    fullDescription: 'Echo Voice AI revolutionizes customer interactions with natural-sounding voice responses. Perfect for call centers, support desks, and automated phone systems. Supports real-time translation, sentiment analysis, and custom voice training.',
    price: 149,
    category: 'Voice AI',
    tags: ['Voice', 'NLP', 'Customer Service', 'Multilingual'],
    image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800',
    features: ['50+ Languages', 'Real-time Translation', 'Sentiment Analysis', 'Custom Voices', 'Call Recording', 'Analytics Dashboard'],
    status: 'active',
    stock: 8,
    sold: 156,
    rating: 4.6,
    reviews: 67,
    created_at: '2024-02-20T10:00:00Z',
    updated_at: '2024-11-15T10:00:00Z',
    demoLink: '#',
  },
  {
    id: '3',
    name: 'Sentinel Security Bot',
    description: '24/7 server monitoring and threat detection. Instant alerts.',
    fullDescription: 'Sentinel provides enterprise-grade security monitoring for your infrastructure. Detects intrusions, DDoS attacks, unauthorized access, and vulnerabilities in real-time. Integrates with Slack, Discord, Telegram for instant notifications.',
    price: 199,
    oldPrice: 249,
    category: 'Security',
    tags: ['Security', 'Monitoring', 'DevOps', 'Alerting'],
    image: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800',
    features: ['Intrusion Detection', 'DDoS Protection', 'Log Analysis', 'Vulnerability Scanning', 'Instant Alerts', 'SIEM Integration'],
    status: 'active',
    stock: 20,
    sold: 312,
    rating: 4.9,
    reviews: 124,
    created_at: '2024-03-10T10:00:00Z',
    updated_at: '2024-12-05T10:00:00Z',
  },
  {
    id: '4',
    name: 'Flow Automator',
    description: 'No-code workflow automation. Connect 200+ apps and services.',
    fullDescription: 'Flow Automator lets you build complex automation workflows without writing code. Connect your favorite tools, set triggers and actions, and watch your productivity soar. Includes pre-built templates for common business processes.',
    price: 79,
    category: 'Automation',
    tags: ['No-Code', 'Integration', 'Productivity', 'SaaS'],
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800',
    features: ['200+ Integrations', 'Visual Builder', 'Scheduled Tasks', 'Conditional Logic', 'Webhook Support', 'Team Collaboration'],
    status: 'active',
    stock: 50,
    sold: 567,
    rating: 4.7,
    reviews: 203,
    created_at: '2024-04-01T10:00:00Z',
    updated_at: '2024-11-20T10:00:00Z',
    demoLink: '#',
  },
  {
    id: '5',
    name: 'Neural Content Writer',
    description: 'GPT-4 powered content generation. Blogs, ads, emails, code.',
    fullDescription: 'Neural Content Writer uses cutting-edge language models to generate high-quality content for any purpose. From blog posts to marketing copy, from code comments to technical documentation — it writes like a human, only faster.',
    price: 129,
    category: 'Content',
    tags: ['AI Writing', 'GPT', 'Marketing', 'SEO'],
    image: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800',
    features: ['GPT-4 Engine', 'SEO Optimization', 'Tone Adjustment', 'Multi-format Export', 'Plagiarism Check', 'Team Workspace'],
    status: 'active',
    stock: 100,
    sold: 892,
    rating: 4.5,
    reviews: 345,
    created_at: '2024-05-15T10:00:00Z',
    updated_at: '2024-12-10T10:00:00Z',
    demoLink: '#',
  },
  {
    id: '6',
    name: 'Guardian Moderator',
    description: 'AI moderation for Discord, Telegram, forums. Auto-ban toxic users.',
    fullDescription: 'Guardian Moderator uses advanced NLP to detect toxic behavior, spam, scams, and inappropriate content across your community platforms. Configurable rules, custom actions, and detailed moderation logs.',
    price: 59,
    category: 'Moderation',
    tags: ['Discord', 'Telegram', 'Community', 'Safety'],
    image: 'https://images.unsplash.com/photo-1614064641938-3bbee52942c7?w=800',
    features: ['Toxicity Detection', 'Spam Filtering', 'Auto-Actions', 'Custom Rules', 'Mod Logs', 'User Reputation'],
    status: 'active',
    stock: 30,
    sold: 445,
    rating: 4.4,
    reviews: 178,
    created_at: '2024-06-01T10:00:00Z',
    updated_at: '2024-11-25T10:00:00Z',
  },
];

export function useBots() {
  const [bots, setBots] = useState<Bot[]>(MOCK_BOTS);
  const [loading, setLoading] = useState(false);

  const fetchBots = async () => {
    setLoading(true);
    // In production: fetch from Supabase
    // const { data } = await supabase.from('bots').select('*');
    setTimeout(() => {
      setBots(MOCK_BOTS);
      setLoading(false);
    }, 500);
  };

  const addBot = async (bot: Omit<Bot, 'id' | 'created_at' | 'updated_at' | 'sold' | 'rating' | 'reviews'>) => {
    const newBot: Bot = {
      ...bot,
      id: generateId(),
      sold: 0,
      rating: 0,
      reviews: 0,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    setBots((prev) => [newBot, ...prev]);
    return newBot;
  };

  const updateBot = async (id: string, updates: Partial<Bot>) => {
    setBots((prev) =>
      prev.map((bot) =>
        bot.id === id ? { ...bot, ...updates, updated_at: new Date().toISOString() } : bot
      )
    );
  };

  const deleteBot = async (id: string) => {
    setBots((prev) => prev.filter((bot) => bot.id !== id));
  };

  const getBotById = (id: string) => bots.find((bot) => bot.id === id);

  useEffect(() => {
    fetchBots();
  }, []);

  return { bots, loading, fetchBots, addBot, updateBot, deleteBot, getBotById };
}

function generateId() {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}