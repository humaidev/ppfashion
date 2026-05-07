import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import User, { UserRole } from '@/models/User';
import Designer from '@/models/Designer';

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
        specialty: (u as any).portfolio?.brandBio?.substring(0, 50) || (u as any).kycData?.category || "Couture Visionary",
        image: primaryImage && primaryImage.trim() !== "" ? primaryImage : 
               brandLogo && brandLogo.trim() !== "" ? brandLogo : "/hero.png", 
        tier: u.membership?.plan || "Collective",
        location: (u as any).kycData?.city || "UK/Pakistan",
        bio: (u as any).portfolio?.brandBio || (u as any).kycData?.businessName || "Exclusive Collective Member",
        portfolio: (u as any).portfolio, // Include full portfolio for gallery access
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
    const designer = await Designer.create(data);
    return NextResponse.json({ success: true, designer });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    await dbConnect();
    const { id, ...data } = await req.json();
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
    await Designer.findByIdAndDelete(id);
    return NextResponse.json({ success: true, message: 'Designer deleted' });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
