import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import dbConnect from '@/lib/dbConnect';
import User, { KYCStatus, UserRole } from '@/models/User';
import { verifyToken } from '@/lib/jwt';

export async function GET() {
  try {
    await dbConnect();
    const cookieStore = await cookies();
    
    // Check for admin token or user token with admin role
    const adminToken = cookieStore.get('admin_token');
    const userToken = cookieStore.get('user_token');

    let isAdmin = false;
    if (adminToken?.value === 'secure_token_abc123') isAdmin = true;
    if (userToken) {
      const decoded = verifyToken(userToken.value);
      if (decoded && (decoded as any).role === UserRole.ADMIN) isAdmin = true;
    }

    if (!isAdmin) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 403 });
    }

    const kycApplications = await User.find({ 
      kycStatus: { $ne: KYCStatus.NOT_STARTED } 
    }).select('-password').sort({ updatedAt: -1 });

    return NextResponse.json({ success: true, applications: kycApplications });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Server error' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    await dbConnect();
    const { userId, status, feedback } = await req.json();

    const user = await User.findById(userId);
    if (!user) return NextResponse.json({ success: false, message: 'User not found' }, { status: 404 });

    user.kycStatus = status;
    if (user.kycData) {
      user.kycData.adminFeedback = feedback;
    }
    await user.save();

    return NextResponse.json({ success: true, message: `Application ${status}` });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Server error' }, { status: 500 });
  }
}
