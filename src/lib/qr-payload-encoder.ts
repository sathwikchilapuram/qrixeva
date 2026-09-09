import { QRCodeItem } from '@/types';
import { DEFAULT_CUSTOMIZATION } from '@/lib/store';

export function encodeQRFallback(qr: { type: string; name: string; content: any }): string {
  try {
    const compact = {
      t: qr.type,
      n: qr.name,
      c: qr.content,
    };
    const jsonStr = JSON.stringify(compact);
    if (typeof window !== 'undefined') {
      return encodeURIComponent(btoa(unescape(encodeURIComponent(jsonStr))));
    } else {
      return encodeURIComponent(Buffer.from(jsonStr, 'utf-8').toString('base64'));
    }
  } catch (e) {
    return '';
  }
}

export function decodeQRFallback(encoded: string): QRCodeItem | null {
  try {
    if (!encoded) return null;
    let jsonStr = '';
    if (typeof window !== 'undefined') {
      jsonStr = decodeURIComponent(escape(atob(decodeURIComponent(encoded))));
    } else {
      jsonStr = Buffer.from(decodeURIComponent(encoded), 'base64').toString('utf-8');
    }
    const parsed = JSON.parse(jsonStr);
    return {
      id: 'qr-decoded-' + Date.now(),
      name: parsed.n || 'Scanned QR Code',
      slug: 'scanned',
      type: parsed.t || 'text',
      mode: 'dynamic',
      status: 'active',
      accessControl: 'public',
      scansCount: 1,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      customization: {
        ...DEFAULT_CUSTOMIZATION,
      },
      content: parsed.c || {},
    };
  } catch (e) {
    console.warn('Failed to decode fallback payload:', e);
    return null;
  }
}
