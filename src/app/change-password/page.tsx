"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

export default function ChangePasswordPage() {
  const [passwords, setPasswords] = useState({ current: '', new: '', confirm: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (passwords.new !== passwords.confirm) {
      setError("New passwords do not match.");
      return;
    }

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const res = await fetch("/api/auth/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(passwords),
      });
      const data = await res.json();
      if (data.success) {
        setSuccess("Password updated successfully.");
        setTimeout(() => router.push("/profile"), 2000);
      } else {
        setError(data.message || "Failed to update password.");
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
          <h1 className="text-primary-gold font-bold uppercase tracking-[0.4em] text-[10px] mb-4">Security Center</h1>
          <h2 className="text-4xl font-serif font-bold uppercase italic">Change Password</h2>
        </header>

        <div className="bg-white/[0.03] border border-white/10 p-10 md:p-16 rounded-sm shadow-2xl">
          <form onSubmit={handleSubmit} className="space-y-8">
            {error && <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-500 text-[10px] uppercase tracking-widest text-center font-bold">{error}</div>}
            {success && <div className="p-4 bg-secondary-emerald/10 border border-secondary-emerald/20 text-secondary-emerald text-[10px] uppercase tracking-widest text-center font-bold">{success}</div>}

            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-white/30">Current Password</label>
              <input 
                type="password" 
                required 
                value={passwords.current}
                onChange={(e) => setPasswords({...passwords, current: e.target.value})}
                className="w-full bg-transparent border-b border-white/10 py-4 text-white focus:outline-none focus:border-primary-gold transition-all" 
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-white/30">New Password</label>
              <input 
                type="password" 
                required 
                value={passwords.new}
                onChange={(e) => setPasswords({...passwords, new: e.target.value})}
                className="w-full bg-transparent border-b border-white/10 py-4 text-white focus:outline-none focus:border-primary-gold transition-all" 
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-white/30">Confirm New Password</label>
              <input 
                type="password" 
                required 
                value={passwords.confirm}
                onChange={(e) => setPasswords({...passwords, confirm: e.target.value})}
                className="w-full bg-transparent border-b border-white/10 py-4 text-white focus:outline-none focus:border-primary-gold transition-all" 
              />
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full brand-gradient py-6 text-[10px] font-black uppercase tracking-widest shadow-xl active:scale-95 disabled:opacity-50"
            >
              {loading ? "Updating..." : "Update Security Credentials"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
