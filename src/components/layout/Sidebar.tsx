'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useApp } from '@/lib/AppContext';
import {
  LayoutDashboard,
  PlusCircle,
  QrCode,
  LayoutTemplate,
  BarChart3,
  FolderKanban,
  User,
  Settings,
  Sparkles,
  Layers,
  HelpCircle,
  Sun,
  Moon,
  Laptop,
  LogOut,
} from 'lucide-react';

export function Sidebar() {
  const pathname = usePathname();
  const { theme, setTheme, profile } = useApp();

  const navItems = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Create QR', href: '/dashboard/create', icon: PlusCircle },
    { name: 'Batch Generator', href: '/dashboard/bulk', icon: Layers },
    { name: 'My QR Codes', href: '/dashboard/my-qrs', icon: QrCode },
    { name: 'Templates', href: '/dashboard/templates', icon: LayoutTemplate },
    { name: 'Analytics', href: '/dashboard/analytics', icon: BarChart3 },
    { name: 'Files', href: '/dashboard/files', icon: FolderKanban },
    { name: 'AI Assistant', href: '/ai-assistant', icon: Sparkles, highlight: true },
    { name: 'Profile', href: '/dashboard/profile', icon: User },
    { name: 'Settings', href: '/dashboard/settings', icon: Settings },
  ];

  return (
    <aside className="w-64 shrink-0 hidden lg:flex flex-col border-r border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 h-[calc(100vh-4rem)] sticky top-16 select-none transition-colors duration-200">
      {/* Primary Navigation Links */}
      <div className="flex-1 p-4 space-y-1.5 overflow-y-auto">
        <div className="px-3 pb-2 text-[11px] font-semibold uppercase tracking-wider text-gray-400">
          Core Engine
        </div>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium text-sm transition ${
                isActive
                  ? 'bg-brand-500 text-white shadow-md shadow-brand-500/20'
                  : item.highlight
                  ? 'text-brand-500 hover:bg-brand-500/10 font-semibold'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-900 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-white' : item.highlight ? 'text-brand-500' : 'text-gray-500'}`} />
              <span>{item.name}</span>
            </Link>
          );
        })}
      </div>

      {/* Bottom Sidebar Section */}
      <div className="p-4 border-t border-gray-200 dark:border-gray-800 space-y-4">
        {/* Help & Support */}
        <Link
          href="/#faq"
          className="flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-900 hover:text-gray-900 dark:hover:text-white transition"
        >
          <HelpCircle className="w-4 h-4" />
          <span>Help & Documentation</span>
        </Link>

        {/* Theme Toggle Bar */}
        <div className="flex items-center justify-between p-1.5 rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900">
          <button
            onClick={() => setTheme('light')}
            className={`flex-1 flex items-center justify-center py-1 rounded-lg text-xs font-medium transition ${
              theme === 'light' ? 'bg-white text-gray-900 shadow' : 'text-gray-400 hover:text-gray-200'
            }`}
          >
            <Sun className="w-3.5 h-3.5 mr-1 text-yellow-500" /> Light
          </button>
          <button
            onClick={() => setTheme('dark')}
            className={`flex-1 flex items-center justify-center py-1 rounded-lg text-xs font-medium transition ${
              theme === 'dark' ? 'bg-gray-800 text-white shadow' : 'text-gray-400 hover:text-gray-200'
            }`}
          >
            <Moon className="w-3.5 h-3.5 mr-1 text-indigo-400" /> Dark
          </button>
          <button
            onClick={() => setTheme('system')}
            className={`flex-1 flex items-center justify-center py-1 rounded-lg text-xs font-medium transition ${
              theme === 'system' ? 'bg-gray-800 text-brand-400 shadow' : 'text-gray-400 hover:text-gray-200'
            }`}
          >
            <Laptop className="w-3.5 h-3.5 mr-1" /> Auto
          </button>
        </div>

        {/* Active User Card */}
        <div className="flex items-center justify-between pt-2 border-t border-gray-100 dark:border-gray-800/60">
          <div className="flex items-center gap-2.5 overflow-hidden">
            <img
              src={profile.avatarUrl}
              alt={profile.name}
              className="w-8 h-8 rounded-full object-cover border border-gray-300 dark:border-gray-700 shrink-0"
            />
            <div className="overflow-hidden text-left">
              <p className="text-xs font-semibold text-gray-900 dark:text-white truncate">{profile.name}</p>
              <p className="text-[10px] text-gray-500 truncate">Pro Account</p>
            </div>
          </div>
          <Link href="/dashboard/settings" className="p-1.5 rounded-lg text-gray-400 hover:text-gray-200 hover:bg-gray-800">
            <Settings className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </aside>
  );
}
