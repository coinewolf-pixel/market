'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Bot, CheckCircle, Loader2 } from 'lucide-react';

interface TelegramUser {
  id: number;
  first_name: string;
  last_name?: string;
  username?: string;
  photo_url?: string;
}

declare global {
  interface Window {
    Telegram?: {
      WebApp: {
        initData: string;
        initDataUnsafe: {
          user?: TelegramUser;
          start_param?: string;
        };
        ready: () => void;
        expand: () => void;
        close: () => void;
        MainButton: {
          show: () => void;
          hide: () => void;
          setText: (text: string) => void;
          onClick: (cb: () => void) => void;
        };
      };
    };
  }
}

export default function TelegramAuthPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [user, setUser] = useState<TelegramUser | null>(null);
  const [redirectPage, setRedirectPage] = useState('/');

  useEffect(() => {
    // Check if opened from Telegram WebApp
    const tg = window.Telegram?.WebApp;

    if (tg) {
      tg.ready();
      tg.expand();

      const tgUser = tg.initDataUnsafe?.user;
      const startParam = tg.initDataUnsafe?.start_param;

      if (tgUser) {
        setUser(tgUser);
        authenticateUser(tgUser, startParam);
      } else {
        // Fallback: check URL params (for testing outside Telegram)
        const userParam = searchParams.get('user');
        const pageParam = searchParams.get('page');
        const adminParam = searchParams.get('admin');

        if (userParam) {
          try {
            const parsedUser = JSON.parse(decodeURIComponent(userParam));
            setUser(parsedUser);
            authenticateUser(parsedUser, undefined, pageParam || undefined, !!adminParam);
          } catch {
            setStatus('error');
          }
        } else {
          setStatus('error');
        }
      }
    } else {
      // Not in Telegram — show manual auth or redirect
      const userParam = searchParams.get('user');
      const pageParam = searchParams.get('page');

      if (userParam) {
        try {
          const parsedUser = JSON.parse(decodeURIComponent(userParam));
          setUser(parsedUser);
          authenticateUser(parsedUser, undefined, pageParam || undefined);
        } catch {
          setStatus('error');
        }
      } else {
        setStatus('error');
      }
    }
  }, [searchParams]);

  const authenticateUser = async (
    tgUser: TelegramUser,
    startParam?: string,
    page?: string,
    isAdmin?: boolean
  ) => {
    try {
      // Generate unique auth token based on Telegram ID
      const authToken = `tg_${tgUser.id}_${Date.now()}`;

      // Store auth data
      localStorage.setItem('botmarket_auth', JSON.stringify({
        telegramId: tgUser.id,
        name: tgUser.first_name + (tgUser.last_name ? ` ${tgUser.last_name}` : ''),
        username: tgUser.username,
        photoUrl: tgUser.photo_url,
        token: authToken,
        authenticatedAt: new Date().toISOString(),
      }));

      // In production: send to Supabase
      // await supabase.from('users').upsert({
      //   telegram_id: tgUser.id,
      //   name: tgUser.first_name,
      //   username: tgUser.username,
      //   auth_token: authToken,
      // });

      setStatus('success');

      // Determine redirect
      let target = '/';
      if (isAdmin) target = '/admin';
      else if (page === 'catalog') target = '/';
      else if (page === 'support') target = '/support';
      else if (page === 'cart') target = '/cart';
      else if (startParam) {
        // Deep link params
        try {
          const params = JSON.parse(decodeURIComponent(startParam));
          if (params.page) target = `/${params.page}`;
        } catch { /* ignore */ }
      }

      setRedirectPage(target);

      // Auto redirect after 2 seconds
      setTimeout(() => {
        router.push(target);
      }, 2000);
    } catch {
      setStatus('error');
    }
  };

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-dark-900">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center">
          <Loader2 className="w-10 h-10 text-accent-cyan animate-spin mx-auto mb-4" />
          <p className="text-gray-400">Авторизация через Telegram...</p>
        </motion.div>
      </div>
    );
  }

  if (status === 'error') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-dark-900 px-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center max-w-md">
          <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">⚠️</span>
          </div>
          <h1 className="text-xl font-bold text-white mb-2">Ошибка авторизации</h1>
          <p className="text-gray-400 mb-6">Открой эту страницу через Telegram бота, нажав кнопку «Авторизоваться».</p>
          <button
            onClick={() => router.push('/')}
            className="px-6 py-3 bg-gradient-to-r from-accent-cyan to-accent-purple text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-accent-cyan/25 transition-all"
          >
            На главную
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-dark-900 px-4">
      <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center max-w-md">
        <div className="w-20 h-20 bg-accent-cyan/10 rounded-full flex items-center justify-center mx-auto mb-6 border border-accent-cyan/20">
          <CheckCircle className="w-10 h-10 text-accent-cyan" />
        </div>
        <h1 className="text-2xl font-bold text-white mb-2">Авторизация успешна!</h1>
        <p className="text-gray-400 mb-2">
          Привет, <span className="text-white font-medium">{user?.first_name}</span>!
        </p>
        <p className="text-sm text-gray-500 mb-6">
          Твой Telegram ID: <code className="text-accent-cyan">{user?.id}</code>
        </p>
        <p className="text-sm text-gray-500 mb-6">
          Перенаправляем на {redirectPage === '/' ? 'каталог' : redirectPage}...
        </p>
        <div className="w-full h-1 bg-dark-800 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: '0%' }}
            animate={{ width: '100%' }}
            transition={{ duration: 2, ease: 'linear' }}
            className="h-full bg-gradient-to-r from-accent-cyan to-accent-purple"
          />
        </div>
      </motion.div>
    </div>
  );
}