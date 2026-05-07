import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import dbConnect from '@/lib/dbConnect';
import User from '@/models/User';
import { verifyToken } from '@/lib/jwt';

export async function POST(req: Request) {
  try {
    await dbConnect();
    const cookieStore = await cookies();
    const token = cookieStore.get('user_token')?.value;

    if (!token) return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    const decoded = verifyToken(token) as any;
    if (!decoded) return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });

    const { brandBio, images, socialLinks } = await req.json();
    console.log(`Updating portfolio for user ${decoded.id}:`, { brandBio, images });

    const user = await User.findByIdAndUpdate(decoded.id, {
      $set: {
        portfolio: {
          brandBio: brandBio || "",
          images: images || [],
          socialLinks: socialLinks || {}
        }
      }
    }, { new: true });

    if (!user) {
      console.error(`User not found: ${decoded.id}`);
      return NextResponse.json({ success: false, message: 'User not found' }, { status: 404 });
    }

    console.log(`Portfolio updated for ${user.email}. Image count: ${user.portfolio?.images?.length}`);
    return NextResponse.json({ success: true, portfolio: user.portfolio });
  } catch (error: any) {
    console.error('Portfolio update error:', error);
    return NextResponse.json({ success: false, message: 'Failed to update portfolio' }, { status: 500 });
  }
}
