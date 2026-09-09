import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAuthUser } from '@/lib/auth';
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
      console.warn('Failed reading /tmp/qrs_store.json:', e);
    }
  }
  return store;
}

function saveMemoryStoreDisk() {
  try {
    const store = initDefaultMemoryStore();
    const items = Array.from(new Set(Array.from(store.values())));
    const diskPath = path.join('/tmp', 'qrs_store.json');
    fs.writeFileSync(diskPath, JSON.stringify(items));
  } catch (e) {
    console.warn('Failed writing /tmp/qrs_store.json:', e);
  }
}

export async function GET(req: Request) {
  try {
    const authSession = await getAuthUser(req);
    const userId = authSession?.userId;

    if (process.env.DATABASE_URL) {
      try {
        const dbQRs = await prisma.qRCode.findMany({
          where: userId ? { userId } : undefined,
          orderBy: { createdAt: 'desc' },
        });
        return NextResponse.json({ success: true, data: dbQRs });
      } catch (dbErr) {
        console.warn('Prisma getMany failed:', dbErr);
      }
    }

    const store = initDefaultMemoryStore();
    const memoryItems = Array.from(new Set(Array.from(store.values())));

    if (userId) {
      const userItems = memoryItems.filter((q) => q.userId === userId);
      return NextResponse.json({ success: true, data: userItems });
    }

    return NextResponse.json({ success: true, data: INITIAL_QR_CODES });
  } catch (error) {
    console.error('API GET /api/qrs error:', error);
    return NextResponse.json({ success: true, data: [] });
  }
}

export async function POST(req: Request) {
  try {
    const authSession = await getAuthUser(req);
    const userId = authSession?.userId;

    const body = await req.json();
    const { id, name, slug, type, mode, status, accessControl, password, expiresAt, content, customization } = body;

    const store = initDefaultMemoryStore();
    const qrObj: QRCodeItem & { userId?: string } = {
      id: id || 'qr-' + Date.now(),
      userId: userId || undefined,
      name: name || 'Custom QR',
      slug: slug || name?.toLowerCase().replace(/[^a-z0-9]/g, '-') || 'qr-' + Date.now(),
      type: type || 'text',
      mode: mode || 'dynamic',
      status: status || 'active',
      accessControl: accessControl || 'public',
      password: password || undefined,
      expiresAt: expiresAt || undefined,
      content: content || {},
      customization: customization || {},
      scansCount: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    store.set(qrObj.slug, qrObj);
    store.set(qrObj.id, qrObj);
    saveMemoryStoreDisk();

    if (process.env.DATABASE_URL) {
      try {
        const created = await prisma.qRCode.create({
          data: {
            name: qrObj.name,
            userId: userId || null,
            slug: qrObj.slug,
            type: qrObj.type,
            mode: qrObj.mode,
            status: qrObj.status,
            accessControl: qrObj.accessControl,
            password: qrObj.password,
            expiresAt: qrObj.expiresAt ? new Date(qrObj.expiresAt) : null,
            content: qrObj.content as any,
            customization: qrObj.customization as any,
          },
        });
        return NextResponse.json({ success: true, data: created });
      } catch (dbErr) {
        console.warn('Prisma create failed, returning memory object:', dbErr);
      }
    }

    return NextResponse.json({ success: true, data: qrObj });
  } catch (error) {
    console.error('API POST /api/qrs error:', error);
    return NextResponse.json({ success: false, error: 'Database save failed' }, { status: 500 });
  }
}
