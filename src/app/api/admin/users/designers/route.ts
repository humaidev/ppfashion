import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import User, { UserRole } from '@/models/User';

export async function GET() {
  try {
    await dbConnect();
    // Fetch all users who registered as designers
    const users = await User.find({ role: UserRole.DESIGNER }).sort({ createdAt: -1 });
    return NextResponse.json({ success: true, designers: users });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
