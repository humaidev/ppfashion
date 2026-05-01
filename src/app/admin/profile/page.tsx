"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Link from "next/link";

export default function AdminProfilePage() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch("/api/auth/profile");
        const data = await res.json();
        if (data.success && data.user.role === 'ADMIN') {
          setUser(data.user);
        } else {
          router.push("/login");
        }
      } catch (err) {
        router.push("/login");
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [router]);

  if (loading) return (
    <div className="min-h-screen bg-luxury-black flex items-center justify-center">
      <div className="w-12 h-12 border-4 border-primary-gold border-t-transparent rounded-full animate-spin"></div>
    </div>
  );

  return (
    <div className="min-h-screen bg-luxury-black text-white py-32 px-6">
      <div className="container mx-auto max-w-4xl">
        <header className="mb-20 text-center">
          <h1 className="text-primary-gold font-bold uppercase tracking-[0.5em] text-[10px] mb-4">Executive Administration</h1>
          <h2 className="text-5xl font-serif font-bold text-white tracking-tighter uppercase italic">Admin Profile</h2>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-1 space-y-6">
             <div className="bg-white/[0.03] border border-white/10 p-10 text-center">
                <div className="w-24 h-24 bg-primary-gold/10 rounded-full flex items-center justify-center mx-auto mb-6 border border-primary-gold/20">
                   <svg className="w-12 h-12 text-primary-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
                </div>
                <h3 className="text-lg font-bold tracking-widest uppercase">{user?.name}</h3>
                <p className="text-[9px] text-white/40 uppercase tracking-[0.3em] mt-2">System Administrator</p>
             </div>
             <Link href="/admin" className="block w-full text-center bg-white/5 border border-white/10 py-4 text-[10px] font-bold uppercase tracking-widest hover:bg-white hover:text-luxury-black transition-all">
                Control Panel
             </Link>
          </div>

          <div className="lg:col-span-2">
             <div className="bg-white/[0.03] border border-white/10 p-10 md:p-16 rounded-sm">
                <div className="space-y-12">
                   <div>
                      <p className="text-[10px] uppercase tracking-widest text-white/30 font-bold mb-4">Official Designation</p>
                      <p className="text-sm font-bold tracking-widest uppercase">Lead Administrator - PPFASSION</p>
                   </div>
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                      <div>
                        <p className="text-[10px] uppercase tracking-widest text-white/30 font-bold mb-3">Email Access</p>
                        <p className="text-sm font-medium">{user?.email}</p>
                      </div>
                      <div>
                        <p className="text-[10px] uppercase tracking-widest text-white/30 font-bold mb-3">Access Level</p>
                        <p className="text-secondary-emerald text-[10px] font-black uppercase tracking-widest">Full Tier / Root</p>
                      </div>
                   </div>
                   <div className="pt-12 border-t border-white/5 flex gap-6">
                      <Link href="/change-password" title="Update Security" className="text-[10px] font-black uppercase tracking-widest text-primary-gold hover:text-white transition-colors">Change Access Password</Link>
                   </div>
                </div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}
