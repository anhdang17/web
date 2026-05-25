import { NextRequest } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { verifyPassword, signToken } from '@/lib/auth';
import { jsonOk, jsonError } from '@/lib/api-response';

const schema = z.object({
  identifier: z.string().min(1),
  password: z.string().min(1),
});

export async function POST(req: NextRequest) {
  try {
    const { identifier, password } = schema.parse(await req.json());

    const isEmail = identifier.includes('@');
    const user = await prisma.user.findFirst({
      where: isEmail ? { email: identifier } : { phone: identifier },
    });

    if (!user || !(await verifyPassword(password, user.password))) {
      return jsonError('Email/số điện thoại hoặc mật khẩu không đúng', 401);
    }

    const token = signToken({ userId: user.id, role: user.role, email: user.email });
    const safeUser = {
      id: user.id,
      email: user.email,
      phone: user.phone,
      name: user.name,
      role: user.role,
      address: user.address,
      city: user.city,
      district: user.district,
    };

    const res = jsonOk({ user: safeUser, token });
    res.cookies.set('token', token, {
      httpOnly: true,
      maxAge: 7 * 24 * 3600,
      path: '/',
      sameSite: 'lax',
    });
    return res;
  } catch {
    return jsonError('Đăng nhập thất bại', 400);
  }
}
