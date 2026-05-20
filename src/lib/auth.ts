import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { NextRequest } from 'next/server';
import { prisma } from './prisma';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret';

export interface JwtPayload {
  userId: string;
  role: string;
  email?: string | null;
}

export async function hashPassword(password: string) {
  return bcrypt.hash(password, 10);
}

export async function verifyPassword(password: string, hash: string) {
  return bcrypt.compare(password, hash);
}

export function signToken(payload: JwtPayload) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
}

export function verifyToken(token: string): JwtPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as JwtPayload;
  } catch {
    return null;
  }
}

export function getTokenFromRequest(req: NextRequest) {
  const auth = req.headers.get('authorization');
  if (auth?.startsWith('Bearer ')) return auth.slice(7);
  return req.cookies.get('token')?.value ?? null;
}

export async function getAuthUser(req: NextRequest) {
  const token = getTokenFromRequest(req);
  if (!token) return null;
  const payload = verifyToken(token);
  if (!payload) return null;
  const user = await prisma.user.findUnique({
    where: { id: payload.userId },
    select: {
      id: true,
      email: true,
      phone: true,
      name: true,
      role: true,
      address: true,
      city: true,
      district: true,
    },
  });
  return user;
}

export function requireAuth(user: Awaited<ReturnType<typeof getAuthUser>>) {
  if (!user) throw new Error('UNAUTHORIZED');
}

export function requireAdmin(user: Awaited<ReturnType<typeof getAuthUser>>) {
  requireAuth(user);
  if (user!.role !== 'ADMIN') throw new Error('FORBIDDEN');
}
