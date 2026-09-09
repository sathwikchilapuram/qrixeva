export type QRType =
  | 'text'
  | 'url'
  | 'pdf'
  | 'file'
  | 'profile'
  | 'resume'
  | 'idcard'
  | 'contact'
  | 'social'
  | 'business'
  | 'menu'
  | 'event'
  | 'location'
  | 'image'
  | 'audio'
  | 'video'
  | 'payment'
  | 'app'
  | 'custom';

export type QRMode = 'static' | 'dynamic';
export type QRStatus = 'active' | 'disabled' | 'expired';
export type AccessControl = 'public' | 'password' | 'expiring';

export interface QRCustomization {
  fgColor: string;
  bgColor: string;
  gradientEnabled: boolean;
  gradientColor: string;
  gradientType: 'linear' | 'radial';
  gradientDirection: 'to-r' | 'to-br' | 'to-b';
  pattern: 'square' | 'rounded' | 'dots' | 'classy' | 'smooth' | 'extra-rounded';
  eyeStyle: 'square' | 'rounded' | 'leaf' | 'dot';
  eyeColor: string;
  logoUrl: string | null;
  logoSize: number;
  frame: 'none' | 'simple' | 'rounded' | 'scanner';
  frameText: string;
  frameColor: string;
  ecl: 'L' | 'M' | 'Q' | 'H';
  margin: number;
  size: number;
}

export interface QRCodeItem {
  id: string;
  name: string;
  slug: string;
  type: QRType;
  mode: QRMode;
  status: QRStatus;
  accessControl: AccessControl;
  password?: string;
  expiresAt?: string | null;
  content: Record<string, any>;
  customization: QRCustomization;
  scansCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface ScanLog {
  id: string;
  qrCodeId: string;
  timestamp: string;
  device: 'Mobile' | 'Desktop' | 'Tablet';
  browser: string;
  os: string;
  location: string;
  referrer: string;
}

export interface StoredFile {
  id: string;
  name: string;
  type: string;
  size: number;
  storageUrl: string;
  downloads: number;
  createdAt: string;
}

export interface UserProfile {
  name: string;
  email: string;
  title: string;
  bio: string;
  avatarUrl: string;
  skills: string[];
  education: { school: string; degree: string; year: string }[];
  experience: { company: string; role: string; period: string; desc: string }[];
  projects: { title: string; link: string; desc: string }[];
  socials: { platform: string; url: string }[];
  phone: string;
}

export interface QRTemplate {
  id: string;
  name: string;
  category: 'Professional' | 'Business' | 'Personal' | 'Resume' | 'Restaurant' | 'Event' | 'Minimal' | 'Creative' | 'Corporate';
  description: string;
  customization: QRCustomization;
  previewColor: string;
}

export type AccentColor = 'violet' | 'blue' | 'cyan' | 'green' | 'orange' | 'rose';
export type ThemeMode = 'light' | 'dark' | 'system';
