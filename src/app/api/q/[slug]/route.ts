import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { INITIAL_QR_CODES } from '@/lib/store';
import { QRCodeItem } from '@/types';
import { getQRMemoryStore } from '@/lib/memory-store';
import fs from 'fs';
import path from 'path';

function initDefaultMemoryStore() {
  const store = getQRMemoryStore();
  if (store.size === 0) {
    INITIAL_QR_CODES.forEach((qr) => {
      store.set(qr.slug, qr);
      store.set(qr.id, qr);
    });

    try {
      const diskPath = path.join('/tmp', 'qrs_store.json');
      if (fs.existsSync(diskPath)) {
        const raw = fs.readFileSync(diskPath, 'utf-8');
        const items = JSON.parse(raw);
        if (Array.isArray(items)) {
          items.forEach((qr) => {
            if (qr && qr.slug) {
              store.set(qr.slug, qr);
              store.set(qr.id, qr);
            }
          });
        }
      }
    } catch (e) {
      console.warn('Failed reading /tmp/qrs_store.json in slug route:', e);
    }
  }
  return store;
}

function sanitizePublicData(qrObj: any) {
  if (!qrObj) return null;
  const { userId, user, scans, passwordHash, ...publicData } = qrObj;
  return publicData;
}

export async function GET(
  req: Request,
  { params }: { params: { slug: string } }
) {
  try {
    const slug = params.slug;
    if (!slug) {
      return NextResponse.json({ success: false, error: 'Slug parameter missing' }, { status: 400 });
    }

    if (process.env.DATABASE_URL) {
      try {
        const dbQR = await prisma.qRCode.findFirst({
          where: {
            OR: [{ slug: slug }, { id: slug }],
          },
        });
        if (dbQR) {
          return NextResponse.json({ success: true, data: sanitizePublicData(dbQR) });
        }
      } catch (dbErr) {
        console.warn('Prisma lookup failed, falling back to memory store:', dbErr);
      }
    }

    const store = initDefaultMemoryStore();
    const memoryQR = store.get(slug);
    if (memoryQR) {
      return NextResponse.json({ success: true, data: sanitizePublicData(memoryQR) });
    }

    const initialQR = INITIAL_QR_CODES.find((q) => q.slug === slug || q.id === slug);
    if (initialQR) {
      return NextResponse.json({ success: true, data: sanitizePublicData(initialQR) });
    }

    return NextResponse.json({ success: false, error: 'QR code not found' }, { status: 404 });
  } catch (error) {
    console.error('API GET /api/q/[slug] error:', error);
    return NextResponse.json({ success: false, error: 'Server error' }, { status: 500 });
  }
}
