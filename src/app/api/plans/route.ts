import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Plan from '@/models/Plan';

export async function GET() {
  try {
    await dbConnect();
    const plans = await Plan.find({}).sort({ price: 1 });
    return NextResponse.json({ success: true, plans });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Server error' }, { status: 500 });
  }
}
