"use client";

import { useState } from "react";
import Link from "next/link";

export default function RegisterPage({ searchParams }: { searchParams: { plan?: string } }) {
  const planName = searchParams.plan ? searchParams.plan.charAt(0).toUpperCase() + searchParams.plan.slice(1) : "Premium";
  
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    brandName: "",
    instagram: "",
    website: "",
    yearsInBusiness: "",
    portfolioLink: "",
    visionStatement: "",
    plan: planName
  });
  
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    
    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });
      
      const data = await res.json();
      
      if (data.success) {
        setStatus("success");
        setMessage(data.message);
      } else {
        setStatus("error");
        setMessage(data.message || "Something went wrong.");
      }
    } catch (err) {
      setStatus("error");
      setMessage("Failed to connect to server.");
    }
  };

  if (status === "success") {
    return (
      <div className="min-h-screen bg-warm-ivory dark:bg-luxury-black py-24 px-6 flex flex-col items-center justify-center text-center">
        <div className="max-w-2xl bg-white dark:bg-white/5 p-20 border border-primary-gold/20">
          <div className="w-20 h-20 bg-secondary-emerald text-white rounded-full flex items-center justify-center mx-auto mb-10 text-4xl">✓</div>
          <h2 className="text-4xl font-serif font-bold mb-6 italic text-primary-gold">Application Received</h2>
          <p className="text-xl text-luxury-black/60 dark:text-warm-ivory/60 mb-10 leading-relaxed">
            Thank you, {formData.fullName}. Your application for the {planName} tier has been successfully submitted to our review board. 
            We will contact you at {formData.email} within 48 hours.
          </p>
          <Link href="/" className="inline-block brand-gradient text-white font-bold py-4 px-12 uppercase tracking-widest text-xs">Return Home</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-warm-ivory dark:bg-luxury-black py-24 px-6 flex flex-col items-center">
      <div className="container max-w-4xl">
        <div className="text-center mb-16">
          <h1 className="text-primary-gold font-bold uppercase tracking-[0.4em] mb-4">Application</h1>
          <h2 className="text-5xl md:text-7xl font-serif font-bold text-luxury-black dark:text-white mb-6">Join the Collective</h2>
          <p className="text-xl text-luxury-black/60 dark:text-warm-ivory/60 max-w-2xl mx-auto">
            You are applying for the <span className="text-primary-gold font-bold italic underline decoration-primary-gold/30 underline-offset-8">{planName}</span> Tier. 
            Our review board will process your application within 48 hours.
          </p>
        </div>

        <div className="bg-white dark:bg-white/5 p-10 md:p-20 shadow-2xl border border-primary-gold/10">
          <form className="space-y-12" onSubmit={handleSubmit}>
            {/* Personal Details */}
            <div className="space-y-8">
              <h3 className="text-[11px] font-bold uppercase tracking-[0.4em] text-primary-gold border-b border-primary-gold/10 pb-4">01. Identity Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-luxury-black/40 dark:text-warm-ivory/40">Legal Full Name</label>
                  <input 
                    type="text" 
                    required
                    value={formData.fullName}
                    onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                    className="w-full bg-transparent border-b border-luxury-black/10 dark:border-warm-ivory/10 py-4 focus:outline-none focus:border-primary-gold transition-colors text-luxury-black dark:text-white" 
                    placeholder="e.g. Zainab Ahmed" 
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-luxury-black/40 dark:text-warm-ivory/40">Email Address</label>
                  <input 
                    type="email" 
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    className="w-full bg-transparent border-b border-luxury-black/10 dark:border-warm-ivory/10 py-4 focus:outline-none focus:border-primary-gold transition-colors text-luxury-black dark:text-white" 
                    placeholder="zainab@brand.com" 
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-luxury-black/40 dark:text-warm-ivory/40">Phone Number</label>
                  <input 
                    type="tel" 
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    className="w-full bg-transparent border-b border-luxury-black/10 dark:border-warm-ivory/10 py-4 focus:outline-none focus:border-primary-gold transition-colors text-luxury-black dark:text-white" 
                    placeholder="+44 000 000 0000" 
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-luxury-black/40 dark:text-warm-ivory/40">Instagram Handle</label>
                  <input 
                    type="text" 
                    value={formData.instagram}
                    onChange={(e) => setFormData({...formData, instagram: e.target.value})}
                    className="w-full bg-transparent border-b border-luxury-black/10 dark:border-warm-ivory/10 py-4 focus:outline-none focus:border-primary-gold transition-colors text-luxury-black dark:text-white" 
                    placeholder="@yourbrand" 
                  />
                </div>
              </div>
            </div>

            {/* Brand Details */}
            <div className="space-y-8">
              <h3 className="text-[11px] font-bold uppercase tracking-[0.4em] text-primary-gold border-b border-primary-gold/10 pb-4">02. Brand & Portfolio</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-luxury-black/40 dark:text-warm-ivory/40">Brand Name</label>
                  <input 
                    type="text" 
                    required
                    value={formData.brandName}
                    onChange={(e) => setFormData({...formData, brandName: e.target.value})}
                    className="w-full bg-transparent border-b border-luxury-black/10 dark:border-warm-ivory/10 py-4 focus:outline-none focus:border-primary-gold transition-colors text-luxury-black dark:text-white" 
                    placeholder="e.g. Zainab Couture" 
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-luxury-black/40 dark:text-warm-ivory/40">Years in Business</label>
                  <select 
                    value={formData.yearsInBusiness}
                    onChange={(e) => setFormData({...formData, yearsInBusiness: e.target.value})}
                    className="w-full bg-transparent border-b border-luxury-black/10 dark:border-warm-ivory/10 py-4 focus:outline-none focus:border-primary-gold transition-colors text-luxury-black/50 dark:text-white/50"
                  >
                    <option value="" disabled className="bg-white dark:bg-luxury-black">Select Years</option>
                    <option value="0-2" className="bg-white dark:bg-luxury-black text-black dark:text-white">0-2 Years</option>
                    <option value="3-5" className="bg-white dark:bg-luxury-black text-black dark:text-white">3-5 Years</option>
                    <option value="5-10" className="bg-white dark:bg-luxury-black text-black dark:text-white">5-10 Years</option>
                    <option value="10+" className="bg-white dark:bg-luxury-black text-black dark:text-white">10+ Years</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-luxury-black/40 dark:text-warm-ivory/40">Brand Website</label>
                  <input 
                    type="url" 
                    value={formData.website}
                    onChange={(e) => setFormData({...formData, website: e.target.value})}
                    className="w-full bg-transparent border-b border-luxury-black/10 dark:border-warm-ivory/10 py-4 focus:outline-none focus:border-primary-gold transition-colors text-luxury-black dark:text-white" 
                    placeholder="https://zainab-couture.com" 
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-luxury-black/40 dark:text-warm-ivory/40">Portfolio Link (Google Drive/Dropbox)</label>
                  <input 
                    type="url" 
                    value={formData.portfolioLink}
                    onChange={(e) => setFormData({...formData, portfolioLink: e.target.value})}
                    className="w-full bg-transparent border-b border-luxury-black/10 dark:border-warm-ivory/10 py-4 focus:outline-none focus:border-primary-gold transition-colors text-luxury-black dark:text-white" 
                    placeholder="Link to lookbook/images" 
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-luxury-black/40 dark:text-warm-ivory/40">Brand Vision Statement</label>
                <textarea 
                  rows={4} 
                  value={formData.visionStatement}
                  onChange={(e) => setFormData({...formData, visionStatement: e.target.value})}
                  className="w-full bg-transparent border-b border-luxury-black/10 dark:border-warm-ivory/10 py-4 focus:outline-none focus:border-primary-gold transition-colors resize-none" 
                  placeholder="Describe your design philosophy and heritage..."
                ></textarea>
              </div>
            </div>

            {/* Payment Summary Teaser */}
            <div className="p-8 bg-primary-gold/5 border border-primary-gold/20">
                <div className="flex justify-between items-center mb-4">
                    <span className="text-[10px] font-bold uppercase tracking-widest opacity-60">Selected Tier</span>
                    <span className="text-primary-gold font-bold uppercase tracking-widest text-xs">{planName}</span>
                </div>
                <div className="flex justify-between items-center">
                    <span className="text-[10px] font-bold uppercase tracking-widest opacity-60">Initial Review Fee</span>
                    <span className="text-luxury-black dark:text-white font-bold text-xl font-serif">Included</span>
                </div>
            </div>

            <div className="flex flex-col items-center gap-6 pt-10">
                <button className="w-full brand-gradient brand-gradient-hover text-white font-bold py-6 uppercase tracking-widest text-xs transition-all shadow-lg">
                    Submit Membership Application
                </button>
                <p className="text-[9px] text-luxury-black/30 dark:text-white/30 text-center uppercase tracking-widest leading-loose">
                    By submitting, you agree to our Terms of Service and professional code of conduct. <br/>
                    All international rights reserved.
                </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
