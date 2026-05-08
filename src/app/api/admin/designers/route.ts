import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import dbConnect from '@/lib/dbConnect';
import User, { UserRole, KYCStatus } from '@/models/User';
import Designer from '@/models/Designer';
import bcrypt from 'bcryptjs';

export async function GET(req: Request) {
  try {
    await dbConnect();
    const { searchParams } = new URL(req.url);
    const featuredOnly = searchParams.get('featured') === 'true';

    const query = featuredOnly ? { isFeatured: true } : {};
    
    // 1. Fetch static Designer records
    const staticDesigners = await Designer.find(query).lean();
    
    // 2. Fetch Users who are Designers
    const userDesigners = await User.find({ role: UserRole.DESIGNER, ...query }).lean();

    // 3. Transform User data to match Designer format
    const transformedUsers = userDesigners.map(u => {
      const portfolioImages = (u as any).portfolio?.images || [];
      const primaryImage = portfolioImages.length > 0 ? portfolioImages[0] : (u as any).image;
      
      return {
        _id: u._id.toString(),
        name: u.name || u.email || "Unnamed Designer",
        email: u.email,
        specialty: (u as any).kycData?.category || (u as any).portfolio?.brandBio?.substring(0, 50) || "Couture Visionary",
        image: primaryImage && primaryImage.trim() !== "" ? primaryImage : "/hero.png", 
        tier: u.membership?.plan || "Basic",
        location: (u as any).kycData?.city || "UK/Pakistan",
        isFeatured: u.isFeatured || false,
        isUserAccount: true
      };
    });

    const combined = [...staticDesigners, ...transformedUsers];
    const finalMap = new Map();
    combined.forEach(item => finalMap.set(item._id.toString(), item));
    const designers = Array.from(finalMap.values());

    return NextResponse.json({ success: true, designers });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    await dbConnect();
    const data = await req.json();
    const { name, email, password, specialty, location, bio, image, tier, businessName, experience, cnic, passport, address, portfolioLinks, documents } = data;

    if (email && password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      
      // Fetch plan to determine interval
      const Plan = mongoose.models.Plan || mongoose.model('Plan', new mongoose.Schema({ name: String, interval: String }));
      const planDoc = await Plan.findOne({ name: tier || 'Basic' });
      const interval = planDoc?.interval || 'monthly';
      
      const expiryDate = new Date();
      if (interval === 'yearly') {
        expiryDate.setFullYear(expiryDate.getFullYear() + 1);
      } else {
        expiryDate.setMonth(expiryDate.getMonth() + 1);
      }

      const user = await User.create({
        name,
        email,
        password: hashedPassword,
        role: UserRole.DESIGNER,
        isEmailVerified: true,
        kycStatus: KYCStatus.APPROVED,
        membership: {
          plan: tier || 'Basic',
          status: 'ACTIVE',
          startDate: new Date(),
          expiryDate: expiryDate
        },
        kycData: {
          cnic,
          passport,
          businessName: businessName || name,
          category: specialty,
          experience: Number(experience) || 0,
          portfolioLinks: Array.isArray(portfolioLinks) ? portfolioLinks : (portfolioLinks ? portfolioLinks.split(',').map((l: string) => l.trim()) : []),
          city: location,
          address: address || '',
          documents: documents || {}
        },
        portfolio: {
          brandBio: bio,
          images: [image],
          brandLogo: image
        }
      });

      return NextResponse.json({ success: true, designer: user, message: 'Designer user account created' });
    }

    const designer = await Designer.create(data);
    return NextResponse.json({ success: true, designer });
  } catch (error: any) {
    console.error("Designer creation failed:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    await dbConnect();
    const { id, ...data } = await req.json();

    const user = await User.findById(id);
    if (user) {
      // If it's a featured toggle only
      if (Object.keys(data).length === 1 && data.hasOwnProperty('isFeatured')) {
        const updated = await User.findByIdAndUpdate(id, { isFeatured: data.isFeatured }, { new: true });
        return NextResponse.json({ success: true, designer: updated });
      }

      const updatePayload: any = {
        name: data.name,
        email: data.email,
        'membership.plan': data.tier,
        'kycData.cnic': data.cnic,
        'kycData.passport': data.passport,
        'kycData.businessName': data.businessName,
        'kycData.category': data.specialty,
        'kycData.experience': Number(data.experience),
        'kycData.city': data.location,
        'kycData.address': data.address,
        'kycData.documents': data.documents,
        'portfolio.brandBio': data.bio, // Syncing with dashboard
        'portfolio.brandLogo': data.image
      };

      if (data.password && data.password.trim() !== "") {
        updatePayload.password = await bcrypt.hash(data.password, 10);
      }

      const updatedUser = await User.findByIdAndUpdate(id, { $set: updatePayload }, { new: true });
      return NextResponse.json({ success: true, designer: updatedUser });
    }

    const designer = await Designer.findByIdAndUpdate(id, data, { new: true });
    return NextResponse.json({ success: true, designer });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    await dbConnect();
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) return NextResponse.json({ success: false, message: 'ID required' }, { status: 400 });

    // Try deleting from User collection first
    const userDeleted = await User.findByIdAndDelete(id);
    if (userDeleted) {
      return NextResponse.json({ success: true, message: 'Designer user account purged' });
    }

    // Fallback to static Designer collection
    const staticDeleted = await Designer.findByIdAndDelete(id);
    if (staticDeleted) {
      return NextResponse.json({ success: true, message: 'Static designer record purged' });
    }

    return NextResponse.json({ success: false, message: 'Record not found' }, { status: 404 });
  } catch (error: any) {
    console.error("Designer deletion failed:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
