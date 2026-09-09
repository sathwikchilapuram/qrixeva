'use client';

import React, { useState, useEffect } from 'react';
import { QRCustomization, QRType } from '@/types';
import { generateQRSVG, calculateScannabilityScore } from '@/lib/qr-generator';
import { downloadSVG, downloadRasterImage, downloadQRPDF } from '@/lib/export-utils';
import { DEFAULT_CUSTOMIZATION } from '@/lib/store';
import { useApp } from '@/lib/AppContext';
import { TestQRScannerModal } from './TestQRScannerModal';
import {
  Palette,
  Sliders,
  RotateCcw,
  CheckCircle,
  Smartphone,
  Zap,
  Download,
  Share2,
  Bookmark,
  AlertTriangle,
  Copy,
} from 'lucide-react';

import { encodeQRFallback } from '@/lib/qr-payload-encoder';

interface CustomizationStudioProps {
  initialType?: QRType;
  initialContent?: Record<string, any>;
  existingQrId?: string;
}

export function CustomizationStudio({
  initialType = 'url',
  initialContent = {},
  existingQrId,
}: CustomizationStudioProps) {
  const { qrCodes, addQRCode, updateQRCode, addToast } = useApp();

  const existingQr = existingQrId ? qrCodes.find((q) => q.id === existingQrId) : undefined;

  const [qrType, setQrType] = useState<QRType>(existingQr?.type || initialType);
  const [name, setName] = useState<string>(existingQr?.name || 'My Qrixeva QR');
  const [custom, setCustom] = useState<QRCustomization>(existingQr?.customization || DEFAULT_CUSTOMIZATION);
  const [contentPayload, setContentPayload] = useState<Record<string, any>>(existingQr?.content || initialContent);

  const [currentSlug] = useState<string>(
    () => existingQr?.slug || (initialType || 'qr') + '-' + Math.random().toString(36).substring(2, 8)
  );

  const [svgString, setSvgString] = useState<string>('');
  const [scannabilityScore, setScannabilityScore] = useState<number>(100);
  const [isGenerated, setIsGenerated] = useState<boolean>(false);
  const [testModalOpen, setTestModalOpen] = useState<boolean>(false);

  useEffect(() => {
    if (initialContent) {
      setContentPayload(initialContent);
    }
  }, [initialContent]);

  useEffect(() => {
    if (initialType) setQrType(initialType);
  }, [initialType]);

  const getBaseUrl = () => {
    if (typeof window !== 'undefined') {
      const host = window.location.host;
      if (host.includes('localhost') || host.includes('127.0.0.1')) {
        return 'https://qrixeva.vercel.app';
      }
      return window.location.origin;
    }
    return 'https://qrixeva.vercel.app';
  };

  const getEncodedString = () => {
    // Direct UPI Payment URI
    if (qrType === 'payment' || qrType === 'upi' || contentPayload?.upiId) {
      const upiId = (contentPayload?.upiId || 'example@upi').trim();
      const payee = encodeURIComponent((contentPayload?.upiName || 'Payee').trim());
      const amount = (contentPayload?.upiAmount || '').toString().trim();
      const note = encodeURIComponent((contentPayload?.upiNote || 'Payment').trim());
      return `upi://pay?pa=${upiId}&pn=${payee}${amount ? `&am=${amount}` : ''}&tn=${note}&cu=INR`;
    }

    // Direct vCard / Contact Card
    if (qrType === 'contact') {
      const n = contentPayload?.name || 'Contact';
      const p = contentPayload?.phone || '';
      const e = contentPayload?.email || '';
      const c = contentPayload?.company || '';
      const t = contentPayload?.jobTitle || '';
      const w = contentPayload?.website || '';
      return `BEGIN:VCARD\nVERSION:3.0\nN:${n}\nFN:${n}\nTEL:${p}\nEMAIL:${e}\nORG:${c}\nTITLE:${t}\nURL:${w}\nEND:VCARD`;
    }

    // Direct Email
    if (qrType === 'email') {
      const e = contentPayload?.email || '';
      const s = encodeURIComponent(contentPayload?.subject || '');
      const b = encodeURIComponent(contentPayload?.message || '');
      return `mailto:${e}?subject=${s}&body=${b}`;
    }

    // Direct Phone
    if (qrType === 'phone') {
      const rawPhone = (contentPayload?.phone || contentPayload?.number || '').trim();
      const phoneClean = rawPhone.replace(/[^\d+]/g, '');
      return `tel:${phoneClean || rawPhone}`;
    }

    // Direct SMS
    if (qrType === 'sms') {
      const rawPhone = (contentPayload?.smsPhone || contentPayload?.phone || '').trim();
      const phoneClean = rawPhone.replace(/[^\d+]/g, '');
      const rawMsg = (contentPayload?.smsMessage || contentPayload?.message || '').trim();
      if (rawMsg) {
        return `sms:${phoneClean || rawPhone}?body=${encodeURIComponent(rawMsg)}`;
      }
      return `sms:${phoneClean || rawPhone}`;
    }

    // Direct WhatsApp
    if (qrType === 'whatsapp') {
      const rawPhone = (contentPayload?.waPhone || contentPayload?.phone || contentPayload?.number || '').trim();
      const digitsOnly = rawPhone.replace(/\D/g, '');
      const rawMsg = (contentPayload?.waMessage || contentPayload?.message || '').trim();
      if (rawMsg) {
        return `https://wa.me/${digitsOnly}?text=${encodeURIComponent(rawMsg)}`;
      }
      return `https://wa.me/${digitsOnly}`;
    }

    // Direct Wi-Fi
    if (qrType === 'wifi') {
      const s = contentPayload?.wifiSsid || '';
      const p = contentPayload?.wifiPassword || '';
      const sec = contentPayload?.wifiSecurity || 'WPA';
      const h = contentPayload?.wifiHidden ? 'true' : 'false';
      return `WIFI:S:${s};T:${sec};P:${p};H:${h};;`;
    }

    // Direct Plain Text
    if (qrType === 'text') {
      return contentPayload?.text || 'Hello World from Qrixeva';
    }

    // Direct URL
    if (qrType === 'url' && contentPayload?.url) {
      return contentPayload.url;
    }

    // Dynamic Route for Profile, Resume, Digital ID, File, Menu, Event, Location, Image, Audio, Video, Custom
    const baseUrl = getBaseUrl();
    return `${baseUrl}/x/${currentSlug}`;
  };

  const generateCode = async () => {
    const encodedStr = getEncodedString();
    const svg = await generateQRSVG(encodedStr, custom);
    setSvgString(svg);
    const { score } = calculateScannabilityScore(encodedStr, custom);
    setScannabilityScore(score);
    setIsGenerated(true);

    // Save & sync record to AppContext and backend database immediately so dynamic QR works 100% when scanned
    const qrObj = {
      id: existingQr?.id || 'qr-' + Date.now(),
      name,
      slug: currentSlug,
      type: qrType,
      mode: 'dynamic' as const,
      status: 'active' as const,
      accessControl: 'public' as const,
      content: contentPayload,
      customization: custom,
      scansCount: existingQr?.scansCount || 0,
      createdAt: existingQr?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    if (existingQr) {
      updateQRCode(existingQr.id, qrObj);
    } else {
      addQRCode(qrObj);
    }
  };

  useEffect(() => {
    if (isGenerated) {
      generateCode();
    }
  }, [custom, name, contentPayload, qrType]);

  const handleSaveQR = () => {
    generateCode();
    addToast('success', 'QR code saved to My QR Codes!');
  };

  const handleShareLink = () => {
    const link = getEncodedString();
    navigator.clipboard.writeText(link);
    addToast('info', 'QR link copied to clipboard!');
  };

  const encodedStr = getEncodedString();

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      {/* LEFT: Customize Your QR Code Controls (7 Cols) */}
      <div className="lg:col-span-7 space-y-6">
        <div className="bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-3xl p-6 shadow-xl space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-gray-200 dark:border-gray-800">
            <h3 className="font-bold text-gray-900 dark:text-white text-base flex items-center gap-2">
              <Sliders className="w-5 h-5 text-brand-500" />
              Customize Your QR Code
            </h3>
            <button
              onClick={() => setCustom(DEFAULT_CUSTOMIZATION)}
              className="text-xs font-semibold text-gray-500 hover:text-brand-500 flex items-center gap-1 transition"
            >
              <RotateCcw className="w-3.5 h-3.5" /> Reset Styling
            </button>
          </div>

          {/* QR Code Label */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-gray-500">QR Code Label</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-800 bg-gray-50 dark:bg-gray-900 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-brand-500"
              placeholder="e.g. My QR Code"
            />
          </div>

          {/* Colors */}
          <div className="space-y-4">
            <label className="text-xs font-bold uppercase tracking-wider text-gray-500 flex items-center gap-1.5">
              <Palette className="w-4 h-4 text-brand-500" /> Colors
            </label>

            {/* Presets */}
            <div className="space-y-2">
              <span className="text-[11px] text-gray-400 font-medium">Quick Presets:</span>
              <div className="flex flex-wrap gap-2">
                {[
                  { name: 'Classic Dark', fg: '#09090b', bg: '#ffffff', grad: '#18181b' },
                  { name: 'Royal Indigo', fg: '#4f46e5', bg: '#ffffff', grad: '#6366f1' },
                  { name: 'Ocean Blue', fg: '#0284c7', bg: '#ffffff', grad: '#38bdf8' },
                  { name: 'Emerald', fg: '#059669', bg: '#ffffff', grad: '#34d399' },
                  { name: 'Sunset', fg: '#e11d48', bg: '#ffffff', grad: '#fb7185' },
                  { name: 'Amber', fg: '#d97706', bg: '#ffffff', grad: '#f59e0b' },
                  { name: 'Dark Mode', fg: '#ffffff', bg: '#09090b', grad: '#e4e4e7' },
                ].map((preset) => (
                  <button
                    key={preset.name}
                    type="button"
                    onClick={() => setCustom({
                      ...custom,
                      fgColor: preset.fg,
                      bgColor: preset.bg,
                      gradientColor: preset.grad
                    })}
                    className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900 hover:border-brand-500 transition text-xs font-semibold text-gray-700 dark:text-gray-300"
                  >
                    <span
                      className="w-4 h-4 rounded-full border border-gray-300 shadow-sm"
                      style={{ backgroundColor: preset.fg }}
                    />
                    {preset.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Custom Color Pickers */}
            <div className="grid grid-cols-2 gap-4 pt-2">
              <div className="p-3 rounded-2xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900 flex items-center justify-between">
                <span className="text-xs font-semibold text-gray-700 dark:text-gray-300">Foreground Color</span>
                <input
                  type="color"
                  value={custom.fgColor}
                  onChange={(e) => setCustom({ ...custom, fgColor: e.target.value })}
                  className="w-9 h-9 rounded-xl cursor-pointer border border-gray-300 dark:border-gray-700 bg-transparent p-0 overflow-hidden"
                />
              </div>

              <div className="p-3 rounded-2xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900 flex items-center justify-between">
                <span className="text-xs font-semibold text-gray-700 dark:text-gray-300">Background Color</span>
                <input
                  type="color"
                  value={custom.bgColor}
                  onChange={(e) => setCustom({ ...custom, bgColor: e.target.value })}
                  className="w-9 h-9 rounded-xl cursor-pointer border border-gray-300 dark:border-gray-700 bg-transparent p-0 overflow-hidden"
                />
              </div>
            </div>

            {/* Gradient Toggle */}
            <div className="p-3 rounded-2xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900 flex items-center justify-between">
              <label className="text-xs font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={custom.gradientEnabled}
                  onChange={(e) => setCustom({ ...custom, gradientEnabled: e.target.checked })}
                  className="rounded text-brand-500 focus:ring-brand-500"
                />
                Gradient Effect
              </label>

              {custom.gradientEnabled && (
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-400">Second Color:</span>
                  <input
                    type="color"
                    value={custom.gradientColor}
                    onChange={(e) => setCustom({ ...custom, gradientColor: e.target.value })}
                    className="w-8 h-8 rounded-xl cursor-pointer border border-gray-300 dark:border-gray-700 bg-transparent p-0 overflow-hidden"
                  />
                </div>
              )}
            </div>
          </div>

          {/* QR Pattern */}
          <div className="space-y-3">
            <label className="text-xs font-bold uppercase tracking-wider text-gray-500">QR Pattern</label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { name: 'square', label: 'Square' },
                { name: 'rounded', label: 'Rounded' },
                { name: 'dots', label: 'Dots' },
                { name: 'classy', label: 'Classy' },
                { name: 'smooth', label: 'Smooth' },
                { name: 'extra-rounded', label: 'Soft Oval' },
              ].map((pat) => (
                <button
                  key={pat.name}
                  onClick={() => setCustom({ ...custom, pattern: pat.name as any })}
                  className={`py-2 px-3 rounded-xl border text-xs font-medium transition ${
                    custom.pattern === pat.name
                      ? 'border-brand-500 bg-brand-500/10 text-brand-500 font-bold'
                      : 'border-gray-200 dark:border-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-900'
                  }`}
                >
                  {pat.label}
                </button>
              ))}
            </div>
          </div>

          {/* Corner Style */}
          <div className="space-y-3">
            <label className="text-xs font-bold uppercase tracking-wider text-gray-500">Corner Style</label>
            <div className="grid grid-cols-4 gap-2">
              {[
                { name: 'square', label: 'Square' },
                { name: 'rounded', label: 'Rounded' },
                { name: 'leaf', label: 'Leaf' },
                { name: 'dot', label: 'Circular' },
              ].map((eye) => (
                <button
                  key={eye.name}
                  onClick={() => setCustom({ ...custom, eyeStyle: eye.name as any })}
                  className={`py-2 px-2 rounded-xl border text-xs font-medium transition ${
                    custom.eyeStyle === eye.name
                      ? 'border-brand-500 bg-brand-500/10 text-brand-500 font-bold'
                      : 'border-gray-200 dark:border-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-900'
                  }`}
                >
                  {eye.label}
                </button>
              ))}
            </div>
          </div>

          {/* Frame */}
          <div className="space-y-3">
            <label className="text-xs font-bold uppercase tracking-wider text-gray-500">Frame</label>
            <div className="grid grid-cols-3 gap-2 mb-2">
              {[
                { name: 'scanner', label: 'Scanner Frame' },
                { name: 'simple', label: 'Simple Frame' },
                { name: 'none', label: 'No Frame' },
              ].map((f) => (
                <button
                  key={f.name}
                  onClick={() => setCustom({ ...custom, frame: f.name as any })}
                  className={`py-2 px-3 rounded-xl border text-xs font-medium transition ${
                    custom.frame === f.name
                      ? 'border-brand-500 bg-brand-500/10 text-brand-500 font-bold'
                      : 'border-gray-200 dark:border-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-900'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>

            {custom.frame !== 'none' && (
              <input
                type="text"
                value={custom.frameText}
                onChange={(e) => setCustom({ ...custom, frameText: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-gray-300 dark:border-gray-800 bg-gray-50 dark:bg-gray-900 text-xs font-medium"
                placeholder="Scan Me Text (e.g. SCAN ME)"
              />
            )}
          </div>

          {/* Primary Generate Trigger Button */}
          <button
            onClick={generateCode}
            className="w-full py-4 rounded-2xl bg-brand-500 hover:bg-brand-600 text-white font-extrabold text-base transition shadow-xl shadow-brand-500/25 flex items-center justify-center gap-2"
          >
            <Zap className="w-5 h-5 fill-white" /> {isGenerated ? 'Update & Refresh QR' : 'Generate QR Code'}
          </button>
        </div>
      </div>

      {/* RIGHT: Live Preview & Action Buttons (5 Cols) */}
      <div className="lg:col-span-5 space-y-6 lg:sticky lg:top-24">
        <div className="bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-3xl p-6 shadow-xl space-y-6 text-center">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-gray-500">LIVE PREVIEW</span>
            
            {isGenerated && (
              scannabilityScore >= 70 ? (
                <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-500 text-[11px] font-bold">
                  <CheckCircle className="w-3.5 h-3.5" />
                  ✓ Easy to scan
                </div>
              ) : (
                <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 text-amber-500 text-[11px] font-bold">
                  <AlertTriangle className="w-3.5 h-3.5" />
                  ⚠️ Difficult to scan
                </div>
              )
            )}
          </div>

          {!isGenerated ? (
            <div className="p-8 bg-gray-900 border border-gray-800 rounded-2xl flex flex-col items-center justify-center min-h-[320px] text-center space-y-4">
              <div className="w-16 h-16 rounded-2xl bg-brand-500/10 text-brand-500 flex items-center justify-center text-2xl">
                ⚡
              </div>
              <h4 className="font-bold text-white text-base">Your QR Code Preview</h4>
              <p className="text-xs text-gray-400 max-w-xs leading-relaxed">
                Enter your information and styling options, then click <span className="text-white font-semibold">"Generate QR Code"</span> to view your personalized QR code.
              </p>
              <button
                onClick={generateCode}
                className="w-full py-3.5 px-6 rounded-2xl bg-brand-500 hover:bg-brand-600 text-white font-bold text-sm transition shadow-lg shadow-brand-500/30 flex items-center justify-center gap-2 mt-2"
              >
                <Zap className="w-4 h-4 fill-white" /> Generate QR Code
              </button>
            </div>
          ) : (
            <>
              {scannabilityScore < 70 && (
                <p className="text-xs text-amber-500 font-medium text-left bg-amber-500/10 p-3 rounded-2xl border border-amber-500/20">
                  Your QR code may be difficult to scan. Try increasing the color contrast or removing background complexity.
                </p>
              )}

              {/* SVG Canvas */}
              <div className="p-6 bg-gray-950 border border-gray-800 rounded-2xl flex items-center justify-center min-h-[300px] shadow-inner">
                {svgString ? (
                  <div className="w-64 h-72" dangerouslySetInnerHTML={{ __html: svgString }} />
                ) : (
                  <div className="animate-pulse text-xs text-gray-500">Rendering QR code...</div>
                )}
              </div>

              {/* Test Camera Button */}
              <button
                type="button"
                onClick={() => setTestModalOpen(true)}
                className="w-full py-3 rounded-2xl bg-indigo-600/10 hover:bg-indigo-600/20 text-indigo-400 border border-indigo-500/30 font-bold text-xs transition flex items-center justify-center gap-2"
              >
                <Smartphone className="w-4 h-4" /> Test Camera Readability
              </button>

              {/* Action Buttons: Download, Share, Save */}
              <div className="space-y-3 pt-2 border-t border-gray-100 dark:border-gray-800">
                {/* Save Button */}
                <button
                  onClick={handleSaveQR}
                  className="w-full py-3.5 rounded-2xl bg-brand-500 hover:bg-brand-600 text-white font-bold text-sm transition shadow-lg shadow-brand-500/25 flex items-center justify-center gap-2"
                >
                  <Bookmark className="w-4 h-4" /> Save QR Code
                </button>

                {/* Download Grid */}
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => downloadSVG(svgString, `${name.toLowerCase().replace(/\s+/g, '-')}.svg`)}
                    className="py-2.5 px-3 rounded-xl border border-gray-300 dark:border-gray-800 bg-gray-100 dark:bg-gray-900 text-xs font-bold hover:bg-brand-500 hover:text-white transition flex items-center justify-center gap-1.5"
                  >
                    <Download className="w-3.5 h-3.5" /> Download SVG
                  </button>
                  <button
                    onClick={() => downloadRasterImage(svgString, 'png', `${name.toLowerCase().replace(/\s+/g, '-')}.png`)}
                    className="py-2.5 px-3 rounded-xl border border-gray-300 dark:border-gray-800 bg-gray-100 dark:bg-gray-900 text-xs font-bold hover:bg-brand-500 hover:text-white transition flex items-center justify-center gap-1.5"
                  >
                    <Download className="w-3.5 h-3.5" /> Download PNG
                  </button>
                </div>

                {/* PDF Download Pass */}
                <button
                  onClick={() => downloadQRPDF(svgString, name, `${name.toLowerCase().replace(/\s+/g, '-')}.pdf`)}
                  className="w-full py-2.5 rounded-xl border border-gray-300 dark:border-gray-800 bg-gray-50 dark:bg-gray-900 text-xs font-bold text-gray-700 dark:text-gray-300 hover:bg-brand-500 hover:text-white transition flex items-center justify-center gap-1.5"
                >
                  <Download className="w-3.5 h-3.5" /> Download PDF Pass
                </button>

                {/* Share Link Button */}
                <button
                  onClick={handleShareLink}
                  className="w-full py-2.5 rounded-xl border border-gray-300 dark:border-gray-800 bg-gray-50 dark:bg-gray-900 text-xs font-bold text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition flex items-center justify-center gap-1.5"
                >
                  <Share2 className="w-3.5 h-3.5" /> Share QR Link
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Test Scanner Modal */}
      <TestQRScannerModal
        isOpen={testModalOpen}
        onClose={() => setTestModalOpen(false)}
        payload={encodedStr}
        customization={custom}
        qrName={name}
      />
    </div>
  );
}
