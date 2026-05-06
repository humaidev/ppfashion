"use client";

import { motion, AnimatePresence } from "framer-motion";

interface EventAppDetailModalProps {
  selectedApp: any;
  setSelectedApp: (val: any) => void;
  updateApp: (id: string, status: string) => void;
}

export default function EventAppDetailModal({ selectedApp, setSelectedApp, updateApp }: EventAppDetailModalProps) {
  if (!selectedApp) return null;

  const designer = selectedApp.designer;
  const event = selectedApp.event;

  return (
    <AnimatePresence>
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[110] bg-luxury-black/98 backdrop-blur-3xl flex items-center justify-center p-6"
      >
        <motion.div 
          initial={{ scale: 0.95, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          className="bg-white/[0.03] border border-white/10 p-12 max-w-4xl w-full max-h-[90vh] overflow-y-auto custom-scrollbar relative"
        >
          <button onClick={() => setSelectedApp(null)} className="absolute top-8 right-8 text-white/40 hover:text-white transition-colors">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
          </button>

          <div className="mb-12 text-center">
            <p className="text-primary-gold font-bold uppercase tracking-[0.4em] text-[9px] mb-4">Event Participation Request</p>
            <h3 className="text-4xl font-serif font-bold text-white uppercase tracking-tighter italic">{designer?.name || "Designer Profile"}</h3>
            <p className="text-xs text-white/40 uppercase tracking-widest mt-4">Applying for: <span className="text-white font-bold">{event?.title || "Upcoming Event"}</span></p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-16">
            <div className="space-y-8 text-left">
               <h4 className="text-[10px] uppercase tracking-widest text-primary-gold font-black border-b border-white/5 pb-2">Designer Identity</h4>
               <div>
                 <p className="text-[10px] uppercase tracking-widest text-white/30 font-bold mb-2">Business / Brand</p>
                 <p className="text-lg font-serif italic text-white">{designer?.kycData?.businessName || "No Brand Linked"}</p>
               </div>
               <div>
                 <p className="text-[10px] uppercase tracking-widest text-white/30 font-bold mb-2">Artistic Category</p>
                 <p className="text-sm font-bold text-white uppercase tracking-widest">{designer?.kycData?.category || "N/A"}</p>
               </div>
               <div>
                 <p className="text-[10px] uppercase tracking-widest text-white/30 font-bold mb-2">Contact Email</p>
                 <p className="text-sm font-medium text-white/60">{designer?.email}</p>
               </div>
            </div>
            <div className="space-y-8 text-left">
               <h4 className="text-[10px] uppercase tracking-widest text-primary-gold font-black border-b border-white/5 pb-2">Verification Status</h4>
               <div>
                 <p className="text-[10px] uppercase tracking-widest text-white/30 font-bold mb-2">KYC Status</p>
                 <span className="text-[10px] font-black uppercase tracking-widest text-secondary-emerald bg-secondary-emerald/10 px-4 py-1.5 rounded-full border border-secondary-emerald/20">{designer?.kycStatus}</span>
               </div>
               <div>
                 <p className="text-[10px] uppercase tracking-widest text-white/30 font-bold mb-2">Membership Plan</p>
                 <p className="text-sm font-bold text-white uppercase tracking-widest">{designer?.membership?.plan || "Standard Member"}</p>
               </div>
               <div>
                 <p className="text-[10px] uppercase tracking-widest text-white/30 font-bold mb-2">Applied On</p>
                 <p className="text-xs text-white/60 font-medium uppercase tracking-widest">{new Date(selectedApp.appliedAt).toLocaleDateString()} {new Date(selectedApp.appliedAt).toLocaleTimeString()}</p>
               </div>
            </div>
          </div>

          <div className="mb-16">
             <p className="text-[10px] uppercase tracking-widest text-white/30 font-bold mb-8 border-b border-white/5 pb-4 text-left">Portfolio Reference</p>
             <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {designer?.kycData?.portfolioLinks?.map((link: string, i: number) => (
                  <a key={i} href={link} target="_blank" rel="noopener noreferrer" className="block p-6 bg-white/5 border border-white/10 hover:border-primary-gold transition-all text-left group">
                    <p className="text-[9px] uppercase tracking-widest text-white/40 mb-2 font-black">Portfolio Link {i+1}</p>
                    <p className="text-xs text-primary-gold font-bold truncate group-hover:text-white">{link}</p>
                  </a>
                ))}
                {!designer?.kycData?.portfolioLinks?.length && (
                  <p className="text-xs text-white/20 italic text-left">No portfolio links provided by designer.</p>
                )}
             </div>
          </div>

          <div className="flex gap-4 pt-10 border-t border-white/5">
            <button 
              onClick={() => { updateApp(selectedApp._id, 'APPROVED'); setSelectedApp(null); }}
              className="flex-1 bg-secondary-emerald text-white py-6 text-[10px] font-black uppercase tracking-[0.3em] hover:scale-[1.02] active:scale-[0.98] transition-all shadow-[0_10px_30px_rgba(0,130,91,0.3)]"
            >
              Approve to Showcase
            </button>
            <button 
              onClick={() => { updateApp(selectedApp._id, 'REJECTED'); setSelectedApp(null); }}
              className="flex-1 border border-red-500/30 text-red-500 py-6 text-[10px] font-black uppercase tracking-[0.3em] hover:bg-red-500 hover:text-white transition-all"
            >
              Decline Application
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
