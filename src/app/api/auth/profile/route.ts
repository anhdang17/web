import { NextRequest } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { getAuthUser } from '@/lib/auth';
import { jsonOk, jsonError } from '@/lib/api-response';

const schema = z.object({
  name: z.string().min(2).optional(),
  address: z.string().optional(),
  city: z.string().optional(),
  district: z.string().optional(),
});

export async function PUT(req: NextRequest) {
  const user = await getAuthUser(req);
  if (!user) return jsonError('Chưa đăng nhập', 401);

  try {
    const data = schema.parse(await req.json());
    const updated = await prisma.user.update({
      where: { id: user.id },
      data,
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
    return jsonOk(updated);
  } catch {
    return jsonError('Cập nhật thất bại', 400);
  }
}
