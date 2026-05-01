"use client";

import { motion, AnimatePresence } from "framer-motion";

interface AdminFormOverlayProps {
  showAddForm: boolean;
  setShowAddForm: (val: boolean) => void;
  activeTab: string;
  editMode: string | null;
  newDesigner: any;
  setNewDesigner: (val: any) => void;
  newEvent: any;
  setNewEvent: (val: any) => void;
  onSubmit: (e: React.FormEvent) => void;
}

export default function AdminFormOverlay({ 
  showAddForm, 
  setShowAddForm, 
  activeTab, 
  editMode, 
  newDesigner, 
  setNewDesigner, 
  newEvent, 
  setNewEvent, 
  onSubmit 
}: AdminFormOverlayProps) {
  if (!showAddForm) return null;

  return (
    <AnimatePresence>
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] bg-luxury-black/95 backdrop-blur-2xl flex items-center justify-center p-6"
      >
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-white/[0.03] border border-white/10 p-16 max-w-2xl w-full relative"
        >
          <button onClick={() => setShowAddForm(false)} className="absolute top-8 right-8 text-white/40 hover:text-white transition-colors">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
          </button>

          <h3 className="text-3xl font-serif font-bold text-white mb-10 italic">{editMode ? 'Refine Record' : `Initialize ${activeTab.slice(0, -1)}`}</h3>
          
          <form onSubmit={onSubmit} className="space-y-8">
            {activeTab === 'designers' ? (
              <div className="space-y-6">
                <input type="text" placeholder="Full Name (e.g. Alexander McQueen)" required className="admin-input" value={newDesigner.name} onChange={(e) => setNewDesigner({...newDesigner, name: e.target.value})} />
                <input type="text" placeholder="Artistic Specialty (e.g. Avant-Garde Couture)" required className="admin-input" value={newDesigner.specialty} onChange={(e) => setNewDesigner({...newDesigner, specialty: e.target.value})} />
                <select className="admin-input" value={newDesigner.tier} onChange={(e) => setNewDesigner({...newDesigner, tier: e.target.value})}>
                  <option value="Premium">Premium Tier</option>
                  <option value="Elite">Elite Collective</option>
                  <option value="Legacy">Legacy Status</option>
                </select>
                <input type="text" placeholder="Operational Base (e.g. Milan, Italy)" required className="admin-input" value={newDesigner.location} onChange={(e) => setNewDesigner({...newDesigner, location: e.target.value})} />
                
                <div className="space-y-4 pt-4">
                  <label className="text-[10px] uppercase tracking-widest text-white/30 font-bold">Profile Portrait</label>
                  <div className="flex items-center gap-6">
                    <div className="w-20 h-20 rounded-full bg-white/5 border border-white/10 overflow-hidden flex items-center justify-center">
                      {newDesigner.image ? <img src={newDesigner.image} className="w-full h-full object-cover" /> : <svg className="w-8 h-8 text-white/10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>}
                    </div>
                    <input type="file" accept="image/*" onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        const reader = new FileReader();
                        reader.onloadend = () => setNewDesigner({...newDesigner, image: reader.result as string});
                        reader.readAsDataURL(file);
                      }
                    }} className="text-[10px] text-white/40 file:bg-white/5 file:border-none file:text-white file:px-4 file:py-2 file:text-[9px] file:uppercase file:tracking-widest hover:file:bg-white/10 cursor-pointer" />
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                <input type="text" placeholder="Event Title (e.g. Paris Fashion Week 2024)" required className="admin-input" value={newEvent.title} onChange={(e) => setNewEvent({...newEvent, title: e.target.value})} />
                <input type="text" placeholder="Show Type (e.g. Seasonal Showcase / Digital Runway)" required className="admin-input" value={newEvent.type} onChange={(e) => setNewEvent({...newEvent, type: e.target.value})} />
                
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[9px] uppercase tracking-widest text-white/30 font-bold">Commencement Date</label>
                    <input type="date" required className="admin-input" value={newEvent.startDate} onChange={(e) => setNewEvent({...newEvent, startDate: e.target.value})} />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[9px] uppercase tracking-widest text-white/30 font-bold">Conclusion Date</label>
                    <input type="date" required className="admin-input" value={newEvent.endDate} onChange={(e) => setNewEvent({...newEvent, endDate: e.target.value})} />
                  </div>

                  <input type="text" placeholder="Venue Location (e.g. Royal Albert Hall, London)" required className="admin-input" value={newEvent.location} onChange={(e) => setNewEvent({...newEvent, location: e.target.value})} />
                  <input type="text" placeholder="Status (e.g. Applications Open)" required className="admin-input" value={newEvent.status} onChange={(e) => setNewEvent({...newEvent, status: e.target.value})} />
                  
                  <div className="col-span-2 space-y-4 pt-4">
                    <label className="text-[10px] uppercase tracking-widest text-white/30 font-bold">Featured Event Banner</label>
                    <div className="flex items-center gap-6">
                      <div className="w-32 h-20 bg-white/5 border border-white/10 rounded-sm overflow-hidden flex items-center justify-center">
                        {newEvent.image ? <img src={newEvent.image} className="w-full h-full object-cover" /> : <svg className="w-8 h-8 text-white/10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>}
                      </div>
                      <input type="file" accept="image/*" onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const reader = new FileReader();
                          reader.onloadend = () => setNewEvent({...newEvent, image: reader.result as string});
                          reader.readAsDataURL(file);
                        }
                      }} className="text-[10px] text-white/40 file:bg-white/5 file:border-none file:text-white file:px-4 file:py-2 file:text-[9px] file:uppercase file:tracking-widest hover:file:bg-white/10 cursor-pointer" />
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            <button type="submit" className="w-full brand-gradient py-6 text-[10px] font-black uppercase tracking-[0.4em] shadow-3xl hover:scale-[1.02] transition-all">
              {editMode ? 'Save Modifications' : 'Commit Record to Registry'}
            </button>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
