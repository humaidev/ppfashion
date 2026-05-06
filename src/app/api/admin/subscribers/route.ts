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
    const query = type ? { type } : {};
    const subscribers = await Subscriber.find(query).sort({ createdAt: -1 });
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
