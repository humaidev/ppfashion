import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Inquiry from '@/models/Inquiry';
import { sendInquiryEmail } from '@/lib/email';

export async function POST(req: Request) {
  try {
    await dbConnect();
    const body = await req.json();
    const { fullName, email, type, message } = body;

    if (!fullName || !email || !type || !message) {
      return NextResponse.json({ success: false, message: 'All fields are required' }, { status: 400 });
    }

    const newInquiry = await Inquiry.create({
      fullName,
      email,
      type,
      message,
    });

    // Send email notification to Admin
    await sendInquiryEmail(fullName, email, type, message);

    return NextResponse.json({ success: true, inquiry: newInquiry }, { status: 201 });
  } catch (error: any) {
    console.error('Contact API error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
