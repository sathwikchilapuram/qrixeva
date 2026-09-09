'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/layout/Navbar';
import { Sidebar } from '@/components/layout/Sidebar';
import { MobileNav } from '@/components/layout/MobileNav';
import { useApp } from '@/lib/AppContext';
import { generateQRSVG } from '@/lib/qr-generator';
import { downloadSVG, downloadRasterImage } from '@/lib/export-utils';
import {
  QrCode,
  Search,
  Grid,
  List,
  Sliders,
  Share2,
  Trash2,
  CheckCircle,
  ExternalLink,
  Eye,
  Plus,
  BarChart3,
  Filter,
} from 'lucide-react';

export default function MyQRCodesPage() {
  const { qrCodes, deleteQRCode, toggleQRStatus, addToast } = useApp();
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [previewQr, setPreviewQr] = useState<any | null>(null);
  const [previewSvg, setPreviewSvg] = useState<string>('');

  const filtered = qrCodes.filter((qr) => {
    const matchesSearch = qr.name.toLowerCase().includes(search.toLowerCase()) || qr.slug.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'all' || qr.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) => (prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]));
  };

  const handleBulkDelete = () => {
    selectedIds.forEach((id) => deleteQRCode(id));
    setSelectedIds([]);
    addToast('info', 'Bulk deletion complete.');
  };

  const handleOpenPreview = async (qr: any) => {
    setPreviewQr(qr);
    const svg = await generateQRSVG(
      qr.mode === 'dynamic' ? `https://qrverse.app/x/${qr.slug}` : (qr.content?.url || qr.name),
      qr.customization
    );
    setPreviewSvg(svg);
  };

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100 transition-colors duration-200">
      <Navbar />

      <div className="flex-1 flex max-w-7xl w-full mx-auto">
        <Sidebar />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 space-y-8 overflow-hidden pb-24 lg:pb-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-gray-200 dark:border-gray-800">
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-gray-900 dark:text-white">
                My QR Codes ({qrCodes.length})
              </h1>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                View, customize, export, and manage status rules for all your dynamic QR codes.
              </p>
            </div>

            <Link
              href="/dashboard/create"
              className="px-5 py-2.5 rounded-xl bg-brand-500 hover:bg-brand-600 text-white font-semibold text-sm transition shadow-lg shadow-brand-500/20 flex items-center gap-2 self-start"
            >
              <Plus className="w-4 h-4" /> Create QR Code
            </Link>
          </div>

          {/* Search & Bulk Bar */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <div className="relative flex-1 sm:w-72">
                <Search className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search QR codes..."
                  className="w-full pl-9 pr-4 py-2 rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900 text-xs font-medium"
                />
              </div>

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900 text-xs font-medium text-gray-700 dark:text-gray-300"
              >
                <option value="all">All Statuses</option>
                <option value="active">Active Only</option>
                <option value="disabled">Disabled Only</option>
              </select>
            </div>

            <div className="flex items-center gap-2 self-end sm:self-auto">
              {selectedIds.length > 0 && (
                <button
                  onClick={handleBulkDelete}
                  className="px-3 py-1.5 rounded-xl bg-rose-500/10 text-rose-500 border border-rose-500/20 text-xs font-bold hover:bg-rose-500 hover:text-white transition flex items-center gap-1.5"
                >
                  <Trash2 className="w-3.5 h-3.5" /> Delete Selected ({selectedIds.length})
                </button>
              )}

              <div className="flex items-center p-1 rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-1.5 rounded-lg ${viewMode === 'grid' ? 'bg-white dark:bg-gray-800 text-brand-500 shadow' : 'text-gray-400'}`}
                >
                  <Grid className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-1.5 rounded-lg ${viewMode === 'list' ? 'bg-white dark:bg-gray-800 text-brand-500 shadow' : 'text-gray-400'}`}
                >
                  <List className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Grid View */}
          {viewMode === 'grid' ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map((qr) => (
                <div
                  key={qr.id}
                  className="p-6 rounded-3xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 shadow-sm hover:shadow-xl transition space-y-4 relative group"
                >
                  <div className="flex items-center justify-between">
                    <input
                      type="checkbox"
                      checked={selectedIds.includes(qr.id)}
                      onChange={() => toggleSelect(qr.id)}
                      className="rounded text-brand-500 focus:ring-brand-500"
                    />

                    <button
                      onClick={() => toggleQRStatus(qr.id)}
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                        qr.status === 'active' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-rose-500/10 text-rose-500'
                      }`}
                    >
                      {qr.status}
                    </button>
                  </div>

                  <div>
                    <h3 className="font-bold text-gray-900 dark:text-white text-base truncate">{qr.name}</h3>
                    <p className="text-xs text-gray-500">
                      {qr.type.toUpperCase()} • {qr.scansCount} scans
                    </p>
                  </div>

                  <div className="p-4 rounded-2xl bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-800/80 flex items-center justify-between text-xs">
                    <span className="font-mono text-gray-400 truncate">/x/{qr.slug}</span>
                    <Link href={`/x/${qr.slug}`} target="_blank" className="text-brand-500 font-semibold hover:underline flex items-center gap-1">
                      View <ExternalLink className="w-3 h-3" />
                    </Link>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-gray-100 dark:border-gray-800">
                    <button
                      onClick={() => handleOpenPreview(qr)}
                      className="p-2 rounded-xl text-gray-400 hover:text-white hover:bg-gray-800 transition"
                      title="Preview QR"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <Link
                      href={`/dashboard/create?edit=${qr.id}`}
                      className="p-2 rounded-xl text-gray-400 hover:text-brand-400 hover:bg-gray-800 transition"
                      title="Edit Customization"
                    >
                      <Sliders className="w-4 h-4" />
                    </Link>
                    <Link
                      href={`/dashboard/analytics`}
                      className="p-2 rounded-xl text-gray-400 hover:text-purple-400 hover:bg-gray-800 transition"
                      title="Analytics"
                    >
                      <BarChart3 className="w-4 h-4" />
                    </Link>
                    <button
                      onClick={() => deleteQRCode(qr.id)}
                      className="p-2 rounded-xl text-gray-400 hover:text-rose-400 hover:bg-gray-800 transition"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="border border-gray-200 dark:border-gray-800 rounded-2xl overflow-hidden bg-white dark:bg-gray-950">
              <div className="divide-y divide-gray-200 dark:divide-gray-800">
                {filtered.map((qr) => (
                  <div key={qr.id} className="p-4 flex items-center justify-between gap-4 hover:bg-gray-50 dark:hover:bg-gray-900/40">
                    <div className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        checked={selectedIds.includes(qr.id)}
                        onChange={() => toggleSelect(qr.id)}
                        className="rounded text-brand-500"
                      />
                      <div>
                        <p className="font-bold text-sm text-gray-900 dark:text-white">{qr.name}</p>
                        <p className="text-xs text-gray-500">{qr.type.toUpperCase()} • /x/{qr.slug}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 text-xs font-medium">
                      <span>{qr.scansCount} scans</span>
                      <button
                        onClick={() => toggleQRStatus(qr.id)}
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                          qr.status === 'active' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-rose-500/10 text-rose-500'
                        }`}
                      >
                        {qr.status}
                      </button>

                      <button onClick={() => handleOpenPreview(qr)} className="p-1.5 text-gray-400 hover:text-white">
                        <Eye className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Quick Preview Modal */}
      {previewQr && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="bg-gray-900 border border-gray-800 rounded-3xl p-6 max-w-md w-full text-center space-y-6">
            <div className="flex items-center justify-between border-b border-gray-800 pb-4">
              <h3 className="font-bold text-white text-base">{previewQr.name}</h3>
              <button onClick={() => setPreviewQr(null)} className="p-1 text-gray-400 hover:text-white">✕</button>
            </div>

            <div className="p-6 bg-gray-950 border border-gray-800 rounded-2xl flex items-center justify-center min-h-[260px]">
              {previewSvg && <div className="w-60 h-68" dangerouslySetInnerHTML={{ __html: previewSvg }} />}
            </div>

            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => downloadSVG(previewSvg, `${previewQr.slug}.svg`)}
                className="py-2.5 px-4 rounded-xl bg-gray-800 hover:bg-gray-700 text-xs font-semibold text-white border border-gray-700 transition"
              >
                Download SVG
              </button>
              <button
                onClick={() => downloadRasterImage(previewSvg, 'png', `${previewQr.slug}.png`)}
                className="py-2.5 px-4 rounded-xl bg-brand-500 hover:bg-brand-600 text-xs font-semibold text-white transition"
              >
                Download PNG
              </button>
            </div>
          </div>
        </div>
      )}

      <MobileNav />
    </div>
  );
}
