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

    const { planId, planName, amount, cardDetails } = await req.json();

    // MOCK PAYMENT PROCESSING
    // In a real app, you'd use Stripe/PayPal here
    const transactionId = 'TXN_' + Math.random().toString(36).substr(2, 9).toUpperCase();
    
    const newTransaction = await Transaction.create({
      userId: decoded.id,
      planId,
      amount,
      paymentMethod: 'Credit Card',
      cardLast4: cardDetails.number?.slice(-4) || 'XXXX',
      transactionId,
      status: TransactionStatus.COMPLETED
    });

    // Update user membership status and save card metadata
    const cardBrand = cardDetails.number?.startsWith('4') ? 'Visa' : 'Mastercard';
    
    await User.findByIdAndUpdate(decoded.id, {
      "membership.plan": planName || "Premium", // Save the plan name
      "membership.status": 'ACTIVE',
      "membership.startDate": new Date(),
      "membership.cardLast4": cardDetails.number?.slice(-4) || 'XXXX',
      "membership.paymentMethod": cardBrand,
      membershipTier: 'PAID', 
      paymentStatus: 'PAID'
    });

    return NextResponse.json({ success: true, transaction: newTransaction });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false, message: 'Payment failed' }, { status: 500 });
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
