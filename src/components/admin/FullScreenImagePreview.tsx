"use client";

import { motion, AnimatePresence } from "framer-motion";

interface FullScreenImagePreviewProps {
  fullScreenImage: string | null;
  setFullScreenImage: (val: string | null) => void;
}

export default function FullScreenImagePreview({ fullScreenImage, setFullScreenImage }: FullScreenImagePreviewProps) {
  if (!fullScreenImage) return null;

  return (
    <AnimatePresence>
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={() => setFullScreenImage(null)}
        className="fixed inset-0 z-[120] bg-black/95 flex items-center justify-center p-10 cursor-zoom-out"
      >
        <button className="absolute top-10 right-10 text-white/40 hover:text-white transition-all">
           <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
        </button>
        <motion.img 
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          src={fullScreenImage} 
          className="max-w-full max-h-full object-contain shadow-2xl"
          onClick={(e) => e.stopPropagation()}
        />
      </motion.div>
    </AnimatePresence>
  );
}
