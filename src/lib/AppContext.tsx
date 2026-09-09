'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { QRCodeItem, StoredFile, ScanLog, UserProfile, AccentColor, ThemeMode } from '@/types';
import { INITIAL_QR_CODES, INITIAL_FILES, INITIAL_SCANS, DEMO_USER_PROFILE } from './store';

interface Toast {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  message: string;
}

interface AppContextType {
  // Theme & Accent
  theme: ThemeMode;
  setTheme: (t: ThemeMode) => void;
  accent: AccentColor;
  setAccent: (a: AccentColor) => void;
  
  // Data
  qrCodes: QRCodeItem[];
  files: StoredFile[];
  scans: ScanLog[];
  profile: UserProfile;
  
  // Actions
  addQRCode: (qr: QRCodeItem) => void;
  updateQRCode: (id: string, updates: Partial<QRCodeItem>) => void;
  deleteQRCode: (id: string) => void;
  toggleQRStatus: (id: string) => void;
  
  addFile: (file: StoredFile) => void;
  deleteFile: (id: string) => void;
  
  updateProfile: (profile: Partial<UserProfile>) => void;
  
  recordScan: (qrId: string, device?: 'Mobile' | 'Desktop' | 'Tablet', browser?: string, os?: string, location?: string, referrer?: string) => void;
  
  // Toasts
  toasts: Toast[];
  addToast: (type: Toast['type'], message: string) => void;
  removeToast: (id: string) => void;
  
  // Global Search
  searchOpen: boolean;
  setSearchOpen: (open: boolean) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<ThemeMode>('light');
  const [accent, setAccentState] = useState<AccentColor>('violet');
  const [qrCodes, setQrCodes] = useState<QRCodeItem[]>(INITIAL_QR_CODES);
  const [files, setFiles] = useState<StoredFile[]>(INITIAL_FILES);
  const [scans, setScans] = useState<ScanLog[]>(INITIAL_SCANS);
  const [profile, setProfileState] = useState<UserProfile>(DEMO_USER_PROFILE);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [searchOpen, setSearchOpen] = useState(false);

  // Load saved settings from localStorage on mount
  useEffect(() => {
    try {
      const savedTheme = localStorage.getItem('qrverse_theme') as ThemeMode | null;
      if (savedTheme) setThemeState(savedTheme);

      const savedAccent = localStorage.getItem('qrverse_accent') as AccentColor | null;
      if (savedAccent) setAccentState(savedAccent);

      const savedQRs = localStorage.getItem('qrverse_qrs');
      if (savedQRs) setQrCodes(JSON.parse(savedQRs));

      const savedFiles = localStorage.getItem('qrverse_files');
      if (savedFiles) setFiles(JSON.parse(savedFiles));

      const savedScans = localStorage.getItem('qrverse_scans');
      if (savedScans) setScans(JSON.parse(savedScans));

      const savedProfile = localStorage.getItem('qrverse_profile');
      if (savedProfile) setProfileState(JSON.parse(savedProfile));
    } catch (e) {
      console.error('Error loading from localStorage', e);
    }
  }, []);

