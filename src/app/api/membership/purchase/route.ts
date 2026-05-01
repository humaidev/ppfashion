import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import dbConnect from '@/lib/dbConnect';
import User, { MembershipPlan } from '@/models/User';
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
    if (!decoded) return NextResponse.json({ success: false, message: 'Invalid token' }, { status: 401 });

    const { plan } = await req.json();

    const user = await User.findById((decoded as any).id);
    if (!user) return NextResponse.json({ success: false, message: 'User not found' }, { status: 404 });

    if (user.kycStatus !== 'APPROVED') {
      return NextResponse.json({ success: false, message: 'KYC not approved' }, { status: 403 });
    }

    // Update Membership (Mocking Stripe Success)
    const expiryDate = new Date();
    if (plan === MembershipPlan.MONTHLY) {
      expiryDate.setMonth(expiryDate.getMonth() + 1);
    } else if (plan === MembershipPlan.YEARLY) {
      expiryDate.setFullYear(expiryDate.getFullYear() + 1);
    }

    user.membership = {
      plan: plan as MembershipPlan,
      status: 'ACTIVE',
      startDate: new Date(),
      expiryDate: expiryDate,
    };

    await user.save();

    return NextResponse.json({ success: true, message: 'Membership purchased' });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: 'Server error' }, { status: 500 });
  }
}
