import { NextResponse } from 'next/server';
import { getAuthUser, hashPassword, comparePassword, getPhoneAuthEmail } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { getUserMemoryStore } from '@/lib/memory-store';
import { normalizePhoneNumber } from '@/lib/phone';
import { supabase } from '@/lib/supabase';

export async function POST(req: Request) {
  try {
    const authSession = await getAuthUser(req);
    if (!authSession) {
      return NextResponse.json({ success: false, error: 'Unauthorized.' }, { status: 401 });
    }

    const { name, phone, currentPassword, newPassword } = await req.json();

    const userStore = getUserMemoryStore();
    let currentHash = '';

    if (process.env.DATABASE_URL) {
      try {
        const dbUser = await prisma.user.findUnique({ where: { id: authSession.userId } });
        if (dbUser) currentHash = dbUser.passwordHash;
      } catch (dbErr) {
        console.warn('Prisma update-account lookup failed:', dbErr);
      }
    }

    if (!currentHash) {
      const memUser = userStore.get(authSession.userId) || userStore.get(authSession.phone);
      if (memUser) currentHash = memUser.passwordHash;
    }

    const updates: { name?: string; phone?: string; passwordHash?: string } = {};

    if (name && name.trim()) updates.name = name.trim();

    let cleanPhone = authSession.phone;
    if (phone && phone.trim()) {
      cleanPhone = normalizePhoneNumber(phone);
      updates.phone = cleanPhone;
    }

    if (newPassword && newPassword.length >= 6) {
      if (!currentPassword) {
        return NextResponse.json({ success: false, error: 'Current password is required to set a new password.' }, { status: 400 });
      }
      if (currentHash && currentHash !== 'supabase_managed') {
        const isValid = await comparePassword(currentPassword, currentHash);
        if (!isValid) {
          return NextResponse.json({ success: false, error: 'Incorrect current password.' }, { status: 400 });
        }
      }

      // Update password in Supabase Auth if applicable
      try {
        const phoneEmail = getPhoneAuthEmail(authSession.phone);
        await supabase.auth.updateUser({ password: newPassword });
      } catch (sbErr) {
        console.warn('Supabase auth.updateUser error:', sbErr);
      }

      updates.passwordHash = await hashPassword(newPassword);
    }

    const memUser = userStore.get(authSession.userId) || userStore.get(authSession.phone);
    if (memUser) {
      if (updates.name) memUser.name = updates.name;
      if (updates.phone) memUser.phone = updates.phone;
      if (updates.passwordHash) memUser.passwordHash = updates.passwordHash;
      userStore.set(memUser.id, memUser);
      userStore.set(memUser.phone, memUser);
    }

    if (process.env.DATABASE_URL) {
      try {
        await prisma.user.update({
          where: { id: authSession.userId },
          data: updates,
        });
      } catch (dbErr) {
        console.warn('Prisma update-account update failed:', dbErr);
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Account details updated successfully.',
      user: {
        id: authSession.userId,
        name: updates.name || authSession.name,
        phone: updates.phone || authSession.phone,
      },
    });
  } catch (error) {
    console.error('API /api/auth/update-account Error:', error);
    return NextResponse.json({ success: false, error: 'Failed to update account.' }, { status: 500 });
  }
}
