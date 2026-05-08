"use client";

import { motion, AnimatePresence } from "framer-motion";

interface InquiryDetailModalProps {
  selectedInquiry: any;
  setSelectedInquiry: (inq: any) => void;
}

export default function InquiryDetailModal({ selectedInquiry, setSelectedInquiry }: InquiryDetailModalProps) {
  return (
    <AnimatePresence>
      {selectedInquiry && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[110] bg-luxury-black/95 backdrop-blur-xl flex items-center justify-center p-6"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            className="bg-[#121212] border border-white/10 max-w-2xl w-full relative overflow-hidden shadow-2xl"
          >
            <div className="p-8 border-b border-white/5 flex justify-between items-center bg-white/[0.02]">
              <div>
                <h3 className="text-xl font-serif font-bold italic text-primary-gold mb-1">Inquiry Perspective</h3>
                <p className="text-[10px] uppercase tracking-widest text-white/30 font-bold">Received on {new Date(selectedInquiry.createdAt).toLocaleDateString()}</p>
              </div>
              <button onClick={() => setSelectedInquiry(null)} className="text-white/40 hover:text-white transition-all p-2 hover:bg-white/5 rounded-full">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>

            <div className="p-10 space-y-8">
              <div className="grid grid-cols-2 gap-8">
                <div>
                  <p className="text-[9px] uppercase tracking-[0.3em] text-white/20 font-bold mb-2">Sender Name</p>
                  <p className="text-sm font-bold text-white">{selectedInquiry.fullName}</p>
                </div>
                <div>
                  <p className="text-[9px] uppercase tracking-[0.3em] text-white/20 font-bold mb-2">Inquiry Type</p>
                  <p className="text-sm font-bold text-primary-gold uppercase tracking-widest">{selectedInquiry.type}</p>
                </div>
              </div>

              <div>
                <p className="text-[9px] uppercase tracking-[0.3em] text-white/20 font-bold mb-2">Electronic Mail Address</p>
                <p className="text-sm font-bold text-white/80">{selectedInquiry.email}</p>
              </div>

              <div className="pt-8 border-t border-white/5">
                <p className="text-[9px] uppercase tracking-[0.3em] text-white/20 font-bold mb-4">Message Content</p>
                <div className="bg-white/[0.02] p-8 border border-white/5 rounded-sm relative">
                   <div className="absolute top-4 right-4 opacity-10">
                     <svg className="w-12 h-12 text-primary-gold" fill="currentColor" viewBox="0 0 24 24"><path d="M14.017 21L14.017 18C14.017 16.8954 14.9124 16 16.017 16H19.017C19.5693 16 20.017 15.5523 20.017 15V9C20.017 8.44772 19.5693 8 19.017 8H15.017C14.4647 8 14.017 8.44772 14.017 9V11H12.017V9C12.017 7.34315 13.3601 6 15.017 6H19.017C20.6739 6 22.017 7.34315 22.017 9V15C22.017 16.6569 20.6739 18 19.017 18H16.017V21H14.017ZM2.017 21L2.017 18C2.017 16.8954 2.91243 16 4.017 16H7.017C7.56928 16 8.017 15.5523 8.017 15V9C8.017 8.44772 7.56928 8 7.017 8H3.017C2.46472 8 2.017 8.44772 2.017 9V11H0.017V9C0.017 7.34315 1.36015 6 3.017 6H7.017C8.67386 6 10.017 7.34315 10.017 9V15C10.017 16.6569 8.67386 18 7.017 18H4.017V21H2.017Z" /></svg>
                   </div>
                   <p className="text-sm text-white/70 leading-relaxed italic relative z-10">"{selectedInquiry.message}"</p>
                </div>
              </div>
            </div>

            <div className="p-8 bg-white/[0.02] border-t border-white/5 text-center">
              <button
                onClick={() => setSelectedInquiry(null)}
                className="text-[10px] font-black uppercase tracking-[0.4em] text-primary-gold hover:text-white transition-all py-3 px-12 border border-primary-gold/20 hover:border-primary-gold"
              >
                Close Perspective
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