  // Update theme class on HTML element
  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else if (theme === 'light') {
      root.classList.remove('dark');
    } else {
      // System mode
      if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
        root.classList.add('dark');
      } else {
        root.classList.remove('dark');
      }
    }
    localStorage.setItem('qrverse_theme', theme);
  }, [theme]);

  // Update CSS variables for dynamic accent colors
  useEffect(() => {
    const root = document.documentElement;
    const accentColors: Record<AccentColor, { 500: string; 600: string; 400: string; glow: string }> = {
      violet: { 500: '#6366f1', 600: '#4f46e5', 400: '#818cf8', glow: 'rgba(99, 102, 241, 0.3)' },
      blue: { 500: '#3b82f6', 600: '#2563eb', 400: '#60a5fa', glow: 'rgba(59, 130, 246, 0.3)' },
      cyan: { 500: '#06b6d4', 600: '#0891b2', 400: '#22d3ee', glow: 'rgba(6, 182, 212, 0.3)' },
      green: { 500: '#10b981', 600: '#059669', 400: '#34d399', glow: 'rgba(16, 185, 129, 0.3)' },
      orange: { 500: '#f97316', 600: '#ea580c', 400: '#fb923c', glow: 'rgba(249, 115, 22, 0.3)' },
      rose: { 500: '#f43f5e', 600: '#e11d48', 400: '#fb7185', glow: 'rgba(244, 63, 94, 0.3)' },
    };

    const sel = accentColors[accent];
    root.style.setProperty('--brand-500', sel[500]);
    root.style.setProperty('--brand-600', sel[600]);
    root.style.setProperty('--brand-400', sel[400]);
    root.style.setProperty('--brand-glow', sel.glow);

    localStorage.setItem('qrverse_accent', accent);
  }, [accent]);

  // Sync state to localStorage
  const syncQRs = (data: QRCodeItem[]) => {
    setQrCodes(data);
    localStorage.setItem('qrverse_qrs', JSON.stringify(data));
  };

  const syncFiles = (data: StoredFile[]) => {
    setFiles(data);
    localStorage.setItem('qrverse_files', JSON.stringify(data));
  };

  const syncScans = (data: ScanLog[]) => {
    setScans(data);
    localStorage.setItem('qrverse_scans', JSON.stringify(data));
  };

  const syncProfile = (data: UserProfile) => {
    setProfileState(data);
    localStorage.setItem('qrverse_profile', JSON.stringify(data));
  };

  const addToast = (type: Toast['type'], message: string) => {
    const id = 'toast-' + Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, type, message }]);
    setTimeout(() => {
      removeToast(id);
    }, 4000);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const addQRCode = (qr: QRCodeItem) => {
    const updated = [qr, ...qrCodes];
    syncQRs(updated);
    addToast('success', `QR Code "${qr.name}" created successfully!`);
  };

  const updateQRCode = (id: string, updates: Partial<QRCodeItem>) => {
    const updated = qrCodes.map((qr) =>
      qr.id === id ? { ...qr, ...updates, updatedAt: new Date().toISOString() } : qr
    );
    syncQRs(updated);
    addToast('success', 'QR code updated successfully.');
  };

  const deleteQRCode = (id: string) => {
    const target = qrCodes.find((q) => q.id === id);
    const updated = qrCodes.filter((qr) => qr.id !== id);
    syncQRs(updated);
    addToast('info', `QR code "${target?.name || ''}" deleted.`);
  };

  const toggleQRStatus = (id: string) => {
    const updated = qrCodes.map((qr) => {
      if (qr.id === id) {
        const nextStatus = qr.status === 'active' ? 'disabled' : 'active';
        addToast(
          nextStatus === 'active' ? 'success' : 'warning',
          `QR Code is now ${nextStatus.toUpperCase()}.`
        );
        return { ...qr, status: nextStatus as QRCodeItem['status'] };
      }
      return qr;
    });
    syncQRs(updated);
  };

  const addFile = (file: StoredFile) => {
    const updated = [file, ...files];
    syncFiles(updated);
    addToast('success', `File "${file.name}" uploaded successfully.`);
  };

  const deleteFile = (id: string) => {
    const target = files.find((f) => f.id === id);
    const updated = files.filter((f) => f.id !== id);
    syncFiles(updated);
    addToast('info', `File "${target?.name || ''}" removed.`);
  };

  const updateProfile = (updates: Partial<UserProfile>) => {
    const updated = { ...profile, ...updates };
    syncProfile(updated);
    addToast('success', 'Profile updated successfully.');
  };

  const recordScan = (
    qrId: string,
    device: 'Mobile' | 'Desktop' | 'Tablet' = 'Mobile',
    browser = 'Safari',
    os = 'iOS',
    location = 'San Francisco, US',
    referrer = 'Direct Scan'
  ) => {
    const newScan: ScanLog = {
      id: 'scan-' + Math.random().toString(36).substring(2, 9),
      qrCodeId: qrId,
      timestamp: new Date().toISOString(),
      device,
      browser,
      os,
      location,
      referrer,
    };
    const updatedScans = [newScan, ...scans];
    syncScans(updatedScans);

    // Also update scan count on QR code item
    const updatedQRs = qrCodes.map((q) =>
      q.id === qrId ? { ...q, scansCount: q.scansCount + 1 } : q
    );
    syncQRs(updatedQRs);
  };

  return (
    <AppContext.Provider
      value={{
        theme,
        setTheme: setThemeState,
        accent,
        setAccent: setAccentState,
        qrCodes,
        files,
        scans,
        profile,
        addQRCode,
        updateQRCode,
        deleteQRCode,
        toggleQRStatus,
        addFile,
        deleteFile,
        updateProfile,
        recordScan,
        toasts,
        addToast,
        removeToast,
        searchOpen,
        setSearchOpen,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
}
