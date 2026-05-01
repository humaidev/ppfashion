import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import dbConnect from '@/lib/dbConnect';
import User from '@/models/User';
import { verifyToken } from '@/lib/jwt';

export async function DELETE() {
  try {
    await dbConnect();
    const cookieStore = await cookies();
    const token = cookieStore.get('user_token')?.value;

    if (!token) return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    const decoded = verifyToken(token) as any;
    if (!decoded) return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });

    await User.findByIdAndUpdate(decoded.id, {
      "membership.cardLast4": null,
      "membership.paymentMethod": null,
      "membership.stripeSubscriptionId": null,
      // We don't delete customer ID usually to keep history
    });

    return NextResponse.json({ success: true, message: 'Payment method removed successfully' });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Server error' }, { status: 500 });
  }
}
