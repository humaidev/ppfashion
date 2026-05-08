import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import dbConnect from '@/lib/dbConnect';
import User from '@/models/User';
import Event from '@/models/Event';
import EventApplication from '@/models/EventApplication';
import { verifyToken } from '@/lib/jwt';
import { sendEventApplicationEmail } from '@/lib/email';

export async function POST(req: Request) {
  try {
    await dbConnect();
    const cookieStore = await cookies();
    const userToken = cookieStore.get('user_token');

    if (!userToken) return NextResponse.json({ success: false, message: 'Not authenticated' }, { status: 401 });

    const decoded = verifyToken(userToken.value);
    if (!decoded) return NextResponse.json({ success: false, message: 'Invalid token' }, { status: 401 });

    const { eventId } = await req.json();

    const user = await User.findById((decoded as any).id);
    if (!user) return NextResponse.json({ success: false, message: 'User not found' }, { status: 404 });

    const event = await Event.findById(eventId);
    if (!event) return NextResponse.json({ success: false, message: 'Event not found' }, { status: 404 });

    if (user.kycStatus !== 'APPROVED') {
      return NextResponse.json({ success: false, message: 'KYC approval required' }, { status: 403 });
    }

    if (user.membership.status !== 'ACTIVE') {
      return NextResponse.json({ success: false, message: 'Active membership required' }, { status: 403 });
    }

    // Check if already applied
    const existing = await EventApplication.findOne({ event: eventId, designer: user._id });
    if (existing) {
      return NextResponse.json({ success: false, message: 'Already applied for this event' }, { status: 400 });
    }

    await EventApplication.create({
      event: eventId,
      designer: user._id,
    });

    // Send confirmation email to designer
    try {
      await sendEventApplicationEmail(
        user.email,
        user.name,
        event.title,
        event.location,
        event.startDate && event.endDate ? `${new Date(event.startDate).toLocaleDateString('en-GB')} - ${new Date(event.endDate).toLocaleDateString('en-GB')}` : 'To Be Announced'
      );
    } catch (emailErr) {
      console.error("Email notification failed:", emailErr);
    }

    return NextResponse.json({ success: true, message: 'Application submitted' });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: 'Server error' }, { status: 500 });
  }
}
