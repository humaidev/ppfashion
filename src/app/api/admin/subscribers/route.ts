import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Subscriber from '@/models/Subscriber';

export async function GET() {
  try {
    await dbConnect();
    const subscribers = await Subscriber.find({}).sort({ createdAt: -1 });
    
    return NextResponse.json({ 
      success: true, 
      subscribers 
    });
  } catch (error: any) {
    console.error('Admin Fetch error:', error);
    return NextResponse.json({ 
      success: false, 
      message: 'Failed to fetch subscribers',
      error: error.message 
    }, { status: 500 });
  }
}
