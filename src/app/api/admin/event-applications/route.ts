import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import EventApplication from '@/models/EventApplication';
import { sendEventStatusEmail } from '@/lib/email';

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
      { status, adminNotes: feedback }, // Storing feedback in adminNotes
      { new: true }
    ).populate('designer event');

    if (!application) {
      return NextResponse.json({ success: false, message: 'Application not found' }, { status: 404 });
    }

    // Send Status Email
    try {
      if ((application.designer as any)?.email) {
        await sendEventStatusEmail(
          (application.designer as any).email,
          (application.designer as any).name,
          (application.event as any).title,
          status,
          (application.event as any).location,
          (application.event as any).startDate && (application.event as any).endDate 
            ? `${new Date((application.event as any).startDate).toLocaleDateString('en-GB')} - ${new Date((application.event as any).endDate).toLocaleDateString('en-GB')}` 
            : 'To Be Announced',
          feedback
        );
      }
    } catch (emailErr) {
      console.error("Status update email failed:", emailErr);
    }

    return NextResponse.json({ success: true, application });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
