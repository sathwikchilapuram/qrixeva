'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/layout/Navbar';
import { Sidebar } from '@/components/layout/Sidebar';
import { MobileNav } from '@/components/layout/MobileNav';
import { useApp } from '@/lib/AppContext';
import { generateQRSVG } from '@/lib/qr-generator';
import { downloadSVG, downloadRasterImage, downloadQRPDF, copyQRImageToClipboard } from '@/lib/export-utils';
import {
  QrCode,
  CheckCircle,
  BarChart3,
  FolderKanban,
  Plus,
  Eye,
  Edit,
  Download,
  Share2,
  Trash2,
  Sliders,
  ExternalLink,
  Sparkles,
  Search,
  Lock,
} from 'lucide-react';

export default function DashboardPage() {
  const { qrCodes, files, scans, deleteQRCode, toggleQRStatus, addToast } = useApp();
  const [filterType, setFilterType] = useState<string>('all');
  const [previewQr, setPreviewQr] = useState<any | null>(null);
  const [previewSvg, setPreviewSvg] = useState<string>('');

  const totalScans = qrCodes.reduce((acc, q) => acc + q.scansCount, 0);
  const activeQRs = qrCodes.filter((q) => q.status === 'active').length;

  const filteredQRs = filterType === 'all'
    ? qrCodes
    : qrCodes.filter((q) => q.type === filterType);

  const handleOpenPreview = async (qr: any) => {
    setPreviewQr(qr);
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || (typeof window !== 'undefined' && window.location.hostname !== 'localhost' ? window.location.origin : 'https://qrixeva.vercel.app');
    const payloadStr = qr.mode === 'dynamic'
      ? `${baseUrl}/x/${qr.slug}`
      : (qr.type === 'text' ? (qr.content?.text || qr.name) : (qr.content?.url || qr.content?.text || qr.name));
    const svg = await generateQRSVG(payloadStr, qr.customization);
    setPreviewSvg(svg);
  };

  const handleCopyLink = (slug: string) => {
    const link = `${window.location.origin}/x/${slug}`;
    navigator.clipboard.writeText(link);
    addToast('success', 'Dynamic QR link copied to clipboard!');
  };

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100 transition-colors duration-200">
      <Navbar />

      <div className="flex-1 flex max-w-7xl w-full mx-auto">
        <Sidebar />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 space-y-8 overflow-hidden pb-24 lg:pb-8">
          {/* Header Banner */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-gray-200 dark:border-gray-800">
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-gray-900 dark:text-white">
                Platform Overview
              </h1>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                Manage your active dynamic QR codes, track real-time scan analytics, and host digital assets.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <Link
                href="/ai-assistant"
                className="px-4 py-2 rounded-xl bg-brand-500/10 text-brand-500 hover:bg-brand-500/20 font-semibold text-xs transition flex items-center gap-1.5"
              >
                <Sparkles className="w-4 h-4" />
                AI Assistant
              </Link>
              <Link
                href="/dashboard/create"
                className="px-5 py-2.5 rounded-xl bg-brand-500 hover:bg-brand-600 text-white font-semibold text-sm transition shadow-lg shadow-brand-500/20 flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Create New QR
              </Link>
            </div>
          </div>

          {/* Overview Metrics Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-6 rounded-2xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900/60 space-y-2">
              <div className="flex items-center justify-between text-gray-500 dark:text-gray-400 text-xs font-semibold uppercase tracking-wider">
                <span>Total QR Codes</span>
                <QrCode className="w-5 h-5 text-brand-500" />
              </div>
              <div className="text-3xl font-extrabold text-gray-900 dark:text-white">{qrCodes.length}</div>
              <p className="text-xs text-emerald-500 font-medium">100% active & operational</p>
            </div>

            <div className="p-6 rounded-2xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900/60 space-y-2">
              <div className="flex items-center justify-between text-gray-500 dark:text-gray-400 text-xs font-semibold uppercase tracking-wider">
                <span>Active Dynamic QRs</span>
                <CheckCircle className="w-5 h-5 text-emerald-500" />
              </div>
              <div className="text-3xl font-extrabold text-gray-900 dark:text-white">{activeQRs}</div>
              <p className="text-xs text-gray-500">Editable destination links</p>
            </div>

            <div className="p-6 rounded-2xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900/60 space-y-2">
              <div className="flex items-center justify-between text-gray-500 dark:text-gray-400 text-xs font-semibold uppercase tracking-wider">
                <span>Total Scans Recorded</span>
                <BarChart3 className="w-5 h-5 text-purple-500" />
              </div>
              <div className="text-3xl font-extrabold text-gray-900 dark:text-white">{totalScans.toLocaleString()}</div>
              <p className="text-xs text-purple-400 font-medium">+14% scan increase this week</p>
            </div>

            <div className="p-6 rounded-2xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900/60 space-y-2">
              <div className="flex items-center justify-between text-gray-500 dark:text-gray-400 text-xs font-semibold uppercase tracking-wider">
                <span>Cloud Files Stored</span>
                <FolderKanban className="w-5 h-5 text-indigo-500" />
              </div>
              <div className="text-3xl font-extrabold text-gray-900 dark:text-white">{files.length}</div>
              <p className="text-xs text-gray-500">PDFs, images & documents</p>
            </div>
          </div>

          {/* Recent QR Codes Table */}
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <QrCode className="w-5 h-5 text-brand-500" />
                Recent QR Codes ({filteredQRs.length})
              </h2>

              <div className="flex items-center gap-2 overflow-x-auto pb-1">
                {['all', 'resume', 'menu', 'event', 'file', 'profile', 'app'].map((t) => (
                  <button
                    key={t}
                    onClick={() => setFilterType(t)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-medium capitalize whitespace-nowrap transition ${
                      filterType === t
                        ? 'bg-brand-500 text-white'
                        : 'bg-gray-100 dark:bg-gray-900 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            <div className="border border-gray-200 dark:border-gray-800 rounded-2xl overflow-hidden bg-white dark:bg-gray-950 shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900/50 text-[11px] font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      <th className="py-3.5 px-4">QR Name & Type</th>
                      <th className="py-3.5 px-4">Dynamic Route</th>
                      <th className="py-3.5 px-4">Status</th>
                      <th className="py-3.5 px-4">Scans</th>
                      <th className="py-3.5 px-4">Created Date</th>
                      <th className="py-3.5 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 dark:divide-gray-800 text-xs">
                    {filteredQRs.map((qr) => (
                      <tr key={qr.id} className="hover:bg-gray-50 dark:hover:bg-gray-900/40 transition">
                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-xl bg-brand-500/10 border border-brand-500/20 text-brand-500 flex items-center justify-center font-bold text-xs shrink-0">
                              {qr.type.substring(0, 2).toUpperCase()}
                            </div>
                            <div>
                              <p className="font-semibold text-gray-900 dark:text-white text-sm">{qr.name}</p>
                              <p className="text-[11px] text-gray-500 capitalize">
                                {qr.mode} • {qr.type} QR
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="py-3.5 px-4 font-mono text-gray-500 dark:text-gray-400">
                          {qr.mode === 'dynamic' ? (
                            <Link href={`/x/${qr.slug}`} target="_blank" className="hover:text-brand-400 underline flex items-center gap-1">
                              /x/{qr.slug} <ExternalLink className="w-3 h-3" />
                            </Link>
                          ) : (
                            <span className="text-gray-400 font-sans italic">Static QR</span>
                          )}
                        </td>
                        <td className="py-3.5 px-4">
                          <button
                            onClick={() => toggleQRStatus(qr.id)}
                            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold transition ${
                              qr.status === 'active'
                                ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20'
                                : 'bg-rose-500/10 text-rose-500 border border-rose-500/20'
                            }`}
                          >
                            <span className={`w-1.5 h-1.5 rounded-full ${qr.status === 'active' ? 'bg-emerald-500 animate-pulse' : 'bg-rose-500'}`} />
                            {qr.status.toUpperCase()}
                          </button>
                        </td>
                        <td className="py-3.5 px-4 font-bold text-gray-900 dark:text-white">
                          {qr.scansCount.toLocaleString()}
                        </td>
                        <td className="py-3.5 px-4 text-gray-500">
                          {new Date(qr.createdAt).toLocaleDateString()}
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          <div className="inline-flex items-center gap-1">
                            <button
                              onClick={() => handleOpenPreview(qr)}
                              className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800 transition"
                              title="Preview & Export QR"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                            <Link
                              href={`/dashboard/create?edit=${qr.id}`}
                              className="p-1.5 rounded-lg text-gray-400 hover:text-brand-400 hover:bg-gray-800 transition"
                              title="Customize QR"
                            >
                              <Sliders className="w-4 h-4" />
                            </Link>
                            {qr.mode === 'dynamic' && (
                              <button
                                onClick={() => handleCopyLink(qr.slug)}
                                className="p-1.5 rounded-lg text-gray-400 hover:text-emerald-400 hover:bg-gray-800 transition"
                                title="Copy Share Link"
                              >
                                <Share2 className="w-4 h-4" />
                              </button>
                            )}
                            <button
                              onClick={() => deleteQRCode(qr.id)}
                              className="p-1.5 rounded-lg text-gray-400 hover:text-rose-400 hover:bg-gray-800 transition"
                              title="Delete QR"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* QR Preview & Quick Export Modal */}
      {previewQr && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in">
          <div className="bg-gray-900 border border-gray-800 rounded-3xl p-6 max-w-md w-full text-center space-y-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-gray-800 pb-4">
              <h3 className="font-bold text-white text-base">{previewQr.name}</h3>
              <button onClick={() => setPreviewQr(null)} className="p-1 text-gray-400 hover:text-white">✕</button>
            </div>

            <div className="p-6 bg-gray-950 border border-gray-800 rounded-2xl flex items-center justify-center min-h-[260px]">
              {previewSvg && (
                <div className="w-60 h-68" dangerouslySetInnerHTML={{ __html: previewSvg }} />
              )}
            </div>

            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => downloadSVG(previewSvg, `${previewQr.slug}.svg`)}
                className="py-2.5 px-4 rounded-xl bg-gray-800 hover:bg-gray-700 text-xs font-bold text-white border border-gray-700 transition"
              >
                Download SVG (Vector)
              </button>
              <button
                onClick={() => downloadRasterImage(previewSvg, 'png', `${previewQr.slug}.png`)}
                className="py-2.5 px-4 rounded-xl bg-brand-500 hover:bg-brand-600 text-xs font-bold text-white transition shadow"
              >
                Download PNG
              </button>
            </div>

            <button
              onClick={() => downloadQRPDF(previewSvg, previewQr.name, `${previewQr.slug}.pdf`)}
              className="w-full py-2.5 rounded-xl border border-gray-800 bg-gray-950 hover:bg-gray-800 text-xs font-bold text-gray-300 hover:text-white transition"
            >
              Download PDF Pass
            </button>
          </div>
        </div>
      )}

      <MobileNav />
    </div>
  );
}
