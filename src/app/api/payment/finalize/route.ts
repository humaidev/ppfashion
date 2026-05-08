import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import dbConnect from '@/lib/dbConnect';
import Transaction, { TransactionStatus } from '@/models/Transaction';
import User from '@/models/User';
import { verifyToken } from '@/lib/jwt';
import { sendPaymentConfirmationEmail } from '@/lib/email';

export async function POST(req: Request) {
  try {
    await dbConnect();
    const cookieStore = await cookies();
    const token = cookieStore.get('user_token')?.value;

    if (!token) return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    const decoded = verifyToken(token) as any;
    if (!decoded) return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });

    const { paymentIntentId } = await req.json();

    const { stripe } = await import('@/lib/stripe');
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

    if (paymentIntent.status !== 'succeeded') {
      return NextResponse.json({ success: false, message: 'Payment not successful' }, { status: 400 });
    }

    const { planId, planName, userId } = paymentIntent.metadata;

    if (userId !== decoded.id) {
       return NextResponse.json({ success: false, message: 'User mismatch' }, { status: 403 });
    }

    // 1. Create Transaction Record
    const transaction = await Transaction.create({
      userId: decoded.id,
      planId,
      amount: paymentIntent.amount / 100,
      paymentMethod: 'Credit Card (Stripe)',
      cardLast4: (paymentIntent as any).charges?.data[0]?.payment_method_details?.card?.last4 || 'XXXX',
      transactionId: paymentIntent.id,
      status: TransactionStatus.COMPLETED
    });

    // 2. Update User Membership with Card Info
    const charge = (paymentIntent as any).charges?.data[0];
    const cardInfo = charge?.payment_method_details?.card;

    const updatedUser = await User.findByIdAndUpdate(decoded.id, {
      "membership.plan": planName,
      "membership.status": 'ACTIVE',
      "membership.startDate": new Date(),
      "membership.expiryDate": new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 year commitment
      "membership.cardLast4": cardInfo?.last4 || 'XXXX',
      "membership.paymentMethod": cardInfo?.brand || 'Stripe',
      "membershipTier": 'PAID',
    }, { new: true });

    // 3. Dispatch Email
    if (updatedUser?.email) {
      await sendPaymentConfirmationEmail(
        updatedUser.email, 
        planName, 
        paymentIntent.amount / 100,
        updatedUser.membership.cardLast4 || 'XXXX'
      );
    }

    return NextResponse.json({ success: true, transaction });
  } catch (error: any) {
    console.error('Finalize error:', error);
    return NextResponse.json({ success: false, message: 'Failed to finalize payment' }, { status: 500 });
  }
}
