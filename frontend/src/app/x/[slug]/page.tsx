'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import { useApp } from '@/lib/AppContext';
import { detectDeviceOS } from '@/lib/device-detector';
import { downloadVCard } from '@/lib/vcard-generator';
import { decodeQRFallback } from '@/lib/qr-payload-encoder';
import { Logo } from '@/components/branding/Logo';
import { QRCodeItem } from '@/types';
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
  Briefcase,
  CreditCard,
  Sparkles,
  Copy,
  Check,
} from 'lucide-react';

function PublicQRExperienceContent() {
  const params = useParams();
  const searchParams = useSearchParams();

  const slug = (params.slug as string) || '';
  const fallbackParam = searchParams.get('d') || '';

  const { qrCodes, recordScan, addToast } = useApp();

  const [fetchedQr, setFetchedQr] = useState<QRCodeItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [passwordInput, setPasswordInput] = useState('');
  const [unlocked, setUnlocked] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const [copiedText, setCopiedText] = useState(false);

  useEffect(() => {
    // 1. Try local match from context first
    const localMatch = qrCodes.find((q) => q.slug === slug || q.id === slug);
    if (localMatch) {
      setFetchedQr(localMatch);
      setLoading(false);
      return;
    }

    // 2. Fetch from backend API /api/q/[slug]
    fetch(`/api/q/${slug}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.data) {
          setFetchedQr(data.data);
        } else if (fallbackParam) {
          const decoded = decodeQRFallback(fallbackParam);
          if (decoded) setFetchedQr(decoded);
        }
      })
      .catch(() => {
        if (fallbackParam) {
          const decoded = decodeQRFallback(fallbackParam);
          if (decoded) setFetchedQr(decoded);
        }
      })
      .finally(() => setLoading(false));
  }, [slug, qrCodes, fallbackParam]);

  useEffect(() => {
    if (fetchedQr && fetchedQr.status === 'active') {
      const ua = typeof window !== 'undefined' ? navigator.userAgent : '';
      const { device, browser, os } = detectDeviceOS(ua);
      recordScan(fetchedQr.id, device, browser, os, 'San Francisco, US', document.referrer || 'Direct Scan');

      if (fetchedQr.accessControl === 'public' || !fetchedQr.password) {
        setUnlocked(true);
      }
    }
  }, [fetchedQr]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-gray-950 text-white">
        <div className="text-center space-y-4 max-w-md">
          <Logo size="lg" variant="light" className="justify-center animate-pulse" />
          <p className="text-sm text-gray-400 font-medium">Resolving Dynamic QR Experience...</p>
        </div>
      </div>
    );
  }

  const qrItem = fetchedQr;

  if (!qrItem) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-gray-950 text-white">
        <div className="text-center space-y-4 max-w-md p-8 rounded-3xl bg-gray-900 border border-gray-800 shadow-2xl">
          <Logo size="lg" variant="light" className="justify-center mx-auto" />
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
              className="w-full py-3.5 rounded-2xl bg-purple-600 font-bold text-sm hover:bg-purple-500 transition"
            >
              Unlock Access
            </button>
          </form>
        </div>
      </div>
    );
  }

  const content = qrItem.content || {};
  const textPayload = content.text || (typeof content === 'string' ? content : '');

  const handleCopyText = () => {
    if (textPayload) {
      navigator.clipboard.writeText(textPayload);
      setCopiedText(true);
      addToast('success', 'Text copied to clipboard!');
      setTimeout(() => setCopiedText(false), 3000);
    }
  };

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

        {/* 1. PLAIN TEXT MODULE */}
        {qrItem.type === 'text' && (
          <div className="p-6 rounded-3xl bg-gray-900 border border-gray-800 shadow-2xl space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-brand-500/10 text-brand-400 flex items-center justify-center">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-white">{qrItem.name}</h1>
                <p className="text-[11px] text-gray-400">{textPayload.length} characters</p>
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-gray-950 border border-gray-800 text-sm font-mono text-gray-200 leading-relaxed whitespace-pre-wrap break-words">
              {textPayload || 'No text payload provided.'}
            </div>

            <button
              onClick={handleCopyText}
              className="w-full py-3 rounded-2xl bg-brand-500 hover:bg-brand-600 text-white font-bold text-xs transition flex items-center justify-center gap-2 shadow-lg shadow-brand-500/20"
            >
              {copiedText ? (
                <>
                  <Check className="w-4 h-4" /> Copied to Clipboard
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" /> Copy Plain Text to Clipboard
                </>
              )}
            </button>
          </div>
        )}

        {/* 2. IMAGE SHOWCASE */}
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

        {/* 3. AUDIO PLAYER */}
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

        {/* 4. VIDEO PLAYER */}
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

        {/* 5. CUSTOM EXPERIENCE */}
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

        {/* 6. CONTACT VCARD */}
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

        {/* 7. DIGITAL PROFILE */}
        {qrItem.type === 'profile' && (
          <div className="p-6 rounded-3xl bg-gray-900 border border-gray-800 shadow-2xl space-y-6 text-center">
            <div className="space-y-3">
              {content.imageUrl ? (
                <img src={content.imageUrl} alt={content.name} className="w-24 h-24 rounded-full mx-auto object-cover border-4 border-brand-500 shadow-xl" />
              ) : (
                <div className="w-24 h-24 rounded-full mx-auto bg-brand-500/20 text-brand-400 flex items-center justify-center font-bold text-3xl border-2 border-brand-500 shadow-xl">
                  {(content.name || 'P')[0]}
                </div>
              )}
              <h1 className="text-2xl font-extrabold text-white">{content.name || 'Digital Profile'}</h1>
              <p className="text-xs font-semibold text-brand-400">{content.professionalTitle || content.headline || 'Professional Profile'}</p>
              {content.bio && <p className="text-xs text-gray-300 leading-relaxed max-w-sm mx-auto p-4 rounded-2xl bg-gray-950/80 border border-gray-800">{content.bio}</p>}
            </div>

            <div className="space-y-2.5 pt-2">
              {content.phone && (
                <a href={`tel:${content.phone}`} className="w-full py-3 rounded-2xl bg-gray-950 border border-gray-800 hover:border-gray-700 text-gray-200 text-xs font-semibold flex items-center justify-center gap-2">
                  <Phone className="w-4 h-4 text-emerald-400" /> Call {content.phone}
                </a>
              )}
              {content.email && (
                <a href={`mailto:${content.email}`} className="w-full py-3 rounded-2xl bg-gray-950 border border-gray-800 hover:border-gray-700 text-gray-200 text-xs font-semibold flex items-center justify-center gap-2">
                  <Mail className="w-4 h-4 text-blue-400" /> Email {content.email}
                </a>
              )}
              {content.website && (
                <a href={content.website} target="_blank" rel="noreferrer" className="w-full py-3 rounded-2xl bg-brand-500 hover:bg-brand-600 text-white font-bold text-xs flex items-center justify-center gap-2">
                  <Globe className="w-4 h-4" /> Visit Website / Portfolio
                </a>
              )}
            </div>
          </div>
        )}

        {/* 8. PROFESSIONAL RESUME */}
        {qrItem.type === 'resume' && (
          <div className="p-6 rounded-3xl bg-gray-900 border border-gray-800 shadow-2xl space-y-6">
            <div className="text-center space-y-2 pb-4 border-b border-gray-800">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center mx-auto">
                <Briefcase className="w-6 h-6" />
              </div>
              <h1 className="text-2xl font-extrabold text-white">{content.name || 'Professional Resume'}</h1>
              <p className="text-xs font-semibold text-emerald-400">{content.professionalTitle || 'Executive Professional'}</p>
              {content.about && <p className="text-xs text-gray-300 leading-relaxed pt-2">{content.about}</p>}
            </div>

            {content.skills && (
              <div className="space-y-2">
                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Key Skills & Core Competencies</h3>
                <div className="flex flex-wrap gap-2">
                  {content.skills.split(',').map((skill: string, idx: number) => (
                    <span key={idx} className="px-3 py-1 rounded-xl bg-gray-950 border border-gray-800 text-[11px] font-semibold text-emerald-400">
                      {skill.trim()}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {content.experience && (
              <div className="space-y-1">
                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Experience</h3>
                <p className="text-xs text-gray-300 bg-gray-950 p-3 rounded-xl border border-gray-800">{content.experience}</p>
              </div>
            )}

            {content.education && (
              <div className="space-y-1">
                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Education</h3>
                <p className="text-xs text-gray-300 bg-gray-950 p-3 rounded-xl border border-gray-800">{content.education}</p>
              </div>
            )}

            {(content.pdfUrl || content.url || content.storageUrl) && (
              <a
                href={content.pdfUrl || content.url || content.storageUrl}
                target="_blank"
                rel="noreferrer"
                download
                className="w-full py-3.5 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs transition flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20"
              >
                <Download className="w-4 h-4" /> Download Complete Resume (PDF)
              </a>
            )}
          </div>
        )}

        {/* 9. DIGITAL ID BADGE */}
        {qrItem.type === 'idcard' && (
          <div className="p-6 rounded-3xl bg-gradient-to-b from-gray-900 via-gray-900 to-gray-950 border-2 border-indigo-500/40 shadow-2xl space-y-6 text-center relative overflow-hidden">
            <div className="absolute top-0 right-0 px-4 py-1.5 rounded-bl-2xl bg-indigo-500 text-white text-[10px] font-black uppercase tracking-widest">
              OFFICIAL VERIFIED BADGE
            </div>

            <div className="pt-2 space-y-3">
              {content.imageUrl ? (
                <img src={content.imageUrl} alt={content.name} className="w-24 h-24 rounded-2xl mx-auto object-cover border-2 border-indigo-400 shadow-2xl" />
              ) : (
                <div className="w-24 h-24 rounded-2xl mx-auto bg-indigo-500/20 text-indigo-400 flex items-center justify-center font-bold text-3xl border-2 border-indigo-500 shadow-2xl">
                  <ShieldCheck className="w-10 h-10" />
                </div>
              )}
              <h1 className="text-2xl font-extrabold text-white">{content.name || 'Employee ID'}</h1>
              <p className="text-xs font-semibold text-indigo-400 uppercase tracking-wider">{content.organization || 'Organization'}</p>
            </div>

            <div className="grid grid-cols-2 gap-3 text-left p-4 rounded-2xl bg-gray-950 border border-gray-800">
              <div>
                <span className="text-[10px] font-bold text-gray-500 uppercase block">Badge ID</span>
                <span className="text-xs font-bold text-white font-mono">{content.idNumber || 'ID-0000'}</span>
              </div>
              <div>
                <span className="text-[10px] font-bold text-gray-500 uppercase block">Role / Title</span>
                <span className="text-xs font-bold text-white">{content.role || content.jobTitle || 'Member'}</span>
              </div>
              {content.department && (
                <div>
                  <span className="text-[10px] font-bold text-gray-500 uppercase block">Department</span>
                  <span className="text-xs font-bold text-white">{content.department}</span>
                </div>
              )}
              {content.expiresAt && (
                <div>
                  <span className="text-[10px] font-bold text-gray-500 uppercase block">Valid Until</span>
                  <span className="text-xs font-bold text-emerald-400">{new Date(content.expiresAt).toLocaleDateString()}</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* 10. PDF / FILE SHOWCASE */}
        {(qrItem.type === 'file' || qrItem.type === 'pdf') && (
          <div className="p-6 rounded-3xl bg-gray-900 border border-gray-800 shadow-2xl space-y-6 text-center">
            <div className="w-16 h-16 rounded-3xl bg-brand-500/10 text-brand-400 flex items-center justify-center mx-auto">
              <FileText className="w-8 h-8" />
            </div>
            <div className="space-y-1">
              <h1 className="text-xl font-extrabold text-white">{content.name || qrItem.name}</h1>
              <p className="text-xs text-gray-400">PDF Document / File</p>
            </div>

            {/* Embedded PDF Viewer */}
            {(content.url || content.storageUrl || content.fileUrl || content.pdfUrl) && (
              <div className="rounded-2xl overflow-hidden border border-gray-800 bg-gray-950 shadow-inner">
                <iframe
                  src={content.url || content.storageUrl || content.fileUrl || content.pdfUrl}
                  className="w-full h-80 sm:h-96 rounded-2xl"
                  title={content.name || 'PDF Document'}
                />
              </div>
            )}

            <div className="space-y-3">
              <a
                href={content.url || content.storageUrl || content.fileUrl || content.pdfUrl}
                target="_blank"
                rel="noreferrer"
                className="w-full py-3.5 rounded-2xl bg-brand-500 hover:bg-brand-600 text-white font-bold text-sm transition flex items-center justify-center gap-2 shadow-xl shadow-brand-500/25"
              >
                <ExternalLink className="w-4 h-4" /> Open / View PDF in Fullscreen
              </a>

              <a
                href={content.url || content.storageUrl || content.fileUrl || content.pdfUrl}
                target="_blank"
                rel="noreferrer"
                download
                className="w-full py-3 rounded-2xl bg-gray-950 hover:bg-gray-800 border border-gray-800 text-gray-300 font-semibold text-xs transition flex items-center justify-center gap-2"
              >
                <Download className="w-4 h-4" /> Download PDF File
              </a>
            </div>
          </div>
        )}

        {/* 11. PAYMENT / UPI */}
        {(qrItem.type === 'payment' || qrItem.type === 'upi' || content.upiId) && (
          <div className="p-6 rounded-3xl bg-gradient-to-b from-gray-900 to-gray-950 border border-emerald-500/30 shadow-2xl space-y-6 text-center">
            <div className="w-16 h-16 rounded-3xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center mx-auto border border-emerald-500/20">
              <CreditCard className="w-8 h-8" />
            </div>
            <div className="space-y-2">
              <h1 className="text-2xl font-extrabold text-white">{content.upiName || 'UPI Payment'}</h1>
              <p className="text-xs font-mono text-emerald-400 bg-emerald-500/10 py-1 px-3 rounded-full inline-block border border-emerald-500/20">
                {content.upiId || 'merchant@upi'}
              </p>
              {content.upiAmount && (
                <div className="text-3xl font-black text-white pt-2">
                  ₹{content.upiAmount}
                </div>
              )}
              {content.upiNote && (
                <p className="text-xs text-gray-400">Note: {content.upiNote}</p>
              )}
            </div>

            <a
              href={`upi://pay?pa=${content.upiId || 'merchant@upi'}&pn=${encodeURIComponent(content.upiName || 'Payee')}${content.upiAmount ? `&am=${content.upiAmount}` : ''}&tn=${encodeURIComponent(content.upiNote || 'Payment')}&cu=INR`}
              className="w-full py-4 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-white font-extrabold text-sm transition flex items-center justify-center gap-2 shadow-xl shadow-emerald-500/30"
            >
              <Zap className="w-5 h-5" /> Pay Now via UPI App
            </a>
          </div>
        )}

        {/* 12. RESTAURANT MENU */}
        {qrItem.type === 'menu' && (
          <div className="p-6 rounded-3xl bg-gray-900 border border-gray-800 shadow-2xl space-y-6 text-center">
            <div className="w-16 h-16 rounded-3xl bg-amber-500/10 text-amber-400 flex items-center justify-center mx-auto border border-amber-500/20">
              <Utensils className="w-8 h-8" />
            </div>
            <div className="space-y-2">
              <h1 className="text-2xl font-extrabold text-white">{content.name || 'Restaurant Menu'}</h1>
              <p className="text-xs font-semibold text-amber-400">{content.professionalTitle || 'Food & Drink Menu'}</p>
              {content.about && (
                <p className="text-xs text-gray-300 leading-relaxed max-w-sm mx-auto p-4 rounded-2xl bg-gray-950/80 border border-gray-800">{content.about}</p>
              )}
            </div>

            {(content.pdfUrl || content.url || content.storageUrl) && (
              <a
                href={content.pdfUrl || content.url || content.storageUrl}
                target="_blank"
                rel="noreferrer"
                download
                className="w-full py-4 rounded-2xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-sm transition flex items-center justify-center gap-2 shadow-xl shadow-amber-500/25"
              >
                <Download className="w-5 h-5" /> View / Download Digital Menu
              </a>
            )}
          </div>
        )}

        {/* 13. EVENT PASS */}
        {qrItem.type === 'event' && (
          <div className="p-6 rounded-3xl bg-gray-900 border border-gray-800 shadow-2xl space-y-6 text-center">
            <div className="w-16 h-16 rounded-3xl bg-purple-500/10 text-purple-400 flex items-center justify-center mx-auto border border-purple-500/20">
              <Zap className="w-8 h-8" />
            </div>
            <div className="space-y-2">
              <h1 className="text-2xl font-extrabold text-white">{content.title || qrItem.name}</h1>
              {content.name && <p className="text-xs font-semibold text-purple-400">Organized by {content.name}</p>}
              {content.headline && (
                <div className="inline-block px-4 py-1.5 rounded-full bg-purple-500/10 text-purple-300 text-xs font-bold border border-purple-500/20">
                  📅 {content.headline}
                </div>
              )}
              {content.address && (
                <p className="text-xs text-gray-300 flex items-center justify-center gap-1">
                  <MapPin className="w-4 h-4 text-rose-400" /> {content.address}
                </p>
              )}
              {content.bodyText && (
                <p className="text-xs text-gray-300 leading-relaxed p-4 rounded-2xl bg-gray-950/80 border border-gray-800">{content.bodyText}</p>
              )}
            </div>

            {content.url && (
              <a
                href={content.url}
                target="_blank"
                rel="noreferrer"
                className="w-full py-4 rounded-2xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-sm transition flex items-center justify-center gap-2 shadow-xl shadow-purple-500/25"
              >
                <Globe className="w-5 h-5" /> Get Event Passes / Tickets
              </a>
            )}
          </div>
        )}

        {/* 14. LOCATION MAP */}
        {qrItem.type === 'location' && (
          <div className="p-6 rounded-3xl bg-gray-900 border border-gray-800 shadow-2xl space-y-6 text-center">
            <div className="w-16 h-16 rounded-3xl bg-rose-500/10 text-rose-400 flex items-center justify-center mx-auto border border-rose-500/20">
              <MapPin className="w-8 h-8" />
            </div>
            <div className="space-y-2">
              <h1 className="text-2xl font-extrabold text-white">{content.title || 'Target Location'}</h1>
              <p className="text-xs text-gray-400">Open exact coordinates in Google Maps</p>
            </div>

            {content.url && (
              <a
                href={content.url.startsWith('http') ? content.url : `https://maps.google.com/?q=${encodeURIComponent(content.url)}`}
                target="_blank"
                rel="noreferrer"
                className="w-full py-4 rounded-2xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-sm transition flex items-center justify-center gap-2 shadow-xl shadow-rose-500/25"
              >
                <MapPin className="w-5 h-5" /> Open in Google Maps <ExternalLink className="w-4 h-4" />
              </a>
            )}
          </div>
        )}

        {/* DEFAULT / OTHER FALLBACK */}
        {qrItem.type !== 'text' &&
          qrItem.type !== 'image' &&
          qrItem.type !== 'audio' &&
          qrItem.type !== 'video' &&
          qrItem.type !== 'custom' &&
          qrItem.type !== 'contact' &&
          qrItem.type !== 'profile' &&
          qrItem.type !== 'resume' &&
          qrItem.type !== 'idcard' &&
          qrItem.type !== 'file' &&
          qrItem.type !== 'pdf' &&
          qrItem.type !== 'payment' &&
          qrItem.type !== 'upi' &&
          qrItem.type !== 'menu' &&
          qrItem.type !== 'event' &&
          qrItem.type !== 'location' && (
            <div className="p-6 rounded-3xl bg-gray-900 border border-gray-800 shadow-2xl space-y-6 text-center">
              <h1 className="text-xl font-bold text-white">{qrItem.name}</h1>
              {content.url ? (
                <a
                  href={content.url}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full py-3.5 rounded-2xl bg-brand-500 hover:bg-brand-600 text-white font-bold text-xs transition flex items-center justify-center gap-2"
                >
                  <Globe className="w-4 h-4" /> Open Link <ExternalLink className="w-3.5 h-3.5" />
                </a>
              ) : content.storageUrl ? (
                <a
                  href={content.storageUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full py-3.5 rounded-2xl bg-brand-500 hover:bg-brand-600 text-white font-bold text-xs transition flex items-center justify-center gap-2"
                >
                  <Download className="w-4 h-4" /> Download File
                </a>
              ) : (
                <p className="text-xs text-gray-400 font-mono">{JSON.stringify(content)}</p>
              )}
            </div>
          )}
      </div>
    </div>
  );
}

export default function PublicQRExperiencePage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center p-4 bg-gray-950 text-white">
        <div className="text-center space-y-4 max-w-md">
          <Logo size="lg" className="justify-center animate-pulse" />
          <p className="text-sm text-gray-400">Loading Dynamic Experience...</p>
        </div>
      </div>
    }>
      <PublicQRExperienceContent />
    </Suspense>
  );
}
