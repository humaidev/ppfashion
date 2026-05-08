import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import dbConnect from '@/lib/dbConnect';
import EventApplication from '@/models/EventApplication';
import { verifyToken } from '@/lib/jwt';

export async function GET() {
  try {
    await dbConnect();
    const cookieStore = await cookies();
    const userToken = cookieStore.get('user_token');

    if (!userToken) return NextResponse.json({ success: false, message: 'Not authenticated' }, { status: 401 });

    const decoded = verifyToken(userToken.value);
    if (!decoded) return NextResponse.json({ success: false, message: 'Invalid token' }, { status: 401 });

    const applications = await EventApplication.find({ designer: (decoded as any).id })
      .populate({ path: 'event' })
      .sort({ createdAt: -1 });

    return NextResponse.json({ success: true, applications });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Server error' }, { status: 500 });
  }
}
