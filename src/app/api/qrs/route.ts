import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { INITIAL_QR_CODES } from '@/lib/store';

export async function GET() {
  try {
    if (process.env.DATABASE_URL) {
      const dbQRs = await prisma.qRCode.findMany({
        orderBy: { createdAt: 'desc' },
      });
      if (dbQRs.length > 0) {
        return NextResponse.json({ success: true, data: dbQRs });
      }
    }
    return NextResponse.json({ success: true, data: INITIAL_QR_CODES });
  } catch (error) {
    console.error('API GET /api/qrs error:', error);
    return NextResponse.json({ success: true, data: INITIAL_QR_CODES });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, slug, type, mode, status, accessControl, password, expiresAt, content, customization } = body;

    if (process.env.DATABASE_URL) {
      const created = await prisma.qRCode.create({
        data: {
          name,
          slug,
          type,
          mode: mode || 'dynamic',
          status: status || 'active',
          accessControl: accessControl || 'public',
          password,
          expiresAt: expiresAt ? new Date(expiresAt) : null,
          content: content || {},
          customization: customization || {},
        },
      });
      return NextResponse.json({ success: true, data: created });
    }

    return NextResponse.json({ success: true, data: body });
  } catch (error) {
    console.error('API POST /api/qrs error:', error);
    return NextResponse.json({ success: false, error: 'Database save failed' }, { status: 500 });
  }
}
