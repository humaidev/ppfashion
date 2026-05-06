import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import User, { UserRole, KYCStatus, MembershipPlan } from '@/models/User';
import bcrypt from 'bcryptjs';

export async function GET() {
  try {
    await dbConnect();
    
    const email = 'huma@designer.com';
    const password = 'password123';
    const hashedPassword = await bcrypt.hash(password, 10);

    // Clean up if exists
    await User.deleteOne({ email });

    await User.create({
      name: 'Huma Designs',
      email,
      password: hashedPassword,
      role: UserRole.DESIGNER,
      kycStatus: KYCStatus.APPROVED,
      kycData: {
        businessName: 'Huma Luxury Collective',
        cnic: '12345-6789012-3',
        category: 'Bridal Wear',
        experience: 10,
        city: 'Lahore',
        address: 'Gulberg III, Lahore',
        documents: {
          cnicFront: 'https://placehold.co/600x400?text=CNIC+Front',
          cnicBack: 'https://placehold.co/600x400?text=CNIC+Back',
          selfieWithCnic: 'https://placehold.co/600x400?text=Selfie'
        }
      },
      membership: {
        plan: MembershipPlan.MONTHLY,
        status: 'ACTIVE',
        startDate: new Date(),
        expiryDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
      }
    });

    return NextResponse.json({ success: true, message: 'Designer Huma created', email, password });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message });
  }
}
