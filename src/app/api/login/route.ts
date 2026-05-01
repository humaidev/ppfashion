import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import User from '@/models/User';
import bcrypt from 'bcryptjs';
import { signToken } from '@/lib/jwt';

export async function POST(req: Request) {
  try {
    await dbConnect();
    const { email, password } = await req.json();

    // Check for user
    const user = await User.findOne({ email });
    
    // Check if it's the legacy hardcoded admin for safety during transition
    if (email === 'admin@ppfassion.com' && password === 'admin123') {
       const response = NextResponse.json({ 
        success: true, 
        message: 'Admin Login successful',
        role: 'ADMIN'
      });
      response.cookies.set('admin_token', 'secure_token_abc123', {
        httpOnly: true,
        path: '/',
        maxAge: 60 * 60 * 24
      });
      return response;
    }

    if (!user) {
      return NextResponse.json({ success: false, message: 'Invalid credentials' }, { status: 401 });
    }

    // Verify password
    const isMatch = await bcrypt.compare(password, user.password || '');
    if (!isMatch) {
      return NextResponse.json({ success: false, message: 'Invalid credentials' }, { status: 401 });
    }

    const token = signToken({ id: user._id, role: user.role });

    const response = NextResponse.json({ 
      success: true, 
      message: 'Login successful',
      role: user.role
    });

    response.cookies.set('user_token', token, {
      httpOnly: true,
      path: '/',
      maxAge: 60 * 60 * 24 // 1 day
    });

    return response;
  } catch (error: any) {
    console.error('Login error:', error);
    return NextResponse.json({ success: false, message: 'Server error' }, { status: 500 });
  }
}
