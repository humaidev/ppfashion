"use client";

import { motion, AnimatePresence } from "framer-motion";

interface FeedbackModalProps {
  showFeedbackModal: { id: string, type: string } | null;
  setShowFeedbackModal: (val: any) => void;
  feedbackText: string;
  setFeedbackText: (val: string) => void;
  submitFeedback: () => void;
}

export default function FeedbackModal({ showFeedbackModal, setShowFeedbackModal, feedbackText, setFeedbackText, submitFeedback }: FeedbackModalProps) {
  if (!showFeedbackModal) return null;

  return (
    <AnimatePresence>
      <motion.div 
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="fixed inset-0 z-[130] bg-black/90 backdrop-blur-md flex items-center justify-center p-6"
      >
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
          className="bg-white/[0.03] border border-white/10 p-12 max-w-lg w-full"
        >
          <h3 className="text-2xl font-serif font-bold text-white mb-2 italic">Rejection Feedback</h3>
          <p className="text-[10px] text-primary-gold uppercase tracking-widest mb-8 font-bold">Provide mandatory reasoning for this decision</p>
          <textarea 
            className="w-full bg-transparent border-b border-white/10 py-4 text-white focus:outline-none focus:border-primary-gold transition-all min-h-[150px] mb-10 text-sm"
            placeholder="Explain the required corrections or reasons for rejection..."
            value={feedbackText}
            onChange={(e) => setFeedbackText(e.target.value)}
          />
          <div className="flex gap-4">
             <button onClick={() => setShowFeedbackModal(null)} className="flex-1 py-4 text-[10px] font-black uppercase tracking-widest text-white/30 hover:text-white transition-all">Cancel</button>
             <button onClick={submitFeedback} className="flex-1 bg-primary-gold text-luxury-black py-4 text-[10px] font-black uppercase tracking-widest shadow-xl font-black">Submit Rejection</button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
