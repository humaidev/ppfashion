import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import dbConnect from "@/lib/dbConnect";
import Event from "@/models/Event";

export default async function EventDetailPage({ params }: { params: { id: string } }) {
  await dbConnect();
  
  let event;
  try {
    event = await Event.findById(params.id);
  } catch (err) {
    // Invalid ID
  }

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
                    <p className="text-primary-gold font-bold uppercase tracking-[0.3em] text-sm">{event.startDate} • {event.location}</p>
                </div>
                <div className="bg-white/10 backdrop-blur-md p-8 border border-white/20 text-right">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-white/60 block mb-2">Access Type</span>
                    <div className="text-2xl font-serif font-bold text-primary-gold uppercase tracking-widest">Collective Elite</div>
                    <p className="text-[9px] text-white/40 uppercase tracking-[0.2em] mt-2">Member Priority Access</p>
                </div>
            </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-20">
            <div className="lg:col-span-2">
                <h2 className="text-3xl font-serif font-bold mb-10 border-b border-primary-gold/10 pb-6 italic text-primary-gold">About the Event</h2>
                <p className="text-xl leading-relaxed text-luxury-black/70 dark:text-warm-ivory/70 mb-16">
                    {event.description || "Join us for an extraordinary showcase of Pakistani fashion excellence. This event brings together the most visionary designers and prestigious guests for a night of culture and high style."}
                </p>

                {event.itinerary && event.itinerary.length > 0 && (
                    <>
                        <h3 className="text-2xl font-serif font-bold mb-10">Event Itinerary</h3>
                        <div className="space-y-6">
                            {event.itinerary.map((item: string, i: number) => (
                                <div key={i} className="flex gap-12 items-center p-6 border border-primary-gold/5 hover:border-primary-gold/30 transition-all bg-white/5">
                                    <span className="text-primary-gold font-bold tracking-widest text-xs uppercase">Agenda Item {i+1}</span>
                                    <span className="text-luxury-black/80 dark:text-warm-ivory/80 font-bold uppercase tracking-widest text-xs">{item}</span>
                                </div>
                            ))}
                        </div>
                    </>
                )}
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
                            <span>Location</span>
                            <span className="text-white truncate max-w-[150px]">{event.location}</span>
                        </div>
                    </div>
                    
                    <button className="w-full bg-primary-gold hover:bg-vibrant-gold text-luxury-black font-bold py-5 uppercase tracking-widest text-xs transition-all mb-4">
                        {event.status?.includes('Tickets') ? 'Book Now' : 'Apply to Attend'}
                    </button>
                    <p className="text-[9px] text-white/40 text-center uppercase tracking-widest">Members get priority access and discounts</p>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
}
