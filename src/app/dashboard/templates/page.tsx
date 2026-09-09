'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/layout/Navbar';
import { Sidebar } from '@/components/layout/Sidebar';
import { MobileNav } from '@/components/layout/MobileNav';
import { QR_TEMPLATES } from '@/lib/store';
import { LayoutTemplate, Sparkles, ArrowRight, Check } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function TemplatesPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const router = useRouter();

  const categories = ['All', 'Corporate', 'Restaurant', 'Minimal', 'Creative', 'Personal', 'Business'];

  const filteredTemplates = selectedCategory === 'All'
    ? QR_TEMPLATES
    : QR_TEMPLATES.filter((t) => t.category === selectedCategory);

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100 transition-colors duration-200">
      <Navbar />

      <div className="flex-1 flex max-w-7xl w-full mx-auto">
        <Sidebar />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 space-y-8 overflow-hidden pb-24 lg:pb-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-gray-200 dark:border-gray-800">
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-gray-900 dark:text-white">
                QR Template Gallery
              </h1>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                Choose a pre-styled template to jumpstart your QR design with custom palettes and dot patterns.
              </p>
            </div>
          </div>

          {/* Category Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition ${
                  selectedCategory === cat
                    ? 'bg-brand-500 text-white shadow-md'
                    : 'bg-gray-100 dark:bg-gray-900 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTemplates.map((tpl) => (
              <div
                key={tpl.id}
                className="p-6 rounded-3xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 shadow-sm hover:shadow-xl transition space-y-6 flex flex-col justify-between group"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span
                      className="w-8 h-8 rounded-xl shadow-md flex items-center justify-center text-white font-bold text-xs"
                      style={{ backgroundColor: tpl.previewColor }}
                    >
                      QR
                    </span>
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-gray-100 dark:bg-gray-900 text-gray-400">
                      {tpl.category}
                    </span>
                  </div>

                  <div>
                    <h3 className="font-bold text-gray-900 dark:text-white text-lg group-hover:text-brand-500 transition">
                      {tpl.name}
                    </h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 leading-relaxed">{tpl.description}</p>
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-100 dark:border-gray-800">
                  <button
                    onClick={() => {
                      router.push(`/dashboard/create?type=url`);
                    }}
                    className="w-full py-2.5 rounded-xl bg-gray-900 dark:bg-gray-900 border border-gray-800 hover:border-brand-500 text-white font-semibold text-xs transition flex items-center justify-center gap-2 group-hover:bg-brand-500"
                  >
                    Apply Template & Create <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>

      <MobileNav />
    </div>
  );
}
