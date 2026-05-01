"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (data.success) {
        setSuccess(true);
      } else {
        setError(data.message || "Failed to send reset link.");
      }
    } catch (err) {
      setError("Server error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-luxury-black text-white py-32 px-6 flex items-center justify-center">
      <div className="container max-w-md">
        <header className="mb-12 text-center">
          <h1 className="text-primary-gold font-bold uppercase tracking-[0.4em] text-[10px] mb-4">Account Recovery</h1>
          <h2 className="text-4xl font-serif font-bold uppercase italic">Forgot Password</h2>
        </header>

        <div className="bg-white/[0.03] border border-white/10 p-10 md:p-16 rounded-sm shadow-2xl">
          {!success ? (
            <form onSubmit={handleSubmit} className="space-y-8">
              <p className="text-xs text-white/40 leading-relaxed uppercase tracking-widest text-center mb-8">Enter your registered email and we will send you a secure link to reset your access.</p>
              
              {error && <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-500 text-[10px] uppercase tracking-widest text-center font-bold">{error}</div>}

              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-white/30">Email Address</label>
                <input 
                  type="email" 
                  required 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-transparent border-b border-white/10 py-4 text-white focus:outline-none focus:border-primary-gold transition-all" 
                  placeholder="designer@ppfassion.com"
                />
              </div>

              <button 
                type="submit" 
                disabled={loading}
                className="w-full brand-gradient py-6 text-[10px] font-black uppercase tracking-widest shadow-xl active:scale-95 disabled:opacity-50"
              >
                {loading ? "Sending Link..." : "Request Reset Link"}
              </button>
            </form>
          ) : (
            <div className="text-center py-10">
              <div className="w-16 h-16 bg-secondary-emerald/20 text-secondary-emerald rounded-full flex items-center justify-center mx-auto mb-8 border border-secondary-emerald/30">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg>
              </div>
              <h3 className="text-xl font-serif font-bold text-white mb-4 italic uppercase">Request Received</h3>
              <p className="text-xs text-white/40 leading-relaxed uppercase tracking-widest mb-10">Please check your email inbox for further instructions to recover your account.</p>
              <Link href="/login" className="text-primary-gold font-bold uppercase tracking-widest text-[10px] hover:text-white transition-colors border-b border-primary-gold/30 pb-1">Return to Login</Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
