import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { verifyToken } from '@/lib/jwt';

export async function GET() {
  const cookieStore = await cookies();
  const adminToken = cookieStore.get('admin_token');
  const userToken = cookieStore.get('user_token');

  if (adminToken?.value === 'secure_token_abc123') {
    return NextResponse.json({ isLoggedIn: true, role: 'ADMIN' });
  }

  if (userToken) {
    const decoded = verifyToken(userToken.value);
    if (decoded) {
      return NextResponse.json({ isLoggedIn: true, role: (decoded as any).role });
    }
  }

  return NextResponse.json({ isLoggedIn: false });
}
