'use client';

import React, { useState, useEffect } from 'react';
import { useApp } from '@/lib/AppContext';
import { Search, X, QrCode, FileText, LayoutTemplate, User, ArrowRight } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { QR_TEMPLATES } from '@/lib/store';

export function GlobalSearchModal() {
  const { searchOpen, setSearchOpen, qrCodes, files, profile } = useApp();
  const [query, setQuery] = useState('');
  const router = useRouter();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setSearchOpen(true);
      }
      if (e.key === 'Escape' && searchOpen) {
        setSearchOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [searchOpen, setSearchOpen]);

  if (!searchOpen) return null;

  const q = query.toLowerCase().trim();

  const matchedQRs = q
    ? qrCodes.filter((qr) => qr.name.toLowerCase().includes(q) || qr.type.toLowerCase().includes(q) || qr.slug.toLowerCase().includes(q))
    : [];

  const matchedFiles = q
    ? files.filter((f) => f.name.toLowerCase().includes(q) || f.type.toLowerCase().includes(q))
    : [];

  const profileMatch = q && (profile.name.toLowerCase().includes(q) || profile.title.toLowerCase().includes(q) || 'profile'.includes(q)) ? profile : null;

  const totalResults = matchedQRs.length + matchedFiles.length + (profileMatch ? 1 : 0);

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-gray-900 border border-gray-800 rounded-2xl shadow-2xl max-w-2xl w-full overflow-hidden text-gray-100">
        {/* Search Header Input */}
        <div className="flex items-center px-4 py-3.5 border-b border-gray-800 gap-3">
          <Search className="w-5 h-5 text-gray-400 shrink-0" />
          <input
            type="text"
            placeholder="Search QR codes, files, profiles... (e.g. 'resume', 'menu')"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full bg-transparent border-none text-white text-base focus:outline-none placeholder-gray-500"
            autoFocus
          />
          <button
            onClick={() => setSearchOpen(false)}
            className="p-1.5 rounded-lg bg-gray-800 text-gray-400 hover:text-white transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Results Container */}
        <div className="p-4 max-h-[60vh] overflow-y-auto space-y-4">
          {!q && (
            <div className="text-center py-8 text-gray-500">
              <Search className="w-10 h-10 mx-auto mb-2 opacity-40" />
              <p className="text-sm">Type a search term to find Qrixeva resources.</p>
              <p className="text-xs text-gray-600 mt-1">Try "resume", "menu", "pdf", or "template"</p>
            </div>
          )}

          {q && totalResults === 0 && (
            <div className="text-center py-8 text-gray-400">
              <p className="text-base font-medium">No results matching "{query}"</p>
              <p className="text-sm text-gray-500 mt-1">Try refining your keyword.</p>
            </div>
          )}

          {/* Matched QRs */}
          {matchedQRs.length > 0 && (
            <div>
              <h4 className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2 px-2 flex items-center gap-2">
                <QrCode className="w-3.5 h-3.5 text-brand-400" />
                QR Codes ({matchedQRs.length})
              </h4>
              <div className="space-y-1">
                {matchedQRs.map((qr) => (
                  <button
                    key={qr.id}
                    onClick={() => {
                      setSearchOpen(false);
                      router.push('/dashboard/my-qrs');
                    }}
                    className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-gray-800/70 transition text-left group"
                  >
                    <div>
                      <p className="font-semibold text-white group-hover:text-brand-400 transition">{qr.name}</p>
                      <p className="text-xs text-gray-400">Type: {qr.type.toUpperCase()} • {qr.scansCount} scans • /{qr.slug}</p>
                    </div>
                    <ArrowRight className="w-4 h-4 text-gray-500 group-hover:text-white transition" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Matched Files */}
          {matchedFiles.length > 0 && (
            <div>
              <h4 className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2 px-2 flex items-center gap-2">
                <FileText className="w-3.5 h-3.5 text-indigo-400" />
                Stored Files ({matchedFiles.length})
              </h4>
              <div className="space-y-1">
                {matchedFiles.map((file) => (
                  <button
                    key={file.id}
                    onClick={() => {
                      setSearchOpen(false);
                      router.push('/dashboard/files');
                    }}
                    className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-gray-800/70 transition text-left group"
                  >
                    <div>
                      <p className="font-semibold text-white group-hover:text-indigo-400 transition">{file.name}</p>
                      <p className="text-xs text-gray-400">{(file.size / 1024 / 1024).toFixed(2)} MB • {file.downloads} downloads</p>
                    </div>
                    <ArrowRight className="w-4 h-4 text-gray-500 group-hover:text-white transition" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Matched Templates */}


          {/* Matched Profile */}
          {profileMatch && (
            <div>
              <h4 className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2 px-2 flex items-center gap-2">
                <User className="w-3.5 h-3.5 text-emerald-400" />
                Digital Profile
              </h4>
              <button
                onClick={() => {
                  setSearchOpen(false);
                  router.push('/dashboard/profile');
                }}
                className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-gray-800/70 transition text-left group"
              >
                <div>
                  <p className="font-semibold text-white group-hover:text-emerald-400 transition">{profileMatch.name}</p>
                  <p className="text-xs text-gray-400">{profileMatch.title}</p>
                </div>
                <ArrowRight className="w-4 h-4 text-gray-500 group-hover:text-white transition" />
              </button>
            </div>
          )}
        </div>

        {/* Footer shortcuts */}
        <div className="px-4 py-2.5 bg-gray-950 border-t border-gray-800 flex items-center justify-between text-xs text-gray-500">
          <span>Navigate with mouse or arrow keys</span>
          <span>Press <kbd className="px-1.5 py-0.5 bg-gray-800 border border-gray-700 rounded text-gray-300">ESC</kbd> to close</span>
        </div>
      </div>
    </div>
  );
}
