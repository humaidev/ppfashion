"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import AnimatedSection from "@/components/AnimatedSection";

interface IDesigner {
  _id: string;
  name: string;
  specialty: string;
  tier: string;
  image: string;
  location: string;
}

export default function DesignersPage() {
  const [designers, setDesigners] = useState<IDesigner[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/designers")
      .then(res => res.json())
      .then(data => {
        if (data.success && data.designers.length > 0) {
          setDesigners(data.designers);
        } else {
          setDesigners([
            { _id: "1", name: "Ayesha Malik", specialty: "Bridal Couture", tier: "Elite", image: "/runway-red.jpg", location: "London, UK" },
            { _id: "2", name: "Zainab Chottani", specialty: "Luxury Pret", tier: "Premium", image: "/runway-couple.jpg", location: "Karachi, PK" },
            { _id: "3", name: "Hassan Sheheryar", specialty: "Men's Formal", tier: "Elite", image: "/runway-bridal-1.jpg", location: "Dubai, UAE" }
          ]);
        }
        setLoading(false);
      });
  }, []);

  return (
    <div className="min-h-screen bg-luxury-black py-32 px-6">
      <div className="container mx-auto">
        <AnimatedSection className="max-w-4xl mb-20 md:mb-32 border-l-2 border-primary-gold/20 pl-6 md:pl-10">
          <h1 className="text-primary-gold font-bold uppercase tracking-[0.4em] mb-6 text-[10px]">The Designer Collective</h1>
          <h2 className="text-4xl md:text-[7rem] font-serif font-bold text-white mb-10 leading-[0.9] tracking-tighter">Couture <br />Visionaries</h2>
          <p className="text-xl text-white/50 leading-relaxed max-w-2xl">
            Meet the elite circle of designers shaping the future of global Pakistani fashion. 
          </p>
        </AnimatedSection>

        {loading ? (
          <div className="py-20 text-center uppercase tracking-[0.4em] opacity-40 text-[10px] font-bold animate-pulse">Syncing Collective...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-16">
            {designers.map((designer, i) => (
              <AnimatedSection key={designer._id} delay={i * 0.1}>
                <Link href={`/designers/${designer._id}`} className="group relative block">
                  <div className="relative aspect-[3/4] overflow-hidden mb-10 shadow-2xl transition-all duration-700 group-hover:shadow-primary-gold/20">
                    <div className="absolute inset-0 bg-luxury-black/40 group-hover:bg-transparent transition-all z-10 duration-700"></div>
                    <Image
                      src={designer.image}
                      alt={designer.name}
                      fill
                      sizes="(max-width: 768px) 100vw, 33vw"
                      className="object-cover grayscale group-hover:grayscale-0 transition-all duration-1000 scale-110 group-hover:scale-100"
                    />
                    <div className="absolute top-6 left-6 z-20">
                      <span className="brand-gradient text-white text-[9px] font-black uppercase tracking-widest px-4 py-2 shadow-lg">
                        {designer.tier} Member
                      </span>
                    </div>
                    
                    <div className="absolute bottom-0 left-0 right-0 p-8 z-20 translate-y-full group-hover:translate-y-0 transition-transform duration-500 bg-gradient-to-t from-luxury-black via-luxury-black/80 to-transparent">
                      <span className="w-full brand-gradient text-white text-center font-bold py-4 uppercase tracking-widest text-[10px] block brand-gradient-hover transition-colors shadow-2xl">
                        View Exclusive Profile
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-start border-l-2 border-primary-gold/20 pl-6 group-hover:border-primary-gold transition-colors duration-500">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <h4 className="text-2xl md:text-3xl font-serif font-bold text-white uppercase tracking-tight group-hover:text-primary-gold transition-colors group-hover:italic duration-500">{designer.name}</h4>
                        <motion.svg 
                          whileHover={{ scale: 1.2, rotate: 360 }}
                          className="w-4 h-4 text-secondary-emerald" fill="currentColor" viewBox="0 0 20 20"
                        >
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </motion.svg>
                      </div>
                      <div className="flex flex-col gap-1">
                        <p className="text-white/40 uppercase text-[9px] font-bold tracking-[0.3em]">{designer.specialty}</p>
                        <p className="text-primary-gold uppercase text-[8px] font-bold tracking-[0.2em]">{designer.location}</p>
                      </div>
                    </div>
                  </div>
                </Link>
              </AnimatedSection>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
