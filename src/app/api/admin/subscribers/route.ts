import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Subscriber from '@/models/Subscriber';

export async function GET(req: Request) {
  try {
    await dbConnect();
    const { searchParams } = new URL(req.url);
    const type = searchParams.get('type');
    
    const query = type ? { type } : {};
    const subscribers = await Subscriber.find(query).sort({ createdAt: -1 });
    
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
