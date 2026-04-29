import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Designer from '@/models/Designer';

export async function GET() {
  try {
    await dbConnect();
    
    // Just a test query to check connection
    const count = await Designer.countDocuments();
    
    return NextResponse.json({ 
      success: true, 
      message: 'Successfully connected to MongoDB',
      designerCount: count 
    });
  } catch (error: any) {
    console.error('Database connection error:', error);
    return NextResponse.json({ 
      success: false, 
      message: 'Failed to connect to MongoDB',
      error: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    }, { status: 500 });
  }
}
