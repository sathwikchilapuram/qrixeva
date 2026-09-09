'use client';

import React from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Sidebar } from '@/components/layout/Sidebar';
import { MobileNav } from '@/components/layout/MobileNav';
import { useApp } from '@/lib/AppContext';
import { AccentColor, ThemeMode } from '@/types';
import { Settings, Sun, Moon, Laptop, Palette, ShieldCheck, Bell } from 'lucide-react';

export default function SettingsPage() {
  const { theme, setTheme, accent, setAccent, addToast } = useApp();

  const accentList: { name: AccentColor; color: string }[] = [
    { name: 'violet', color: '#6366f1' },
    { name: 'blue', color: '#3b82f6' },
    { name: 'cyan', color: '#06b6d4' },
    { name: 'green', color: '#10b981' },
    { name: 'orange', color: '#f97316' },
    { name: 'rose', color: '#f43f5e' },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100 transition-colors duration-200">
      <Navbar />

      <div className="flex-1 flex max-w-7xl w-full mx-auto">
        <Sidebar />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 space-y-8 overflow-hidden pb-24 lg:pb-8">
          <div className="pb-6 border-b border-gray-200 dark:border-gray-800">
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-gray-900 dark:text-white">
              Account & Interface Settings
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Configure global theme parameters, dynamic accent palettes, and security notifications.
            </p>
          </div>

          <div className="max-w-3xl space-y-8">
            {/* Theme Mode Card */}
            <div className="p-6 rounded-3xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 space-y-4 shadow-sm">
              <h3 className="font-bold text-gray-900 dark:text-white text-base flex items-center gap-2">
                <Sun className="w-5 h-5 text-brand-500" /> Interface Theme
              </h3>
              <div className="grid grid-cols-3 gap-4">
                <button
                  onClick={() => setTheme('light')}
                  className={`p-4 rounded-2xl border flex flex-col items-center gap-2 transition ${
                    theme === 'light' ? 'border-brand-500 bg-brand-500/10 font-bold' : 'border-gray-200 dark:border-gray-800'
                  }`}
                >
                  <Sun className="w-6 h-6 text-yellow-500" />
                  <span className="text-xs">Light Mode</span>
                </button>
                <button
                  onClick={() => setTheme('dark')}
                  className={`p-4 rounded-2xl border flex flex-col items-center gap-2 transition ${
                    theme === 'dark' ? 'border-brand-500 bg-brand-500/10 font-bold' : 'border-gray-200 dark:border-gray-800'
                  }`}
                >
                  <Moon className="w-6 h-6 text-indigo-400" />
                  <span className="text-xs">Dark Mode</span>
                </button>
                <button
                  onClick={() => setTheme('system')}
                  className={`p-4 rounded-2xl border flex flex-col items-center gap-2 transition ${
                    theme === 'system' ? 'border-brand-500 bg-brand-500/10 font-bold' : 'border-gray-200 dark:border-gray-800'
                  }`}
                >
                  <Laptop className="w-6 h-6 text-brand-400" />
                  <span className="text-xs">System Auto</span>
                </button>
              </div>
            </div>

            {/* Accent Colors Card */}
            <div className="p-6 rounded-3xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 space-y-4 shadow-sm">
              <h3 className="font-bold text-gray-900 dark:text-white text-base flex items-center gap-2">
                <Palette className="w-5 h-5 text-brand-500" /> Dynamic Accent Color Palette
              </h3>
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
                {accentList.map((item) => (
                  <button
                    key={item.name}
                    onClick={() => {
                      setAccent(item.name);
                      addToast('success', `Accent color changed to ${item.name.toUpperCase()}`);
                    }}
                    className={`flex flex-col items-center gap-2 p-3 rounded-2xl border transition ${
                      accent === item.name
                        ? 'border-gray-900 dark:border-white bg-gray-100 dark:bg-gray-900 font-bold'
                        : 'border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-900/50'
                    }`}
                  >
                    <span className="w-8 h-8 rounded-full shadow-lg" style={{ backgroundColor: item.color }} />
                    <span className="text-xs capitalize">{item.name}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </main>
      </div>

      <MobileNav />
    </div>
  );
}
