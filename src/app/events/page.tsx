"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import AnimatedSection from "@/components/AnimatedSection";

interface IEvent {
  _id: string;
  title: string;
  date: string;
  location: string;
  type: string;
  image: string;
  status: string;
  price: string;
}

export default function EventsPage() {
  const [events, setEvents] = useState<IEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [appliedEvents, setAppliedEvents] = useState<string[]>([]);
  const [processingId, setProcessingId] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [eventsRes, profileRes] = await Promise.all([
          fetch("/api/admin/events"),
          fetch("/api/auth/profile")
        ]);

        const eventsData = await eventsRes.json();
        const profileData = await profileRes.json();

        if (eventsData.success) {
          setEvents(eventsData.events);
        }
        
        if (profileData.success) {
          setUser(profileData.user);
          // Fetch existing applications
          const appRes = await fetch("/api/events/applications");
          const appData = await appRes.json();
          if (appData.success) {
            setAppliedEvents(appData.applications.map((a: any) => a.event));
          }
        }
      } catch (err) {
        console.error("Fetch failed", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleJoin = async (e: React.MouseEvent, eventId: string) => {
    e.preventDefault();
    e.stopPropagation();

    if (!user) {
      alert("Please login first");
      return;
    }

    if (user.kycStatus !== 'APPROVED' || user.membership?.status !== 'ACTIVE') {
      alert("You need an approved KYC and an active membership to join events.");
      return;
    }

    setProcessingId(eventId);
    try {
      const res = await fetch("/api/events/apply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ eventId }),
      });
      const data = await res.json();
      if (data.success) {
        setAppliedEvents([...appliedEvents, eventId]);
        alert("Application submitted successfully!");
      } else {
        alert(data.message);
      }
    } catch (err) {
      alert("Application failed");
    } finally {
      setProcessingId(null);
    }
  };

  return (
    <div className="min-h-screen bg-luxury-black py-32 px-6">
      <div className="container mx-auto">
        <AnimatedSection className="max-w-4xl mb-20 md:mb-32 border-l-2 border-primary-gold/20 pl-6 md:pl-10">
          <h1 className="text-primary-gold font-bold uppercase tracking-[0.4em] mb-6 text-[10px]">The Global Calendar</h1>
          <h2 className="text-4xl md:text-[7rem] font-serif font-bold text-white mb-10 leading-[0.9] tracking-tighter">Exhibitions <br />& Showcases</h2>
          <p className="text-xl text-white/50 leading-relaxed max-w-2xl">
            Join us at the world&apos;s most prestigious venues. 
            {user?.role === 'DESIGNER' && (
              <span className="block mt-4 text-sm text-primary-gold/60 uppercase tracking-widest font-bold">
                Exclusive Designer Access: Apply to participate in elite showcases.
              </span>
            )}
          </p>
        </AnimatedSection>

        {loading ? (
          <div className="py-20 text-center uppercase tracking-[0.4em] opacity-40 text-[10px] font-bold animate-pulse">Syncing Digital Calendar...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
            {events.map((event, i) => (
              <AnimatedSection key={event._id} delay={i * 0.2}>
                <div className="group relative flex flex-col bg-white/[0.02] border border-white/5 hover:border-primary-gold/30 transition-all duration-500 overflow-hidden shadow-2xl">
                  <Link href={`/events/${event._id}`} className="block">
                    <div className="relative h-[300px] md:h-[450px] overflow-hidden">
                      <Image
                        src={event.image}
                        alt={event.title}
                        fill
                        sizes="(max-width: 768px) 100vw, 50vw"
                        className="object-cover transition-all duration-1000 group-hover:scale-110 group-hover:rotate-1 grayscale group-hover:grayscale-0 opacity-60 group-hover:opacity-100"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-luxury-black via-transparent to-transparent opacity-80"></div>
                      <div className="absolute top-8 right-8 z-20">
                        <motion.span 
                          whileHover={{ scale: 1.05 }}
                          className="brand-gradient text-white text-[9px] font-black uppercase tracking-widest px-6 py-2 shadow-[0_0_20px_rgba(0,79,52,0.4)]"
                        >
                          {event.status}
                        </motion.span>
                      </div>
                      
                      <div className="absolute bottom-6 left-6 right-6 md:bottom-8 md:left-8 md:right-8 z-20">
                        <p className="text-primary-gold font-bold uppercase tracking-[0.3em] text-[10px] mb-3">{event.type}</p>
                        <h3 className="text-3xl md:text-5xl font-serif font-bold text-white tracking-tight leading-tight group-hover:italic transition-all duration-500">{event.title}</h3>
                      </div>
                    </div>
                  </Link>

                  <div className="p-10 flex flex-col flex-1">
                    <div className="flex justify-between items-center pt-2 mb-10">
                      <div className="flex flex-col gap-2">
                        <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-white/30">Entry Tier</p>
                        <p className="text-xl md:text-2xl font-serif font-bold text-primary-gold">{event.price}</p>
                      </div>
                      <div className="flex flex-col gap-2 text-right">
                        <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-white/30">Date & Location</p>
                        <p className="text-xs font-bold text-white/70 uppercase tracking-widest">{event.date}</p>
                      </div>
                    </div>
                    
                    <div className="mt-auto pt-8 border-t border-white/5 flex flex-col sm:flex-row justify-between items-center gap-6">
                      <Link href={`/events/${event._id}`} className="text-white/40 font-bold uppercase tracking-widest text-[9px] hover:text-white transition-colors">
                        View Itinerary
                      </Link>

                      {user?.role === 'DESIGNER' && (
                        <button
                          disabled={appliedEvents.includes(event._id) || processingId === event._id}
                          onClick={(e) => handleJoin(e, event._id)}
                          className={`w-full sm:w-auto px-10 py-4 text-[10px] font-black uppercase tracking-widest transition-all ${
                            appliedEvents.includes(event._id)
                              ? "bg-white/10 text-white/30 cursor-default"
                              : "brand-gradient text-white shadow-xl hover:scale-105 active:scale-95"
                          }`}
                        >
                          {processingId === event._id ? "Processing..." : 
                           appliedEvents.includes(event._id) ? "Application Sent" : "Join as Designer"}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </AnimatedSection>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
