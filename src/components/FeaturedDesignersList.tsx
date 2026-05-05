"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import AnimatedSection from "@/components/AnimatedSection";

interface IDesigner {
  _id: string;
  name: string;
  specialty: string;
  tier: string;
  image: string;
  location: string;
}

export default function FeaturedDesignersList() {
  const [designers, setDesigners] = useState<IDesigner[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/designers")
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.designers) {
          setDesigners(data.designers.slice(0, 3)); // Only show top 3
        }
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div className="py-20 text-center uppercase tracking-[0.4em] opacity-40 text-[10px] font-bold animate-pulse">Loading Featured Designers...</div>;
  }

  if (designers.length === 0) {
    return <div className="py-20 text-center uppercase tracking-[0.4em] opacity-40 text-[10px] font-bold">No designers featured yet.</div>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
      {designers.map((designer, i) => (
        <AnimatedSection key={designer._id} delay={i * 0.2}>
          <Link href={`/designers/${designer._id}`} className="group cursor-pointer block">
            <div className="relative aspect-[4/5] overflow-hidden mb-10 transition-all duration-700 shadow-2xl group-hover:shadow-primary-gold/10">
              <div className="absolute inset-0 bg-luxury-black/40 group-hover:bg-transparent transition-all z-10 duration-700"></div>
              <Image
                src={designer.image}
                alt={designer.name}
                fill
                sizes="(max-width: 768px) 100vw, 33vw"
                className="object-cover grayscale group-hover:grayscale-0 transition-all duration-1000 scale-110 group-hover:scale-100"
              />
              <div className="absolute bottom-0 left-0 right-0 p-8 z-20 translate-y-full group-hover:translate-y-0 transition-transform duration-500 bg-gradient-to-t from-luxury-black via-luxury-black/80 to-transparent">
                <span className="w-full brand-gradient text-white text-center font-bold py-4 uppercase tracking-widest text-[10px] block brand-gradient-hover transition-colors">
                  View Exclusive Profile
                </span>
              </div>
              <div className="absolute top-6 left-6 z-20 flex gap-2">
                <span className="brand-gradient text-white text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded-[2px] shadow-lg">{designer.tier || 'Elite'} Member</span>
              </div>
            </div>

            <div className="flex justify-between items-start border-l-2 border-primary-gold/20 pl-6 group-hover:border-primary-gold transition-colors duration-500">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <h4 className="text-2xl font-serif font-bold gold-gradient-text uppercase tracking-tight transition-colors">{designer.name}</h4>
                  <svg className="w-4 h-4 text-secondary-emerald" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
                <p className="text-white/40 uppercase text-[9px] font-bold tracking-[0.3em]">{designer.specialty}</p>
              </div>
            </div>
          </Link>
        </AnimatedSection>
      ))}
    </div>
  );
}
