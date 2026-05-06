"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";

export default function DesignerDashboard() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isEditingCard, setIsEditingCard] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [newCard, setNewCard] = useState({ number: '', expiry: '', cvc: '' });
  const router = useRouter();

  const fetchProfile = async () => {
    try {
      const res = await fetch("/api/auth/profile");
      const data = await res.json();
      if (data.success) {
        if (data.user.role === 'ADMIN') {
          router.push("/admin");
          return;
        }
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

  useEffect(() => {
    fetchProfile();
  }, [router]);


  const handleUpdateCard = async () => {
    setUpdating(true);
    try {
      const res = await fetch("/api/payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cardDetails: newCard, amount: '0', planId: 'UPDATE' }),
      });
      if (res.ok) {
        setIsEditingCard(false);
        fetchProfile();
      }
    } catch (err) {
      console.error("Update failed", err);
    } finally {
      setUpdating(false);
    }
  };

  if (loading) return (
    <div className="min-h-screen bg-luxury-black flex items-center justify-center">
      <div className="w-12 h-12 border-4 border-primary-gold border-t-transparent rounded-full animate-spin"></div>
    </div>
  );

  return (
    <div className="min-h-screen bg-luxury-black text-white py-20 px-6">
      <div className="container mx-auto max-w-6xl">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-16 gap-8">
          <div>
            <h1 className="text-primary-gold font-bold uppercase tracking-[0.4em] text-[10px] mb-4">Designer Dashboard</h1>
            <h2 className="text-5xl font-serif font-bold tracking-tighter">Welcome, {user?.name}</h2>
          </div>
          <div className="flex gap-4">
            <Link href="/membership" className="brand-gradient px-8 py-4 text-[10px] font-black uppercase tracking-widest shadow-lg">
              Manage Membership
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* KYC Status Card */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="lg:col-span-2 bg-white/[0.03] border border-white/10 p-10 rounded-sm relative overflow-hidden"
          >
            <div className="relative z-10">
              <h3 className="text-xl font-serif font-bold mb-6 italic">KYC Verification Status</h3>
              <div className="flex items-center gap-6 mb-10">
                <div className={`px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-widest ${
                  user?.kycStatus === 'APPROVED' ? 'bg-secondary-emerald text-white' : 
                  user?.kycStatus === 'PENDING' ? 'bg-primary-gold text-luxury-black' : 
                  user?.kycStatus === 'REJECTED' ? 'bg-red-500 text-white' : 'bg-white/10 text-white/40'
                }`}>
                  {user?.kycStatus?.replace('_', ' ') || 'NOT SUBMITTED'}
                </div>
                {user?.kycStatus === 'NOT_SUBMITTED' && (
                  <p className="text-[10px] text-white/40 uppercase tracking-widest font-bold">Action Required</p>
                )}
              </div>

              {user?.kycStatus === 'NOT_SUBMITTED' ? (
                <div className="space-y-6">
                  <p className="text-white/60 text-sm leading-relaxed max-w-xl">
                    To participate in events and access the full collective, you must verify your identity and business details.
                  </p>
                  <Link href="/kyc" className="inline-block border border-primary-gold text-primary-gold px-10 py-4 text-[10px] font-black uppercase tracking-widest hover:bg-primary-gold hover:text-luxury-black transition-all">
                    Start KYC Process
                  </Link>
                </div>
              ) : (
                <div className="space-y-6">
                   <p className="text-white/60 text-sm leading-relaxed">
                     {user?.kycStatus === 'APPROVED' ? 'Your identity is verified. You can now join upcoming events.' : 
                      user?.kycStatus === 'PENDING' ? 'Our admin team is currently reviewing your documents. This usually takes 24-48 hours.' : 
                      'Your application requires attention. Please check admin feedback below and update your record.'}
                   </p>
                   
                   {user?.kycData?.adminFeedback && (
                     <div className="p-6 bg-red-500/10 border border-red-500/20 text-red-500 text-xs italic">
                       " {user?.kycData?.adminFeedback} "
                     </div>
                   )}

                   <div className="flex gap-4 pt-4">
                      <Link href="/kyc" className="inline-block bg-white/5 border border-white/10 text-white px-8 py-4 text-[9px] font-black uppercase tracking-widest hover:bg-white hover:text-luxury-black transition-all">
                        {user?.kycStatus === 'REJECTED' ? 'Update & Correct Verification' : 'View Submitted Dossier'}
                      </Link>
                      {user?.kycStatus === 'APPROVED' && (
                        <div className="flex items-center gap-2 text-secondary-emerald text-[9px] font-black uppercase tracking-widest">
                           <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
                           Verified Member
                        </div>
                      )}
                   </div>
                </div>
              )}
            </div>
            {/* Background design */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary-gold/5 blur-[100px] -mr-32 -mt-32"></div>
          </motion.div>

          {/* Membership Status Card */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="flex flex-col gap-10"
          >
            <div className="bg-white/[0.03] border border-white/10 p-10 rounded-sm">
              <h3 className="text-xl font-serif font-bold mb-8 italic">Membership</h3>
              <div className="space-y-8">
                <div>
                  <p className="text-[10px] uppercase tracking-widest text-white/30 font-bold mb-2">Current Plan</p>
                  <p className="text-2xl font-serif font-bold gold-gradient-text">
                    {user?.membership?.plan === 'NONE' ? 'No Active Plan' : user?.membership?.plan}
                  </p>
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-widest text-white/30 font-bold mb-2">Status</p>
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${user?.membership?.status === 'ACTIVE' ? 'bg-secondary-emerald shadow-[0_0_10px_#00FF9D]' : 'bg-white/20'}`}></div>
                    <p className="text-xs font-bold uppercase tracking-widest">{user?.membership?.status || 'INACTIVE'}</p>
                  </div>
                </div>
                <Link href="/membership" className="block w-full text-center border border-white/10 py-4 text-[10px] font-bold uppercase tracking-widest hover:bg-white hover:text-luxury-black transition-all">
                  {user?.membership?.plan === 'NONE' ? 'Upgrade Now' : 'Manage Subscription'}
                </Link>
              </div>
            </div>

            {/* Payment Method Card */}
            <div className="bg-white/[0.03] border border-white/10 p-10 rounded-sm">
              <h3 className="text-xl font-serif font-bold mb-8 italic">Billing Method</h3>
              {user?.membership?.cardLast4 && !isEditingCard ? (
                <div className="space-y-8">
                   <div>
                    <p className="text-[10px] uppercase tracking-widest text-white/30 font-bold mb-4">Saved Card</p>
                    <div className="flex items-center gap-4 bg-white/[0.03] p-4 border border-white/5">
                       <div className="w-10 h-6 bg-white/10 rounded-sm flex items-center justify-center">
                          <svg className="w-6 h-6 text-white/30" fill="currentColor" viewBox="0 0 24 24"><path d="M20 4H4c-1.11 0-1.99.89-1.99 2L2 18c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V6c0-1.11-.89-2-2-2zm0 14H4v-6h16v6zm0-10H4V6h16v4z"/></svg>
                       </div>
                       <div>
                          <p className="text-xs font-bold tracking-widest">{user.membership.paymentMethod} •••• {user.membership.cardLast4}</p>
                       </div>
                    </div>
                  </div>
                  <div className="flex flex-col gap-3">
                    <button 
                      onClick={() => setIsEditingCard(true)}
                      className="w-full text-center py-4 text-[9px] font-black uppercase tracking-widest text-primary-gold hover:bg-primary-gold/5 transition-all border border-primary-gold/20"
                    >
                      Update Card
                    </button>
                    <button 
                      onClick={async () => {
                        if(confirm("Are you sure you want to remove this payment method?")) {
                          const res = await fetch("/api/auth/payment-method", { method: 'DELETE' });
                          if(res.ok) window.location.reload();
                        }
                      }}
                      className="w-full text-center py-4 text-[9px] font-black uppercase tracking-widest text-red-500/60 hover:text-red-500 hover:bg-red-500/5 transition-all"
                    >
                      Remove Card
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                  {isEditingCard ? (
                    <div className="space-y-4">
                       <div className="space-y-2">
                         <label className="text-[9px] uppercase tracking-widest text-white/30">Card Number</label>
                         <input 
                           type="text" 
                           placeholder="•••• •••• •••• ••••" 
                           className="w-full bg-black/40 border-b border-white/10 py-3 text-white focus:outline-none focus:border-primary-gold text-xs tracking-widest"
                           onChange={(e) => setNewCard({...newCard, number: e.target.value})}
                         />
                       </div>
                       <div className="grid grid-cols-2 gap-4">
                         <div className="space-y-2">
                           <label className="text-[9px] uppercase tracking-widest text-white/30">Expiry</label>
                           <input type="text" placeholder="MM/YY" className="w-full bg-black/40 border-b border-white/10 py-3 text-white focus:outline-none focus:border-primary-gold text-xs" />
                         </div>
                         <div className="space-y-2">
                           <label className="text-[9px] uppercase tracking-widest text-white/30">CVC</label>
                           <input type="text" placeholder="***" className="w-full bg-black/40 border-b border-white/10 py-3 text-white focus:outline-none focus:border-primary-gold text-xs" />
                         </div>
                       </div>
                       <div className="flex gap-4 pt-4">
                          <button 
                            onClick={handleUpdateCard}
                            disabled={updating}
                            className="flex-1 bg-primary-gold text-luxury-black py-4 text-[9px] font-black uppercase tracking-widest"
                          >
                            {updating ? 'Saving...' : 'Save Card'}
                          </button>
                          <button onClick={() => setIsEditingCard(false)} className="flex-1 border border-white/10 text-white/40 py-4 text-[9px] font-black uppercase tracking-widest">Cancel</button>
                       </div>
                    </div>
                  ) : (
                    <>
                      <p className="text-xs text-white/30 uppercase tracking-widest leading-relaxed">No payment method saved on file.</p>
                      <button 
                        onClick={() => setIsEditingCard(true)}
                        className="block w-full text-center border border-primary-gold/30 text-primary-gold py-4 text-[9px] font-black uppercase tracking-widest hover:bg-primary-gold hover:text-luxury-black transition-all"
                      >
                        Add Payment Method
                      </button>
                    </>
                  )}
                </div>
              )}
            </div>
          </motion.div>

          {/* Recent Activity / Events Card */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-3 bg-white/[0.03] border border-white/10 p-10 rounded-sm"
          >
            <div className="flex justify-between items-center mb-10">
               <h3 className="text-xl font-serif font-bold italic">Your Event Participation</h3>
               <Link href="/events" className="text-[10px] font-bold text-primary-gold uppercase tracking-widest hover:text-white transition-colors">Browse Global Events →</Link>
            </div>
            
            <div className="border-t border-white/5">
               <div className="py-20 text-center text-white/20 uppercase tracking-[0.4em] text-[10px] font-bold">
                 No event applications found. Submit KYC and upgrade membership to participate.
               </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
