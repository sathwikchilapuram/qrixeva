'use client';

import React, { useState, useEffect } from 'react';
import { QRCustomization, QRType, QRMode, AccessControl } from '@/types';
import { generateQRSVG } from '@/lib/qr-generator';
import { downloadSVG, downloadRasterImage, downloadQRPDF } from '@/lib/export-utils';
import { DEFAULT_CUSTOMIZATION } from '@/lib/store';
import { useApp } from '@/lib/AppContext';
import { TestQRScannerModal } from './TestQRScannerModal';
import {
  Palette,
  Sliders,
  RotateCcw,
  CheckCircle,
  Lock,
  Smartphone,
  Sparkles,
} from 'lucide-react';

interface CustomizationStudioProps {
  initialType?: QRType;
  initialContent?: Record<string, any>;
  existingQrId?: string;
}

export function CustomizationStudio({ initialType = 'url', initialContent = {}, existingQrId }: CustomizationStudioProps) {
  const { addQRCode, updateQRCode, qrCodes } = useApp();

  const existingQr = existingQrId ? qrCodes.find((q) => q.id === existingQrId) : null;

  // Form State
  const [name, setName] = useState(existingQr ? existingQr.name : 'My Custom QR');
  const [qrType, setQrType] = useState<QRType>(existingQr ? existingQr.type : initialType);
  const [mode, setMode] = useState<QRMode>(existingQr ? existingQr.mode : 'dynamic');
  const [accessControl, setAccessControl] = useState<AccessControl>(existingQr ? existingQr.accessControl : 'public');
  const [password, setPassword] = useState(existingQr?.password || '');
  const [expiresAt, setExpiresAt] = useState(existingQr?.expiresAt || '');
  const [contentPayload, setContentPayload] = useState<Record<string, any>>(existingQr ? existingQr.content : initialContent);

  // Customization State
  const [custom, setCustom] = useState<QRCustomization>(existingQr ? existingQr.customization : DEFAULT_CUSTOMIZATION);

  // Live SVG Preview & Test Modal
  const [svgString, setSvgString] = useState<string>('');
  const [scannabilityScore, setScannabilityScore] = useState<number>(100);
  const [testModalOpen, setTestModalOpen] = useState(false);

  useEffect(() => {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || (typeof window !== 'undefined' && window.location.hostname !== 'localhost' ? window.location.origin : 'https://qrverse-theta.vercel.app');
    const payloadStr = mode === 'dynamic'
      ? `${baseUrl}/x/${name.toLowerCase().replace(/[^a-z0-9]/g, '-') || 'demo'}`
      : (contentPayload?.url || contentPayload?.text || JSON.stringify(contentPayload));

    generateQRSVG(payloadStr, custom).then((svg) => {
      setSvgString(svg);

      let score = 100;
      if (custom.fgColor === custom.bgColor) score -= 80;
      if (custom.logoUrl && custom.logoSize > 25 && custom.ecl === 'L') score -= 30;
      if (custom.margin < 1) score -= 15;
      setScannabilityScore(Math.max(10, score));
    });
  }, [custom, mode, name, contentPayload]);

  const handleSaveQR = () => {
    const slug = name.toLowerCase().replace(/[^a-z0-9]/g, '-') + '-' + Math.random().toString(36).substring(2, 6);

    if (existingQr) {
      updateQRCode(existingQr.id, {
        name,
        type: qrType,
        mode,
        accessControl,
        password,
        expiresAt,
        content: contentPayload,
        customization: custom,
      });
    } else {
      addQRCode({
        id: 'qr-' + Date.now(),
        name,
        slug,
        type: qrType,
        mode,
        status: 'active',
        accessControl,
        password,
        expiresAt,
        content: contentPayload,
        customization: custom,
        scansCount: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
    }
  };

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || (typeof window !== 'undefined' && window.location.hostname !== 'localhost' ? window.location.origin : 'https://qrverse-theta.vercel.app');
  const payloadStr = mode === 'dynamic'
    ? `${baseUrl}/x/${name.toLowerCase().replace(/[^a-z0-9]/g, '-') || 'demo'}`
    : (contentPayload?.url || contentPayload?.text || JSON.stringify(contentPayload));

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      {/* LEFT: Customization Controls (7 Cols) */}
      <div className="lg:col-span-7 space-y-6">
        <div className="bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-3xl p-6 shadow-xl space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-gray-200 dark:border-gray-800">
            <h3 className="font-bold text-gray-900 dark:text-white text-base flex items-center gap-2">
              <Sliders className="w-5 h-5 text-brand-500" />
              Customization Studio Controls
            </h3>
            <button
              onClick={() => setCustom(DEFAULT_CUSTOMIZATION)}
              className="text-xs font-semibold text-gray-500 hover:text-brand-500 flex items-center gap-1 transition"
            >
              <RotateCcw className="w-3.5 h-3.5" /> Reset Customization
            </button>
          </div>

          {/* QR Name */}
          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-wider text-gray-500">QR Code Label</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-800 bg-gray-50 dark:bg-gray-900 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-brand-500"
              placeholder="e.g. Executive Resume Pass"
            />
          </div>

          {/* Color Options */}
          <div className="space-y-3">
            <label className="text-xs font-semibold uppercase tracking-wider text-gray-500 flex items-center gap-1.5">
              <Palette className="w-4 h-4 text-brand-500" /> Foreground & Background Colors
            </label>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <span className="text-xs text-gray-400 block mb-1">Foreground Pixel Color</span>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={custom.fgColor}
                    onChange={(e) => setCustom({ ...custom, fgColor: e.target.value })}
                    className="w-9 h-9 rounded-xl cursor-pointer border border-gray-700 bg-transparent"
                  />
                  <input
                    type="text"
                    value={custom.fgColor}
                    onChange={(e) => setCustom({ ...custom, fgColor: e.target.value })}
                    className="w-full px-3 py-1.5 text-xs font-mono rounded-lg border border-gray-300 dark:border-gray-800 bg-gray-50 dark:bg-gray-900"
                  />
                </div>
              </div>

              <div>
                <span className="text-xs text-gray-400 block mb-1">Background Canvas Color</span>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={custom.bgColor}
                    onChange={(e) => setCustom({ ...custom, bgColor: e.target.value })}
                    className="w-9 h-9 rounded-xl cursor-pointer border border-gray-700 bg-transparent"
                  />
                  <input
                    type="text"
                    value={custom.bgColor}
                    onChange={(e) => setCustom({ ...custom, bgColor: e.target.value })}
                    className="w-full px-3 py-1.5 text-xs font-mono rounded-lg border border-gray-300 dark:border-gray-800 bg-gray-50 dark:bg-gray-900"
                  />
                </div>
              </div>
            </div>

            {/* Gradient Toggle */}
            <div className="pt-2 flex items-center justify-between">
              <label className="text-xs font-medium text-gray-600 dark:text-gray-300 flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={custom.gradientEnabled}
                  onChange={(e) => setCustom({ ...custom, gradientEnabled: e.target.checked })}
                  className="rounded text-brand-500 focus:ring-brand-500"
                />
                Enable Color Gradient
              </label>

              {custom.gradientEnabled && (
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-400">Target Gradient:</span>
                  <input
                    type="color"
                    value={custom.gradientColor}
                    onChange={(e) => setCustom({ ...custom, gradientColor: e.target.value })}
                    className="w-7 h-7 rounded-lg cursor-pointer border border-gray-700 bg-transparent"
                  />
                </div>
              )}
            </div>
          </div>

          {/* Pattern Styles */}
          <div className="space-y-3">
            <label className="text-xs font-semibold uppercase tracking-wider text-gray-500">Dot Matrix Pattern</label>
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

          {/* Eye Shapes */}
          <div className="space-y-3">
            <label className="text-xs font-semibold uppercase tracking-wider text-gray-500">Corner Eye Shapes</label>
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

          {/* Scanner Frames */}
          <div className="space-y-3">
            <label className="text-xs font-semibold uppercase tracking-wider text-gray-500">Scanner Frame Badge</label>
            <div className="grid grid-cols-3 gap-2 mb-2">
              {[
                { name: 'scanner', label: 'Scanner Badge' },
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
                placeholder="Frame Text (e.g. SCAN ME)"
              />
            )}
          </div>
        </div>
      </div>

      {/* RIGHT: Live Preview & Test QR Trigger (5 Cols) */}
      <div className="lg:col-span-5 space-y-6 lg:sticky lg:top-24">
        <div className="bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-3xl p-6 shadow-xl space-y-6 text-center">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-gray-400">Live Preview</span>
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-500 text-[11px] font-bold">
              <CheckCircle className="w-3.5 h-3.5" />
              Scannability: {scannabilityScore}%
            </div>
          </div>

          {/* SVG Canvas */}
          <div className="p-6 bg-gray-950 border border-gray-800 rounded-2xl flex items-center justify-center min-h-[300px] shadow-inner">
            {svgString ? (
              <div className="w-64 h-72" dangerouslySetInnerHTML={{ __html: svgString }} />
            ) : (
              <div className="animate-pulse text-xs text-gray-500">Generating QR...</div>
            )}
          </div>

          {/* Requirement #32: Test QR Scanner Button */}
          <button
            type="button"
            onClick={() => setTestModalOpen(true)}
            className="w-full py-3 rounded-2xl bg-indigo-600/10 hover:bg-indigo-600/20 text-indigo-400 border border-indigo-500/30 font-bold text-xs transition flex items-center justify-center gap-2"
          >
            <Smartphone className="w-4 h-4" /> Test QR Camera Scannability
          </button>

          {/* Operating Mode Selector */}
          <div className="p-3 rounded-2xl bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 text-left space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase text-gray-500">QR Operating Mode</span>
              <span className="text-xs text-brand-500 font-semibold">{mode === 'dynamic' ? 'Dynamic URL' : 'Static Payload'}</span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => setMode('dynamic')}
                className={`py-2 px-3 rounded-xl border text-xs font-bold transition ${
                  mode === 'dynamic'
                    ? 'border-brand-500 bg-brand-500 text-white'
                    : 'border-gray-300 dark:border-gray-800 text-gray-500 hover:text-white'
                }`}
              >
                ⚡ Dynamic (Editable)
              </button>
              <button
                onClick={() => setMode('static')}
                className={`py-2 px-3 rounded-xl border text-xs font-bold transition ${
                  mode === 'static'
                    ? 'border-brand-500 bg-brand-500 text-white'
                    : 'border-gray-300 dark:border-gray-800 text-gray-500 hover:text-white'
                }`}
              >
                🔒 Static (Fixed)
              </button>
            </div>
          </div>

          {/* Security Rules */}
          {mode === 'dynamic' && (
            <div className="p-4 rounded-2xl bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 text-left space-y-3">
              <span className="text-xs font-bold uppercase text-gray-500 flex items-center gap-1.5">
                <Lock className="w-4 h-4 text-purple-400" /> Access & Password Protection
              </span>

              <div className="space-y-2">
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Set Access Password (optional)"
                  className="w-full px-3 py-2 rounded-xl border border-gray-300 dark:border-gray-800 bg-white dark:bg-gray-950 text-xs font-mono"
                />

                <input
                  type="date"
                  value={expiresAt}
                  onChange={(e) => setExpiresAt(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-gray-300 dark:border-gray-800 bg-white dark:bg-gray-950 text-xs text-gray-400"
                />
              </div>
            </div>
          )}

          {/* Save & Export */}
          <div className="space-y-2 pt-2">
            <button
              onClick={handleSaveQR}
              className="w-full py-3.5 rounded-2xl bg-brand-500 hover:bg-brand-600 text-white font-bold text-sm transition shadow-lg shadow-brand-500/25 flex items-center justify-center gap-2"
            >
              <CheckCircle className="w-4 h-4" /> Save to My QR Codes
            </button>

            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => downloadSVG(svgString, `${name.toLowerCase().replace(/\s+/g, '-')}.svg`)}
                className="py-2.5 px-3 rounded-xl border border-gray-300 dark:border-gray-800 bg-gray-100 dark:bg-gray-900 text-xs font-semibold hover:bg-gray-200 dark:hover:bg-gray-800 transition"
              >
                Download SVG
              </button>
              <button
                onClick={() => downloadRasterImage(svgString, 'png', `${name.toLowerCase().replace(/\s+/g, '-')}.png`)}
                className="py-2.5 px-3 rounded-xl border border-gray-300 dark:border-gray-800 bg-gray-100 dark:bg-gray-900 text-xs font-semibold hover:bg-gray-200 dark:hover:bg-gray-800 transition"
              >
                Download PNG
              </button>
            </div>

            <button
              onClick={() => downloadQRPDF(svgString, name, `${name.toLowerCase().replace(/\s+/g, '-')}.pdf`)}
              className="w-full py-2.5 rounded-xl border border-gray-300 dark:border-gray-800 bg-gray-50 dark:bg-gray-900 text-xs font-semibold text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition"
            >
              Download PDF Pass
            </button>
          </div>
        </div>
      </div>

      {/* Test Scanner Modal */}
      <TestQRScannerModal
        isOpen={testModalOpen}
        onClose={() => setTestModalOpen(false)}
        payload={payloadStr}
        customization={custom}
        qrName={name}
      />
    </div>
  );
}
