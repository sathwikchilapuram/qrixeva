import bcrypt from 'bcryptjs';
import { SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';
import { normalizePhoneNumber } from './phone';

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'qrixeva_jwt_auth_secret_key_prod_2026_super_secure'
);

export const AUTH_COOKIE_NAME = 'qrixeva_session';

export interface AuthSessionPayload {
  userId: string;
  phone: string;
  name: string;
}

/**
 * Converts an E.164 phone number into a canonical email address for Supabase Auth integration
 */
export function getPhoneAuthEmail(phone: string): string {
  const cleanPhone = normalizePhoneNumber(phone);
  const digits = cleanPhone.replace(/\D/g, '');
  return `${digits}@phone.qrixeva.internal`;
}

/**
 * Hashes a plain-text password securely with bcrypt
 */
export async function hashPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
}

/**
 * Compares a plain-text password against a hashed password
 */
export async function comparePassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

/**
 * Hashes an OTP code securely
 */
export async function hashOtp(otp: string): Promise<string> {
  const salt = await bcrypt.genSalt(6);
  return bcrypt.hash(otp, salt);
}

/**
 * Verifies an OTP code against a hash
 */
export async function compareOtp(otp: string, hash: string): Promise<boolean> {
  return bcrypt.compare(otp, hash);
}

/**
 * Creates a signed JWT session token
 */
export async function createSessionToken(payload: AuthSessionPayload): Promise<string> {
  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('30d')
    .sign(JWT_SECRET);
}

/**
 * Verifies and decodes a JWT session token
 */
export async function verifySessionToken(token: string): Promise<AuthSessionPayload | null> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return {
      userId: payload.userId as string,
      phone: payload.phone as string,
      name: payload.name as string,
    };
  } catch (err) {
    return null;
  }
}

/**
 * Extracts and verifies the current authenticated user from request cookies or Authorization header
 */
export async function getAuthUser(req: Request): Promise<AuthSessionPayload | null> {
  try {
    // 1. Try Authorization header
    const authHeader = req.headers.get('authorization');
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.substring(7);
      const verified = await verifySessionToken(token);
      if (verified) return verified;
    }

    // 2. Try Cookie header
    const cookieHeader = req.headers.get('cookie');
    if (cookieHeader) {
      const cookiesArr = cookieHeader.split(';');
      for (const cookieStr of cookiesArr) {
        const [name, ...rest] = cookieStr.trim().split('=');
        if (name === AUTH_COOKIE_NAME) {
          const token = rest.join('=');
          const verified = await verifySessionToken(token);
          if (verified) return verified;
        }
      }
    }

    return null;
  } catch (err) {
    return null;
  }
}

/**
 * Server-side helper to read auth user from Next.js server context cookies()
 */
export async function getAuthUserFromCookies(): Promise<AuthSessionPayload | null> {
  try {
    const cookieStore = cookies();
    const token = cookieStore.get(AUTH_COOKIE_NAME)?.value;
    if (!token) return null;
    return verifySessionToken(token);
  } catch (err) {
    return null;
  }
}
