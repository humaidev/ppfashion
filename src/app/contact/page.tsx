"use client";

import { useState } from "react";
import toast, { Toaster } from "react-hot-toast";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    type: "Membership Application",
    message: ""
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const t = toast.loading("Sending digital inquiry...");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (data.success) {
        toast.success("Inquiry delivered to the collective.", { id: t });
        setFormData({ fullName: "", email: "", type: "Membership Application", message: "" });
      } else {
        toast.error(data.message || "Delivery failed.", { id: t });
      }
    } catch (err) {
      toast.error("Network error. Please try again.", { id: t });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-luxury-black min-h-screen py-32">
      <Toaster position="top-right" />
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-start">
          <div className="border-l-2 border-primary-gold/20 pl-6 md:pl-10">
            <h1 className="text-primary-gold font-bold uppercase tracking-[0.4em] mb-6 text-[10px]">Contact the Collective</h1>
            <h2 className="text-4xl md:text-[7rem] font-serif font-bold mb-12 text-white leading-[0.9] tracking-tighter">Get in <br />Touch</h2>
            <p className="text-xl text-white/50 mb-16 leading-relaxed max-w-xl font-medium">
              Whether you are an elite designer looking to join the collective,
              a brand seeking global collaboration, or a member of the press,
              we are ready to connect you with excellence.
            </p>

            <div className="space-y-12">
              <div className="group">
                <h3 className="text-primary-gold font-bold uppercase tracking-[0.3em] text-[10px] mb-4 group-hover:translate-x-2 transition-transform duration-500">The Registry</h3>
                <p className="text-3xl font-serif text-white hover:italic transition-all cursor-pointer">registry@ppfassion.com</p>
              </div>
              <div className="group border-t border-white/5 pt-10">
                <h3 className="text-primary-gold font-bold uppercase tracking-[0.3em] text-[10px] mb-4 group-hover:translate-x-2 transition-transform duration-500">Press & Media</h3>
                <p className="text-3xl font-serif text-white hover:italic transition-all cursor-pointer">media@ppfassion.com</p>
              </div>
              <div className="group border-t border-white/5 pt-10">
                <h3 className="text-primary-gold font-bold uppercase tracking-[0.3em] text-[10px] mb-4 group-hover:translate-x-2 transition-transform duration-500">HQ Address</h3>
                <p className="text-xl md:text-3xl font-serif text-white hover:italic transition-all cursor-pointer leading-tight">124 St Vincent St, <br />Glasgow G2 5HF, UK</p>
              </div>
            </div>
          </div>

          <div className="bg-white/[0.02] backdrop-blur-sm p-8 md:p-20 shadow-2xl border border-white/5 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-full h-full bg-primary-gold/[0.02] -skew-x-12 transform translate-x-1/2"></div>
            <form onSubmit={handleSubmit} className="space-y-12 relative z-10">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <div className="space-y-3">
                  <label className="text-[10px] font-bold uppercase tracking-[0.3em] text-white/30 group-hover:text-primary-gold transition-colors">Full Name</label>
                  <input 
                    type="text" 
                    required
                    value={formData.fullName}
                    onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                    className="w-full bg-transparent border-b border-white/10 py-5 focus:outline-none focus:border-primary-gold transition-all text-white placeholder:text-white/10" 
                    placeholder="Ayesha Ahmed" 
                  />
                </div>
                <div className="space-y-3">
                  <label className="text-[10px] font-bold uppercase tracking-[0.3em] text-white/30 group-hover:text-primary-gold transition-colors">Email Address</label>
                  <input 
                    type="email" 
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    className="w-full bg-transparent border-b border-white/10 py-5 focus:outline-none focus:border-primary-gold transition-all text-white placeholder:text-white/10" 
                    placeholder="ayesha@example.com" 
                  />
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-[10px] font-bold uppercase tracking-[0.3em] text-white/30 group-hover:text-primary-gold transition-colors">Inquiry Type</label>
                <select 
                  value={formData.type}
                  onChange={(e) => setFormData({...formData, type: e.target.value})}
                  className="w-full bg-transparent border-b border-white/10 py-5 focus:outline-none focus:border-primary-gold transition-all appearance-none text-white/60"
                >
                  <option className="bg-luxury-black" value="Membership Application">Membership Application</option>
                  <option className="bg-luxury-black" value="Event Sponsorship">Event Sponsorship</option>
                  <option className="bg-luxury-black" value="Press Inquiry">Press Inquiry</option>
                  <option className="bg-luxury-black" value="General Question">General Question</option>
                </select>
              </div>

              <div className="space-y-3">
                <label className="text-[10px] font-bold uppercase tracking-[0.3em] text-white/30 group-hover:text-primary-gold transition-colors">Your Message</label>
                <textarea 
                  rows={5} 
                  required
                  value={formData.message}
                  onChange={(e) => setFormData({...formData, message: e.target.value})}
                  className="w-full bg-transparent border-b border-white/10 py-5 focus:outline-none focus:border-primary-gold transition-all resize-none text-white placeholder:text-white/10" 
                  placeholder="Tell us about your brand or inquiry..."
                ></textarea>
              </div>

              <button 
                type="submit"
                disabled={loading}
                className="w-full brand-gradient brand-gradient-hover text-white font-bold py-6 uppercase tracking-[0.3em] text-[10px] transition-all shadow-2xl active:scale-95 disabled:opacity-50"
              >
                {loading ? "Transmitting..." : "Send Digital Inquiry"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
