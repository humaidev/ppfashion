import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import dbConnect from '@/lib/dbConnect';
import Transaction, { TransactionStatus } from '@/models/Transaction';
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

    const { planId, planName, amount } = await req.json();

    // REAL STRIPE PROCESSING
    const { stripe } = await import('@/lib/stripe');
    
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(parseFloat(amount) * 100), // Stripe expects cents
      currency: 'gbp', 
      description: `Membership: ${planName}`,
      metadata: { userId: decoded.id, planId, planName }
    });

    return NextResponse.json({ 
      success: true, 
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false, message: 'Payment initialization failed' }, { status: 500 });
  }
}

export async function GET(req: Request) {
  try {
    await dbConnect();
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId');

    const query = userId ? { userId } : {};
    const transactions = await Transaction.find(query).populate('userId', 'name email').sort({ createdAt: -1 });

    return NextResponse.json({ success: true, transactions });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Server error' }, { status: 500 });
  }
}
