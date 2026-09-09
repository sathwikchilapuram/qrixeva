import { QRCodeItem } from '@/types';
import fs from 'fs';
import path from 'path';

declare global {
  var _userMemoryStore: Map<string, { id: string; phone: string; name: string; passwordHash: string; createdAt: string }> | undefined;
  var _qrMemoryStore: Map<string, QRCodeItem & { userId?: string }> | undefined;
  var _fileMemoryStore: Map<string, { buffer: Buffer; filename: string; mimeType: string; userId?: string }> | undefined;
}

/**
 * Standardizes phone numbers by removing all spaces, dashes, and parentheses
 */
export function normalizePhone(phone: string): string {
  if (!phone) return '';
  return phone.trim().replace(/[^0-9+]/g, '');
}

export function getUserMemoryStore() {
  if (!globalThis._userMemoryStore) {
    globalThis._userMemoryStore = new Map();

    try {
      const diskPath = path.join('/tmp', 'users_store.json');
      if (fs.existsSync(diskPath)) {
        const raw = fs.readFileSync(diskPath, 'utf-8');
        const items = JSON.parse(raw);
        if (Array.isArray(items)) {
          items.forEach((user) => {
            if (user && user.phone) {
              globalThis._userMemoryStore?.set(user.phone, user);
              globalThis._userMemoryStore?.set(user.id, user);
            }
          });
        }
      }
    } catch (e) {
      console.warn('Failed reading /tmp/users_store.json:', e);
    }
  }
  return globalThis._userMemoryStore;
}

export function saveUsersDisk() {
  try {
    const store = getUserMemoryStore();
    const items = Array.from(new Set(Array.from(store.values())));
    const diskPath = path.join('/tmp', 'users_store.json');
    fs.writeFileSync(diskPath, JSON.stringify(items));
  } catch (e) {
    console.warn('Failed writing /tmp/users_store.json:', e);
  }
}

export function getQRMemoryStore() {
  if (!globalThis._qrMemoryStore) {
    globalThis._qrMemoryStore = new Map();
  }
  return globalThis._qrMemoryStore;
}

export function getFileMemoryStore() {
  if (!globalThis._fileMemoryStore) {
    globalThis._fileMemoryStore = new Map();
  }
  return globalThis._fileMemoryStore;
}
