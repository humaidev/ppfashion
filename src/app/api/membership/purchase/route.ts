import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import dbConnect from '@/lib/dbConnect';
import User, { MembershipPlan } from '@/models/User';
import { verifyToken } from '@/lib/jwt';
import { sendMembershipEmail } from '@/lib/email';

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

    const { planName } = await req.json();

    const user = await User.findById((decoded as any).id);
    if (!user) return NextResponse.json({ success: false, message: 'User not found' }, { status: 404 });

    if (user.kycStatus !== 'APPROVED') {
      return NextResponse.json({ success: false, message: 'KYC not approved' }, { status: 403 });
    }

    const isRenewal = user.membership?.status === 'ACTIVE' || user.membership?.status === 'EXPIRED';

    // Update Membership (Mocking Stripe Success)
    const expiryDate = new Date();
    // Default to 1 month for now, or detect from planName if needed
    expiryDate.setMonth(expiryDate.getMonth() + 1);

    user.membership = {
      plan: planName,
      status: 'ACTIVE',
      startDate: new Date(),
      expiryDate: expiryDate,
    };

    await user.save();

    // Send Confirmation Email
    try {
      await sendMembershipEmail(user.email, user.name, planName, isRenewal ? 'RENEWED' : 'PURCHASED');
    } catch (emailErr) {
      console.error("Purchase email failed:", emailErr);
    }

    return NextResponse.json({ success: true, message: 'Membership purchased' });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: 'Server error' }, { status: 500 });
  }
}
