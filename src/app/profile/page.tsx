"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { motion } from "framer-motion";
import Link from "next/link";

export default function ProfilePage() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', phone: '' });
  const router = useRouter();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch("/api/auth/profile");
        const data = await res.json();
        if (data.success) {
          setUser(data.user);
          setFormData({
            name: data.user.name || '',
            email: data.user.email || '',
            phone: data.user.phone || ''
          });
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

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    // Logic to update profile can be added here
    alert("Profile update logic will be implemented here.");
    setIsEditing(false);
  };

  if (loading) return (
    <div className="min-h-screen bg-luxury-black flex items-center justify-center">
      <div className="w-12 h-12 border-4 border-primary-gold border-t-transparent rounded-full animate-spin"></div>
    </div>
  );

  return (
    <div className="min-h-screen bg-luxury-black text-white py-32 px-6">
      <div className="container mx-auto max-w-4xl">
        <header className="mb-20 text-center">
          <h1 className="text-primary-gold font-bold uppercase tracking-[0.5em] text-[10px] mb-4">Designer Profile</h1>
          <h2 className="text-5xl md:text-7xl font-serif font-bold text-white tracking-tighter uppercase italic">My Identity</h2>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Profile Sidebar */}
          <div className="lg:col-span-1 space-y-8">
            <div className="bg-white/[0.03] border border-white/10 p-10 text-center rounded-sm">
              <div className="w-32 h-32 rounded-full border-2 border-primary-gold/30 p-1 mx-auto mb-8 relative">
                 <div className="w-full h-full rounded-full bg-white/5 flex items-center justify-center overflow-hidden">
                    <svg className="w-16 h-16 text-primary-gold/20" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                    </svg>
                 </div>
              </div>
              <h3 className="text-xl font-serif font-bold text-white mb-2">{user?.name}</h3>
              <p className="text-[10px] uppercase tracking-widest text-primary-gold font-black mb-6">{user?.role}</p>
              
              <div className={`inline-block px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest ${user?.role === 'ADMIN' ? 'bg-primary-gold/20 text-primary-gold border border-primary-gold/20' : user?.membership?.status === 'ACTIVE' ? 'bg-secondary-emerald/20 text-secondary-emerald' : 'bg-white/10 text-white/40'}`}>
                {user?.role === 'ADMIN' ? 'Full System Access' : user?.membership?.status === 'ACTIVE' ? 'Premium Member' : 'Standard Access'}
              </div>
            </div>

            <Link href={user?.role === 'ADMIN' ? "/admin" : "/dashboard"} className="block w-full text-center border border-white/10 py-5 text-[10px] font-black uppercase tracking-widest hover:bg-white hover:text-luxury-black transition-all">
              Go to Dashboard
            </Link>
          </div>

          {/* Main Profile Info */}
          <div className="lg:col-span-2">
            <div className="bg-white/[0.03] border border-white/10 p-10 md:p-16 rounded-sm">
              <div className="flex justify-between items-center mb-12 pb-6 border-b border-white/5">
                 <h4 className="text-sm font-bold uppercase tracking-[0.3em] text-white/40">Account Details</h4>
                 <button onClick={() => setIsEditing(!isEditing)} className="text-[10px] font-black uppercase tracking-widest text-primary-gold hover:text-white transition-colors">
                    {isEditing ? "Cancel" : "Edit Profile"}
                 </button>
              </div>

              {isEditing ? (
                <form onSubmit={handleUpdate} className="space-y-10">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-white/30">Full Name</label>
                    <input type="text" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="w-full bg-transparent border-b border-white/10 py-4 text-white focus:outline-none focus:border-primary-gold" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-white/30">Email Address</label>
                    <input type="email" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} className="w-full bg-transparent border-b border-white/10 py-4 text-white/40 cursor-not-allowed" disabled />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-white/30">Phone Number</label>
                    <input type="tel" value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} className="w-full bg-transparent border-b border-white/10 py-4 text-white focus:outline-none focus:border-primary-gold" />
                  </div>
                  <button type="submit" className="brand-gradient w-full py-6 text-[10px] font-black uppercase tracking-widest">Save Changes</button>
                </form>
              ) : (
                <div className="space-y-12">
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                      <div>
                        <p className="text-[10px] uppercase tracking-widest text-white/30 font-bold mb-3">Legal Name</p>
                        <p className="text-lg font-serif font-bold italic">{user?.name}</p>
                      </div>
                      <div>
                        <p className="text-[10px] uppercase tracking-widest text-white/30 font-bold mb-3">Email Address</p>
                        <p className="text-sm font-medium">{user?.email}</p>
                      </div>
                   </div>

                   <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                      <div>
                        <p className="text-[10px] uppercase tracking-widest text-white/30 font-bold mb-3">Contact Number</p>
                        <p className="text-sm font-medium">{user?.phone || "Not Provided"}</p>
                      </div>
                      <div>
                        <p className="text-[10px] uppercase tracking-widest text-white/30 font-bold mb-3">Member Since</p>
                        <p className="text-sm font-medium">{new Date(user?.createdAt).toLocaleDateString()}</p>
                      </div>
                   </div>

                   {user?.kycData?.businessName && (
                     <div className="pt-12 border-t border-white/5">
                        <p className="text-[10px] font-black uppercase tracking-[0.4em] text-primary-gold mb-10">Professional Dossier</p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                           <div>
                             <p className="text-[10px] uppercase tracking-widest text-white/30 font-bold mb-3">Brand Identity</p>
                             <p className="text-lg font-serif font-bold italic">{user.kycData.businessName}</p>
                           </div>
                           <div>
                             <p className="text-[10px] uppercase tracking-widest text-white/30 font-bold mb-3">Fashion Category</p>
                             <p className="text-sm font-medium uppercase tracking-widest">{user.kycData.category}</p>
                           </div>
                        </div>
                     </div>
                   )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
