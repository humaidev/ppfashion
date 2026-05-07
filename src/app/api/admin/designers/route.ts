import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import User, { UserRole, KYCStatus } from '@/models/User';
import Designer from '@/models/Designer';
import bcrypt from 'bcryptjs';

export async function GET() {
  try {
    await dbConnect();
    
    // 1. Fetch ALL static Designer records (Admin added)
    const staticDesigners = await Designer.find({}).lean();
    
    // 2. Fetch ALL Users who are Designers
    const userDesigners = await User.find({ role: UserRole.DESIGNER }).lean();

    // 3. Transform User data to match Designer format
    const transformedUsers = userDesigners.map(u => {
      const portfolioImages = (u as any).portfolio?.images || [];
      const primaryImage = portfolioImages.length > 0 ? portfolioImages[0] : (u as any).image;
      const brandLogo = (u as any).portfolio?.brandLogo;
      
      return {
        _id: u._id.toString(),
        name: u.name || u.email || "Unnamed Designer",
        email: u.email,
        specialty: (u as any).kycData?.category || (u as any).portfolio?.brandBio?.substring(0, 50) || "Couture Visionary",
        image: primaryImage && primaryImage.trim() !== "" ? primaryImage : 
               brandLogo && brandLogo.trim() !== "" ? brandLogo : "/hero.png", 
        tier: u.membership?.plan || "Basic",
        location: (u as any).kycData?.city || "UK/Pakistan",
        address: (u as any).kycData?.address || "",
        bio: (u as any).portfolio?.brandBio || "Exclusive Collective Member",
        businessName: (u as any).kycData?.businessName || "",
        experience: (u as any).kycData?.experience || 0,
        cnic: (u as any).kycData?.cnic || "",
        passport: (u as any).kycData?.passport || "",
        portfolioLinks: (u as any).kycData?.portfolioLinks || [],
        documents: (u as any).kycData?.documents || {},
        isUserAccount: true
      };
    });

    // Merge all records
    const combined = [...staticDesigners, ...transformedUsers];
    
    const finalMap = new Map();
    combined.forEach(item => {
      if (!item.image || item.image.trim() === "") {
        item.image = "/hero.png";
      }
      finalMap.set(item._id.toString(), item);
    });
    
    const designers = Array.from(finalMap.values());

    return NextResponse.json({ success: true, designers });
  } catch (error: any) {
    console.error("Designer fetch failed", error);
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
          expiryDate: new Date(new Date().setFullYear(new Date().getFullYear() + 1))
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
    const { name, email, password, specialty, location, bio, image, tier, businessName, experience, cnic, passport, address, portfolioLinks, documents } = data;

    const user = await User.findById(id);
    if (user) {
      const updatePayload: any = {
        name,
        email,
        'membership.plan': tier,
        'kycData.cnic': cnic,
        'kycData.passport': passport,
        'kycData.businessName': businessName,
        'kycData.category': specialty,
        'kycData.experience': Number(experience),
        'kycData.city': location,
        'kycData.address': address,
        'kycData.documents': documents,
        'portfolio.brandBio': bio,
        'portfolio.brandLogo': image
      };

      if (portfolioLinks) {
        updatePayload['kycData.portfolioLinks'] = Array.isArray(portfolioLinks) ? portfolioLinks : portfolioLinks.split(',').map((l: string) => l.trim());
      }

      if (password && password.trim() !== "") {
        updatePayload.password = await bcrypt.hash(password, 10);
      }

      const updatedUser = await User.findByIdAndUpdate(id, { $set: updatePayload }, { new: true });
      return NextResponse.json({ success: true, designer: updatedUser });
    }

    const designer = await Designer.findByIdAndUpdate(id, data, { new: true });
    return NextResponse.json({ success: true, designer });
  } catch (error: any) {
    console.error("Designer update failed:", error);
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
