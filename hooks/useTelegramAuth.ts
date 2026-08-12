'use client';

import { useState, useEffect } from 'react';

interface TelegramAuthData {
  telegramId: number;
  name: string;
  username?: string;
  photoUrl?: string;
  token: string;
  authenticatedAt: string;
}

export function useTelegramAuth() {
  const [auth, setAuth] = useState<TelegramAuthData | null>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem('botmarket_auth');
    if (stored) {
      try {
        setAuth(JSON.parse(stored));
      } catch {
        localStorage.removeItem('botmarket_auth');
      }
    }
    setIsReady(true);
  }, []);

  const isAuthenticated = !!auth;
  const userName = auth?.name || 'Гость';
  const telegramId = auth?.telegramId;

  const logout = () => {
    localStorage.removeItem('botmarket_auth');
    setAuth(null);
    window.location.href = '/';
  };

  return { auth, isAuthenticated, isReady, userName, telegramId, logout };
}