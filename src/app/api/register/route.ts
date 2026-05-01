import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import User, { UserRole } from '@/models/User';
import bcrypt from 'bcryptjs';

export async function POST(req: Request) {
  try {
    await dbConnect();
    const { name, email, password, phone } = await req.json();

    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json({ success: false, message: 'Email already registered' }, { status: 400 });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Generate Verification Code
    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();

    // Create user
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      phone,
      role: UserRole.DESIGNER,
      verificationCode,
      isEmailVerified: false
    });

    // MOCK EMAIL SENDING
    console.log(`[EMAIL VERIFICATION] To: ${email}, Code: ${verificationCode}`);

    return NextResponse.json({ 
      success: true, 
      message: 'Registration successful. Please verify your email.',
      email: user.email // Send email back to pre-fill verification page
    });
  } catch (error: any) {
    console.error('Registration error:', error);
    return NextResponse.json({ success: false, message: 'Server error during registration' }, { status: 500 });
  }
}
