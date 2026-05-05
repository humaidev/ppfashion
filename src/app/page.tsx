"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import AnimatedSection from "@/components/AnimatedSection";
import FeaturedDesignersList from "@/components/FeaturedDesignersList";

export default function Home() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" as const } }
  };

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative h-[90vh] flex items-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src="/runway-bridal-1.jpg"
            alt="Pakistani Fashion Runway"
            fill
            sizes="100vw"
            className="object-cover brightness-[0.4] scale-110 animate-[pulse_10s_infinite_alternate]"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-luxury-black via-transparent to-transparent"></div>
        </div>

        <div className="container mx-auto px-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="max-w-4xl"
          >
            <h2 className="text-white font-bold uppercase tracking-[0.4em] mb-1 md:mb-4 text-[10px] md:text-sm opacity-80">
              Membership Program
            </h2>
            <h1 className="text-7xl md:text-[9.5rem] font-serif font-bold mb-4 md:mb-6 leading-[0.8] md:leading-[0.8] tracking-tighter">
              <span className="text-white inline-block">Couture</span> <br />
              <motion.span
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5, duration: 1 }}
                className="gold-gradient-text inline-block italic font-bold drop-shadow-[0_0_20px_rgba(198,165,92,0.5)]"
              >
                Excellence.
              </motion.span>
            </h1>
            <p className="text-lg md:text-2xl text-white/90 mb-6 md:mb-8 max-w-2xl leading-relaxed">
              Join the elite circle of 50+ leading designers. Unlock priority access to
              runway shows, global networking, and exclusive opportunities.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 md:gap-8 mb-10 md:mb-12">
              <Link
                href="/membership"
                className="brand-gradient brand-gradient-hover text-white text-center font-bold py-5 px-12 rounded-sm transition-all transform hover:scale-105 active:scale-95 uppercase tracking-[0.2em] text-sm shadow-[0_0_30px_rgba(0,79,52,0.3)]"
              >
                Become a Member
              </Link>
              <Link
                href="/events"
                className="border-2 border-white/20 hover:border-primary-gold text-white text-center font-bold py-5 px-12 rounded-sm transition-all backdrop-blur-md hover:bg-white/5 uppercase tracking-[0.2em] text-sm transform hover:scale-105"
              >
                View Events
              </Link>
            </div>

            <div className="w-full border-t border-primary-gold/20 md:border-t-0 md:border-l md:pl-8 pt-10 md:pt-0 mt-12 md:mt-0 flex flex-col items-center md:items-start">
              <p className="text-[10px] font-black uppercase tracking-[0.5em] text-white/40 mb-8 md:mb-6">Established Presence Across</p>
              <div className="grid grid-cols-2 md:flex md:flex-wrap gap-x-8 md:gap-x-12 gap-y-8 md:gap-y-4 text-[11px] md:text-[10px] font-black text-white/80 uppercase tracking-[0.4em] w-full max-w-[320px] md:max-w-none">
                {["London", "Glasgow", "Manchester", "Dubai", "Lahore"].map((city, idx) => (
                  <motion.div
                    key={city}
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 + (idx * 0.1) }}
                    viewport={{ once: true }}
                    className={`flex items-center justify-center md:justify-start ${idx === 4 ? 'col-span-2' : ''}`}
                  >
                    <span className="relative group cursor-default transition-colors hover:text-primary-gold">
                      {city}
                      <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 md:left-0 md:translate-x-0 w-0 h-[1px] bg-primary-gold/50 transition-all duration-300 group-hover:w-full"></span>
                    </span>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>

        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 hidden md:block">
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-px h-16 bg-gradient-to-b from-primary-gold to-transparent"
          ></motion.div>
        </div>
      </section>

      {/* Upcoming Event Section */}
      <section className="py-24 bg-[#0A0A0A] relative overflow-hidden border-t border-white/5">
        <div className="absolute inset-0 z-0 opacity-30">
          <Image
             src="/event-group.jpg"
             alt="Upcoming Event"
             fill
             sizes="100vw"
             className="object-cover grayscale"
          />
          <div className="absolute inset-0 bg-luxury-black/80"></div>
        </div>
        <div className="container mx-auto px-6 relative z-10">
          <AnimatedSection className="border border-primary-gold/30 p-12 md:p-24 bg-luxury-black/60 backdrop-blur-md relative overflow-hidden group hover:border-primary-gold/60 transition-colors duration-500">
             <div className="absolute top-0 right-0 p-6 md:p-10">
               <span className="brand-gradient text-white text-[10px] font-black uppercase tracking-[0.4em] px-6 py-3 shadow-[0_0_30px_rgba(0,79,52,0.4)] block">
                 June 6th - 7th, 2026
               </span>
             </div>
             
             <h3 className="text-primary-gold font-bold uppercase tracking-[0.4em] text-[12px] mb-4">Pride of the Nation</h3>
             <h2 className="text-4xl md:text-7xl font-serif font-bold text-white mb-6 leading-[1.1] tracking-tighter">
               Fashion Show, <br className="hidden md:block"/>
               <span className="italic font-light gold-gradient-text">Exhibition</span> & Award Ceremony
             </h2>
             <p className="text-white/70 max-w-2xl text-sm md:text-base font-medium mb-8">
               A Global Celebration of Pakistani Excellence. An extraordinary fusion of fashion, recognition, culture, and business.
             </p>
             
             <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 mt-8 border-t border-white/10 pt-8">
               <div className="flex items-center gap-3 text-white/80 uppercase tracking-[0.3em] text-[11px] font-bold">
                  <svg className="w-5 h-5 text-primary-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.242-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  Glasgow Marriott Hotel, UK
               </div>
               <div className="hidden sm:block w-px h-8 bg-white/20"></div>
               <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 text-white uppercase tracking-[0.2em] text-[10px] font-bold">
                 <span>Tickets: £100</span>
                 <span className="hidden sm:block text-primary-gold">•</span>
                 <span>Table (10): £900</span>
               </div>
               <div className="hidden sm:block w-px h-8 bg-white/20"></div>
               <Link href="/events/glasgow-2026" className="text-[10px] font-black uppercase tracking-[0.3em] text-primary-gold hover:text-white transition-colors flex items-center gap-2">
                 View Details <span>→</span>
               </Link>
             </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Stats Section */}
      <section className="relative py-32 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src="/luxury_pakistani_fabric_bg_1777291822766.png"
            alt="Luxury Fabric Background"
            fill
            sizes="100vw"
            className="object-cover brightness-[0.3]"
          />
          <div className="absolute inset-0 bg-luxury-black/60"></div>
          <div className="absolute inset-0 bg-gradient-to-b from-luxury-black via-transparent to-luxury-black"></div>
        </div>

        <div className="container mx-auto px-6 relative z-10">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-2 lg:grid-cols-4 gap-y-16 lg:gap-8 border-y border-white/10 py-20 backdrop-blur-sm bg-white/[0.02]"
          >
            {[
              { label: "Elite Designers", val: "50+" },
              { label: "Annual Shows", val: "12" },
              { label: "Based Operations", val: "UK" },
              { label: "Global Reach", val: "10k+" },
            ].map((stat, i) => (
              <motion.div key={i} variants={itemVariants} className="flex flex-col items-center border-r border-white/5 lg:last:border-0">
                <div className="text-5xl md:text-8xl font-serif font-bold gold-gradient-text mb-4 tracking-tighter">{stat.val}</div>
                <div className="text-white/60 uppercase tracking-[0.4em] text-[9px] font-black">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Featured Designers Preview */}
      <section className="py-40 bg-[#0A0A0A]">
        <div className="container mx-auto px-6">
          <AnimatedSection className="flex flex-col lg:flex-row justify-between items-start lg:items-end mb-32 gap-12">
            <div className="max-w-4xl">
              <h2 className="text-white inline-block font-bold uppercase tracking-[0.4em] text-[10px] mb-8">The Designer Collective</h2>
              <h3 className="text-4xl sm:text-5xl md:text-6xl lg:text-8xl font-serif font-bold text-white leading-[1.1] md:leading-[1] tracking-tighter">
                <span className="text-white inline-block">High Fashion</span> <br className="hidden sm:block" />
                <span className="text-white">Visionaries</span>
              </h3>
            </div>
            <Link href="/designers" className="gold-gradient-text hover:opacity-80 font-bold uppercase tracking-[0.3em] text-[10px] flex items-center group transition-all pt-4 lg:pt-0 border-b border-secondary-emerald/20 pb-2 hover:border-primary-gold">
              Explore the full collective <span className="ml-4 group-hover:translate-x-3 transition-transform text-lg text-primary-gold">→</span>
            </Link>
          </AnimatedSection>

          <FeaturedDesignersList />
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-48 bg-luxury-black relative overflow-hidden border-t border-white/5">
        <AnimatedSection className="container mx-auto px-6 relative z-10 text-center max-w-5xl">
          <h2 className="text-5xl md:text-[7rem] font-serif font-bold text-white mb-12 leading-[0.9] tracking-tighter">
            Build Your <br />
            <span className="gold-gradient-text italic font-light">Legacy.</span>
          </h2>
          <div className="flex flex-col items-center gap-8">
            <Link
              href="/membership"
              className="brand-gradient brand-gradient-hover text-white font-bold py-7 px-8 md:px-24 rounded-sm transition-all transform hover:scale-105 uppercase tracking-[0.4em] text-[10px] md:text-xs shadow-[0_0_60px_rgba(0,79,52,0.15)]"
            >
              Apply for Exclusive Membership
            </Link>
          </div>
        </AnimatedSection>
      </section>
    </div>
  );
}
