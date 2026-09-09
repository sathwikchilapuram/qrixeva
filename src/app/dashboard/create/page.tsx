'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Sidebar } from '@/components/layout/Sidebar';
import { MobileNav } from '@/components/layout/MobileNav';
import { CustomizationStudio } from '@/components/qr/CustomizationStudio';
import { useSearchParams } from 'next/navigation';
import { useApp } from '@/lib/AppContext';
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
  UploadCloud,
  Mail,
  Phone,
  MessageSquare,
} from 'lucide-react';

import { QRType } from '@/types';

function CreateQRContent() {
  const { addFile, addToast } = useApp();
  const searchParams = useSearchParams();
  const initialTypeFromUrl = (searchParams.get('type') as QRType) || null;
  const initialUrlFromParams = searchParams.get('url') || null;
  const editId = searchParams.get('edit') || null;

  const [selectedType, setSelectedType] = useState<QRType | null>(initialTypeFromUrl);
  const [searchQuery, setSearchQuery] = useState('');
  const [uploadingFile, setUploadingFile] = useState(false);
  const [fileDetails, setFileDetails] = useState<{ name: string; size: string; url: string } | null>(
    initialUrlFromParams
      ? {
          name: initialUrlFromParams.split('/').pop() || 'Uploaded File',
          size: 'Cloud File',
          url: initialUrlFromParams,
        }
      : null
  );

  // Human-friendly payload form state
  const [formState, setFormState] = useState<Record<string, any>>({
    url: 'https://qrixeva.vercel.app',
    text: '',
    email: '',
    subject: '',
    message: '',
    phone: '',
    smsPhone: '',
    smsMessage: '',
    waPhone: '',
    waMessage: '',
    wifiSsid: '',
    wifiPassword: '',
    wifiSecurity: 'WPA',
    wifiHidden: false,
    upiId: '',
    upiName: '',
    upiAmount: '',
    upiNote: '',
    name: 'Alex Rivera',
    company: '',
    jobTitle: '',
    address: '',
    website: '',
    imageUrl: '',
    caption: '',
    audioUrl: '',
    artist: '',
    videoUrl: '',
    title: '',
    headline: '',
    badgeText: '',
    bodyText: '',
    // Resume specific
    professionalTitle: '',
    about: '',
    skills: '',
    experience: '',
    education: '',
    // Profile & ID specific
    bio: '',
    idNumber: '',
    organization: '',
    role: '',
  });

  useEffect(() => {
    if (initialTypeFromUrl) setSelectedType(initialTypeFromUrl);
    if (initialUrlFromParams) {
      updateForm('url', initialUrlFromParams);
      updateForm('fileUrl', initialUrlFromParams);
      updateForm('pdfUrl', initialUrlFromParams);
    }
  }, [initialTypeFromUrl, initialUrlFromParams]);

  const updateForm = (key: string, val: any) => {
    setFormState((prev) => ({ ...prev, [key]: val }));
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileObj = e.target.files?.[0];
    if (!fileObj) return;

    setUploadingFile(true);
    try {
      const formData = new FormData();
      formData.append('file', fileObj);

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const json = await res.json();
      const storageUrl = json.data?.storageUrl || URL.createObjectURL(fileObj);
      const formattedSize = (fileObj.size / (1024 * 1024)).toFixed(2) + ' MB';

      setFileDetails({
        name: fileObj.name,
        size: formattedSize,
        url: storageUrl,
      });

      updateForm('url', storageUrl);
      updateForm('fileUrl', storageUrl);
      updateForm('pdfUrl', storageUrl);

      // Save to AppContext files list
      addFile({
        id: 'file-' + Date.now(),
        name: fileObj.name,
        type: fileObj.type || 'application/octet-stream',
        size: fileObj.size,
        storageUrl: storageUrl,
        downloads: 0,
        createdAt: new Date().toISOString(),
      });

      addToast('success', `File "${fileObj.name}" uploaded successfully!`);
    } catch (err) {
      console.error('File upload error', err);
      addToast('error', 'File upload failed. Please try again.');
    } finally {
      setUploadingFile(false);
    }
  };

  const qrCards = [
    { type: 'text' as QRType, emoji: '📝', name: 'Text', desc: 'Share plain text or notes', icon: FileText, category: 'General' },
    { type: 'url' as QRType, emoji: '🔗', name: 'Website / Link', desc: 'Open any website or URL link', icon: Globe, category: 'General' },
    { type: 'file' as QRType, emoji: '📄', name: 'PDF / File', desc: 'Upload a PDF, document, or media file directly', icon: Layers, category: 'Files' },
    { type: 'payment' as QRType, emoji: '💳', name: 'Payment / UPI', desc: 'Collect instant payments via Google Pay, PhonePe, Paytm', icon: CreditCard, category: 'Payments' },
    { type: 'contact' as QRType, emoji: '📇', name: 'Contact (vCard)', desc: 'Share contact details & save to phone address book', icon: User, category: 'Identity' },
    { type: 'profile' as QRType, emoji: '👤', name: 'Digital Profile', desc: 'Share your personal bio, photo, & contact links', icon: User, category: 'Identity' },
    { type: 'resume' as QRType, emoji: '📋', name: 'Resume', desc: 'Share your professional resume & download PDF', icon: Briefcase, category: 'Identity' },
    { type: 'idcard' as QRType, emoji: '🪪', name: 'Digital ID Badge', desc: 'Share official employee or member ID badge details', icon: ShieldCheck, category: 'Identity' },
    { type: 'menu' as QRType, emoji: '🍽️', name: 'Restaurant Menu', desc: 'Share digital touchless food & drink menu', icon: Utensils, category: 'Business' },
    { type: 'event' as QRType, emoji: '🎟️', name: 'Event Pass', desc: 'Share event pass & venue schedule', icon: Zap, category: 'Events' },
    { type: 'location' as QRType, emoji: '📍', name: 'Location', desc: 'Direct visitors on Google Maps', icon: MapPin, category: 'General' },
    { type: 'image' as QRType, emoji: '🖼️', name: 'Image', desc: 'Upload and share high-resolution photos', icon: ImageIcon, category: 'Media' },
    { type: 'audio' as QRType, emoji: '🎵', name: 'Audio', desc: 'Upload music or audio tracks', icon: Music, category: 'Media' },
    { type: 'video' as QRType, emoji: '🎥', name: 'Video', desc: 'Upload video reels or promo clips', icon: VideoIcon, category: 'Media' },
    { type: 'email' as QRType, emoji: '✉️', name: 'Email', desc: 'Open pre-formatted email message', icon: Mail, category: 'Communication' },
    { type: 'phone' as QRType, emoji: '📞', name: 'Phone Call', desc: 'Initiate direct phone call', icon: Phone, category: 'Communication' },
    { type: 'sms' as QRType, emoji: '💬', name: 'SMS Message', desc: 'Send direct text message', icon: Smartphone, category: 'Communication' },
    { type: 'whatsapp' as QRType, emoji: '🟢', name: 'WhatsApp', desc: 'Open direct WhatsApp chat with message', icon: MessageSquare, category: 'Communication' },
    { type: 'wifi' as QRType, emoji: '📶', name: 'Wi-Fi Network', desc: 'Connect guests to Wi-Fi without typing password', icon: Zap, category: 'Network' },
    { type: 'custom' as QRType, emoji: '✨', name: 'Custom Card', desc: 'Create custom branded pass or promotion card', icon: Sparkles, category: 'Advanced' },
  ];

  const filteredCards = qrCards.filter(
    (c) => c.name.toLowerCase().includes(searchQuery.toLowerCase()) || c.desc.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-gray-200 dark:border-gray-800">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-gray-900 dark:text-white">
            {selectedType || editId ? 'Create & Customize QR Code' : 'What kind of QR code do you want to create?'}
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            {selectedType
              ? 'Enter your information below, then customize your QR design.'
              : 'Select a type below to get started immediately.'}
          </p>
        </div>

        {selectedType && !editId && (
          <button
            onClick={() => setSelectedType(null)}
            className="px-4 py-2 rounded-xl border border-gray-300 dark:border-gray-800 bg-gray-50 dark:bg-gray-900 text-xs font-semibold hover:bg-gray-100 dark:hover:bg-gray-800 transition flex items-center gap-2 self-start"
          >
            <ArrowLeft className="w-4 h-4" /> Change QR Type
          </button>
        )}
      </div>

      {/* STEP 1: Select QR Type Grid */}
      {!selectedType && !editId && (
        <div className="space-y-6">
          <div className="relative max-w-md">
            <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search QR types (e.g. text, website, PDF, contact, UPI)..."
              className="w-full pl-10 pr-4 py-2.5 rounded-2xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCards.map((card) => {
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

      {/* STEP 2: Natural Language Input Forms */}
      {(selectedType || editId) && (
        <div className="space-y-8">
          <div className="p-6 rounded-3xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 shadow-md space-y-6">
            {/* TEXT QR */}
            {selectedType === 'text' && (
              <div className="space-y-3">
                <h3 className="text-base font-bold text-gray-900 dark:text-white">Enter Text</h3>
                <p className="text-xs text-gray-500">Enter any text you want to share through this QR code.</p>
                <textarea
                  rows={4}
                  value={formState.text}
                  onChange={(e) => updateForm('text', e.target.value)}
                  className="w-full px-4 py-3 rounded-2xl border border-gray-300 dark:border-gray-800 bg-gray-50 dark:bg-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
                  placeholder="Type or paste your text here..."
                />
              </div>
            )}

            {/* URL QR */}
            {selectedType === 'url' && (
              <div className="space-y-3">
                <h3 className="text-base font-bold text-gray-900 dark:text-white">Enter URL</h3>
                <p className="text-xs text-gray-500">Enter the website or link you want people to open.</p>
                <input
                  type="url"
                  value={formState.url}
                  onChange={(e) => updateForm('url', e.target.value)}
                  className="w-full px-4 py-3 rounded-2xl border border-gray-300 dark:border-gray-800 bg-gray-50 dark:bg-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
                  placeholder="https://example.com"
                />
              </div>
            )}

            {/* EMAIL QR */}
            {selectedType === 'email' && (
              <div className="space-y-4">
                <h3 className="text-base font-bold text-gray-900 dark:text-white">Enter Email Details</h3>
                <div className="space-y-3">
                  <div>
                    <label className="text-xs font-semibold text-gray-600 dark:text-gray-400 block mb-1">Email Address</label>
                    <input
                      type="email"
                      value={formState.email}
                      onChange={(e) => updateForm('email', e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-800 bg-gray-50 dark:bg-gray-900 text-sm"
                      placeholder="you@example.com"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-gray-600 dark:text-gray-400 block mb-1">Subject</label>
                    <input
                      type="text"
                      value={formState.subject}
                      onChange={(e) => updateForm('subject', e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-800 bg-gray-50 dark:bg-gray-900 text-sm"
                      placeholder="Email subject"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-gray-600 dark:text-gray-400 block mb-1">Message</label>
                    <textarea
                      rows={3}
                      value={formState.message}
                      onChange={(e) => updateForm('message', e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-800 bg-gray-50 dark:bg-gray-900 text-sm"
                      placeholder="Write your message..."
                    />
                  </div>
                </div>
              </div>
            )}

            {/* PHONE QR */}
            {selectedType === 'phone' && (
              <div className="space-y-4">
                <h3 className="text-base font-bold text-gray-900 dark:text-white">Enter Phone Number</h3>
                <div>
                  <label className="text-xs font-semibold text-gray-600 dark:text-gray-400 block mb-1">Phone Number</label>
                  <input
                    type="text"
                    value={formState.phone}
                    onChange={(e) => updateForm('phone', e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-800 bg-gray-50 dark:bg-gray-900 text-sm"
                    placeholder="+91 XXXXX XXXXX"
                  />
                </div>
              </div>
            )}

            {/* SMS QR */}
            {selectedType === 'sms' && (
              <div className="space-y-4">
                <h3 className="text-base font-bold text-gray-900 dark:text-white">Enter SMS Details</h3>
                <div className="space-y-3">
                  <div>
                    <label className="text-xs font-semibold text-gray-600 dark:text-gray-400 block mb-1">Phone Number</label>
                    <input
                      type="text"
                      value={formState.smsPhone}
                      onChange={(e) => updateForm('smsPhone', e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-800 bg-gray-50 dark:bg-gray-900 text-sm"
                      placeholder="+91 XXXXX XXXXX"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-gray-600 dark:text-gray-400 block mb-1">Message</label>
                    <textarea
                      rows={3}
                      value={formState.smsMessage}
                      onChange={(e) => updateForm('smsMessage', e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-800 bg-gray-50 dark:bg-gray-900 text-sm"
                      placeholder="Write your message..."
                    />
                  </div>
                </div>
              </div>
            )}

            {/* WHATSAPP QR */}
            {selectedType === 'whatsapp' && (
              <div className="space-y-4">
                <h3 className="text-base font-bold text-gray-900 dark:text-white">Enter WhatsApp Details</h3>
                <div className="space-y-3">
                  <div>
                    <label className="text-xs font-semibold text-gray-600 dark:text-gray-400 block mb-1">WhatsApp Phone Number (with Country Code)</label>
                    <input
                      type="text"
                      value={formState.waPhone || formState.phone}
                      onChange={(e) => {
                        updateForm('waPhone', e.target.value);
                        updateForm('phone', e.target.value);
                      }}
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-800 bg-gray-50 dark:bg-gray-900 text-sm"
                      placeholder="e.g. +91 9876543210 or 15551234567"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-gray-600 dark:text-gray-400 block mb-1">Pre-filled Message (Optional)</label>
                    <textarea
                      rows={3}
                      value={formState.waMessage || formState.message}
                      onChange={(e) => {
                        updateForm('waMessage', e.target.value);
                        updateForm('message', e.target.value);
                      }}
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-800 bg-gray-50 dark:bg-gray-900 text-sm"
                      placeholder="Write your message..."
                    />
                  </div>
                </div>
              </div>
            )}

            {/* WIFI QR */}
            {(selectedType as string) === 'wifi' && (
              <div className="space-y-4">
                <h3 className="text-base font-bold text-gray-900 dark:text-white">Enter Wi-Fi Details</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-semibold text-gray-600 dark:text-gray-400 block mb-1">Wi-Fi Name (SSID)</label>
                    <input
                      type="text"
                      value={formState.wifiSsid}
                      onChange={(e) => updateForm('wifiSsid', e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-800 bg-gray-50 dark:bg-gray-900 text-sm"
                      placeholder="MyHomeNetwork"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-gray-600 dark:text-gray-400 block mb-1">Password</label>
                    <input
                      type="password"
                      value={formState.wifiPassword}
                      onChange={(e) => updateForm('wifiPassword', e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-800 bg-gray-50 dark:bg-gray-900 text-sm"
                      placeholder="Wi-Fi Password"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-gray-600 dark:text-gray-400 block mb-1">Security</label>
                    <select
                      value={formState.wifiSecurity}
                      onChange={(e) => updateForm('wifiSecurity', e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-800 bg-gray-50 dark:bg-gray-900 text-sm"
                    >
                      <option value="WPA">WPA / WPA2 / WPA3</option>
                      <option value="WEP">WEP</option>
                      <option value="nopass">Open (No Password)</option>
                    </select>
                  </div>
                  <div className="flex items-center pt-6">
                    <label className="text-xs font-semibold text-gray-600 dark:text-gray-400 flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formState.wifiHidden}
                        onChange={(e) => updateForm('wifiHidden', e.target.checked)}
                        className="rounded text-brand-500 focus:ring-brand-500"
                      />
                      Hidden Network
                    </label>
                  </div>
                </div>
              </div>
            )}

            {/* FILE / PDF QR */}
            {(selectedType === 'pdf' || selectedType === 'file') && (
              <div className="space-y-4">
                <div>
                  <h3 className="text-base font-bold text-gray-900 dark:text-white">
                    Upload PDF or Document File
                  </h3>
                  <p className="text-xs text-gray-500 mt-1">
                    Select a file from your computer or phone to attach to this QR code.
                  </p>
                </div>
                
                <div className="p-8 border-2 border-dashed border-brand-500/40 hover:border-brand-500 rounded-3xl bg-gray-50 dark:bg-gray-900 text-center space-y-4 transition">
                  <UploadCloud className="w-12 h-12 text-brand-500 mx-auto" />

                  {uploadingFile ? (
                    <div className="space-y-2 py-4">
                      <div className="inline-block animate-spin w-8 h-8 border-3 border-brand-500 border-t-transparent rounded-full" />
                      <p className="text-sm font-bold text-brand-500">Uploading file...</p>
                    </div>
                  ) : fileDetails ? (
                    <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl max-w-md mx-auto text-left space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-emerald-500 uppercase tracking-wider flex items-center gap-1">
                          ✓ File Uploaded Successfully
                        </span>
                        <span className="text-[11px] text-gray-400 font-medium">{fileDetails.size}</span>
                      </div>
                      <p className="text-sm font-bold text-gray-900 dark:text-white truncate">{fileDetails.name}</p>
                      <label className="text-xs font-bold text-brand-500 hover:underline cursor-pointer block pt-2 border-t border-emerald-500/20">
                        Choose Different File
                        <input
                          type="file"
                          accept=".pdf,application/pdf,.doc,.docx,.ppt,.pptx,.zip,image/*"
                          onChange={handleFileUpload}
                          className="hidden"
                        />
                      </label>
                    </div>
                  ) : (
                    <div className="space-y-4 py-2">
                      <label className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-brand-500 hover:bg-brand-600 text-white font-bold text-sm shadow-lg shadow-brand-500/25 cursor-pointer transition">
                        <UploadCloud className="w-5 h-5" />
                        Select & Upload File
                        <input
                          type="file"
                          accept=".pdf,application/pdf,.doc,.docx,.ppt,.pptx,.zip,image/*"
                          onChange={handleFileUpload}
                          className="hidden"
                        />
                      </label>
                      <p className="text-xs text-gray-400">
                        Supported files: PDF documents, DOCX, PPT, ZIP, Images • Maximum file size: Up to 50MB
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* IMAGE QR */}
            {selectedType === 'image' && (
              <div className="space-y-4">
                <h3 className="text-base font-bold text-gray-900 dark:text-white">Upload Your Image</h3>
                <p className="text-xs text-gray-500">Upload an image and create a QR code for it.</p>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-semibold text-gray-600 dark:text-gray-400 block mb-1">Image Link / URL</label>
                    <input
                      type="url"
                      value={formState.imageUrl}
                      onChange={(e) => updateForm('imageUrl', e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-800 bg-gray-50 dark:bg-gray-900 text-sm"
                      placeholder="https://example.com/image.jpg"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-gray-600 dark:text-gray-400 block mb-1">Image Caption (Optional)</label>
                    <input
                      type="text"
                      value={formState.caption}
                      onChange={(e) => updateForm('caption', e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-800 bg-gray-50 dark:bg-gray-900 text-sm"
                      placeholder="e.g. Sunset Coastline"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* VIDEO QR */}
            {selectedType === 'video' && (
              <div className="space-y-4">
                <h3 className="text-base font-bold text-gray-900 dark:text-white">Upload Your Video</h3>
                <p className="text-xs text-gray-500">Upload a video or enter a video stream link.</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-semibold text-gray-600 dark:text-gray-400 block mb-1">Video Link / URL</label>
                    <input
                      type="url"
                      value={formState.videoUrl}
                      onChange={(e) => updateForm('videoUrl', e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-800 bg-gray-50 dark:bg-gray-900 text-sm"
                      placeholder="https://example.com/video.mp4"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-gray-600 dark:text-gray-400 block mb-1">Video Title</label>
                    <input
                      type="text"
                      value={formState.title}
                      onChange={(e) => updateForm('title', e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-800 bg-gray-50 dark:bg-gray-900 text-sm"
                      placeholder="e.g. Product Demo Reel"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* AUDIO QR */}
            {selectedType === 'audio' && (
              <div className="space-y-4">
                <h3 className="text-base font-bold text-gray-900 dark:text-white">Upload Your Audio</h3>
                <p className="text-xs text-gray-500">Upload an audio file or stream track.</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-semibold text-gray-600 dark:text-gray-400 block mb-1">Audio MP3 Link / URL</label>
                    <input
                      type="url"
                      value={formState.audioUrl}
                      onChange={(e) => updateForm('audioUrl', e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-800 bg-gray-50 dark:bg-gray-900 text-sm"
                      placeholder="https://example.com/song.mp3"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-gray-600 dark:text-gray-400 block mb-1">Artist / Track Name</label>
                    <input
                      type="text"
                      value={formState.artist}
                      onChange={(e) => updateForm('artist', e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-800 bg-gray-50 dark:bg-gray-900 text-sm"
                      placeholder="e.g. Solaris Wave"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* RESUME QR */}
            {selectedType === 'resume' && (
              <div className="space-y-4">
                <h3 className="text-base font-bold text-gray-900 dark:text-white">Create Your Resume QR</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-semibold text-gray-600 dark:text-gray-400 block mb-1">Your Name</label>
                    <input
                      type="text"
                      value={formState.name}
                      onChange={(e) => updateForm('name', e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-800 bg-gray-50 dark:bg-gray-900 text-sm"
                      placeholder="e.g. Alex Rivera"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-gray-600 dark:text-gray-400 block mb-1">Professional Title</label>
                    <input
                      type="text"
                      value={formState.professionalTitle}
                      onChange={(e) => updateForm('professionalTitle', e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-800 bg-gray-50 dark:bg-gray-900 text-sm"
                      placeholder="e.g. Senior Software Engineer"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-gray-600 dark:text-gray-400 block mb-1">Email</label>
                    <input
                      type="email"
                      value={formState.email}
                      onChange={(e) => updateForm('email', e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-800 bg-gray-50 dark:bg-gray-900 text-sm"
                      placeholder="you@example.com"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-gray-600 dark:text-gray-400 block mb-1">Phone</label>
                    <input
                      type="text"
                      value={formState.phone}
                      onChange={(e) => updateForm('phone', e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-800 bg-gray-50 dark:bg-gray-900 text-sm"
                      placeholder="+1 (555) 000-0000"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-gray-600 dark:text-gray-400 block mb-1">About You</label>
                  <textarea
                    rows={2}
                    value={formState.about}
                    onChange={(e) => updateForm('about', e.target.value)}
                    className="w-full px-4 py-2 rounded-xl border border-gray-300 dark:border-gray-800 bg-gray-50 dark:bg-gray-900 text-sm"
                    placeholder="Brief professional summary..."
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="text-xs font-semibold text-gray-600 dark:text-gray-400 block mb-1">Skills</label>
                    <input
                      type="text"
                      value={formState.skills}
                      onChange={(e) => updateForm('skills', e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-800 bg-gray-50 dark:bg-gray-900 text-sm"
                      placeholder="e.g. React, TypeScript, Node.js"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-gray-600 dark:text-gray-400 block mb-1">Experience</label>
                    <input
                      type="text"
                      value={formState.experience}
                      onChange={(e) => updateForm('experience', e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-800 bg-gray-50 dark:bg-gray-900 text-sm"
                      placeholder="e.g. 5+ years in Tech"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-gray-600 dark:text-gray-400 block mb-1">Education</label>
                    <input
                      type="text"
                      value={formState.education}
                      onChange={(e) => updateForm('education', e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-800 bg-gray-50 dark:bg-gray-900 text-sm"
                      placeholder="e.g. B.S. Computer Science"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* DIGITAL PROFILE */}
            {selectedType === 'profile' && (
              <div className="space-y-4">
                <h3 className="text-base font-bold text-gray-900 dark:text-white">Create Your Digital Profile</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-semibold text-gray-600 dark:text-gray-400 block mb-1">Profile Name</label>
                    <input
                      type="text"
                      value={formState.name}
                      onChange={(e) => updateForm('name', e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-800 bg-gray-50 dark:bg-gray-900 text-sm"
                      placeholder="Your Full Name"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-gray-600 dark:text-gray-400 block mb-1">Website</label>
                    <input
                      type="url"
                      value={formState.website}
                      onChange={(e) => updateForm('website', e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-800 bg-gray-50 dark:bg-gray-900 text-sm"
                      placeholder="https://yourwebsite.com"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-600 dark:text-gray-400 block mb-1">Bio</label>
                  <textarea
                    rows={2}
                    value={formState.bio}
                    onChange={(e) => updateForm('bio', e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-800 bg-gray-50 dark:bg-gray-900 text-sm"
                    placeholder="Short bio about yourself..."
                  />
                </div>
              </div>
            )}

            {/* DIGITAL ID */}
            {selectedType === 'idcard' && (
              <div className="space-y-4">
                <h3 className="text-base font-bold text-gray-900 dark:text-white">Create Your Digital ID</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-semibold text-gray-600 dark:text-gray-400 block mb-1">Full Name</label>
                    <input
                      type="text"
                      value={formState.name}
                      onChange={(e) => updateForm('name', e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-800 bg-gray-50 dark:bg-gray-900 text-sm"
                      placeholder="e.g. Jane Doe"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-gray-600 dark:text-gray-400 block mb-1">ID Number</label>
                    <input
                      type="text"
                      value={formState.idNumber}
                      onChange={(e) => updateForm('idNumber', e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-800 bg-gray-50 dark:bg-gray-900 text-sm"
                      placeholder="e.g. EMP-9042"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-gray-600 dark:text-gray-400 block mb-1">Organization</label>
                    <input
                      type="text"
                      value={formState.organization}
                      onChange={(e) => updateForm('organization', e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-800 bg-gray-50 dark:bg-gray-900 text-sm"
                      placeholder="e.g. Acme Corp"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-gray-600 dark:text-gray-400 block mb-1">Role / Designation</label>
                    <input
                      type="text"
                      value={formState.role}
                      onChange={(e) => updateForm('role', e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-800 bg-gray-50 dark:bg-gray-900 text-sm"
                      placeholder="e.g. Product Lead"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* CONTACT VCARD */}
            {selectedType === 'contact' && (
              <div className="space-y-4">
                <h3 className="text-base font-bold text-gray-900 dark:text-white">Enter Contact Details</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-semibold text-gray-600 dark:text-gray-400 block mb-1">Full Name</label>
                    <input
                      type="text"
                      value={formState.name}
                      onChange={(e) => updateForm('name', e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-800 bg-gray-50 dark:bg-gray-900 text-sm"
                      placeholder="e.g. John Smith"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-gray-600 dark:text-gray-400 block mb-1">Phone Number</label>
                    <input
                      type="text"
                      value={formState.phone}
                      onChange={(e) => updateForm('phone', e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-800 bg-gray-50 dark:bg-gray-900 text-sm"
                      placeholder="+1 (555) 000-0000"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-gray-600 dark:text-gray-400 block mb-1">Email</label>
                    <input
                      type="email"
                      value={formState.email}
                      onChange={(e) => updateForm('email', e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-800 bg-gray-50 dark:bg-gray-900 text-sm"
                      placeholder="john@example.com"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-gray-600 dark:text-gray-400 block mb-1">Company</label>
                    <input
                      type="text"
                      value={formState.company}
                      onChange={(e) => updateForm('company', e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-800 bg-gray-50 dark:bg-gray-900 text-sm"
                      placeholder="Acme Inc."
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-gray-600 dark:text-gray-400 block mb-1">Job Title</label>
                    <input
                      type="text"
                      value={formState.jobTitle}
                      onChange={(e) => updateForm('jobTitle', e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-800 bg-gray-50 dark:bg-gray-900 text-sm"
                      placeholder="Managing Director"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-gray-600 dark:text-gray-400 block mb-1">Website</label>
                    <input
                      type="url"
                      value={formState.website}
                      onChange={(e) => updateForm('website', e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-800 bg-gray-50 dark:bg-gray-900 text-sm"
                      placeholder="https://example.com"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* UPI PAYMENT QR */}
            {selectedType === 'payment' && (
              <div className="space-y-4">
                <h3 className="text-base font-bold text-gray-900 dark:text-white">Enter UPI Payment Details</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-semibold text-gray-600 dark:text-gray-400 block mb-1">UPI ID</label>
                    <input
                      type="text"
                      value={formState.upiId}
                      onChange={(e) => updateForm('upiId', e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-800 bg-gray-50 dark:bg-gray-900 text-sm"
                      placeholder="example@upi"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-gray-600 dark:text-gray-400 block mb-1">Payee Name</label>
                    <input
                      type="text"
                      value={formState.upiName}
                      onChange={(e) => updateForm('upiName', e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-800 bg-gray-50 dark:bg-gray-900 text-sm"
                      placeholder="John"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-gray-600 dark:text-gray-400 block mb-1">Amount (₹)</label>
                    <input
                      type="number"
                      value={formState.upiAmount}
                      onChange={(e) => updateForm('upiAmount', e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-800 bg-gray-50 dark:bg-gray-900 text-sm"
                      placeholder="500"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-gray-600 dark:text-gray-400 block mb-1">Message / Note</label>
                    <input
                      type="text"
                      value={formState.upiNote}
                      onChange={(e) => updateForm('upiNote', e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-800 bg-gray-50 dark:bg-gray-900 text-sm"
                      placeholder="Payment for order"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* RESTAURANT MENU */}
            {selectedType === 'menu' && (
              <div className="space-y-4">
                <h3 className="text-base font-bold text-gray-900 dark:text-white">Enter Restaurant Menu Details</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-semibold text-gray-600 dark:text-gray-400 block mb-1">Restaurant Name</label>
                    <input
                      type="text"
                      value={formState.name || ''}
                      onChange={(e) => updateForm('name', e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-800 bg-gray-50 dark:bg-gray-900 text-sm"
                      placeholder="e.g. La Piazza Bistro"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-gray-600 dark:text-gray-400 block mb-1">Cuisine / Tagline</label>
                    <input
                      type="text"
                      value={formState.professionalTitle || ''}
                      onChange={(e) => updateForm('professionalTitle', e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-800 bg-gray-50 dark:bg-gray-900 text-sm"
                      placeholder="e.g. Authentic Italian & Woodfired Pizza"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-600 dark:text-gray-400 block mb-1">Menu Highlights & Description</label>
                  <textarea
                    rows={3}
                    value={formState.about || ''}
                    onChange={(e) => updateForm('about', e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-800 bg-gray-50 dark:bg-gray-900 text-sm"
                    placeholder="e.g. Fresh handmade pasta, artisan wines, gluten-free desserts..."
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-600 dark:text-gray-400 block mb-1">Upload PDF / Image Menu</label>
                  <div className="p-4 border-2 border-dashed border-gray-300 dark:border-gray-800 rounded-2xl bg-gray-50 dark:bg-gray-900 text-center space-y-2">
                    <label className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-brand-500 hover:bg-brand-600 text-white font-bold text-xs cursor-pointer transition">
                      <UploadCloud className="w-4 h-4" /> Select & Upload Menu File
                      <input
                        type="file"
                        accept=".pdf,image/*"
                        onChange={handleFileUpload}
                        className="hidden"
                      />
                    </label>
                    {fileDetails && <p className="text-xs font-semibold text-emerald-500">✓ Uploaded: {fileDetails.name}</p>}
                  </div>
                </div>
              </div>
            )}

            {/* EVENT PASS */}
            {selectedType === 'event' && (
              <div className="space-y-4">
                <h3 className="text-base font-bold text-gray-900 dark:text-white">Enter Event Pass Details</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-semibold text-gray-600 dark:text-gray-400 block mb-1">Event Title</label>
                    <input
                      type="text"
                      value={formState.title || ''}
                      onChange={(e) => updateForm('title', e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-800 bg-gray-50 dark:bg-gray-900 text-sm"
                      placeholder="e.g. Global Tech Expo 2026"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-gray-600 dark:text-gray-400 block mb-1">Organizer Name</label>
                    <input
                      type="text"
                      value={formState.name || ''}
                      onChange={(e) => updateForm('name', e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-800 bg-gray-50 dark:bg-gray-900 text-sm"
                      placeholder="e.g. Tech Events Inc."
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-gray-600 dark:text-gray-400 block mb-1">Date & Time</label>
                    <input
                      type="text"
                      value={formState.headline || ''}
                      onChange={(e) => updateForm('headline', e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-800 bg-gray-50 dark:bg-gray-900 text-sm"
                      placeholder="e.g. November 20, 2026 • 09:00 AM PST"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-gray-600 dark:text-gray-400 block mb-1">Venue / Address</label>
                    <input
                      type="text"
                      value={formState.address || ''}
                      onChange={(e) => updateForm('address', e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-800 bg-gray-50 dark:bg-gray-900 text-sm"
                      placeholder="e.g. Center Convention Hall, SF"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-600 dark:text-gray-400 block mb-1">Event Description</label>
                  <textarea
                    rows={3}
                    value={formState.bodyText || ''}
                    onChange={(e) => updateForm('bodyText', e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-800 bg-gray-50 dark:bg-gray-900 text-sm"
                    placeholder="Event agenda, keynote speakers, and pass instructions..."
                  />
                </div>
              </div>
            )}

            {/* LOCATION */}
            {selectedType === 'location' && (
              <div className="space-y-4">
                <h3 className="text-base font-bold text-gray-900 dark:text-white">Enter Location Details</h3>
                <div className="space-y-3">
                  <div>
                    <label className="text-xs font-semibold text-gray-600 dark:text-gray-400 block mb-1">Location Name</label>
                    <input
                      type="text"
                      value={formState.title || ''}
                      onChange={(e) => updateForm('title', e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-800 bg-gray-50 dark:bg-gray-900 text-sm"
                      placeholder="e.g. Qrixeva Headquarters"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-gray-600 dark:text-gray-400 block mb-1">Google Maps Link or Full Address</label>
                    <input
                      type="text"
                      value={formState.url || ''}
                      onChange={(e) => updateForm('url', e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-800 bg-gray-50 dark:bg-gray-900 text-sm"
                      placeholder="https://maps.google.com/?q=..."
                    />
                  </div>
                </div>
              </div>
            )}

            {/* CUSTOM CARDS */}
            {selectedType === 'custom' && (
              <div className="space-y-4">
                <h3 className="text-base font-bold text-gray-900 dark:text-white">Create Custom Experience Card</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-semibold text-gray-600 dark:text-gray-400 block mb-1">Headline Title</label>
                    <input
                      type="text"
                      value={formState.headline}
                      onChange={(e) => updateForm('headline', e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-800 bg-gray-50 dark:bg-gray-900 text-sm"
                      placeholder="e.g. VIP Access Pass"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-gray-600 dark:text-gray-400 block mb-1">Badge Text</label>
                    <input
                      type="text"
                      value={formState.badgeText}
                      onChange={(e) => updateForm('badgeText', e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-800 bg-gray-50 dark:bg-gray-900 text-sm"
                      placeholder="e.g. VIP TIER 1"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-600 dark:text-gray-400 block mb-1">Custom Message</label>
                  <textarea
                    rows={3}
                    value={formState.bodyText}
                    onChange={(e) => updateForm('bodyText', e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-800 bg-gray-50 dark:bg-gray-900 text-sm"
                    placeholder="Enter message text..."
                  />
                </div>
              </div>
            )}
          </div>

          {/* Customization Studio (Color, Frame, Logo, Size) */}
          <CustomizationStudio
            initialType={selectedType || 'url'}
            initialContent={formState}
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
          <Suspense fallback={<div className="p-8 text-center text-gray-400">Loading QR Studio...</div>}>
            <CreateQRContent />
          </Suspense>
        </main>
      </div>

      <MobileNav />
    </div>
  );
}
