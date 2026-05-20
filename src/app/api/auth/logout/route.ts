import { jsonOk } from '@/lib/api-response';

export async function POST() {
  const res = jsonOk({ message: 'Đã đăng xuất' });
  res.cookies.set('token', '', { httpOnly: true, maxAge: 0, path: '/' });
  return res;
}
