"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import AnimatedSection from "@/components/AnimatedSection";

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
              The Official Home of Pakistani Designers
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

            <div className="w-full border-t border-primary-gold/20 md:border-t-0 md:border-l md:pl-8 pt-8 md:pt-0 mt-10 md:mt-0">
              <p className="text-[9px] font-black uppercase tracking-[0.4em] text-white/30 mb-6">Established Presence Across</p>
              <div className="flex flex-wrap gap-x-12 gap-y-4 text-[10px] font-black text-white/60 uppercase tracking-[0.3em]">
                {["London", "Glasgow", "Manchester", "Dubai", "Lahore"].map((city, idx) => (
                  <motion.span
                    key={city}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1 + (idx * 0.1) }}
                    className="hover:text-primary-gold transition-colors cursor-default"
                  >
                    {city}
                  </motion.span>
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

      {/* Stats Section */}
      <section className="relative py-32 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src="/luxury_pakistani_fabric_bg_1777291822766.png"
            alt="Luxury Fabric Background"
            fill
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

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
              { name: "Ayesha Malik", type: "Bridal Couture", img: "/runway-red.jpg", loc: "London, UK" },
              { name: "Zainab Chottani", type: "Luxury Pret", img: "/runway-couple.jpg", loc: "Karachi, PK" },
              { name: "Hassan Sheheryar", type: "Men's Formal", img: "/runway-bridal-1.jpg", loc: "Dubai, UAE" },
            ].map((designer, i) => (
              <AnimatedSection key={i} delay={i * 0.2}>
                <div className="group cursor-pointer">
                  <div className="relative aspect-[4/5] overflow-hidden mb-10 transition-all duration-700 shadow-2xl group-hover:shadow-primary-gold/10">
                    <div className="absolute inset-0 bg-luxury-black/40 group-hover:bg-transparent transition-all z-10 duration-700"></div>
                    <Image
                      src={designer.img}
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
                      <span className="brand-gradient text-white text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded-[2px] shadow-lg">Elite Member</span>
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
                      <p className="text-white/40 uppercase text-[9px] font-bold tracking-[0.3em]">{designer.type}</p>
                    </div>
                  </div>
                </div>
              </AnimatedSection>
            ))}
          </div>
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
