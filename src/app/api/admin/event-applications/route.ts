import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import EventApplication from '@/models/EventApplication';

export async function GET() {
  try {
    await dbConnect();
    const applications = await EventApplication.find({})
      .populate('event')
      .populate('designer')
      .sort({ appliedAt: -1 });

    return NextResponse.json({ success: true, applications });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    await dbConnect();
    const { applicationId, status, feedback } = await req.json();
    
    const application = await EventApplication.findByIdAndUpdate(
      applicationId,
      { status, feedback },
      { new: true }
    );

    if (!application) {
      return NextResponse.json({ success: false, message: 'Application not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, application });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
