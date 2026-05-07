import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import dbConnect from '@/lib/dbConnect';
import User from '@/models/User';

export async function POST(req: Request) {
  try {
    await dbConnect();
    const { id } = await req.json();

    const user = await User.findById(id);
    if (!user) {
      return NextResponse.json({ success: false, error: "User not found" }, { status: 404 });
    }

    // Fetch plan details to determine extension period
    const Plan = mongoose.models.Plan || mongoose.model('Plan', new mongoose.Schema({ name: String, interval: String }));
    const planName = user.membership?.plan || 'Basic';
    const planDoc = await Plan.findOne({ name: planName });
    const interval = planDoc?.interval || 'monthly';

    // Calculate new expiry date
    // If current expiry is in the future, extend from there, otherwise extend from now
    const currentExpiry = user.membership?.expiryDate ? new Date(user.membership.expiryDate) : new Date();
    const baseDate = currentExpiry.getTime() > new Date().getTime() ? currentExpiry : new Date();
    
    const newExpiry = new Date(baseDate);
    if (interval === 'yearly') {
      newExpiry.setFullYear(newExpiry.getFullYear() + 1);
    } else {
      newExpiry.setMonth(newExpiry.getMonth() + 1);
    }

    user.membership.expiryDate = newExpiry;
    user.membership.status = 'ACTIVE';
    await user.save();

    return NextResponse.json({ 
      success: true, 
      message: `Membership extended by ${interval === 'yearly' ? '1 year' : '1 month'}`,
      newExpiry: newExpiry
    });

  } catch (error: any) {
    console.error("Renewal failed:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
