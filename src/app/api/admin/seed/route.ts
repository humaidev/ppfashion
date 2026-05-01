import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Designer from '@/models/Designer';
import Event from '@/models/Event';

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

export async function POST() {
  try {
    await dbConnect();
    
    // Seed Designers
    for (const d of initialDesigners) {
      const existing = await Designer.findOne({ name: d.name });
      if (!existing) await Designer.create(d);
    }

    // Seed Events
    for (const e of initialEvents) {
      const existing = await Event.findOne({ title: e.title });
      if (!existing) await Event.create(e);
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
