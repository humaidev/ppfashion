import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Designer from '@/models/Designer';
import Event from '@/models/Event';
import EventApplication from '@/models/EventApplication';
import Blog from '@/models/Blog';
import Subscriber from '@/models/Subscriber';
import Transaction from '@/models/Transaction';
import User, { KYCStatus, UserRole } from '@/models/User';

const initialDesigners = [
  { name: "Ayesha Malik", specialty: "Bridal Couture", tier: "Elite", image: "/runway-red.jpg", location: "London, UK", bio: "Renowned for her intricate zardozi work and modern bridal silhouettes.", collections: ["Regal Heritage 2026", "Silk Road"] },
  { name: "Zainab Chottani", specialty: "Luxury Pret", tier: "Premium", image: "/runway-couple.jpg", location: "Karachi, PK", bio: "A household name in Pakistani fashion, blending tradition with contemporary flair.", collections: ["Summer Bloom", "Velvet Nights"] },
  { name: "Hassan Sheheryar", specialty: "Men's Formal", tier: "Elite", image: "/runway-bridal-1.jpg", location: "Dubai, UAE", bio: "The king of Pakistani couture, known for his grand runway shows and opulent designs.", collections: ["The Sultanate", "Modern Raj"] },
  { name: "Nomi Ansari", specialty: "Colorist / Bridal", tier: "Premium", image: "/event-group.jpg", location: "London, UK", bio: "Known for his vibrant use of color and avant-garde bridal collections.", collections: ["Kaleidoscope", "Rainbow Bride"] },
  { name: "Sana Safinaz", specialty: "Luxury Retail", tier: "Elite", image: "/vvip-event.jpg", location: "Glasgow, UK", bio: "The duo that revolutionized Pakistani retail and luxury fashion.", collections: ["Muzlin", "Luxury Lawn"] },
  { name: "Faraz Manan", specialty: "Bespoke Couture", tier: "Elite", image: "/runway-bridal-1.jpg", location: "Dubai, UAE", bio: "Exquisite craftsmanship and understated elegance for the global Pakistani elite.", collections: ["The Al-Ula Collection"] }
];

const initialEvents = [
  { title: "Glasgow Fashion Gala 2026", startDate: "2026-06-15", endDate: "2026-06-17", location: "Glasgow Royal Concert Hall", type: "Fashion Show", image: "/vvip-event.jpg", status: "Applications Open", price: "From £45", description: "The premier event of the season." },
  { title: "Pakistani Design Awards", startDate: "2026-08-22", endDate: "2026-08-23", location: "London Hilton Park Lane", type: "Awards Ceremony", image: "/hero.png", status: "Tickets on Sale", price: "From £120", description: "Celebrating excellence in design." }
];

const initialBlogs = [
  { title: "The Rise of Pakistani Bridal Couture", author: "Sarah Jenkins", excerpt: "Exploring the intricate craftsmanship and global impact of traditional bridal wear.", content: "<p>Pakistani bridal couture has seen a massive surge in global popularity...</p>", image: "/runway-red.jpg" },
  { title: "Upcoming Designers to Watch in 2026", author: "Imran Khan", excerpt: "Highlighting the fresh talent emerging from the collective this year.", content: "<p>The next generation of designers is pushing boundaries...</p>", image: "/runway-couple.jpg" }
];

const initialSubscribers = [
  { fullName: "James Wilson", email: "james@example.com", plan: "Premium", type: "Member", status: "Approved", brandName: "Wilson Silks" },
  { fullName: "Amara Siddiqui", email: "amara@fashion.pk", plan: "Newsletter", type: "Newsletter", status: "Approved" }
];

export async function POST() {
  try {
    await dbConnect();
    
    // Seed Designers
    for (const d of initialDesigners) {
      const existing = await Designer.findOne({ name: d.name });
      if (!existing) await Designer.create(d as any);
    }

    // Seed Events
    for (const e of initialEvents) {
      const existing = await Event.findOne({ title: e.title });
      if (!existing) await Event.create(e);
    }

    // Seed Blogs
    for (const b of initialBlogs) {
      const existing = await Blog.findOne({ title: b.title });
      if (!existing) await Blog.create(b);
    }

    // Seed Subscribers
    for (const s of initialSubscribers) {
      const existing = await Subscriber.findOne({ email: s.email });
      if (!existing) await Subscriber.create(s as any);
    }

    // Seed a working test Designer for login verification
    const testDesigner = await User.findOne({ email: "designer@test.com" });
    if (!testDesigner) {
      await User.create({
        name: "Designer Prototype",
        email: "designer@test.com",
        password: "$2b$10$DlH44loQZsitxRPvJN17YuLylwlBFwWosMrFoXzjNiFrzA3K/ofQC", // password123
        role: UserRole.DESIGNER,
        kycStatus: KYCStatus.APPROVED,
        isEmailVerified: true,
        membership: {
          plan: 'Elite',
          status: 'ACTIVE',
          cardLast4: '4242',
          paymentMethod: 'Visa'
        },
        kycData: {
          businessName: "Midnight Couture",
          cnic: "12345-6789012-3",
          category: "Luxury Bridal",
          experience: 10,
          city: "London",
          address: "123 Fashion Street, Mayfair",
          portfolioLinks: ["https://portfolio.example.com"],
          documents: {
            cnicFront: "https://via.placeholder.com/400x250",
            cnicBack: "https://via.placeholder.com/400x250",
            selfieWithCnic: "https://via.placeholder.com/400x250"
          }
        }
      });
    }

    // Seed some Event Applications
    const appCount = await EventApplication.countDocuments();
    if (appCount === 0) {
      const testUser = await User.findOne({ email: "designer@test.com" });
      const firstEvent = await Event.findOne();
      if (testUser && firstEvent) {
        await EventApplication.create({
          designer: testUser._id,
          event: firstEvent._id,
          status: 'PENDING' as any,
          appliedAt: new Date()
        });
      }
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Database seeded successfully with initial elite collective.' 
    });
  } catch (error: any) {
    return NextResponse.json({ 
      success: false, 
      error: error.message 
    }, { status: 500 });
  }
}
