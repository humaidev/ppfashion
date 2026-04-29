import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Subscriber from '@/models/Subscriber';

export async function POST(req: Request) {
  try {
    await dbConnect();
    const data = await req.json();
    
    // Check if subscriber already exists
    const existing = await Subscriber.findOne({ email: data.email });
    if (existing) {
      return NextResponse.json({ 
        success: false, 
        message: 'This email is already registered.' 
      }, { status: 400 });
    }

    const subscriber = await Subscriber.create({
      fullName: data.fullName,
      email: data.email,
      phone: data.phone,
      brandName: data.brandName,
      instagram: data.instagram,
      website: data.website,
      yearsInBusiness: data.yearsInBusiness,
      portfolioLink: data.portfolioLink,
      visionStatement: data.visionStatement,
      plan: data.plan || 'Premium',
      type: 'Member',
      status: 'Pending'
    });

    return NextResponse.json({ 
      success: true, 
      message: 'Application submitted successfully!',
      subscriber 
    });
  } catch (error: any) {
    console.error('Registration error:', error);
    return NextResponse.json({ 
      success: false, 
      message: 'Failed to submit application',
      error: error.message 
    }, { status: 500 });
  }
}
