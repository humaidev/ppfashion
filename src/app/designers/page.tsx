"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

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
  const [error, setError] = useState(false);

  useEffect(() => {
    async function getDesigners() {
      try {
        const res = await fetch("/api/admin/designers");
        const data = await res.json();
        
        if (data.success && data.designers && data.designers.length > 0) {
          setDesigners(data.designers);
        } else {
          // Fallback to Elite Mock Data if DB is empty
          setDesigners([
            { _id: "m1", name: "Ayesha Malik", specialty: "Bridal Couture", tier: "Elite", image: "/runway-red.jpg", location: "London, UK" },
            { _id: "m2", name: "Zainab Chottani", specialty: "Luxury Pret", tier: "Premium", image: "/runway-couple.jpg", location: "Karachi, PK" },
            { _id: "m3", name: "Hassan Sheheryar", specialty: "Men's Formal", tier: "Elite", image: "/runway-bridal-1.jpg", location: "Dubai, UAE" }
          ]);
        }
      } catch (err) {
        console.error("Failed to load designers", err);
        setError(true);
        // Ensure we still show mock data on error
        setDesigners([
            { _id: "e1", name: "Ayesha Malik", specialty: "Bridal Couture", tier: "Elite", image: "/runway-red.jpg", location: "London, UK" },
            { _id: "e2", name: "Zainab Chottani", specialty: "Luxury Pret", tier: "Premium", image: "/runway-couple.jpg", location: "Karachi, PK" }
        ]);
      } finally {
        setLoading(false);
      }
    }
    getDesigners();
  }, []);

  if (loading) return (
    <div className="min-h-screen bg-luxury-black flex items-center justify-center">
      <div className="text-primary-gold uppercase tracking-[0.4em] text-[10px] animate-pulse">Syncing Collective...</div>
    </div>
  );

  return (
    <div className="min-h-screen bg-luxury-black py-32 px-6">
      <div className="container mx-auto">
        <div className="max-w-4xl mb-20 md:mb-32 border-l-2 border-primary-gold/20 pl-6 md:pl-10">
          <h1 className="text-primary-gold font-bold uppercase tracking-[0.4em] mb-6 text-[10px]">The Designer Collective</h1>
          <h2 className="text-4xl md:text-[7rem] font-serif font-bold text-white mb-10 leading-[0.9] tracking-tighter">Couture <br />Visionaries</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-16">
          {designers.map((designer, i) => (
            <motion.div 
              key={designer._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <Link href={`/designers/${designer._id}`} className="group relative block">
                <div className="relative aspect-[3/4] overflow-hidden mb-10 shadow-2xl transition-all duration-700">
                  <div className="absolute inset-0 bg-luxury-black/40 group-hover:bg-transparent transition-all z-10 duration-700"></div>
                  <img
                    src={designer.image || "/runway-red.jpg"}
                    alt={designer.name}
                    className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-1000 scale-110 group-hover:scale-100"
                  />
                  <div className="absolute top-6 left-6 z-20">
                    <span className="bg-primary-gold text-luxury-black text-[9px] font-black uppercase tracking-widest px-4 py-2 shadow-lg">
                      {designer.tier || 'Member'}
                    </span>
                  </div>
                  
                  <div className="absolute bottom-0 left-0 right-0 p-8 z-20 translate-y-full group-hover:translate-y-0 transition-transform duration-500 bg-gradient-to-t from-luxury-black via-luxury-black/80 to-transparent">
                    <span className="w-full bg-primary-gold text-luxury-black text-center font-bold py-4 uppercase tracking-widest text-[10px] block transition-colors shadow-2xl">
                      View Exclusive Profile
                    </span>
                  </div>
                </div>
                
                <div className="flex justify-between items-start border-l-2 border-primary-gold/20 pl-6 group-hover:border-primary-gold transition-colors duration-500">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <h4 className="text-2xl md:text-3xl font-serif font-bold text-white uppercase tracking-tight group-hover:italic duration-500">{designer.name}</h4>
                    </div>
                    <div className="flex flex-col gap-1">
                      <p className="text-white/40 uppercase text-[9px] font-bold tracking-[0.3em]">{designer.specialty}</p>
                      <p className="text-primary-gold uppercase text-[8px] font-bold tracking-[0.2em]">{designer.location}</p>
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        {designers.length === 0 && !loading && (
          <div className="py-40 text-center border border-dashed border-white/10">
            <p className="text-white/20 uppercase tracking-widest text-xs font-bold">The collective is currently in private session.</p>
          </div>
        )}
      </div>
    </div>
  );
}
