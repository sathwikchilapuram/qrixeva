'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { useApp } from '@/lib/AppContext';
import { detectDeviceOS } from '@/lib/device-detector';
import { downloadVCard } from '@/lib/vcard-generator';
import { Logo } from '@/components/branding/Logo';
import {
  Lock,
  AlertTriangle,
  FileText,
  Download,
  Utensils,
  Zap,
  User,
  ShieldCheck,
  Globe,
  ExternalLink,
  Phone,
  Mail,
  MapPin,
  Image as ImageIcon,
  Music,
  Video as VideoIcon,
  Sparkles,
  Copy,
} from 'lucide-react';

export default function PublicQRExperiencePage() {
  const params = useParams();
  const slug = (params.slug as string) || '';

  const { qrCodes, recordScan, addToast } = useApp();

  const qrItem = qrCodes.find((q) => q.slug === slug || q.id === slug);

  const [passwordInput, setPasswordInput] = useState('');
  const [unlocked, setUnlocked] = useState(false);
  const [passwordError, setPasswordError] = useState(false);

  useEffect(() => {
    if (qrItem && qrItem.status === 'active') {
      const ua = typeof window !== 'undefined' ? navigator.userAgent : '';
      const { device, browser, os } = detectDeviceOS(ua);
      recordScan(qrItem.id, device, browser, os, 'San Francisco, US', document.referrer || 'Direct Scan');

      if (qrItem.accessControl === 'public' || !qrItem.password) {
        setUnlocked(true);
      }
    }
  }, [qrItem]);

  if (!qrItem) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-gray-950 text-white">
        <div className="text-center space-y-4 max-w-md">
          <Logo size="lg" className="justify-center" />
          <h1 className="text-2xl font-bold">QR Code Not Found</h1>
          <p className="text-sm text-gray-400">The scanned dynamic QR route "/x/{slug}" does not exist or has been deleted.</p>
        </div>
      </div>
    );
  }

  if (qrItem.status === 'disabled') {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-gray-950 text-white">
        <div className="text-center space-y-4 max-w-md p-8 rounded-3xl bg-gray-900 border border-gray-800 shadow-2xl">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-500 flex items-center justify-center mx-auto">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <h1 className="text-xl font-bold">QR Code Temporarily Disabled</h1>
          <p className="text-sm text-gray-400">This dynamic QR code has been temporarily paused by its owner.</p>
        </div>
      </div>
    );
  }

  if (qrItem.expiresAt && new Date(qrItem.expiresAt) < new Date()) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-gray-950 text-white">
        <div className="text-center space-y-4 max-w-md p-8 rounded-3xl bg-gray-900 border border-gray-800 shadow-2xl">
          <div className="w-12 h-12 rounded-2xl bg-rose-500/10 text-rose-500 flex items-center justify-center mx-auto">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <h1 className="text-xl font-bold">QR Code Expired</h1>
          <p className="text-sm text-gray-400">This QR access code expired on {new Date(qrItem.expiresAt).toLocaleDateString()}.</p>
        </div>
      </div>
    );
  }

  if (!unlocked) {
    const handleUnlock = (e: React.FormEvent) => {
      e.preventDefault();
      if (passwordInput === qrItem.password) {
        setUnlocked(true);
        setPasswordError(false);
      } else {
        setPasswordError(true);
      }
    };

    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-gray-950 text-white">
        <div className="w-full max-w-md p-8 rounded-3xl bg-gray-900 border border-gray-800 shadow-2xl space-y-6 text-center">
          <div className="w-12 h-12 rounded-2xl bg-purple-500/10 text-purple-400 flex items-center justify-center mx-auto">
            <Lock className="w-6 h-6" />
          </div>
          <h1 className="text-xl font-bold">Protected Access</h1>
          <form onSubmit={handleUnlock} className="space-y-4">
            <input
              type="password"
              value={passwordInput}
              onChange={(e) => setPasswordInput(e.target.value)}
              placeholder="Enter Access Password"
              className="w-full px-4 py-3 rounded-2xl bg-gray-950 border border-gray-800 text-sm text-center focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            {passwordError && <p className="text-xs text-rose-400">Incorrect password.</p>}
            <button
              type="submit"
              className="w-full py-3.5 rounded-2xl bg-purple-600 font-bold text-sm"
            >
              Unlock Access
            </button>
          </form>
        </div>
      </div>
    );
  }

  const content = qrItem.content || {};

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 flex flex-col items-center justify-start p-4 sm:p-6 select-none">
      <div className="w-full max-w-md space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between py-2 border-b border-gray-900">
          <Logo size="sm" />
          <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded bg-gray-900 text-brand-400">
            {qrItem.type.toUpperCase()} MODULE
          </span>
        </div>

        {/* 1. IMAGE SHOWCASE */}
        {qrItem.type === 'image' && (
          <div className="p-6 rounded-3xl bg-gray-900 border border-gray-800 shadow-2xl space-y-4 text-center">
            <div className="w-12 h-12 rounded-2xl bg-rose-500/10 text-rose-400 flex items-center justify-center mx-auto">
              <ImageIcon className="w-6 h-6" />
            </div>
            <h1 className="text-xl font-extrabold text-white">{content.title || qrItem.name}</h1>
            <p className="text-xs text-gray-400">{content.caption}</p>

            <div className="rounded-2xl overflow-hidden border border-gray-800 shadow-xl">
              <img
                src={content.imageUrl || 'https://images.unsplash.com/photo-1506146332389-18140dc7b2fb'}
                alt={content.title || 'Image'}
                className="w-full h-64 object-cover"
              />
            </div>

            <a
              href={content.imageUrl}
              target="_blank"
              download
              className="w-full py-3 rounded-2xl bg-rose-600 hover:bg-rose-500 font-bold text-xs transition flex items-center justify-center gap-2"
            >
              <Download className="w-4 h-4" /> Download Full Resolution Image
            </a>
          </div>
        )}

        {/* 2. AUDIO PLAYER */}
        {qrItem.type === 'audio' && (
          <div className="p-6 rounded-3xl bg-gray-900 border border-gray-800 shadow-2xl space-y-6 text-center">
            <div className="space-y-3">
              <img
                src={content.coverArtUrl || 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4'}
                alt="Cover"
                className="w-40 h-40 rounded-2xl mx-auto object-cover border border-gray-800 shadow-2xl"
              />
              <h1 className="text-xl font-extrabold text-white">{content.title || qrItem.name}</h1>
              <p className="text-xs font-semibold text-cyan-400">{content.artist || 'Unknown Artist'}</p>
            </div>

            <div className="p-4 rounded-2xl bg-gray-950 border border-gray-800">
              <audio controls className="w-full">
                <source src={content.audioUrl} type="audio/mpeg" />
                Your browser does not support the audio element.
              </audio>
            </div>
          </div>
        )}

        {/* 3. VIDEO PLAYER */}
        {qrItem.type === 'video' && (
          <div className="p-6 rounded-3xl bg-gray-900 border border-gray-800 shadow-2xl space-y-4 text-center">
            <div className="w-12 h-12 rounded-2xl bg-purple-500/10 text-purple-400 flex items-center justify-center mx-auto">
              <VideoIcon className="w-6 h-6" />
            </div>
            <h1 className="text-xl font-extrabold text-white">{content.title || qrItem.name}</h1>
            <p className="text-xs text-gray-400">{content.description}</p>

            <div className="rounded-2xl overflow-hidden border border-gray-800 shadow-xl bg-black">
              <video controls poster={content.posterUrl} className="w-full h-56 object-cover">
                <source src={content.videoUrl} type="video/mp4" />
              </video>
            </div>
          </div>
        )}

        {/* 4. CUSTOM EXPERIENCE */}
        {qrItem.type === 'custom' && (
          <div className="p-6 rounded-3xl bg-gradient-to-b from-gray-900 via-gray-900 to-gray-950 border border-emerald-500/30 shadow-2xl space-y-6 text-center relative">
            <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-[10px] font-extrabold uppercase tracking-widest border border-emerald-500/20">
              {content.badgeText || 'VIP CUSTOM EXPERIENCE'}
            </span>

            <div className="space-y-2">
              <h1 className="text-2xl font-extrabold text-white">{content.headline || 'Exclusive Founder Access'}</h1>
              <p className="text-xs text-gray-300 leading-relaxed p-4 rounded-2xl bg-gray-950/80 border border-gray-800">
                {content.bodyText || 'Welcome to this custom dynamic QR experience.'}
              </p>
            </div>

            {content.ctaText && (
              <a
                href={content.ctaUrl || '#'}
                target="_blank"
                rel="noreferrer"
                className="w-full py-3.5 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs transition shadow-lg shadow-emerald-500/30 flex items-center justify-center gap-2"
              >
                <Sparkles className="w-4 h-4" /> {content.ctaText}
              </a>
            )}
          </div>
        )}

        {/* 5. CONTACT VCARD */}
        {qrItem.type === 'contact' && (
          <div className="p-6 rounded-3xl bg-gray-900 border border-gray-800 shadow-2xl space-y-6 text-center">
            <div className="space-y-3">
              <div className="w-20 h-20 rounded-full mx-auto bg-brand-500/20 text-brand-400 flex items-center justify-center font-bold text-2xl border-2 border-brand-500">
                {(content.name || 'A')[0]}
              </div>
              <h1 className="text-2xl font-extrabold text-white">{content.name || 'Alex Rivera'}</h1>
              <p className="text-xs font-semibold text-brand-400">{content.title || 'Lead Architect'}</p>
            </div>

            <button
              onClick={() => {
                downloadVCard(content);
                addToast('success', 'vCard contact file generated!');
              }}
              className="w-full py-3.5 rounded-2xl bg-brand-500 hover:bg-brand-600 text-white font-bold text-xs transition shadow-lg shadow-brand-500/30 flex items-center justify-center gap-2"
            >
              <User className="w-4 h-4" /> Save Contact to Phone Address Book (.vcf)
            </button>
          </div>
        )}

        {/* 6. PLAIN TEXT */}
        {qrItem.type === 'text' && (
          <div className="p-6 rounded-3xl bg-gray-900 border border-gray-800 shadow-2xl space-y-6">
            <h1 className="text-lg font-bold text-white text-center">{qrItem.name}</h1>
            <div className="p-4 rounded-2xl bg-gray-950 border border-gray-800 text-xs font-mono text-gray-300">
              {content.text || 'No text payload.'}
            </div>
          </div>
        )}

        {/* DEFAULT / OTHER */}
        {(qrItem.type === 'file' || qrItem.type === 'pdf' || qrItem.type === 'url' || qrItem.type === 'app') && (
          <div className="p-6 rounded-3xl bg-gray-900 border border-gray-800 shadow-2xl space-y-6 text-center">
            <h1 className="text-xl font-bold text-white">{qrItem.name}</h1>
            {content.storageUrl && (
              <a
                href={content.storageUrl}
                target="_blank"
                rel="noreferrer"
                className="w-full py-3.5 rounded-2xl bg-brand-500 hover:bg-brand-600 text-white font-bold text-xs transition flex items-center justify-center gap-2"
              >
                <Download className="w-4 h-4" /> Download File Payload
              </a>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
