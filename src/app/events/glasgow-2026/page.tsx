"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import AnimatedSection from "@/components/AnimatedSection";

export default function GlasgowEventPage() {
  const packages = [
    {
      title: "Platinum Package",
      price: "Rs 5,000,000",
      features: [
        "Premium Booth & Branding",
        "4 People Invitation Letters",
        "4–5 Star Hotel Accommodation",
        "Airport Transfers & Meals",
        "Access to Business Networking & Forums",
        "Included Full Media Coverage"
      ],
      recommended: true
    },
    {
      title: "Gold Package",
      price: "Rs 3,500,000",
      features: [
        "Branded Booth Space",
        "3 People Invitation Letters",
        "Hotel Accommodation & Meals",
        "Airport Transfers",
        "Business Networking Opportunities",
        "Full Media Coverage"
      ],
      recommended: false
    },
    {
      title: "Silver Package",
      price: "Rs 2,500,000",
      features: [
        "Booth Space",
        "2 People Invitation Letters",
        "Hotel Accommodation & Meals",
        "Airport Transfers",
        "Interaction with Local Businesses",
        "Media Coverage"
      ],
      recommended: false
    },
    {
      title: "Stall Package",
      price: "Rs 500,000",
      features: [
        "Exhibition Stall Space",
        "1 Person Invitation Letter",
        "Bed & Breakfast"
      ],
      recommended: false
    }
  ];

  return (
    <div className="min-h-screen bg-luxury-black py-32 px-6">
      {/* Hero Section */}
      <section className="relative h-[70vh] mb-32 flex items-center justify-center overflow-hidden border border-white/10">
        <div className="absolute inset-0 z-0">
          <Image
            src="/pdf-images/img_p0_2.png"
            alt="Glasgow 2026 Fashion Event"
            fill
            className="object-cover opacity-40 grayscale"
            onError={(e) => { e.currentTarget.src = "/runway-bridal-1.jpg" }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-luxury-black via-luxury-black/50 to-transparent"></div>
        </div>
        
        <AnimatedSection className="relative z-10 text-center max-w-5xl px-6">
          <div className="inline-block mb-6 brand-gradient px-6 py-2 shadow-2xl">
            <span className="text-white text-[12px] font-black uppercase tracking-[0.4em]">June 6th - 7th, 2026 | Glasgow Marriott Hotel, UK</span>
          </div>
          <h2 className="text-primary-gold font-bold uppercase tracking-[0.4em] text-[14px] mb-4">Pride of the Nation</h2>
          <h1 className="text-5xl md:text-[5.5rem] font-serif font-bold text-white leading-[1] tracking-tighter mb-8">
            Fashion Show, Exhibition <br />
            <span className="gold-gradient-text italic font-light">& Award Ceremony</span>
          </h1>
          <p className="text-xl md:text-2xl text-white/70 max-w-3xl mx-auto font-medium mb-12">
            A Global Celebration of Pakistani Excellence. An extraordinary fusion of fashion, recognition, culture, and business — bringing Pakistani talent to the international stage.
          </p>
          
          <div className="flex flex-col sm:flex-row justify-center items-center gap-6 md:gap-12 pt-8 border-t border-white/10">
            <div className="text-center">
              <p className="text-white/50 uppercase tracking-[0.3em] text-[10px] font-bold mb-2">Single Admission</p>
              <p className="text-3xl font-serif text-white font-bold">£100 <span className="text-sm font-sans text-white/50 font-normal">/ person</span></p>
            </div>
            <div className="hidden sm:block w-px h-12 bg-white/20"></div>
            <div className="text-center">
              <p className="text-white/50 uppercase tracking-[0.3em] text-[10px] font-bold mb-2">VIP Table</p>
              <p className="text-3xl font-serif text-primary-gold font-bold">£900 <span className="text-sm font-sans text-white/50 font-normal">/ table of 10</span></p>
            </div>
          </div>
        </AnimatedSection>
      </section>

      {/* What & Why Section */}
      <div className="container mx-auto max-w-7xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-20 mb-40">
          <AnimatedSection className="p-12 bg-white/[0.02] border border-white/5 hover:border-primary-gold/30 transition-all duration-500">
            <h2 className="text-primary-gold font-bold uppercase tracking-[0.4em] text-[12px] mb-8">What Is The Event About?</h2>
            <ul className="space-y-6">
              {[
                "Grand Award Ceremony honoring distinguished achievers",
                "International Fashion Show featuring top designers & models",
                "Exclusive Exhibition Stalls for brands & businesses",
                "Networking with industry leaders, entrepreneurs & investors",
                "Cultural & entertainment performances",
                "Media coverage across TV, print & digital platforms"
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-4 text-white/80 font-medium text-lg">
                  <span className="text-primary-gold mt-1">✦</span> {item}
                </li>
              ))}
            </ul>
          </AnimatedSection>

          <AnimatedSection className="p-12 bg-white/[0.02] border border-white/5 hover:border-primary-gold/30 transition-all duration-500" delay={0.2}>
            <h2 className="text-primary-gold font-bold uppercase tracking-[0.4em] text-[12px] mb-8">Why Participate?</h2>
            <ul className="space-y-6">
              {[
                "Global Exposure through extensive Media Coverage",
                "Direct Access to Business Forums & Panel Discussions",
                "4–5 Star Hospitality including Accommodation, Meals & Transfers",
                "Free Public Entry to Exhibition Area maximizing footfall"
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-4 text-white/80 font-medium text-lg">
                  <span className="text-primary-gold mt-1">✦</span> {item}
                </li>
              ))}
            </ul>
            <div className="mt-12 p-6 border border-secondary-emerald/30 bg-secondary-emerald/10 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-secondary-emerald/20 blur-3xl rounded-full"></div>
              <h3 className="text-white font-bold uppercase tracking-[0.2em] text-[10px] mb-2">Special Offer For Designers</h3>
              <p className="text-2xl font-serif text-white font-bold mb-1">£3,000</p>
              <p className="text-sm text-white/60">Includes Visa Invitation Letter, Hotel stay with breakfast, Airport transfers, and Full Media Coverage.</p>
            </div>
          </AnimatedSection>
        </div>

        {/* Packages */}
        <AnimatedSection className="text-center mb-16">
          <h2 className="text-4xl md:text-6xl font-serif font-bold text-white tracking-tighter mb-4">Sponsorship & <span className="gold-gradient-text italic">Exhibition Packages</span></h2>
          <p className="text-white/50 uppercase tracking-[0.3em] text-[10px] font-bold">Secure your presence at the premier South Asian event in the UK</p>
        </AnimatedSection>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-32">
          {packages.map((pkg, i) => (
            <AnimatedSection key={i} delay={i * 0.1} className={`relative flex flex-col p-8 border transition-all duration-500 ${pkg.recommended ? 'border-primary-gold bg-primary-gold/5 transform lg:-translate-y-4 shadow-[0_0_40px_rgba(198,165,92,0.15)]' : 'border-white/10 bg-white/[0.02] hover:border-white/30'}`}>
              {pkg.recommended && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 brand-gradient text-white text-[9px] font-black uppercase tracking-widest px-4 py-1 shadow-lg">
                  Premium Choice
                </div>
              )}
              <h3 className="text-2xl font-serif font-bold text-white mb-2 mt-4">{pkg.title}</h3>
              <p className="text-3xl font-bold gold-gradient-text mb-8">{pkg.price}</p>
              
              <ul className="flex-1 space-y-4 mb-8">
                {pkg.features.map((feature, idx) => (
                  <li key={idx} className="flex items-start gap-3 text-sm text-white/70">
                    <svg className="w-4 h-4 text-primary-gold shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    {feature}
                  </li>
                ))}
              </ul>

              <button className={`w-full py-4 text-[10px] font-black uppercase tracking-widest transition-all ${pkg.recommended ? 'brand-gradient text-white hover:scale-105 shadow-xl' : 'bg-white/10 text-white hover:bg-white/20'}`}>
                Inquire Now
              </button>
            </AnimatedSection>
          ))}
        </div>

        {/* Image Gallery Preview */}
        <AnimatedSection className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-32">
          {[
            "/pdf-images/img_p2_5.png",
            "/pdf-images/img_p4_3.png",
            "/pdf-images/img_p5_2.png"
          ].map((src, i) => (
            <div key={i} className="relative aspect-[4/3] overflow-hidden border border-white/10 group">
              <Image 
                src={src} 
                alt="Event Gallery" 
                fill 
                className="object-cover grayscale group-hover:grayscale-0 transition-all duration-1000 group-hover:scale-110"
                onError={(e) => { e.currentTarget.style.display = 'none' }}
              />
              <div className="absolute inset-0 bg-luxury-black/20 group-hover:bg-transparent transition-all duration-500"></div>
            </div>
          ))}
        </AnimatedSection>

      </div>
    </div>
  );
}
