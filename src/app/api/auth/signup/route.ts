import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { createSessionToken, AUTH_COOKIE_NAME, getPhoneAuthEmail, hashPassword } from '@/lib/auth';
import { normalizePhoneNumber } from '@/lib/phone';
import { getUserMemoryStore, saveUsersDisk } from '@/lib/memory-store';
import { supabase } from '@/lib/supabase';

export async function POST(req: Request) {
  try {
    const { name, phone, password } = await req.json();

    if (!name || !name.trim()) {
      return NextResponse.json({ success: false, error: 'Full name is required.' }, { status: 400 });
    }
    if (!phone || !phone.trim() || phone.trim().length < 5) {
      return NextResponse.json({ success: false, error: 'Valid phone number is required.' }, { status: 400 });
    }
    if (!password || password.length < 6) {
      return NextResponse.json({ success: false, error: 'Password must be at least 6 characters.' }, { status: 400 });
    }

    const cleanPhone = normalizePhoneNumber(phone);
    const cleanName = name.trim();
    const phoneEmail = getPhoneAuthEmail(cleanPhone);

    const userStore = getUserMemoryStore();

    // Check duplicate in memory store first
    if (userStore.has(cleanPhone)) {
      return NextResponse.json({ success: false, error: 'An account with this phone number already exists.' }, { status: 400 });
    }

    // Check duplicate in Prisma DB if available
    if (process.env.DATABASE_URL) {
      try {
        const existingDbUser = await prisma.user.findFirst({
          where: {
            OR: [{ phone: cleanPhone }, { phone: phone.trim() }],
          },
        });
        if (existingDbUser) {
          return NextResponse.json({ success: false, error: 'An account with this phone number already exists.' }, { status: 400 });
        }
      } catch (dbErr) {
        console.warn('Prisma signup duplicate check error:', dbErr);
      }
    }

    let userId = '';
    let passwordHash = '';

    // Register user with Supabase Auth
    try {
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: phoneEmail,
        password: password,
        options: {
          data: {
            name: cleanName,
            phone: cleanPhone,
          },
        },
      });

      if (authError) {
        if (authError.message.includes('already registered') || authError.message.includes('already exists')) {
          return NextResponse.json({ success: false, error: 'An account with this phone number already exists.' }, { status: 400 });
        }
        console.warn('Supabase auth.signUp warning:', authError.message);
      }

      if (authData?.user?.id) {
        userId = authData.user.id;
      }
    } catch (sbErr) {
      console.warn('Supabase Auth signup exception, fallback to local user id generation:', sbErr);
    }

    if (!userId) {
      userId = `usr_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    }

    passwordHash = await hashPassword(password);

    const userObj = {
      id: userId,
      phone: cleanPhone,
      name: cleanName,
      passwordHash,
      createdAt: new Date().toISOString(),
    };

    userStore.set(cleanPhone, userObj);
    userStore.set(userId, userObj);
    saveUsersDisk();

    if (process.env.DATABASE_URL) {
      try {
        const dbUser = await prisma.user.upsert({
          where: { phone: cleanPhone },
          update: {
            id: userId,
            name: cleanName,
            passwordHash,
          },
          create: {
            id: userId,
            phone: cleanPhone,
            name: cleanName,
            passwordHash,
          },
        });
        userObj.id = dbUser.id;
      } catch (dbErr) {
        console.warn('Prisma user.upsert error:', dbErr);
      }
    }

    const token = await createSessionToken({
      userId: userObj.id,
      phone: userObj.phone,
      name: userObj.name,
    });

    const response = NextResponse.json({
      success: true,
      message: 'Account created successfully!',
      user: {
        id: userObj.id,
        phone: userObj.phone,
        name: userObj.name,
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
    console.error('API /api/auth/signup Error:', error);
    return NextResponse.json({ success: false, error: 'Failed to create account. Please try again.' }, { status: 500 });
  }
}
