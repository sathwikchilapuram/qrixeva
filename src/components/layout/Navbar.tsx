'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Logo } from '../branding/Logo';
import { useApp } from '@/lib/AppContext';
import { AccentColor } from '@/types';
import { Search, Sun, Moon, Laptop, Plus, Sparkles, Palette, Menu, X, ArrowRight } from 'lucide-react';

export function Navbar() {
  const { theme, setTheme, accent, setAccent, setSearchOpen } = useApp();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [accentMenuOpen, setAccentMenuOpen] = useState(false);
  const pathname = usePathname();

  const isDashboard = pathname?.startsWith('/dashboard');

  const accentList: { name: AccentColor; color: string }[] = [
    { name: 'violet', color: '#6366f1' },
    { name: 'blue', color: '#3b82f6' },
    { name: 'cyan', color: '#06b6d4' },
    { name: 'green', color: '#10b981' },
    { name: 'orange', color: '#f97316' },
    { name: 'rose', color: '#f43f5e' },
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-gray-200 dark:border-gray-800 bg-white/80 dark:bg-gray-950/80 backdrop-blur-xl transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Left Logo */}
        <Link href="/" className="flex items-center gap-2">
          <Logo size="md" />
        </Link>

        {/* Center Desktop Navigation */}
        {!isDashboard && (
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-gray-600 dark:text-gray-300">
            <Link href="/#features" className="hover:text-brand-500 transition">
              Features
            </Link>
            <Link href="/#qr-types" className="hover:text-brand-500 transition">
              QR Types
            </Link>

            <Link href="/#dynamic-qr" className="hover:text-brand-500 transition">
              Dynamic QR
            </Link>
            <Link href="/dashboard/templates" className="hover:text-brand-500 transition">
              Templates
            </Link>
            <Link href="/ai-assistant" className="flex items-center gap-1.5 text-brand-500 font-semibold hover:opacity-80 transition">
              <Sparkles className="w-4 h-4 animate-pulse" />
              AI Assistant
            </Link>
          </nav>
        )}

        {/* Right Tools & Actions */}
        <div className="flex items-center gap-3">
          {/* Quick Search Button */}
          <button
            onClick={() => setSearchOpen(true)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900 text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition text-xs font-medium"
          >
            <Search className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Search...</span>
            <kbd className="hidden sm:inline px-1.5 py-0.5 bg-gray-200 dark:bg-gray-800 rounded text-[10px]">⌘K</kbd>
          </button>

          {/* Accent Color Picker Dropdown */}
          <div className="relative">
            <button
              onClick={() => setAccentMenuOpen(!accentMenuOpen)}
              className="p-2 rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition"
              title="Change Accent Color"
            >
              <Palette className="w-4 h-4" />
            </button>

            {accentMenuOpen && (
              <div className="absolute right-0 mt-2 w-48 p-2 rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-2xl z-50 animate-in fade-in">
                <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-2 px-2">Select Accent Color</p>
                <div className="grid grid-cols-3 gap-2">
                  {accentList.map((item) => (
                    <button
                      key={item.name}
                      onClick={() => {
                        setAccent(item.name);
                        setAccentMenuOpen(false);
                      }}
                      className={`flex flex-col items-center gap-1 p-2 rounded-xl border transition ${
                        accent === item.name
                          ? 'border-gray-900 dark:border-white bg-gray-100 dark:bg-gray-800'
                          : 'border-transparent hover:bg-gray-100 dark:hover:bg-gray-800/50'
                      }`}
                    >
                      <span className="w-5 h-5 rounded-full shadow" style={{ backgroundColor: item.color }} />
                      <span className="text-[10px] capitalize text-gray-600 dark:text-gray-300">{item.name}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Theme Mode Switcher */}
          <div className="flex items-center p-1 rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900">
            <button
              onClick={() => setTheme('light')}
              className={`p-1 rounded-lg transition ${theme === 'light' ? 'bg-white text-yellow-500 shadow' : 'text-gray-400 hover:text-gray-200'}`}
              title="Light Mode"
            >
              <Sun className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setTheme('dark')}
              className={`p-1 rounded-lg transition ${theme === 'dark' ? 'bg-gray-800 text-indigo-400 shadow' : 'text-gray-400 hover:text-gray-200'}`}
              title="Dark Mode"
            >
              <Moon className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setTheme('system')}
              className={`p-1 rounded-lg transition ${theme === 'system' ? 'bg-gray-800 text-brand-400 shadow' : 'text-gray-400 hover:text-gray-200'}`}
              title="System Theme"
            >
              <Laptop className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Primary CTA */}
          <Link
            href="/dashboard/create"
            className="hidden sm:inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-brand-500 hover:bg-brand-600 text-white font-medium text-sm transition shadow-lg shadow-brand-500/20 active:scale-95"
          >
            <Plus className="w-4 h-4" />
            Create QR
          </Link>

          {!isDashboard && (
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-800 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-900 transition text-sm font-medium"
            >
              Dashboard
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          )}

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-xl text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden p-4 border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 space-y-3">
          <Link
            href="/#features"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-gray-600 dark:text-gray-300 font-medium"
          >
            Features
          </Link>
          <Link
            href="/#qr-types"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-gray-600 dark:text-gray-300 font-medium"
          >
            QR Types
          </Link>
          <Link
            href="/#dynamic-qr"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-gray-600 dark:text-gray-300 font-medium"
          >
            Dynamic QR
          </Link>
          <Link
            href="/dashboard/templates"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-gray-600 dark:text-gray-300 font-medium"
          >
            Templates
          </Link>
          <Link
            href="/ai-assistant"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-brand-500 font-semibold"
          >
            AI Assistant Studio
          </Link>
          <div className="pt-2">
            <Link
              href="/dashboard/create"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-brand-500 text-white font-medium text-sm shadow-md"
            >
              <Plus className="w-4 h-4" />
              Create QR Code
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
