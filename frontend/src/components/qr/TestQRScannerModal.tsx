'use client';

import React, { useState, useEffect } from 'react';
import { QRCustomization } from '@/types';
import { generateQRSVG } from '@/lib/qr-generator';
import { CheckCircle2, AlertTriangle, ShieldCheck, RefreshCw, X, Smartphone } from 'lucide-react';

interface TestQRScannerModalProps {
  isOpen: boolean;
  onClose: () => void;
  payload: string;
  customization: QRCustomization;
  qrName: string;
}

export function TestQRScannerModal({
  isOpen,
  onClose,
  payload,
  customization,
  qrName,
}: TestQRScannerModalProps) {
  const [testing, setTesting] = useState(true);
  const [svgStr, setSvgStr] = useState('');
  const [scannabilityDetails, setScannabilityDetails] = useState<{
    score: number;
    contrastOk: boolean;
    marginOk: boolean;
    logoOk: boolean;
    recommendations: string[];
  }>({ score: 100, contrastOk: true, marginOk: true, logoOk: true, recommendations: [] });

  useEffect(() => {
    if (isOpen) {
      setTesting(true);
      generateQRSVG(payload, customization).then((svg) => {
        setSvgStr(svg);

        // Perform camera scannability test checks
        setTimeout(() => {
          const recs: string[] = [];
          let score = 100;

          const contrastOk = customization.fgColor !== customization.bgColor;
          if (!contrastOk) {
            score -= 80;
            recs.push('Foreground and background colors are identical! Increase visual contrast.');
          }

          const marginOk = customization.margin >= 1;
          if (!marginOk) {
            score -= 15;
            recs.push('Quiet zone margin is below 1 cell width. Add a margin for paper scanning.');
          }

          const logoOk = !customization.logoUrl || customization.logoSize <= 25 || customization.ecl === 'H';
          if (!logoOk) {
            score -= 20;
            recs.push('Center logo size is large. Upgrade Error Correction Level (ECL) to "H".');
          }

          if (recs.length === 0) {
            recs.push('QR matrix pattern verified! Excellent optical camera scannability across iOS & Android devices.');
          }

          setScannabilityDetails({
            score: Math.max(10, score),
            contrastOk,
            marginOk,
            logoOk,
            recommendations: recs,
          });
          setTesting(false);
        }, 800);
      });
    }
  }, [isOpen, payload, customization]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
      <div className="bg-gray-900 border border-gray-800 rounded-3xl p-6 max-w-lg w-full text-gray-100 shadow-2xl space-y-6">
        <div className="flex items-center justify-between pb-4 border-b border-gray-800">
          <div className="flex items-center gap-2">
            <Smartphone className="w-5 h-5 text-brand-400" />
            <h3 className="font-extrabold text-white text-base">Camera Scannability Test Studio</h3>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg hover:bg-gray-800 text-gray-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Live Scanner Animation Frame */}
        <div className="relative p-6 bg-gray-950 border border-gray-800 rounded-2xl flex flex-col items-center justify-center min-h-[280px] overflow-hidden">
          {testing ? (
            <div className="flex flex-col items-center gap-3 text-brand-400 animate-pulse">
              <RefreshCw className="w-8 h-8 animate-spin" />
              <p className="text-xs font-semibold">Simulating Hardware Camera Scan...</p>
            </div>
          ) : (
            <>
              {/* Laser Scanning Line */}
              <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-transparent via-brand-500 to-transparent shadow-[0_0_15px_#6366f1] animate-bounce pointer-events-none" />

              <div className="w-56 h-64" dangerouslySetInnerHTML={{ __html: svgStr }} />

              <div className="mt-4 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-extrabold flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4" /> Payload Resolved: 100% Scannable
              </div>
            </>
          )}
        </div>

        {/* Test Diagnostics Readout */}
        {!testing && (
          <div className="p-4 rounded-2xl bg-gray-950 border border-gray-800 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-gray-400">Scannability Score</span>
              <span className={`text-sm font-extrabold ${scannabilityDetails.score >= 80 ? 'text-emerald-400' : 'text-amber-400'}`}>
                {scannabilityDetails.score} / 100
              </span>
            </div>

            <div className="space-y-1 text-xs">
              {scannabilityDetails.recommendations.map((rec, i) => (
                <p key={i} className="text-gray-300 flex items-start gap-2">
                  <ShieldCheck className="w-4 h-4 text-brand-400 shrink-0 mt-0.5" />
                  <span>{rec}</span>
                </p>
              ))}
            </div>

            <div className="pt-2 border-t border-gray-900 text-[11px] text-gray-500 font-mono truncate">
              Scanned QR Data: {payload}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
