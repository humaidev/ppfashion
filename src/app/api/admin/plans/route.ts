import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import dbConnect from '@/lib/dbConnect';
import Plan from '@/models/Plan';
import { verifyToken } from '@/lib/jwt';
import { UserRole } from '@/models/User';

export async function GET() {
  try {
    await dbConnect();
    const plans = await Plan.find({}).sort({ createdAt: -1 });
    return NextResponse.json({ success: true, plans });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Server error' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    await dbConnect();
    const cookieStore = await cookies();
    const adminToken = cookieStore.get('admin_token');
    const userToken = cookieStore.get('user_token');

    let isAdmin = false;
    if (adminToken?.value === 'secure_token_abc123') isAdmin = true;
    if (userToken) {
      const decoded = verifyToken(userToken.value);
      if (decoded && (decoded as any).role === UserRole.ADMIN) isAdmin = true;
    }

    if (!isAdmin) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 403 });
    }

    const { name, price, currency, interval, description, features, isPopular } = await req.json();
    const newPlan = await Plan.create({ name, price, currency, interval, description, features, isPopular });

    return NextResponse.json({ success: true, plan: newPlan });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Server error' }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    await dbConnect();
    const { id, ...updateData } = await req.json();
    const updatedPlan = await Plan.findByIdAndUpdate(id, updateData, { new: true });
    if (!updatedPlan) return NextResponse.json({ success: false, message: 'Plan not found' }, { status: 404 });

    return NextResponse.json({ success: true, plan: updatedPlan });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Server error' }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    await dbConnect();
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    if (!id) return NextResponse.json({ success: false, message: 'ID required' }, { status: 400 });

    await Plan.findByIdAndDelete(id);
    return NextResponse.json({ success: true, message: 'Plan deleted' });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Server error' }, { status: 500 });
  }
}
