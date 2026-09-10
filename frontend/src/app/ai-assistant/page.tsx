'use client';

import React, { useState } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Sidebar } from '@/components/layout/Sidebar';
import { MobileNav } from '@/components/layout/MobileNav';
import { analyzeQRIntent, AIRecommendation } from '@/lib/ai-engine';
import { Sparkles, Send, CheckCircle, ArrowRight, Bot, User } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function AIAssistantPage() {
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [recommendation, setRecommendation] = useState<AIRecommendation | null>(null);
  const router = useRouter();

  const handleAnalyze = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) return;

    setLoading(true);
    const rec = await analyzeQRIntent(prompt);
    setRecommendation(rec);
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100 transition-colors duration-200">
      <Navbar />

      <div className="flex-1 flex max-w-7xl w-full mx-auto">
        <Sidebar />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 space-y-8 overflow-hidden pb-24 lg:pb-8">
          <div className="pb-6 border-b border-gray-200 dark:border-gray-800">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-500/10 text-brand-400 text-xs font-bold uppercase mb-2">
              <Sparkles className="w-4 h-4 animate-pulse" /> AI Assistant Studio
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-gray-900 dark:text-white">
              AI QR Requirement Advisor
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Describe your objective in plain text. The AI will evaluate content structure, pick template palettes, and configure your QR code.
            </p>
          </div>

          <div className="max-w-3xl space-y-8">
            {/* Prompt Input Form */}
            <form onSubmit={handleAnalyze} className="space-y-4">
              <div className="relative">
                <textarea
                  rows={4}
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="e.g. 'I want a QR code for my Italian restaurant with a food menu and booking phone number.'"
                  className="w-full p-4 rounded-3xl border border-gray-300 dark:border-gray-800 bg-white dark:bg-gray-950 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-brand-500 shadow-lg"
                />
                <button
                  type="submit"
                  disabled={loading || !prompt.trim()}
                  className="absolute bottom-4 right-4 px-5 py-2.5 rounded-2xl bg-brand-500 hover:bg-brand-600 disabled:opacity-50 text-white font-semibold text-xs transition shadow-md flex items-center gap-2"
                >
                  <Send className="w-3.5 h-3.5" />
                  {loading ? 'Analyzing Intent...' : 'Ask AI Assistant'}
                </button>
              </div>

              {/* Sample Prompts */}
              <div className="flex flex-wrap gap-2 text-xs">
                <span className="text-gray-400">Try asking:</span>
                {[
                  'QR code for my resume & CV',
                  'QR code for restaurant menu',
                  'QR pass for tech conference',
                  'PDF document sharing QR',
                ].map((sample) => (
                  <button
                    key={sample}
                    type="button"
                    onClick={() => setPrompt(sample)}
                    className="px-3 py-1 rounded-full bg-gray-100 dark:bg-gray-900 text-gray-600 dark:text-gray-300 hover:text-brand-500 transition"
                  >
                    "{sample}"
                  </button>
                ))}
              </div>
            </form>

            {/* AI Recommendation Output Card */}
            {recommendation && (
              <div className="p-8 rounded-3xl border border-brand-500/30 bg-gray-900 text-white space-y-6 shadow-2xl animate-in fade-in">
                <div className="flex items-center gap-3 pb-4 border-b border-gray-800">
                  <div className="w-10 h-10 rounded-2xl bg-brand-500/20 text-brand-400 flex items-center justify-center font-bold">
                    <Bot className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-lg text-white">{recommendation.title}</h3>
                    <p className="text-xs text-brand-400 font-semibold uppercase">Recommended Type: {recommendation.recommendedType}</p>
                  </div>
                </div>

                <div className="space-y-2 text-xs leading-relaxed text-gray-300">
                  <span className="font-bold text-white uppercase tracking-wider text-[10px]">AI Strategic Analysis:</span>
                  <p>{recommendation.reasoning}</p>
                </div>

                {/* Suggested Customization Tips */}
                <div className="space-y-2 text-xs">
                  <span className="font-bold text-white uppercase tracking-wider text-[10px]">Customization Recommendations:</span>
                  <ul className="space-y-1 text-gray-300">
                    {recommendation.customizationTips.map((tip, i) => (
                      <li key={i} className="flex items-center gap-2">
                        <CheckCircle className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                        {tip}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Apply Button */}
                <div className="pt-4 border-t border-gray-800">
                  <button
                    onClick={() => {
                      router.push(`/dashboard/create?type=${recommendation.recommendedType}`);
                    }}
                    className="w-full py-3.5 rounded-2xl bg-brand-500 hover:bg-brand-600 text-white font-bold text-sm transition shadow-lg shadow-brand-500/30 flex items-center justify-center gap-2"
                  >
                    Apply AI Recommendation & Open Studio <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>

      <MobileNav />
    </div>
  );
}
