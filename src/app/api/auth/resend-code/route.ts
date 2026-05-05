import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import User from '@/models/User';
import { sendVerificationEmail } from '@/lib/email';

export async function POST(req: Request) {
  try {
    await dbConnect();
    const { email } = await req.json();

    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json({ success: false, message: 'User not found' }, { status: 404 });
    }

    // Generate New Verification Code
    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
    
    user.verificationCode = verificationCode;
    await user.save();

    // DISPATCH REAL EMAIL
    await sendVerificationEmail(email, verificationCode);

    return NextResponse.json({ 
      success: true, 
      message: 'A new verification code has been dispatched to your email.' 
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: 'Server error' }, { status: 500 });
  }
}
