"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";

export default function DesignerDashboard() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isEditingCard, setIsEditingCard] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [newCard, setNewCard] = useState({ number: '', expiry: '', cvc: '' });
  const [events, setEvents] = useState<any[]>([]);
  const [appliedEvents, setAppliedEvents] = useState<string[]>([]);
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [isEditingPortfolio, setIsEditingPortfolio] = useState(false);
  const [portfolioForm, setPortfolioForm] = useState({ brandBio: '', images: [] as string[] });
  const [uploading, setUploading] = useState(false);
  const router = useRouter();

  const fetchDashboardData = async () => {
    try {
      const [profileRes, eventsRes, appsRes] = await Promise.all([
        fetch("/api/auth/profile"),
        fetch("/api/admin/events"),
        fetch("/api/events/applications")
      ]);

      const profileData = await profileRes.json();
      const eventsData = await eventsRes.json();
      const appsData = await appsRes.json();

      if (profileData.success) {
        if (profileData.user.role === 'ADMIN') {
          router.push("/admin");
          return;
        }
        setUser(profileData.user);
        setPortfolioForm({
          brandBio: profileData.user.portfolio?.brandBio || '',
          images: profileData.user.portfolio?.images || []
        });
      } else {
        router.push("/login");
      }

      if (eventsData.success) setEvents(eventsData.events.slice(0, 3));
      if (appsData.success) setAppliedEvents(appsData.applications.map((a: any) => a.event));

    } catch (err) {
      console.error("Dashboard fetch failed", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, [router]);

  const calculateProfileCompletion = () => {
    if (!user) return 0;
    let points = 0;
    if (user.name) points += 20;
    if (user.kycStatus === 'APPROVED') points += 30;
    if (user.membership?.status === 'ACTIVE') points += 20;
    if (user.phone) points += 10;
    if (user.portfolio?.brandBio) points += 10;
    if (user.portfolio?.images?.length > 0) points += 10;
    return points;
  };

  const handleJoinEvent = async (eventId: string) => {
    if (user.kycStatus !== 'APPROVED' || user.membership?.status !== 'ACTIVE') {
      toast.error("Verification & Active Membership required.");
      return;
    }

    setProcessingId(eventId);
    try {
      const res = await fetch("/api/events/apply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ eventId }),
      });
      if (res.ok) {
        setAppliedEvents([...appliedEvents, eventId]);
        toast.success("Application sent to elite jury.");
        fetchDashboardData();
      }
    } catch (err) {
      toast.error("Application failed.");
    } finally {
      setProcessingId(null);
    }
  };

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
        toast.success("Billing info updated.");
        fetchDashboardData();
      }
    } catch (err) {
      toast.error("Update failed.");
    } finally {
      setUpdating(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      if (data.success) {
        setPortfolioForm(prev => ({
          ...prev,
          images: [...prev.images, data.url]
        }));
        toast.success("Image uploaded.");
      }
    } catch (err) {
      toast.error("Upload failed.");
    } finally {
      setUploading(false);
    }
  };

  const savePortfolio = async () => {
    setUpdating(true);
    try {
      const res = await fetch("/api/auth/portfolio", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(portfolioForm),
      });
      if (res.ok) {
        setIsEditingPortfolio(false);
        toast.success("Portfolio synchronized.");
        fetchDashboardData();
      }
    } catch (err) {
      toast.error("Save failed.");
    } finally {
      setUpdating(false);
    }
  };

  if (loading) return (
    <div className="min-h-screen bg-luxury-black flex items-center justify-center">
      <div className="w-12 h-12 border-2 border-primary-gold border-t-transparent rounded-full animate-spin shadow-[0_0_20px_#E8D196]"></div>
    </div>
  );

  const completion = calculateProfileCompletion();

  return (
    <div className="min-h-screen bg-luxury-black text-white py-20 px-6">
      <div className="container mx-auto max-w-7xl">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-16 gap-8">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
            <h1 className="text-primary-gold font-bold uppercase tracking-[0.4em] text-[10px] mb-4">Command Center</h1>
            <h2 className="text-4xl md:text-6xl font-serif font-bold tracking-tighter italic">Welcome, {user?.name?.split(' ')[0]}</h2>
          </motion.div>
          <div className="flex flex-wrap gap-4">
            <Link href="/membership" className="bg-primary-gold text-luxury-black px-8 py-4 text-[10px] font-black uppercase tracking-widest hover:scale-105 transition-all shadow-[0_0_20px_rgba(232,209,150,0.2)]">
              Subscription Management
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Main Status Area */}
          <div className="lg:col-span-8 space-y-8">
            
            {/* Profile Completion & KYC */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white/[0.03] border border-white/10 p-8 rounded-sm relative overflow-hidden group"
              >
                <div className="relative z-10">
                  <p className="text-[10px] font-black uppercase tracking-widest text-white/30 mb-6">Profile Completion</p>
                  <div className="flex items-end justify-between mb-4">
                    <span className="text-5xl font-serif font-bold italic text-primary-gold">{completion}%</span>
                    <span className="text-[10px] font-bold text-white/20 uppercase tracking-widest">Digital Dossier</span>
                  </div>
                  <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${completion}%` }}
                      className="h-full bg-primary-gold shadow-[0_0_10px_#E8D196]"
                    />
                  </div>
                  <p className="mt-6 text-[10px] text-white/40 leading-relaxed uppercase tracking-widest font-medium">
                    {completion < 100 ? 'Complete your portfolio to unlock elite placement.' : 'Your profile is fully optimized for global discovery.'}
                  </p>
                </div>
                <div className="absolute -right-4 -bottom-4 w-32 h-32 bg-primary-gold/5 blur-3xl group-hover:bg-primary-gold/10 transition-all"></div>
              </motion.div>

              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-white/[0.03] border border-white/10 p-8 rounded-sm"
              >
                <p className="text-[10px] font-black uppercase tracking-widest text-white/30 mb-6">Verification Identity</p>
                <div className="flex items-center gap-4 mb-8">
                   <div className={`px-4 py-2 text-[9px] font-black uppercase tracking-widest ${
                     user?.kycStatus === 'APPROVED' ? 'bg-secondary-emerald text-white' : 
                     user?.kycStatus === 'PENDING' ? 'bg-primary-gold text-luxury-black' : 'bg-white/5 text-white/40'
                   }`}>
                     {user?.kycStatus || 'NOT SUBMITTED'}
                   </div>
                   {user?.kycStatus === 'APPROVED' && (
                     <span className="text-secondary-emerald">
                       <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
                     </span>
                   )}
                </div>
                <Link href="/kyc" className="text-[10px] font-black uppercase tracking-widest text-white hover:text-primary-gold transition-colors inline-flex items-center gap-2">
                  {user?.kycStatus === 'APPROVED' ? 'Manage Dossier' : 'Continue Verification'}
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M9 5l7 7-7 7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </Link>
              </motion.div>
            </div>

            {/* Brand Gallery & Portfolio Management */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white/[0.03] border border-white/10 p-8 rounded-sm"
            >
              <div className="flex justify-between items-center mb-10">
                <div>
                  <h3 className="text-xl font-serif font-bold italic">Brand Gallery</h3>
                  <p className="text-[9px] uppercase tracking-[0.2em] text-white/30 mt-1">Professional collections & portfolio</p>
                </div>
                {!isEditingPortfolio && (
                  <button 
                    onClick={() => setIsEditingPortfolio(true)}
                    className="text-[9px] font-black uppercase tracking-widest bg-primary-gold text-luxury-black px-6 py-3 shadow-lg hover:scale-105 transition-all"
                  >
                    Manage Gallery
                  </button>
                )}
              </div>

              <AnimatePresence mode="wait">
                {isEditingPortfolio ? (
                  <motion.div 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="space-y-8"
                  >
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-widest text-primary-gold mb-3">Brand Biography</p>
                      <textarea 
                        value={portfolioForm.brandBio}
                        onChange={(e) => setPortfolioForm({...portfolioForm, brandBio: e.target.value})}
                        className="w-full bg-white/5 border border-white/10 p-6 text-white font-serif italic text-lg focus:outline-none focus:border-primary-gold min-h-[150px]"
                        placeholder="Tell your brand's story..."
                      />
                    </div>

                    <div>
                      <p className="text-[10px] font-black uppercase tracking-widest text-primary-gold mb-4">Collection Images</p>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                        {portfolioForm.images.map((img, i) => (
                          <div key={i} className="relative aspect-square border border-white/10 group overflow-hidden">
                            <img src={img} className="w-full h-full object-cover" />
                            <button 
                              onClick={() => setPortfolioForm({...portfolioForm, images: portfolioForm.images.filter((_, idx) => idx !== i)})}
                              className="absolute inset-0 bg-red-500/80 text-white opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all uppercase text-[8px] font-black"
                            >
                              Remove
                            </button>
                          </div>
                        ))}
                        <label className="aspect-square border border-dashed border-white/20 flex flex-col items-center justify-center cursor-pointer hover:bg-white/5 transition-all">
                          <input type="file" className="hidden" onChange={handleFileUpload} accept="image/*" />
                          <span className="text-[8px] font-black uppercase tracking-widest text-white/40">{uploading ? 'Uploading...' : 'Add Image'}</span>
                        </label>
                      </div>
                    </div>

                    <div className="flex gap-4 pt-4">
                      <button 
                        onClick={savePortfolio}
                        disabled={updating}
                        className="flex-1 bg-primary-gold text-luxury-black font-black py-4 uppercase tracking-widest text-[10px]"
                      >
                        {updating ? 'Synchronizing...' : 'Save Portfolio'}
                      </button>
                      <button 
                        onClick={() => setIsEditingPortfolio(false)}
                        className="flex-1 border border-white/10 text-white/40 font-black py-4 uppercase tracking-widest text-[10px]"
                      >
                        Cancel
                      </button>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                      {user?.portfolio?.images?.map((img: string, i: number) => (
                        <div key={i} className="relative aspect-square overflow-hidden border border-white/10 group">
                          <img src={img} alt="Collection" className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all" />
                        </div>
                      ))}
                      {(!user?.portfolio?.images || user?.portfolio?.images.length === 0) && (
                        <div className="col-span-4 py-16 text-center border border-dashed border-white/10 text-white/20 uppercase tracking-widest text-[9px] font-bold">
                          No collection images uploaded yet.
                        </div>
                      )}
                    </div>

                    <div className="p-6 bg-white/[0.02] border border-white/5">
                      <p className="text-[10px] font-black uppercase tracking-widest text-primary-gold mb-3">Brand Bio</p>
                      <p className="text-sm font-serif italic text-white/60 leading-relaxed">
                        {user?.portfolio?.brandBio || "Your professional brand biography will appear here."}
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>

            {/* Featured Events spotlight */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white/[0.03] border border-white/10 p-8 rounded-sm"
            >
              <div className="flex justify-between items-center mb-10">
                <div>
                  <h3 className="text-xl font-serif font-bold italic">Elite Calendar</h3>
                  <p className="text-[9px] uppercase tracking-[0.2em] text-white/30 mt-1">Global participation opportunities</p>
                </div>
                <Link href="/events" className="text-[9px] font-black uppercase tracking-widest border-b border-primary-gold/30 text-primary-gold pb-1 hover:text-white hover:border-white transition-all">View All</Link>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {events.map((event, i) => (
                  <div key={event._id} className="bg-white/[0.02] border border-white/5 p-6 hover:border-white/10 transition-all flex flex-col h-full">
                    <p className="text-[8px] font-bold text-primary-gold uppercase tracking-widest mb-3">{event.type}</p>
                    <h4 className="text-lg font-serif font-bold mb-4 line-clamp-1">{event.title}</h4>
                    <div className="space-y-2 mb-8">
                       <p className="text-[9px] text-white/40 uppercase tracking-widest font-medium">{event.date || 'TBA 2026'}</p>
                       <p className="text-[9px] text-white/40 uppercase tracking-widest font-medium">{event.location}</p>
                    </div>
                    <button 
                      onClick={() => handleJoinEvent(event._id)}
                      disabled={appliedEvents.includes(event._id) || processingId === event._id}
                      className={`mt-auto w-full py-3 text-[8px] font-black uppercase tracking-widest transition-all ${
                        appliedEvents.includes(event._id) ? 'bg-secondary-emerald/10 text-secondary-emerald' : 'bg-white/5 text-white hover:bg-primary-gold hover:text-luxury-black'
                      }`}
                    >
                      {appliedEvents.includes(event._id) ? 'Application Sent' : 'Join Showcase'}
                    </button>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Activity Timeline */}
            <div className="bg-white/[0.03] border border-white/10 p-8 rounded-sm">
               <h3 className="text-xl font-serif font-bold italic mb-10">Collective Journey</h3>
               <div className="space-y-8 relative before:absolute before:left-[7px] before:top-2 before:bottom-2 before:w-[1px] before:bg-white/10">
                  {[
                    { title: 'Membership Initialized', date: user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A', icon: 'M12 4.354a4 4 0 110 5.292' },
                    { title: 'Identity Verification Started', date: 'Phase 1 Complete', icon: 'M9 12l2 2 4-4' },
                    { title: 'Global Registry Listed', date: 'Visibility Active', icon: 'M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9h18' },
                  ].map((item, i) => (
                    <div key={i} className="flex gap-6 relative pl-1">
                       <div className="w-4 h-4 bg-luxury-black border border-white/20 rounded-full flex items-center justify-center relative z-10">
                          <div className="w-1.5 h-1.5 bg-primary-gold rounded-full shadow-[0_0_10px_#E8D196]"></div>
                       </div>
                       <div>
                          <p className="text-[10px] font-black uppercase tracking-widest text-white leading-none mb-2">{item.title}</p>
                          <p className="text-[9px] font-bold text-white/20 uppercase tracking-widest">{item.date}</p>
                       </div>
                    </div>
                  ))}
               </div>
            </div>
          </div>

          {/* Right Sidebar - Membership & Billing */}
          <div className="lg:col-span-4 space-y-8">
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white/[0.03] border border-white/10 p-8 rounded-sm"
            >
              <h3 className="text-xl font-serif font-bold mb-10 italic">Subscription</h3>
              <div className="space-y-10">
                <div className="p-6 bg-primary-gold/5 border border-primary-gold/10 relative group overflow-hidden">
                  <p className="text-[9px] uppercase tracking-widest text-primary-gold/50 font-black mb-2">Active Plan</p>
                  <p className="text-3xl font-serif font-bold italic text-primary-gold group-hover:scale-105 transition-all origin-left">
                    {user?.membership?.plan && user.membership.plan !== 'NONE' ? `${user.membership.plan} Collective` : 'Standard Collective'}
                  </p>
                  <div className="mt-6 pt-6 border-t border-primary-gold/10 flex items-center justify-between">
                     <span className="text-[9px] font-black uppercase tracking-widest text-white/20">Status</span>
                     <span className="flex items-center gap-2">
                        <div className={`w-1.5 h-1.5 rounded-full ${user?.membership?.status === 'ACTIVE' ? 'bg-secondary-emerald shadow-[0_0_10px_#00FF9D]' : 'bg-white/20'}`}></div>
                        <span className="text-[9px] font-black uppercase tracking-widest text-white">{user?.membership?.status || 'PENDING'}</span>
                     </span>
                  </div>
                  <div className="absolute top-0 right-0 w-24 h-24 bg-primary-gold/5 blur-3xl -mr-12 -mt-12"></div>
                </div>

                <div>
                   <p className="text-[9px] font-black uppercase tracking-widest text-white/20 mb-6">Renewal Intelligence</p>
                   <div className="flex justify-between items-end">
                      <div>
                         <p className="text-xl font-serif font-bold text-white">
                           {(() => {
                             if (!user?.membership?.expiryDate) return '--';
                             const expiry = new Date(user.membership.expiryDate);
                             const now = new Date();
                             const diff = expiry.getTime() - now.getTime();
                             const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
                             return days > 0 ? days : '0';
                           })()} Days
                         </p>
                         <p className="text-[8px] uppercase tracking-widest text-white/30 font-bold mt-1 italic">until cycle end</p>
                      </div>
                      <Link href="/membership" className="text-[9px] font-black uppercase tracking-widest text-primary-gold hover:text-white transition-colors">Manage →</Link>
                   </div>
                </div>
              </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white/[0.03] border border-white/10 p-8 rounded-sm"
            >
              <h3 className="text-xl font-serif font-bold mb-10 italic">Billing Method</h3>
              {user?.membership?.cardLast4 && !isEditingCard ? (
                <div className="space-y-10">
                   <div className="bg-white/[0.02] p-6 border border-white/5 relative">
                      <div className="flex items-center gap-4">
                         <div className="w-12 h-8 bg-black/40 border border-white/10 rounded flex items-center justify-center">
                            <svg className="w-6 h-6 text-white/20" fill="currentColor" viewBox="0 0 24 24"><path d="M20 4H4c-1.11 0-1.99.89-1.99 2L2 18c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V6c0-1.11-.89-2-2-2zm0 14H4v-6h16v6zm0-10H4V6h16v4z"/></svg>
                         </div>
                         <div>
                            <p className="text-[10px] font-black tracking-widest uppercase">{user.membership.paymentMethod} •••• {user.membership.cardLast4}</p>
                         </div>
                      </div>
                   </div>
                   <div className="flex gap-4">
                      <button onClick={() => setIsEditingCard(true)} className="flex-1 py-4 text-[9px] font-black uppercase tracking-widest border border-white/10 hover:bg-white hover:text-luxury-black transition-all">Update</button>
                      <button className="flex-1 py-4 text-[9px] font-black uppercase tracking-widest text-red-500/40 hover:text-red-500 transition-all">Remove</button>
                   </div>
                </div>
              ) : (
                <div className="space-y-6">
                  {isEditingCard ? (
                    <div className="space-y-6">
                       <input 
                         type="text" 
                         placeholder="CARD NUMBER" 
                         className="w-full bg-black/40 border-b border-white/10 py-4 text-white focus:outline-none focus:border-primary-gold text-[10px] font-bold tracking-[0.2em]"
                         onChange={(e) => setNewCard({...newCard, number: e.target.value})}
                       />
                       <div className="grid grid-cols-2 gap-8">
                         <input type="text" placeholder="MM / YY" className="w-full bg-black/40 border-b border-white/10 py-4 text-white focus:outline-none focus:border-primary-gold text-[10px] font-bold tracking-[0.2em]" />
                         <input type="text" placeholder="CVC" className="w-full bg-black/40 border-b border-white/10 py-4 text-white focus:outline-none focus:border-primary-gold text-[10px] font-bold tracking-[0.2em]" />
                       </div>
                       <div className="flex gap-4 pt-6">
                          <button onClick={handleUpdateCard} disabled={updating} className="flex-1 bg-primary-gold text-luxury-black py-4 text-[9px] font-black uppercase tracking-widest">{updating ? 'SAVING...' : 'SAVE CARD'}</button>
                          <button onClick={() => setIsEditingCard(false)} className="flex-1 border border-white/10 text-white/40 py-4 text-[9px] font-black uppercase tracking-widest">CANCEL</button>
                       </div>
                    </div>
                  ) : (
                    <button onClick={() => setIsEditingCard(true)} className="w-full border border-primary-gold/30 text-primary-gold py-5 text-[9px] font-black uppercase tracking-widest hover:bg-primary-gold hover:text-luxury-black transition-all shadow-[0_0_20px_rgba(232,209,150,0.1)]">Add Billing Method</button>
                  )}
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
