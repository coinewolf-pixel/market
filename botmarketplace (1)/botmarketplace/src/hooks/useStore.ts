'use client';

import { create } from 'zustand';
import { Bot, CartItem } from '@/types';

interface StoreState {
  cart: CartItem[];
  addToCart: (bot: Bot) => void;
  removeFromCart: (botId: string) => void;
  updateQuantity: (botId: string, quantity: number) => void;
  clearCart: () => void;
  getCartTotal: () => number;
  getCartCount: () => number;
  isAdmin: boolean;
  setIsAdmin: (value: boolean) => void;
}

export const useStore = create<StoreState>((set, get) => ({
  cart: [],
  addToCart: (bot) => {
    const { cart } = get();
    const existing = cart.find((item) => item.bot.id === bot.id);
    if (existing) {
      set({
        cart: cart.map((item) =>
          item.bot.id === bot.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        ),
      });
    } else {
      set({ cart: [...cart, { bot, quantity: 1 }] });
    }
  },
  removeFromCart: (botId) => {
    set({ cart: get().cart.filter((item) => item.bot.id !== botId) });
  },
  updateQuantity: (botId, quantity) => {
    if (quantity <= 0) {
      get().removeFromCart(botId);
      return;
    }
    set({
      cart: get().cart.map((item) =>
        item.bot.id === botId ? { ...item, quantity } : item
      ),
    });
  },
  clearCart: () => set({ cart: [] }),
  getCartTotal: () =>
    get().cart.reduce((sum, item) => sum + item.bot.price * item.quantity, 0),
  getCartCount: () =>
    get().cart.reduce((sum, item) => sum + item.quantity, 0),
  isAdmin: false,
  setIsAdmin: (value) => set({ isAdmin: value }),
}));