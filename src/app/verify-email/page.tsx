"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";

function VerifyEmailContent() {
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/verify-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, code }),
      });
      const data = await res.json();
      if (data.success) {
        setSuccess(true);
        setTimeout(() => router.push("/login?verified=true"), 2000);
      } else {
        setError(data.message || "Invalid verification code.");
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
          <h1 className="text-primary-gold font-bold uppercase tracking-[0.4em] text-[10px] mb-4">Identity Verification</h1>
          <h2 className="text-4xl font-serif font-bold uppercase italic">Verify Email</h2>
        </header>

        <div className="bg-white/[0.03] border border-white/10 p-10 md:p-16 rounded-sm shadow-2xl">
          <form onSubmit={handleSubmit} className="space-y-10 text-center">
            <p className="text-[10px] text-white/40 leading-relaxed uppercase tracking-[0.2em] mb-8">
              We have dispatched a 6-digit verification dossier to <span className="text-white">{email}</span>. Please enter it below.
            </p>

            {error && <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-500 text-[10px] uppercase tracking-widest text-center font-bold">{error}</div>}
            {success && <div className="p-4 bg-secondary-emerald/10 border border-secondary-emerald/20 text-secondary-emerald text-[10px] uppercase tracking-widest text-center font-bold">Verification Successful</div>}

            <input 
              type="text" 
              required 
              maxLength={6}
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="w-full bg-transparent border-b border-white/10 py-6 text-center text-4xl font-serif tracking-[0.5em] text-primary-gold focus:outline-none focus:border-primary-gold transition-all" 
              placeholder="000000"
            />

            <button 
              type="submit" 
              disabled={loading || success}
              className="w-full brand-gradient py-6 text-[10px] font-black uppercase tracking-widest shadow-xl active:scale-95 disabled:opacity-50"
            >
              {loading ? "Verifying..." : "Verify Identity"}
            </button>

            <button type="button" className="text-[9px] font-bold text-white/20 uppercase tracking-widest hover:text-white transition-colors">
              Resend Code
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-luxury-black flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-primary-gold border-t-transparent rounded-full animate-spin"></div>
      </div>
    }>
      <VerifyEmailContent />
    </Suspense>
  );
}
