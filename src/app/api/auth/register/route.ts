import { NextRequest } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { hashPassword, signToken } from '@/lib/auth';
import { jsonOk, jsonError } from '@/lib/api-response';

const schema = z.object({
  name: z.string().min(2),
  email: z.string().email().optional().or(z.literal('')),
  phone: z.string().min(9).max(15).optional().or(z.literal('')),
  password: z.string().min(6),
  address: z.string().optional(),
  city: z.string().optional(),
  district: z.string().optional(),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const data = schema.parse(body);

    if (!data.email && !data.phone) {
      return jsonError('Vui lòng nhập email hoặc số điện thoại', 400);
    }

    if (data.email) {
      const exists = await prisma.user.findUnique({ where: { email: data.email } });
      if (exists) return jsonError('Email đã được đăng ký', 400);
    }
    if (data.phone) {
      const exists = await prisma.user.findUnique({ where: { phone: data.phone } });
      if (exists) return jsonError('Số điện thoại đã được đăng ký', 400);
    }

    const hashed = await hashPassword(data.password);
    const user = await prisma.user.create({
      data: {
        name: data.name,
        email: data.email || null,
        phone: data.phone || null,
        password: hashed,
        role: 'USER',
        address: data.address,
        city: data.city,
        district: data.district,
      },
      select: { id: true, email: true, phone: true, name: true, role: true },
    });

    const token = signToken({ userId: user.id, role: user.role, email: user.email });
    const res = jsonOk({ user, token });
    res.cookies.set('token', token, {
      httpOnly: true,
      maxAge: 7 * 24 * 3600,
      path: '/',
      sameSite: 'lax',
    });
    return res;
  } catch (e) {
    if (e instanceof z.ZodError) return jsonError(e.errors[0].message, 400);
    return jsonError('Đăng ký thất bại', 500);
  }
}
