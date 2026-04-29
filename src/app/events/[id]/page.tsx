import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

const events = [
  {
    id: 1,
    title: "Glasgow Fashion Gala 2026",
    date: "June 15, 2026",
    location: "Glasgow Royal Concert Hall",
    type: "Fashion Show",
    image: "/vvip-event.jpg",
    status: "Applications Open",
    price: "From £45",
    description: "The flagship event of the summer season. Experience a night of unparalleled luxury as we showcase 12 elite designers in the heart of Glasgow. This year's theme focuses on 'Heritage Refined', blending ancient embroidery techniques with futuristic silhouettes.",
    itinerary: [
        { time: "18:30", label: "Red Carpet Arrival & Drinks" },
        { time: "19:30", label: "Opening Ceremony" },
        { time: "20:00", label: "Main Runway Show" },
        { time: "21:30", label: "After-Party & Networking" },
    ],
  },
  {
    id: 2,
    title: "Pakistani Design Awards",
    date: "August 22, 2026",
    location: "London Hilton Park Lane",
    type: "Awards Ceremony",
    image: "/runway-red.jpg",
    status: "Early Bird Tickets",
    price: "From £95",
    description: "Celebrating the pioneers and rising stars of the Pakistani fashion industry. Join us for a black-tie evening at the Hilton Park Lane, London, as we honor excellence in design, sustainability, and innovation.",
    itinerary: [
        { time: "19:00", label: "VIP Reception" },
        { time: "20:00", label: "Gala Dinner" },
        { time: "21:30", label: "Awards Presentation" },
        { time: "23:00", label: "Late Night Lounge" },
    ],
  },
  {
    id: 3,
    title: "Digital Trends Masterclass",
    date: "September 10, 2026",
    location: "Virtual / Private Hub",
    type: "Workshop",
    image: "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?q=80&w=2070&auto=format&fit=crop",
    status: "Members Only",
    price: "Free for Premium",
    description: "An exclusive digital-first masterclass for our members. Learn how to leverage AI and emerging digital platforms to scale your fashion brand globally without losing your cultural core.",
    itinerary: [
        { time: "14:00", label: "Session 1: AI in Design" },
        { time: "15:30", label: "Breakout Rooms" },
        { time: "16:00", label: "Session 2: Global Logistics" },
        { time: "17:30", label: "Q&A with Industry Leaders" },
    ],
  },
];

export default async function EventDetailPage({ params }: { params: { id: string } }) {
  const eventId = parseInt(params.id);
  const event = events.find((e) => e.id === eventId);

  if (!event) {
    notFound();
  }

  return (
    <div className="bg-warm-ivory dark:bg-luxury-black min-h-screen py-24">
      <div className="container mx-auto px-6">
        <Link href="/events" className="text-primary-gold font-bold uppercase tracking-widest text-[10px] mb-12 inline-block hover:text-vibrant-gold transition-colors">
          ← Back to Calendar
        </Link>

        <div className="relative h-[60vh] w-full overflow-hidden mb-20 shadow-2xl group">
            <Image
                src={event.image}
                alt={event.title}
                fill
                className="object-cover transition-transform duration-1000 group-hover:scale-105"
                priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-luxury-black via-luxury-black/40 to-transparent"></div>
            <div className="absolute bottom-12 left-12 right-12 flex flex-col md:flex-row justify-between items-end gap-8">
                <div className="max-w-3xl">
                    <span className="bg-primary-gold text-luxury-black text-[10px] font-black uppercase tracking-widest px-4 py-2 mb-6 inline-block shadow-xl">
                        {event.type}
                    </span>
                    <h1 className="text-5xl md:text-7xl font-serif font-bold text-white mb-4">{event.title}</h1>
                    <p className="text-primary-gold font-bold uppercase tracking-[0.3em] text-sm">{event.date} • {event.location}</p>
                </div>
                <div className="bg-white/10 backdrop-blur-md p-8 border border-white/20">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-white/60 block mb-2 text-right">Investment</span>
                    <div className="text-4xl font-serif font-bold text-white">{event.price}</div>
                </div>
            </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-20">
            <div className="lg:col-span-2">
                <h2 className="text-3xl font-serif font-bold mb-10 border-b border-primary-gold/10 pb-6 italic text-primary-gold">About the Event</h2>
                <p className="text-xl leading-relaxed text-luxury-black/70 dark:text-warm-ivory/70 mb-16">
                    {event.description}
                </p>

                <h3 className="text-2xl font-serif font-bold mb-10">Event Itinerary</h3>
                <div className="space-y-6">
                    {event.itinerary.map((item, i) => (
                        <div key={i} className="flex gap-12 items-center p-6 border border-primary-gold/5 hover:border-primary-gold/30 transition-all bg-white/5">
                            <span className="text-primary-gold font-bold tracking-widest text-lg">{item.time}</span>
                            <span className="text-luxury-black/80 dark:text-warm-ivory/80 font-bold uppercase tracking-widest text-xs">{item.label}</span>
                        </div>
                    ))}
                </div>
            </div>

            <div>
                <div className="sticky top-32 bg-secondary-emerald p-10 rounded-sm shadow-2xl">
                    <h3 className="text-white text-2xl font-serif font-bold mb-8">Reserve Your Spot</h3>
                    <div className="space-y-6 mb-10">
                        <div className="flex justify-between items-center text-white/60 text-xs font-bold uppercase tracking-widest">
                            <span>Status</span>
                            <span className="text-primary-gold">{event.status}</span>
                        </div>
                        <div className="flex justify-between items-center text-white/60 text-xs font-bold uppercase tracking-widest">
                            <span>Capacity</span>
                            <span className="text-white">Limited</span>
                        </div>
                    </div>
                    
                    <button className="w-full bg-primary-gold hover:bg-vibrant-gold text-luxury-black font-bold py-5 uppercase tracking-widest text-xs transition-all mb-4">
                        {event.status.includes('Tickets') ? 'Book Now' : 'Apply to Attend'}
                    </button>
                    <p className="text-[9px] text-white/40 text-center uppercase tracking-widest">Members get priority access and discounts</p>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
}
