import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import User from '@/models/User';

export async function POST(req: Request) {
  try {
    await dbConnect();
    const { email, code } = await req.json();

    const user = await User.findOne({ email });
    if (!user) return NextResponse.json({ success: false, message: 'User not found' }, { status: 404 });

    if (user.verificationCode === code) {
      user.isEmailVerified = true;
      user.verificationCode = undefined; // Clear code after success
      await user.save();
      return NextResponse.json({ success: true, message: 'Email verified successfully' });
    } else {
      return NextResponse.json({ success: false, message: 'Invalid verification code' }, { status: 400 });
    }
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Server error' }, { status: 500 });
  }
}
