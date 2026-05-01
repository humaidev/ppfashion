"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    phone: ""
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (data.success) {
        router.push(`/verify-email?email=${encodeURIComponent(formData.email)}`);
      } else {
        setError(data.message || "Registration failed");
      }
    } catch (err) {
      setError("Failed to connect to server");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="min-h-screen bg-luxury-black flex flex-col items-center justify-center relative overflow-hidden py-20 px-6">
      {/* Background Decorative Element */}
      <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
        <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] brand-gradient rounded-full blur-[150px] opacity-20"></div>
        <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] brand-gradient rounded-full blur-[150px] opacity-20"></div>
      </div>

      <div className="container max-w-lg relative z-10">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-white mb-4 tracking-tighter">Join the Collective</h1>
          <p className="text-primary-gold uppercase tracking-[0.4em] text-[10px] font-bold">Register as a Designer</p>
        </div>

        <div className="bg-white/[0.03] backdrop-blur-xl border border-white/10 p-10 md:p-16 shadow-[0_0_80px_rgba(0,0,0,0.5)] rounded-sm">
          <form className="space-y-8" onSubmit={handleSubmit}>
            {error && (
              <div className="bg-red-500/10 border border-red-500/20 text-red-500 text-[10px] uppercase tracking-widest p-4 text-center">
                {error}
              </div>
            )}
            
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-white/30">Full Name</label>
              <input 
                type="text" 
                name="name"
                required
                value={formData.name}
                onChange={handleChange}
                className="w-full bg-transparent border-b border-white/10 py-4 text-white focus:outline-none focus:border-primary-gold transition-all placeholder:text-white/10" 
                placeholder="Ayesha Malik"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-white/30">Email Address</label>
              <input 
                type="email" 
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="w-full bg-transparent border-b border-white/10 py-4 text-white focus:outline-none focus:border-primary-gold transition-all placeholder:text-white/10" 
                placeholder="designer@ppfassion.com"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-white/30">Phone Number</label>
              <input 
                type="tel" 
                name="phone"
                required
                value={formData.phone}
                onChange={handleChange}
                className="w-full bg-transparent border-b border-white/10 py-4 text-white focus:outline-none focus:border-primary-gold transition-all placeholder:text-white/10" 
                placeholder="+44 7000 000000"
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-white/30">Password</label>
              <input 
                type="password" 
                name="password"
                required
                value={formData.password}
                onChange={handleChange}
                className="w-full bg-transparent border-b border-white/10 py-4 text-white focus:outline-none focus:border-primary-gold transition-all placeholder:text-white/10" 
                placeholder="••••••••"
              />
            </div>

            <button 
              type="submit"
              disabled={loading}
              className="w-full brand-gradient brand-gradient-hover text-white font-bold py-6 uppercase tracking-widest text-xs transition-all shadow-2xl active:scale-95 disabled:opacity-50"
            >
              {loading ? "Creating Account..." : "Create Designer Account"}
            </button>
          </form>

          <div className="mt-12 pt-8 border-t border-white/5 text-center">
            <p className="text-[10px] text-white/20 uppercase tracking-widest mb-4 font-bold">Already have an account?</p>
            <Link 
              href="/login" 
              className="text-primary-gold font-bold uppercase tracking-widest text-[10px] hover:text-white transition-colors"
            >
              Log in instead
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
