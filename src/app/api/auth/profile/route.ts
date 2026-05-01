import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import dbConnect from '@/lib/dbConnect';
import User from '@/models/User';
import { verifyToken } from '@/lib/jwt';

export async function GET() {
  try {
    await dbConnect();
    const cookieStore = await cookies();
    const userToken = cookieStore.get('user_token');
    const adminToken = cookieStore.get('admin_token');

    if (!userToken && adminToken?.value === 'secure_token_abc123') {
      return NextResponse.json({ 
        success: true, 
        user: { 
          name: 'Super Admin', 
          email: 'admin@ppfassion.com', 
          role: 'ADMIN',
          createdAt: new Date()
        } 
      });
    }

    if (!userToken) {
      return NextResponse.json({ success: false, message: 'Not authenticated' }, { status: 401 });
    }

    const decoded = verifyToken(userToken.value);
    if (!decoded || !(decoded as any).id) {
      return NextResponse.json({ success: false, message: 'Invalid token' }, { status: 401 });
    }

    const user = await User.findById((decoded as any).id).select('-password');
    if (!user) {
      return NextResponse.json({ success: false, message: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, user });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Server error' }, { status: 500 });
  }
}
