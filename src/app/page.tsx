'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { generateQRSVG } from '@/lib/qr-generator';
import { DEFAULT_CUSTOMIZATION } from '@/lib/store';
import {
  Sparkles,
  QrCode,
  Zap,
  ShieldCheck,
  BarChart3,
  Sliders,
  FileText,
  User,
  Utensils,
  Smartphone,
  CheckCircle,
  HelpCircle,
  ArrowRight,
  ChevronDown,
  Layers,
  Globe,
  Lock,
  RefreshCw,
  Share2,
} from 'lucide-react';

export default function LandingPage() {
  const [heroSvg, setHeroSvg] = useState<string>('');
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [customStyle, setCustomStyle] = useState<{
    fgColor: string;
    pattern: 'square' | 'rounded' | 'dots' | 'classy' | 'smooth' | 'extra-rounded';
    eyeStyle: 'square' | 'rounded' | 'leaf' | 'dot';
  }>({
    fgColor: '#4f46e5',
    pattern: 'rounded',
    eyeStyle: 'rounded',
  });

  useEffect(() => {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || (typeof window !== 'undefined' && window.location.hostname !== 'localhost' ? window.location.origin : 'https://qrixeva.vercel.app');
    generateQRSVG(`${baseUrl}/x/alex-resume`, {
      ...DEFAULT_CUSTOMIZATION,
      fgColor: customStyle.fgColor,
      pattern: customStyle.pattern,
      eyeStyle: customStyle.eyeStyle,
      frameText: 'SCAN ME NOW',
    }).then(setHeroSvg);
  }, [customStyle]);

  const qrTypesList = [
    { name: 'Plain Text', desc: 'Encode raw text messages or code snippets.', icon: FileText },
    { name: 'Website URLs', desc: 'Direct visitors to landing pages & websites.', icon: Globe },
    { name: 'PDF Documents', desc: 'Share brochures, eBooks, or PDF specs.', icon: FileText },
    { name: 'Files & Media', desc: 'Upload images, audio, video, or ZIP archives.', icon: Layers },
    { name: 'Digital Profile', desc: 'Share social links, portfolio, and bio.', icon: User },
    { name: 'Resume / CV', desc: 'Interactive recruiter pass with PDF download.', icon: FileText },
    { name: 'Digital ID Card', desc: 'Official staff badge with verification details.', icon: ShieldCheck },
    { name: 'Contact vCard', desc: 'Save contact directly into phone address book.', icon: User },
    { name: 'Restaurant Menu', desc: 'Touchless dining menu with category items.', icon: Utensils },
    { name: 'Event Access', desc: 'Passes, schedules, and Moscone venue maps.', icon: Zap },
    { name: 'Location Map', desc: 'GPS coordinates & Google Maps routes.', icon: Globe },
    { name: 'App Store Redirect', desc: 'Auto-detect iOS App Store or Play Store.', icon: Smartphone },
  ];

  const faqs = [
    {
      q: 'What is the difference between Static and Dynamic QR codes?',
      a: 'Static QR codes encode data directly into the pixel pattern. Dynamic QR codes route through a secure Qrixeva URL (qrixeva.vercel.app/x/slug), allowing you to edit the destination, content, password rules, or expiration date at any time without re-printing the QR code.',
    },
    {
      q: 'Can I track scan analytics for my QR codes?',
      a: 'Yes! Dynamic QR codes record full real-time scan metrics including total scans, unique visitors, device types (Mobile, Desktop, Tablet), Operating System, Browser, and referrer sources.',
    },
    {
      q: 'How does password protection and expiration work?',
      a: 'When creating or editing a Dynamic QR code, you can enable Password Access or set an Expiration Date (e.g. 1 hour, 1 day, 7 days, or custom date). Unauthorized users are prompted for a password before viewing.',
    },
    {
      q: 'What export formats are available?',
      a: 'You can export high-resolution QR codes as SVG vector files (ideal for professional printing), PNG images, JPGs, or print-ready PDF passes.',
    },
    {
      q: 'Can I upload custom logos into the center of the QR code?',
      a: 'Absolutley! Customization studio allows logo upload, logo resizing, custom dot patterns, corner eye shapes, linear/radial gradients, and custom scanner text frames.',
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100 transition-colors duration-200">
      <Navbar />

      {/* HERO SECTION */}
      <section className="relative overflow-hidden pt-12 pb-20 lg:pt-20 lg:pb-32 border-b border-gray-100 dark:border-gray-900">
        {/* Background Ambient Glow */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-tr from-brand-500/20 via-purple-500/20 to-pink-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Copy */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-brand-500/30 bg-brand-500/10 text-brand-400 text-xs font-semibold tracking-wide">
                <Sparkles className="w-4 h-4 text-brand-400 animate-pulse" />
                Next Generation Universal QR Platform
              </div>

              <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-gray-900 dark:text-white leading-[1.1]">
                One QR. <br />
                <span className="bg-gradient-to-r from-brand-500 via-indigo-400 to-purple-500 bg-clip-text text-transparent">
                  Endless possibilities.
                </span>
              </h1>

              <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto lg:mx-0 font-normal leading-relaxed">
                Create, customize, share and track QR codes for URLs, PDFs, digital profiles, resumes, menus, ID cards, and multi-link pages in one unified platform.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
                <Link
                  href="/dashboard/create"
                  className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-brand-500 hover:bg-brand-600 text-white font-semibold text-base shadow-xl shadow-brand-500/25 transition transform active:scale-95 flex items-center justify-center gap-2"
                >
                  <QrCode className="w-5 h-5" />
                  Create QR Code
                </Link>
                <Link
                  href="#features"
                  className="w-full sm:w-auto px-8 py-4 rounded-2xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900 hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-800 dark:text-gray-200 font-semibold text-base transition flex items-center justify-center gap-2"
                >
                  Explore Features
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>

              {/* Social Proof */}
              <div className="pt-8 flex items-center justify-center lg:justify-start gap-8 text-xs text-gray-500 dark:text-gray-400 border-t border-gray-100 dark:border-gray-900">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-500" />
                  No App Installation Needed
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-500" />
                  Real-time Analytics
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-500" />
                  Vector SVG Export
                </div>
              </div>
            </div>

            {/* Right Interactive Visualizer Card */}
            <div className="lg:col-span-5 flex justify-center">
              <div className="relative w-full max-w-md bg-gray-900/90 border border-gray-800 rounded-3xl p-6 shadow-2xl backdrop-blur-xl">
                <div className="flex items-center justify-between pb-4 border-b border-gray-800 mb-6">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-rose-500" />
                    <span className="w-3 h-3 rounded-full bg-amber-500" />
                    <span className="w-3 h-3 rounded-full bg-emerald-500" />
                  </div>
                  <span className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                    Live Customizer Preview
                  </span>
                </div>

                {/* QR Canvas Container */}
                <div className="p-4 bg-gray-950 border border-gray-800 rounded-2xl flex items-center justify-center min-h-[300px]">
                  {heroSvg ? (
                    <div
                      className="w-64 h-72 transition-all duration-300"
                      dangerouslySetInnerHTML={{ __html: heroSvg }}
                    />
                  ) : (
                    <div className="animate-pulse text-gray-500 text-sm">Rendering QR...</div>
                  )}
                </div>

                {/* Live Controls */}
                <div className="mt-6 space-y-3">
                  <p className="text-xs font-semibold text-gray-400">Interactive Style Controls:</p>
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      onClick={() => setCustomStyle({ ...customStyle, fgColor: '#4f46e5', pattern: 'rounded' })}
                      className="py-2 px-3 rounded-xl bg-gray-800 hover:bg-gray-700 text-xs font-medium text-indigo-400 border border-gray-700 transition"
                    >
                      Violet Rounded
                    </button>
                    <button
                      onClick={() => setCustomStyle({ ...customStyle, fgColor: '#059669', pattern: 'dots' })}
                      className="py-2 px-3 rounded-xl bg-gray-800 hover:bg-gray-700 text-xs font-medium text-emerald-400 border border-gray-700 transition"
                    >
                      Emerald Dots
                    </button>
                    <button
                      onClick={() => setCustomStyle({ ...customStyle, fgColor: '#d97706', pattern: 'extra-rounded' })}
                      className="py-2 px-3 rounded-xl bg-gray-800 hover:bg-gray-700 text-xs font-medium text-amber-400 border border-gray-700 transition"
                    >
                      Amber Soft
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* WHAT IS QRIXEVA SECTION */}
      <section id="features" className="py-20 bg-gray-50 dark:bg-gray-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
            <h2 className="text-xs font-bold uppercase tracking-widest text-brand-500">Universal Platform</h2>
            <h3 className="text-3xl sm:text-5xl font-extrabold text-gray-900 dark:text-white tracking-tight">
              Why settle for simple static QR generators?
            </h3>
            <p className="text-gray-600 dark:text-gray-400 text-lg">
              Qrixeva powers digital connections across enterprise resume sharing, food menus, file hosting, event access cards, and smart app redirects.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-8 rounded-3xl bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-800 shadow-xl space-y-4 hover:border-brand-500/50 transition">
              <div className="w-12 h-12 rounded-2xl bg-brand-500/10 text-brand-500 flex items-center justify-center">
                <RefreshCw className="w-6 h-6" />
              </div>
              <h4 className="text-xl font-bold text-gray-900 dark:text-white">Dynamic Redirect Infrastructure</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                Update content, change URLs, or swap attached PDF files anytime without re-printing marketing collateral.
              </p>
            </div>

            <div className="p-8 rounded-3xl bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-800 shadow-xl space-y-4 hover:border-brand-500/50 transition">
              <div className="w-12 h-12 rounded-2xl bg-purple-500/10 text-purple-500 flex items-center justify-center">
                <Sliders className="w-6 h-6" />
              </div>
              <h4 className="text-xl font-bold text-gray-900 dark:text-white">Customization Studio</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                Tailor dot patterns, gradients, logo overlays, and scanner text frames while preserving 100% scannability.
              </p>
            </div>

            <div className="p-8 rounded-3xl bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-800 shadow-xl space-y-4 hover:border-brand-500/50 transition">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
                <BarChart3 className="w-6 h-6" />
              </div>
              <h4 className="text-xl font-bold text-gray-900 dark:text-white">Real-Time Scan Intelligence</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                Track visitor count, device OS (iOS vs Android), browsers, and scan timelines with high resolution charts.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 15 QR TYPES GRID SECTION */}
      <section id="qr-types" className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
            <h2 className="text-xs font-bold uppercase tracking-widest text-brand-500">Supported Formats</h2>
            <h3 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight">
              15+ Digital Content & Media Types
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              One QR code platform to encode all your physical-to-digital workflows.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {qrTypesList.map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.name}
                  className="p-6 rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 hover:border-brand-500 transition group"
                >
                  <div className="w-10 h-10 rounded-xl bg-gray-100 dark:bg-gray-900 text-brand-500 flex items-center justify-center mb-4 group-hover:bg-brand-500 group-hover:text-white transition">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h4 className="font-bold text-gray-900 dark:text-white text-base mb-1">{item.name}</h4>
                  <p className="text-xs text-gray-500 dark:text-gray-400 leading-normal">{item.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>



      {/* AI ASSISTANT SHOWCASE */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-500/10 text-brand-400 text-xs font-bold uppercase">
                <Sparkles className="w-4 h-4" /> AI Companion Studio
              </div>
              <h3 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight">
                Not sure which QR structure fits best? Ask the AI Assistant.
              </h3>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                Simply type your request in natural language (e.g. "I want a QR code for my restaurant menu"). The assistant evaluates required fields, selects template styles, and generates prefilled configurations in one click.
              </p>
              <Link
                href="/ai-assistant"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-brand-500 hover:bg-brand-600 text-white font-semibold text-sm transition shadow-lg shadow-brand-500/20"
              >
                Launch AI Assistant Studio
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="p-6 rounded-3xl bg-gray-900 border border-gray-800 shadow-2xl space-y-4">
              <div className="flex items-center gap-3 pb-4 border-b border-gray-800">
                <Sparkles className="w-5 h-5 text-brand-400" />
                <span className="text-sm font-semibold text-white">AI Studio Recommendation Engine</span>
              </div>
              <div className="p-4 rounded-xl bg-gray-950 border border-gray-800 text-xs text-gray-300">
                <span className="text-brand-400 font-bold">User Input:</span> "I need a QR code for my executive resume and portfolio."
              </div>
              <div className="p-4 rounded-xl bg-gray-800/80 border border-gray-700 text-xs space-y-2">
                <p className="font-bold text-emerald-400 flex items-center gap-1.5">
                  <CheckCircle className="w-4 h-4" /> Recommended: Interactive Executive Resume QR
                </p>
                <p className="text-gray-300">
                  Includes digital bio, experience highlights, portfolio links, and 1-click recruiter PDF download.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>



      {/* FAQ ACCORDION SECTION */}
      <section id="faq" className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-xs font-bold uppercase tracking-widest text-brand-500">Help Center</h2>
            <h3 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight">
              Frequently Asked Questions
            </h3>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, idx) => (
              <div
                key={idx}
                className="border border-gray-200 dark:border-gray-800 rounded-2xl overflow-hidden bg-white dark:bg-gray-950 transition"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                  className="w-full flex items-center justify-between p-6 text-left font-semibold text-gray-900 dark:text-white text-base hover:text-brand-500 transition"
                >
                  <span>{faq.q}</span>
                  <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform duration-200 ${openFaq === idx ? 'rotate-180 text-brand-500' : ''}`} />
                </button>

                {openFaq === idx && (
                  <div className="px-6 pb-6 text-sm text-gray-600 dark:text-gray-400 leading-relaxed border-t border-gray-100 dark:border-gray-900 pt-4 animate-in fade-in">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
