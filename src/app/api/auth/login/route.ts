import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { comparePassword, createSessionToken, AUTH_COOKIE_NAME, getPhoneAuthEmail } from '@/lib/auth';
import { normalizePhoneNumber } from '@/lib/phone';
import { getUserMemoryStore } from '@/lib/memory-store';
import { supabase } from '@/lib/supabase';

export async function POST(req: Request) {
  try {
    const { phone, password } = await req.json();

    if (!phone || !phone.trim() || !password) {
      return NextResponse.json({ success: false, error: 'Phone number and password are required.' }, { status: 400 });
    }

    const cleanPhone = normalizePhoneNumber(phone);
    const rawPhone = phone.trim();
    const phoneEmail = getPhoneAuthEmail(cleanPhone);

    let authSuccess = false;
    let authUserId = '';
    let authName = '';

    // 1. Authenticate against Supabase Auth
    try {
      const { data: sbData, error: sbError } = await supabase.auth.signInWithPassword({
        email: phoneEmail,
        password: password,
      });

      if (!sbError && sbData?.user) {
        authSuccess = true;
        authUserId = sbData.user.id;
        authName = sbData.user.user_metadata?.name || '';
      }
    } catch (sbErr) {
      console.warn('Supabase Auth signInWithPassword exception:', sbErr);
    }

    let targetUser: { id: string; phone: string; name: string; passwordHash: string } | null = null;

    // 2. Fetch user record from Prisma Database if available
    if (process.env.DATABASE_URL) {
      try {
        const dbUser = await prisma.user.findFirst({
          where: {
            OR: [
              { phone: cleanPhone },
              { phone: rawPhone },
              { id: authUserId },
            ],
          },
        });
        if (dbUser) {
          targetUser = {
            id: dbUser.id,
            phone: dbUser.phone,
            name: dbUser.name || 'User',
            passwordHash: dbUser.passwordHash,
          };
        }
      } catch (dbErr) {
        console.warn('Prisma login findFirst failed:', dbErr);
      }
    }

    // 3. Fallback check in memory store
    if (!targetUser) {
      const userStore = getUserMemoryStore();
      const memUser = userStore.get(cleanPhone) || userStore.get(rawPhone) || (authUserId ? userStore.get(authUserId) : null);
      if (memUser) {
        targetUser = memUser;
      }
    }

    // If Supabase Auth succeeded but user record not yet in local store, build user record
    if (authSuccess && !targetUser) {
      targetUser = {
        id: authUserId,
        phone: cleanPhone,
        name: authName || 'Qrixeva User',
        passwordHash: 'supabase_managed',
      };
    }

    // 4. If Supabase Auth did not pass, verify stored password hash as fallback
    if (!authSuccess) {
      if (!targetUser) {
        return NextResponse.json({ success: false, error: 'Invalid phone number or password.' }, { status: 401 });
      }

      const isPasswordValid = await comparePassword(password, targetUser.passwordHash);
      if (!isPasswordValid) {
        return NextResponse.json({ success: false, error: 'Invalid phone number or password.' }, { status: 401 });
      }
    }

    const finalUserId = authUserId || targetUser?.id || `usr_${Date.now()}`;
    const finalPhone = targetUser?.phone || cleanPhone;
    const finalName = targetUser?.name || authName || 'Qrixeva User';

    // 5. Create session token
    const token = await createSessionToken({
      userId: finalUserId,
      phone: finalPhone,
      name: finalName,
    });

    const response = NextResponse.json({
      success: true,
      message: 'Logged in successfully!',
      user: {
        id: finalUserId,
        phone: finalPhone,
        name: finalName,
      },
      token,
    });

    response.cookies.set({
      name: AUTH_COOKIE_NAME,
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 30 * 24 * 60 * 60,
      path: '/',
    });

    return response;
  } catch (error) {
    console.error('API /api/auth/login Error:', error);
    return NextResponse.json({ success: false, error: 'Unable to sign in right now. Please try again.' }, { status: 500 });
  }
}
