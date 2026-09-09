'use client';

import React from 'react';
import Link from 'next/link';
import { Logo } from '../branding/Logo';
import { Github, Twitter, Linkedin, ShieldCheck, Zap, Globe } from 'lucide-react';

export function Footer() {
  return (
    <footer className="border-t border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-950 text-gray-600 dark:text-gray-400 py-12 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
          {/* Brand Info */}
          <div className="md:col-span-2 space-y-4">
            <Logo size="lg" />
            <p className="text-sm text-gray-500 max-w-sm">
              QRVerse is the universal dynamic QR code platform enabling creators, enterprises, and businesses to build customizable, trackable QR experiences.
            </p>
            <div className="flex items-center gap-4 text-gray-400">
              <a href="https://github.com" target="_blank" rel="noreferrer" className="hover:text-brand-500 transition">
                <Github className="w-5 h-5" />
              </a>
              <a href="https://x.com" target="_blank" rel="noreferrer" className="hover:text-brand-500 transition">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="hover:text-brand-500 transition">
                <Linkedin className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Product Links */}
          <div>
            <h4 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider mb-4">Product</h4>
            <ul className="space-y-2.5 text-sm">
              <li><Link href="/#features" className="hover:text-brand-500 transition">Features</Link></li>
              <li><Link href="/#qr-types" className="hover:text-brand-500 transition">QR Types</Link></li>
              <li><Link href="/#dynamic-qr" className="hover:text-brand-500 transition">Dynamic QR</Link></li>
              <li><Link href="/dashboard/templates" className="hover:text-brand-500 transition">Templates</Link></li>
              <li><Link href="/ai-assistant" className="hover:text-brand-500 transition">AI Assistant</Link></li>
            </ul>
          </div>

          {/* QR Types Links */}
          <div>
            <h4 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider mb-4">QR Types</h4>
            <ul className="space-y-2.5 text-sm">
              <li><Link href="/dashboard/create?type=resume" className="hover:text-brand-500 transition">Resume QR</Link></li>
              <li><Link href="/dashboard/create?type=menu" className="hover:text-brand-500 transition">Restaurant Menu</Link></li>
              <li><Link href="/dashboard/create?type=pdf" className="hover:text-brand-500 transition">PDF Document</Link></li>
              <li><Link href="/dashboard/create?type=idcard" className="hover:text-brand-500 transition">Digital ID Card</Link></li>
              <li><Link href="/dashboard/create?type=app" className="hover:text-brand-500 transition">App Redirect</Link></li>
            </ul>
          </div>

          {/* Legal & Security */}
          <div>
            <h4 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider mb-4">Platform</h4>
            <ul className="space-y-2.5 text-sm">
              <li className="flex items-center gap-1.5"><ShieldCheck className="w-4 h-4 text-emerald-500" /> Enterprise SLA</li>
              <li className="flex items-center gap-1.5"><Zap className="w-4 h-4 text-brand-500" /> 99.99% Uptime</li>
              <li className="flex items-center gap-1.5"><Globe className="w-4 h-4 text-indigo-500" /> Global Edge CDN</li>
              <li><a href="#" className="hover:text-brand-500 transition">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-brand-500 transition">Terms of Service</a></li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
}
