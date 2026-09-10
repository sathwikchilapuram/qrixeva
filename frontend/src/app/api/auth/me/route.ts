import { NextResponse } from 'next/server';
import { getAuthUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { getUserMemoryStore } from '@/lib/memory-store';
import { normalizePhoneNumber } from '@/lib/phone';

export async function GET(req: Request) {
  try {
    const authSession = await getAuthUser(req);

    if (!authSession) {
      return NextResponse.json({ success: false, authenticated: false, user: null }, { status: 401 });
    }

    let userDetail = null;
    const cleanPhone = normalizePhoneNumber(authSession.phone);

    if (process.env.DATABASE_URL) {
      try {
        const dbUser = await prisma.user.findFirst({
          where: {
            OR: [
              { id: authSession.userId },
              { phone: cleanPhone },
              { phone: authSession.phone },
            ],
          },
          select: { id: true, phone: true, name: true, createdAt: true },
        });
        if (dbUser) userDetail = dbUser;
      } catch (dbErr) {
        console.warn('Prisma me lookup failed:', dbErr);
      }
    }

    if (!userDetail) {
      const userStore = getUserMemoryStore();
      const memUser = userStore.get(authSession.userId) || userStore.get(cleanPhone) || userStore.get(authSession.phone);
      if (memUser) {
        userDetail = {
          id: memUser.id,
          phone: memUser.phone,
          name: memUser.name,
          createdAt: memUser.createdAt,
        };
      }
    }

    if (!userDetail) {
      userDetail = {
        id: authSession.userId,
        phone: cleanPhone || authSession.phone,
        name: authSession.name,
        createdAt: new Date().toISOString(),
      };
    }

    return NextResponse.json({
      success: true,
      authenticated: true,
      user: userDetail,
    });
  } catch (error) {
    console.error('API /api/auth/me Error:', error);
    return NextResponse.json({ success: false, authenticated: false, user: null }, { status: 500 });
  }
}
