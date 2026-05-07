import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Subscriber from '@/models/Subscriber';
import User from '@/models/User';

export async function GET(req: Request) {
  try {
    await dbConnect();
    const { searchParams } = new URL(req.url);
    const type = searchParams.get('type');
    
    let combinedResults: any[] = [];

    // 1. Fetch from Subscriber model
    const query: any = type ? { type } : {};
    const subscribers = await Subscriber.find(query).sort({ createdAt: -1 }).lean();
    combinedResults = [...subscribers];

    // 2. If looking for 'Member', also fetch from User model
    if (type === 'Member' || !type) {
      const activeUsers = await User.find({ 
        'membership.status': 'ACTIVE' 
      }).sort({ createdAt: -1 });

      const mappedUsers = activeUsers.map(user => ({
        _id: user._id,
        fullName: user.name,
        email: user.email,
        brandName: user.kycData?.businessName || "Individual Member",
        plan: user.membership?.plan || "Standard",
        status: "Approved", // Active users are approved by default
        type: "Member",
        createdAt: user.createdAt
      }));

      // Avoid duplicates if email exists in both (unlikely but possible)
      const existingEmails = new Set(combinedResults.map(s => s.email));
      mappedUsers.forEach(u => {
        if (!existingEmails.has(u.email)) {
          combinedResults.push(u);
        }
      });
    }

    // Sort combined results by date
    combinedResults.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    
    return NextResponse.json({ 
      success: true, 
      subscribers: combinedResults 
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

export async function DELETE(req: Request) {
  try {
    await dbConnect();
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ success: false, message: 'ID is required' }, { status: 400 });
    }

    // Try deleting from Subscriber model first
    const deletedSubscriber = await Subscriber.findByIdAndDelete(id);
    
    // If not found in Subscriber, it might be a User record (though usually we don't delete users from here)
    // For now, we only allow deleting from Subscriber model to be safe.
    
    if (deletedSubscriber) {
      return NextResponse.json({ success: true, message: 'Subscriber deleted successfully' });
    }

    return NextResponse.json({ success: false, message: 'Subscriber not found' }, { status: 404 });
  } catch (error: any) {
    console.error('Subscriber Delete error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
