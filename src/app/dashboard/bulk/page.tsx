'use client';

import React, { useState } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Sidebar } from '@/components/layout/Sidebar';
import { MobileNav } from '@/components/layout/MobileNav';
import { useApp } from '@/lib/AppContext';
import { generateQRSVG } from '@/lib/qr-generator';
import { DEFAULT_CUSTOMIZATION } from '@/lib/store';
import { downloadSVG, downloadRasterImage } from '@/lib/export-utils';
import { Layers, Download, Sparkles, CheckCircle2, RefreshCw } from 'lucide-react';

interface GeneratedBatchItem {
  id: string;
  label: string;
  url: string;
  svg: string;
}

export default function BulkQRGeneratorPage() {
  const { addToast } = useApp();
  const [bulkInput, setBulkInput] = useState(
    "https://qrixeva.vercel.app/menu\nhttps://qrixeva.vercel.app/resume\nhttps://qrixeva.vercel.app/contact\nhttps://qrixeva.vercel.app/event"
  );
  const [generating, setGenerating] = useState(false);
  const [items, setItems] = useState<GeneratedBatchItem[]>([]);

  const handleGenerateBatch = async (e: React.FormEvent) => {
    e.preventDefault();
    const lines = bulkInput
      .split('\n')
      .map((l) => l.trim())
      .filter(Boolean);

    if (lines.length === 0) return;

    setGenerating(true);
    const results: GeneratedBatchItem[] = [];

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      const svg = await generateQRSVG(line, DEFAULT_CUSTOMIZATION);
      results.push({
        id: `batch-${i + 1}`,
        label: `Batch QR #${i + 1}`,
        url: line,
        svg,
      });
    }

    setItems(results);
    setGenerating(false);
    addToast('success', `Generated ${results.length} QR codes in batch!`);
  };

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100 transition-colors duration-200">
      <Navbar />

      <div className="flex-1 flex max-w-7xl w-full mx-auto">
        <Sidebar />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 space-y-8 overflow-hidden pb-24 lg:pb-8">
          <div className="pb-6 border-b border-gray-200 dark:border-gray-800">
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-gray-900 dark:text-white">
              Batch & Bulk QR Generator
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Enter multiple target URLs or plain text items (one per line) to generate and download batch QR codes simultaneously.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Input Form */}
            <div className="lg:col-span-5 space-y-4">
              <form onSubmit={handleGenerateBatch} className="p-6 rounded-3xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 shadow-md space-y-4">
                <label className="text-xs font-bold uppercase tracking-wider text-brand-500 block">
                  Batch URLs / Payloads (1 per line)
                </label>

                <textarea
                  rows={8}
                  value={bulkInput}
                  onChange={(e) => setBulkInput(e.target.value)}
                  className="w-full p-4 rounded-2xl border border-gray-300 dark:border-gray-800 bg-gray-50 dark:bg-gray-900 text-xs font-mono focus:outline-none focus:ring-2 focus:ring-brand-500"
                  placeholder="https://example.com/link1&#10;https://example.com/link2"
                />

                <button
                  type="submit"
                  disabled={generating || !bulkInput.trim()}
                  className="w-full py-3.5 rounded-2xl bg-brand-500 hover:bg-brand-600 text-white font-bold text-xs transition shadow-lg shadow-brand-500/25 flex items-center justify-center gap-2"
                >
                  {generating ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" /> Batch Generating...
                    </>
                  ) : (
                    <>
                      <Layers className="w-4 h-4" /> Generate Batch QRs
                    </>
                  )}
                </button>
              </form>
            </div>

            {/* Generated Results Grid */}
            <div className="lg:col-span-7 space-y-4">
              {items.length > 0 ? (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-gray-400">
                      Batch Output ({items.length} Codes)
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {items.map((item) => (
                      <div key={item.id} className="p-4 rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 space-y-3 shadow-sm text-center">
                        <div className="p-4 bg-gray-950 rounded-xl flex items-center justify-center min-h-[160px]">
                          <div className="w-36 h-40" dangerouslySetInnerHTML={{ __html: item.svg }} />
                        </div>

                        <p className="text-xs font-mono text-gray-400 truncate">{item.url}</p>

                        <div className="grid grid-cols-2 gap-2">
                          <button
                            onClick={() => downloadSVG(item.svg, `${item.id}.svg`)}
                            className="py-1.5 rounded-lg border border-gray-300 dark:border-gray-800 text-[11px] font-semibold hover:bg-gray-100 dark:hover:bg-gray-800"
                          >
                            SVG
                          </button>
                          <button
                            onClick={() => downloadRasterImage(item.svg, 'png', `${item.id}.png`)}
                            className="py-1.5 rounded-lg bg-brand-500 text-white text-[11px] font-semibold"
                          >
                            PNG
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="p-12 text-center border-2 border-dashed border-gray-200 dark:border-gray-800 rounded-3xl text-gray-500">
                  <Layers className="w-10 h-10 mx-auto mb-2 opacity-40" />
                  <p className="text-sm font-medium">No batch generated yet.</p>
                  <p className="text-xs text-gray-600 mt-1">Enter target links or text on the left and click Generate Batch.</p>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>

      <MobileNav />
    </div>
  );
}
