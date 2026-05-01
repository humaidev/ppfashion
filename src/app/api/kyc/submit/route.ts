import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import dbConnect from '@/lib/dbConnect';
import User, { KYCStatus } from '@/models/User';
import { verifyToken } from '@/lib/jwt';

export async function POST(req: Request) {
  try {
    await dbConnect();
    const cookieStore = await cookies();
    const userToken = cookieStore.get('user_token');

    if (!userToken) {
      return NextResponse.json({ success: false, message: 'Not authenticated' }, { status: 401 });
    }

    const decoded = verifyToken(userToken.value);
    if (!decoded || !(decoded as any).id) {
      return NextResponse.json({ success: false, message: 'Invalid token' }, { status: 401 });
    }

    const kycData = await req.json();

    const user = await User.findById((decoded as any).id);
    if (!user) {
      return NextResponse.json({ success: false, message: 'User not found' }, { status: 404 });
    }

    user.kycData = kycData;
    user.kycStatus = KYCStatus.PENDING;
    await user.save();

    return NextResponse.json({ success: true, message: 'KYC submitted successfully' });
  } catch (error: any) {
    console.error('KYC Submission error:', error);
    return NextResponse.json({ success: false, message: 'Server error' }, { status: 500 });
  }
}
