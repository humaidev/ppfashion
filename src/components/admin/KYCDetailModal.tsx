"use client";

import { motion, AnimatePresence } from "framer-motion";

interface KYCDetailModalProps {
  selectedKYC: any;
  setSelectedKYC: (val: any) => void;
  updateKYC: (id: string, status: string) => void;
  setFullScreenImage: (src: string) => void;
}

export default function KYCDetailModal({ selectedKYC, setSelectedKYC, updateKYC, setFullScreenImage }: KYCDetailModalProps) {
  if (!selectedKYC) return null;

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
          <button onClick={() => setSelectedKYC(null)} className="absolute top-8 right-8 text-white/40 hover:text-white transition-colors">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
          </button>

          <div className="mb-12 text-center">
            <p className="text-primary-gold font-bold uppercase tracking-[0.4em] text-[9px] mb-4">Comprehensive Verification Dossier</p>
            <h3 className="text-4xl font-serif font-bold text-white uppercase tracking-tighter italic">{selectedKYC.name}</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-12">
            <div className="space-y-6 text-left">
               <div>
                 <p className="text-[9px] uppercase tracking-widest text-white/20 font-bold mb-1">Brand Identity</p>
                 <p className="text-xl font-serif italic text-white">{selectedKYC.kycData?.businessName || selectedKYC.businessName || 'Not Provided'}</p>
               </div>
               <div className="grid grid-cols-2 gap-6">
                 <div>
                   <p className="text-[9px] uppercase tracking-widest text-white/20 font-bold mb-1">Category</p>
                   <p className="text-[11px] font-black text-primary-gold uppercase tracking-widest">{selectedKYC.kycData?.category || selectedKYC.specialty || 'N/A'}</p>
                 </div>
                 <div>
                   <p className="text-[9px] uppercase tracking-widest text-white/20 font-bold mb-1">Experience</p>
                   <p className="text-[11px] font-black text-white uppercase tracking-widest">{selectedKYC.kycData?.experience || selectedKYC.experience || '0'} Years</p>
                 </div>
               </div>
               <div className="pt-4 border-t border-white/5">
                 <p className="text-[9px] uppercase tracking-widest text-white/20 font-bold mb-2">Legal Identity</p>
                 <div className="space-y-3">
                    <p className="text-xs text-white/60"><span className="text-white/30 mr-2">CNIC:</span> {selectedKYC.kycData?.cnic || selectedKYC.cnic || 'N/A'}</p>
                    {selectedKYC.kycData?.passport && <p className="text-xs text-white/60"><span className="text-white/30 mr-2">Passport:</span> {selectedKYC.kycData.passport}</p>}
                 </div>
               </div>
            </div>
            <div className="space-y-6 text-left">
               <div>
                 <p className="text-[9px] uppercase tracking-widest text-white/20 font-bold mb-1">Headquarters / City</p>
                 <p className="text-sm font-bold text-white uppercase tracking-widest">{selectedKYC.kycData?.city || selectedKYC.location || 'Unknown'}</p>
               </div>
               <div>
                 <p className="text-[9px] uppercase tracking-widest text-white/20 font-bold mb-1">Registered Address</p>
                 <p className="text-[10px] text-white/60 leading-relaxed font-medium uppercase tracking-widest">{selectedKYC.kycData?.address || selectedKYC.address || 'Not Provided'}</p>
               </div>
            </div>
          </div>

          {/* Portfolio Links Spotlight */}
          <div className="mb-16 p-6 bg-white/[0.02] border border-white/5">
             <p className="text-[10px] uppercase tracking-widest text-white/30 font-bold mb-6 text-left">Portfolio & Social Dossier</p>
             <div className="flex flex-wrap gap-3">
                {selectedKYC.kycData?.portfolioLinks && selectedKYC.kycData.portfolioLinks.length > 0 ? (
                  selectedKYC.kycData.portfolioLinks.map((link: string, i: number) => (
                    <a key={i} href={link.startsWith('http') ? link : `https://${link}`} target="_blank" rel="noopener noreferrer" className="px-4 py-2 bg-primary-gold/10 border border-primary-gold/20 text-primary-gold text-[10px] font-bold uppercase tracking-widest hover:bg-primary-gold hover:text-luxury-black transition-all">
                      Link #{i + 1} ↗
                    </a>
                  ))
                ) : (
                  <p className="text-[10px] text-white/20 font-bold uppercase tracking-widest italic">No external links provided</p>
                )}
             </div>
          </div>

          <div className="mb-16">
             <p className="text-[10px] uppercase tracking-widest text-white/30 font-bold mb-8 border-b border-white/5 pb-4 text-left">Verification Documents</p>
             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                 {[
                   { label: 'Identity Front', src: selectedKYC.kycData?.documents?.cnicFront },
                   { label: 'Identity Back', src: selectedKYC.kycData?.documents?.cnicBack },
                   { label: 'Security Selfie', src: selectedKYC.kycData?.documents?.selfieWithCnic },
                   { label: 'Trade License', src: selectedKYC.kycData?.documents?.license },
                 ].map((doc) => (
                  <div key={doc.label} className="group relative">
                    <p className="text-[9px] uppercase tracking-widest text-white/40 mb-3 font-black text-left">{doc.label}</p>
                    <div className="aspect-[3/2] bg-white/5 border border-white/10 rounded-sm overflow-hidden hover:border-primary-gold transition-colors">
                       {doc.src ? (
                         <img src={doc.src} alt={doc.label} className="w-full h-full object-cover transition-transform group-hover:scale-110 duration-700" />
                       ) : (
                         <div className="w-full h-full flex items-center justify-center italic text-[9px] opacity-20">No Image Uploaded</div>
                       )}
                    </div>
                    <div onClick={() => doc.src && setFullScreenImage(doc.src)} className="absolute inset-0 bg-luxury-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity cursor-pointer">
                       <span className="text-[9px] font-black uppercase tracking-widest border border-white/20 px-4 py-2 hover:bg-white hover:text-luxury-black transition-all">Expand View</span>
                    </div>
                  </div>
                ))}
             </div>
          </div>

          <div className="flex gap-4 pt-10 border-t border-white/5">
            <button 
              onClick={() => { updateKYC(selectedKYC._id, 'APPROVED'); setSelectedKYC(null); }}
              className="flex-1 bg-secondary-emerald text-white py-6 text-[10px] font-black uppercase tracking-[0.3em] hover:scale-[1.02] active:scale-[0.98] transition-all shadow-[0_10px_30px_rgba(0,130,91,0.3)]"
            >
              Approve Application
            </button>
            <button 
              onClick={() => { updateKYC(selectedKYC._id, 'REJECTED'); setSelectedKYC(null); }}
              className="flex-1 border border-red-500/30 text-red-500 py-6 text-[10px] font-black uppercase tracking-[0.3em] hover:bg-red-500 hover:text-white transition-all"
            >
              Reject with Feedback
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
