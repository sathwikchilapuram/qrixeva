'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Sidebar } from '@/components/layout/Sidebar';
import { MobileNav } from '@/components/layout/MobileNav';
import { CustomizationStudio } from '@/components/qr/CustomizationStudio';
import { QRType } from '@/types';
import { useSearchParams } from 'next/navigation';
import {
  FileText,
  Globe,
  FileCode,
  Layers,
  User,
  ShieldCheck,
  Utensils,
  Zap,
  Smartphone,
  CreditCard,
  Share2,
  Search,
  ArrowLeft,
  MapPin,
  Briefcase,
  Image as ImageIcon,
  Music,
  Video as VideoIcon,
  Sparkles,
} from 'lucide-react';

function CreateQRContent() {
  const searchParams = useSearchParams();
  const initialTypeFromUrl = (searchParams.get('type') as QRType) || null;
  const editId = searchParams.get('edit') || null;

  const [selectedType, setSelectedType] = useState<QRType | null>(initialTypeFromUrl);
  const [searchQuery, setSearchQuery] = useState('');
  const [payloadForm, setPayloadForm] = useState<Record<string, any>>({
    url: 'https://qrverse.app',
    name: 'Alex Rivera',
    title: 'Senior Product Strategist',
    phone: '+1 (555) 382-9102',
    email: 'alex@qrverse.dev',
    // Image defaults
    imageUrl: 'https://images.unsplash.com/photo-1506146332389-18140dc7b2fb?auto=format&fit=crop&w=1200&q=80',
    caption: 'Golden Hour Coastline',
    // Audio defaults
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
    artist: 'Solaris Wave',
    coverArtUrl: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=600&q=80',
    // Video defaults
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    posterUrl: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80',
    // Custom experience defaults
    headline: 'VIP Founder Access Pass',
    badgeText: 'FOUNDER CIRCLE',
    bodyText: 'Welcome to the exclusive QRVerse Founder Circle. Enjoy unlimited cloud file hosting and priority edge delivery.',
  });

  useEffect(() => {
    if (initialTypeFromUrl) setSelectedType(initialTypeFromUrl);
  }, [initialTypeFromUrl]);

  const qrCards = [
    { type: 'text' as QRType, emoji: '📝', name: 'Plain Text', desc: 'Encode raw unformatted text notes or code.', icon: FileText, category: 'General' },
    { type: 'url' as QRType, emoji: '🔗', name: 'Website URL', desc: 'Direct visitors to any website, landing page, or app.', icon: Globe, category: 'General' },
    { type: 'pdf' as QRType, emoji: '📄', name: 'PDF Document', desc: 'Share downloadable PDF brochures and specs.', icon: FileCode, category: 'Files' },
    { type: 'file' as QRType, emoji: '📁', name: 'Cloud File / Zip', desc: 'Host ZIP, DOCX, presentation, or data archives.', icon: Layers, category: 'Files' },
    { type: 'profile' as QRType, emoji: '👤', name: 'Digital Bio Profile', desc: 'Mobile-first social bio & multi-link hub.', icon: User, category: 'Identity' },
    { type: 'resume' as QRType, emoji: '📋', name: 'Resume / CV', desc: 'Recruiter-focused CV with experience & PDF.', icon: Briefcase, category: 'Identity' },
    { type: 'idcard' as QRType, emoji: '🪪', name: 'Digital ID Card', desc: 'Official staff badge with verification details.', icon: ShieldCheck, category: 'Identity' },
    { type: 'contact' as QRType, emoji: '📇', name: 'Contact / vCard', desc: 'Save contact directly into phone address book.', icon: User, category: 'Identity' },
    { type: 'social' as QRType, emoji: '📱', name: 'Social Media Hub', desc: 'Consolidate Twitter, Instagram, GitHub links.', icon: Share2, category: 'Social' },
    { type: 'business' as QRType, emoji: '🏢', name: 'Business Hub', desc: 'Company contact info, hours, and location.', icon: Briefcase, category: 'Business' },
    { type: 'menu' as QRType, emoji: '🍽️', name: 'Restaurant Menu', desc: 'Touchless dining menu with categories & prices.', icon: Utensils, category: 'Business' },
    { type: 'event' as QRType, emoji: '🎟️', name: 'Event Access Pass', desc: 'Conference schedule, venue map, and VIP pass.', icon: Zap, category: 'Events' },
    { type: 'location' as QRType, emoji: '📍', name: 'GPS Location', desc: 'Direct visitors on Google Maps coordinates.', icon: MapPin, category: 'General' },
    { type: 'image' as QRType, emoji: '🖼️', name: 'Image Showcase', desc: 'Display full-screen photos, artwork, or infographics.', icon: ImageIcon, category: 'Media' },
    { type: 'audio' as QRType, emoji: '🎵', name: 'Audio Player', desc: 'Stream podcasts, music tracks, or voice notes.', icon: Music, category: 'Media' },
    { type: 'video' as QRType, emoji: '🎥', name: 'Video Player', desc: 'Embed product trailers, tutorials, or video reels.', icon: VideoIcon, category: 'Media' },
    { type: 'payment' as QRType, emoji: '💳', name: 'Payment Link', desc: 'Direct to PayPal, Stripe, Venmo, or UPI.', icon: CreditCard, category: 'Business' },
    { type: 'custom' as QRType, emoji: '✨', name: 'Custom QR Experience', desc: 'Build custom HTML, styled cards & rich badges.', icon: Sparkles, category: 'Advanced' },
  ];

  const filteredCards = qrCards.filter(
    (c) => c.name.toLowerCase().includes(searchQuery.toLowerCase()) || c.desc.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-gray-200 dark:border-gray-800">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-gray-900 dark:text-white">
            {selectedType || editId ? 'QR Creation & Customization Studio' : 'Select Content Experience Module'}
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            {selectedType
              ? `Configure payload content and style for ${selectedType.toUpperCase()} QR.`
              : 'Choose from 18 high-performance digital content modules.'}
          </p>
        </div>

        {selectedType && !editId && (
          <button
            onClick={() => setSelectedType(null)}
            className="px-4 py-2 rounded-xl border border-gray-300 dark:border-gray-800 bg-gray-50 dark:bg-gray-900 text-xs font-semibold hover:bg-gray-100 dark:hover:bg-gray-800 transition flex items-center gap-2 self-start"
          >
            <ArrowLeft className="w-4 h-4" /> Change Module Type
          </button>
        )}
      </div>

      {/* STEP 1: 18 Modules Grid */}
      {!selectedType && !editId && (
        <div className="space-y-6">
          <div className="relative max-w-md">
            <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Filter 18 QR types (e.g. 'image', 'audio', 'video', 'resume')"
              className="w-full pl-10 pr-4 py-2.5 rounded-2xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCards.map((card) => {
              const Icon = card.icon;
              return (
                <button
                  key={card.type}
                  onClick={() => setSelectedType(card.type)}
                  className="p-6 rounded-3xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 hover:border-brand-500 transition text-left space-y-4 shadow-sm hover:shadow-xl group"
                >
                  <div className="flex items-center justify-between">
                    <div className="w-12 h-12 rounded-2xl bg-brand-500/10 text-brand-500 flex items-center justify-center text-xl group-hover:bg-brand-500 group-hover:text-white transition">
                      <span>{card.emoji}</span>
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-gray-100 dark:bg-gray-900 text-gray-500">
                      {card.category}
                    </span>
                  </div>

                  <div>
                    <h3 className="font-bold text-gray-900 dark:text-white text-base group-hover:text-brand-500 transition">
                      {card.name}
                    </h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 leading-relaxed">{card.desc}</p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* STEP 2: Custom Payload Forms */}
      {(selectedType || editId) && (
        <div className="space-y-8">
          <div className="p-6 rounded-3xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 shadow-md space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-brand-500 flex items-center gap-2">
              Content Payload Setup ({selectedType?.toUpperCase()})
            </h3>

            {/* URL */}
            {selectedType === 'url' && (
              <div>
                <label className="text-xs font-semibold text-gray-400 block mb-1">Target Website URL</label>
                <input
                  type="url"
                  value={payloadForm.url || 'https://qrverse.app'}
                  onChange={(e) => setPayloadForm({ ...payloadForm, url: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-800 bg-gray-50 dark:bg-gray-900 text-sm"
                  placeholder="https://example.com"
                />
              </div>
            )}

            {/* TEXT */}
            {selectedType === 'text' && (
              <div>
                <label className="text-xs font-semibold text-gray-400 block mb-1">Plain Text Payload</label>
                <textarea
                  rows={3}
                  value={payloadForm.text || 'Hello World from QRVerse!'}
                  onChange={(e) => setPayloadForm({ ...payloadForm, text: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-800 bg-gray-50 dark:bg-gray-900 text-sm"
                />
              </div>
            )}

            {/* IMAGE SHOWCASE */}
            {selectedType === 'image' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-gray-400 block mb-1">Image URL</label>
                  <input
                    type="url"
                    value={payloadForm.imageUrl || ''}
                    onChange={(e) => setPayloadForm({ ...payloadForm, imageUrl: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-800 bg-gray-50 dark:bg-gray-900 text-sm"
                    placeholder="https://images.unsplash.com/..."
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-400 block mb-1">Image Caption / Title</label>
                  <input
                    type="text"
                    value={payloadForm.caption || ''}
                    onChange={(e) => setPayloadForm({ ...payloadForm, caption: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-800 bg-gray-50 dark:bg-gray-900 text-sm"
                    placeholder="e.g. Golden Gate Sunset"
                  />
                </div>
              </div>
            )}

            {/* AUDIO PLAYER */}
            {selectedType === 'audio' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-gray-400 block mb-1">Audio Stream MP3 URL</label>
                  <input
                    type="url"
                    value={payloadForm.audioUrl || ''}
                    onChange={(e) => setPayloadForm({ ...payloadForm, audioUrl: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-800 bg-gray-50 dark:bg-gray-900 text-sm"
                    placeholder="https://domain.com/track.mp3"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-400 block mb-1">Track Title & Artist</label>
                  <input
                    type="text"
                    value={payloadForm.artist || ''}
                    onChange={(e) => setPayloadForm({ ...payloadForm, artist: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-800 bg-gray-50 dark:bg-gray-900 text-sm"
                    placeholder="e.g. Solaris Wave"
                  />
                </div>
              </div>
            )}

            {/* VIDEO PLAYER */}
            {selectedType === 'video' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-gray-400 block mb-1">Video Stream MP4 URL</label>
                  <input
                    type="url"
                    value={payloadForm.videoUrl || ''}
                    onChange={(e) => setPayloadForm({ ...payloadForm, videoUrl: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-800 bg-gray-50 dark:bg-gray-900 text-sm"
                    placeholder="https://domain.com/video.mp4"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-400 block mb-1">Video Title</label>
                  <input
                    type="text"
                    value={payloadForm.title || ''}
                    onChange={(e) => setPayloadForm({ ...payloadForm, title: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-800 bg-gray-50 dark:bg-gray-900 text-sm"
                    placeholder="e.g. Keynote Product Video"
                  />
                </div>
              </div>
            )}

            {/* CUSTOM EXPERIENCE */}
            {selectedType === 'custom' && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-semibold text-gray-400 block mb-1">Headline Title</label>
                    <input
                      type="text"
                      value={payloadForm.headline || ''}
                      onChange={(e) => setPayloadForm({ ...payloadForm, headline: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-800 bg-gray-50 dark:bg-gray-900 text-sm"
                      placeholder="e.g. VIP Founder Pass"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-gray-400 block mb-1">Badge Text</label>
                    <input
                      type="text"
                      value={payloadForm.badgeText || ''}
                      onChange={(e) => setPayloadForm({ ...payloadForm, badgeText: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-800 bg-gray-50 dark:bg-gray-900 text-sm"
                      placeholder="e.g. FOUNDER TIER 1"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-400 block mb-1">Custom Message Body</label>
                  <textarea
                    rows={3}
                    value={payloadForm.bodyText || ''}
                    onChange={(e) => setPayloadForm({ ...payloadForm, bodyText: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-800 bg-gray-50 dark:bg-gray-900 text-sm"
                    placeholder="Enter custom experience message..."
                  />
                </div>
              </div>
            )}

            {/* CONTACT VCARD */}
            {selectedType === 'contact' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-gray-400 block mb-1">Full Name</label>
                  <input
                    type="text"
                    value={payloadForm.name || 'Alex Rivera'}
                    onChange={(e) => setPayloadForm({ ...payloadForm, name: e.target.value })}
                    className="w-full px-4 py-2 rounded-xl border border-gray-300 dark:border-gray-800 bg-gray-50 dark:bg-gray-900 text-sm"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-400 block mb-1">Phone Number</label>
                  <input
                    type="text"
                    value={payloadForm.phone || '+1 (555) 382-9102'}
                    onChange={(e) => setPayloadForm({ ...payloadForm, phone: e.target.value })}
                    className="w-full px-4 py-2 rounded-xl border border-gray-300 dark:border-gray-800 bg-gray-50 dark:bg-gray-900 text-sm"
                  />
                </div>
              </div>
            )}
          </div>

          <CustomizationStudio
            initialType={selectedType || 'url'}
            initialContent={payloadForm}
            existingQrId={editId || undefined}
          />
        </div>
      )}
    </div>
  );
}

export default function CreateQRPage() {
  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100 transition-colors duration-200">
      <Navbar />

      <div className="flex-1 flex max-w-7xl w-full mx-auto">
        <Sidebar />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 space-y-8 overflow-hidden pb-24 lg:pb-8">
          <Suspense fallback={<div className="p-8 text-center text-gray-400">Loading Studio...</div>}>
            <CreateQRContent />
          </Suspense>
        </main>
      </div>

      <MobileNav />
    </div>
  );
}
