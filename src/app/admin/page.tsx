"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

interface ISubscriber {
  _id: string;
  fullName: string;
  email: string;
  brandName?: string;
  plan: string;
  status: string;
  createdAt: string;
}

interface IDesigner {
  _id: string;
  name: string;
  specialty: string;
  tier: string;
  location: string;
  image: string;
}

interface IEvent {
  _id: string;
  title: string;
  date: string;
  location: string;
  status: string;
  type: string;
  price: string;
  image: string;
}

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<'subscribers' | 'designers' | 'events'>('subscribers');
  const [subscribers, setSubscribers] = useState<ISubscriber[]>([]);
  const [designers, setDesigners] = useState<IDesigner[]>([]);
  const [events, setEvents] = useState<IEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const router = useRouter();

  // Form State for Adding
  const [newDesigner, setNewDesigner] = useState({ name: '', specialty: '', tier: 'Premium', location: '', image: '/runway-red.jpg' });
  const [newEvent, setNewEvent] = useState({ title: '', date: '', location: '', type: 'Fashion Show', price: 'From £50', status: 'Applications Open', image: '/vvip-event.jpg' });

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  const fetchData = async () => {
    setLoading(true);
    const endpoint = activeTab === 'subscribers' ? '/api/admin/subscribers' : 
                     activeTab === 'designers' ? '/api/admin/designers' : '/api/admin/events';
    
    try {
      const res = await fetch(endpoint);
      const data = await res.json();
      if (data.success) {
        if (activeTab === 'subscribers') setSubscribers(data.subscribers);
        if (activeTab === 'designers') setDesigners(data.designers);
        if (activeTab === 'events') setEvents(data.events);
      }
    } catch (err) {
      console.error("Fetch failed", err);
    }
    setLoading(false);
  };

  const handleSeed = async () => {
    try {
      const res = await fetch('/api/admin/seed', { method: 'POST' });
      const data = await res.json();
      if (data.success) {
        fetchData();
      } else {
        console.error('Seed failed:', data.error);
      }
    } catch (err) {
      console.error('Seed error', err);
    }
  };

  const handleLogout = async () => {
    await fetch("/api/logout", { method: "POST" });
    router.push("/login");
  };

  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const endpoint = activeTab === 'designers' ? '/api/admin/designers' : '/api/admin/events';
    const body = activeTab === 'designers' ? newDesigner : newEvent;

    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });
      if (res.ok) {
        setShowAddForm(false);
        fetchData();
      }
    } catch (err) {
      console.error("Add failed", err);
    }
  };

  return (
    <div className="min-h-screen bg-[#FDFBF7] dark:bg-[#0A0A0A] py-12 px-6">
      <div className="container mx-auto max-w-7xl">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6">
          <div>
            <h1 className="text-primary-gold font-bold uppercase tracking-[0.4em] text-[10px] mb-2">Management Suite</h1>
            <h2 className="text-4xl font-serif font-bold text-luxury-black dark:text-white uppercase tracking-tighter">Pakistani Passion Hub</h2>
          </div>
          <div className="flex gap-4">
            <button 
              onClick={handleSeed}
              className="text-[10px] font-bold uppercase tracking-widest border border-primary-gold/30 text-primary-gold px-8 py-3 hover:bg-primary-gold hover:text-luxury-black transition-all"
            >
              Seed Initial Collective
            </button>
            <button onClick={handleLogout} className="text-[10px] font-bold uppercase tracking-widest border border-luxury-black/10 dark:border-white/10 px-8 py-3 hover:bg-red-500 hover:text-white transition-all">
              Secure Sign Out
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex gap-8 border-b border-luxury-black/5 dark:border-white/5 mb-12 overflow-x-auto">
          {[
            { id: 'subscribers', label: 'Applications', count: subscribers.length },
            { id: 'designers', label: 'Designer Collective', count: designers.length },
            { id: 'events', label: 'Global Events', count: events.length }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => { setActiveTab(tab.id as any); setShowAddForm(false); }}
              className={`pb-4 text-[11px] font-bold uppercase tracking-[0.3em] transition-all relative whitespace-nowrap ${
                activeTab === tab.id ? 'text-primary-gold' : 'text-luxury-black/40 dark:text-white/40'
              }`}
            >
              {tab.label} ({tab.count})
              {activeTab === tab.id && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-primary-gold"></div>}
            </button>
          ))}
        </div>

        {showAddForm && (
          <div className="mb-12 bg-white dark:bg-white/5 p-10 border border-primary-gold/20 shadow-2xl animate-in fade-in slide-in-from-top-4 duration-500">
            <h3 className="text-xl font-serif font-bold mb-8 italic text-primary-gold">Add New {activeTab === 'designers' ? 'Designer' : 'Event'}</h3>
            <form onSubmit={handleAddSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {activeTab === 'designers' ? (
                <>
                  <input type="text" placeholder="Designer Name" required className="bg-transparent border-b border-white/10 py-4 focus:outline-none focus:border-primary-gold" value={newDesigner.name} onChange={(e) => setNewDesigner({...newDesigner, name: e.target.value})} />
                  <input type="text" placeholder="Specialty" required className="bg-transparent border-b border-white/10 py-4 focus:outline-none focus:border-primary-gold" value={newDesigner.specialty} onChange={(e) => setNewDesigner({...newDesigner, specialty: e.target.value})} />
                  <input type="text" placeholder="Location" required className="bg-transparent border-b border-white/10 py-4 focus:outline-none focus:border-primary-gold" value={newDesigner.location} onChange={(e) => setNewDesigner({...newDesigner, location: e.target.value})} />
                  <select className="bg-transparent border-b border-white/10 py-4 focus:outline-none focus:border-primary-gold text-white/40" value={newDesigner.tier} onChange={(e) => setNewDesigner({...newDesigner, tier: e.target.value})}>
                    <option value="Basic" className="bg-luxury-black">Basic Tier</option>
                    <option value="Premium" className="bg-luxury-black">Premium Tier</option>
                    <option value="Elite" className="bg-luxury-black">Elite Tier</option>
                  </select>
                </>
              ) : (
                <>
                  <input type="text" placeholder="Event Title" required className="bg-transparent border-b border-white/10 py-4 focus:outline-none focus:border-primary-gold" value={newEvent.title} onChange={(e) => setNewEvent({...newEvent, title: e.target.value})} />
                  <input type="text" placeholder="Date (e.g. June 15, 2026)" required className="bg-transparent border-b border-white/10 py-4 focus:outline-none focus:border-primary-gold" value={newEvent.date} onChange={(e) => setNewEvent({...newEvent, date: e.target.value})} />
                  <input type="text" placeholder="Location" required className="bg-transparent border-b border-white/10 py-4 focus:outline-none focus:border-primary-gold" value={newEvent.location} onChange={(e) => setNewEvent({...newEvent, location: e.target.value})} />
                  <input type="text" placeholder="Price (e.g. From £50)" required className="bg-transparent border-b border-white/10 py-4 focus:outline-none focus:border-primary-gold" value={newEvent.price} onChange={(e) => setNewEvent({...newEvent, price: e.target.value})} />
                </>
              )}
              <div className="md:col-span-2 flex gap-4 mt-4">
                <button type="submit" className="bg-primary-gold text-luxury-black font-bold py-4 px-12 uppercase tracking-widest text-[10px]">Save Record</button>
                <button type="button" onClick={() => setShowAddForm(false)} className="border border-white/10 px-12 py-4 uppercase tracking-widest text-[10px]">Cancel</button>
              </div>
            </form>
          </div>
        )}

        {/* Content Area */}
        <div className="bg-white dark:bg-white/5 shadow-2xl border border-luxury-black/5 dark:border-white/5 min-h-[400px]">
          {loading ? (
            <div className="flex flex-col items-center justify-center h-full py-32">
              <div className="w-8 h-8 border-2 border-primary-gold border-t-transparent rounded-full animate-spin mb-4"></div>
              <p className="text-[10px] uppercase tracking-widest opacity-40">Syncing Registry...</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-luxury-black/5 dark:border-white/5 bg-gray-50/50 dark:bg-white/[0.02]">
                    <th className="py-6 px-8 text-[9px] font-black uppercase tracking-widest opacity-40">Detail</th>
                    <th className="py-6 px-8 text-[9px] font-black uppercase tracking-widest opacity-40">Location / Info</th>
                    <th className="py-6 px-8 text-[9px] font-black uppercase tracking-widest opacity-40">Status / Tier</th>
                    <th className="py-6 px-8 text-right text-[9px] font-black uppercase tracking-widest opacity-40">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-luxury-black/5 dark:divide-white/5">
                  {activeTab === 'subscribers' && subscribers.map((sub) => (
                    <tr key={sub._id} className="hover:bg-primary-gold/[0.02] transition-colors">
                      <td className="py-8 px-8">
                        <p className="text-sm font-bold text-luxury-black dark:text-white">{sub.fullName}</p>
                        <p className="text-[10px] uppercase tracking-widest opacity-40 font-bold">{sub.brandName || "Individual"}</p>
                      </td>
                      <td className="py-8 px-8"><p className="text-xs">{sub.email}</p></td>
                      <td className="py-8 px-8">
                        <span className={`text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded-sm ${sub.plan === 'Elite' ? 'bg-secondary-emerald text-white' : 'bg-primary-gold text-luxury-black'}`}>{sub.plan}</span>
                      </td>
                      <td className="py-8 px-8 text-right font-bold text-[10px] uppercase tracking-widest text-primary-gold italic">{sub.status}</td>
                    </tr>
                  ))}

                  {activeTab === 'designers' && designers.map((des) => (
                    <tr key={des._id} className="hover:bg-primary-gold/[0.02] transition-colors">
                      <td className="py-8 px-8">
                        <p className="text-sm font-bold text-luxury-black dark:text-white">{des.name}</p>
                        <p className="text-[10px] uppercase tracking-widest opacity-40 font-bold">{des.specialty}</p>
                      </td>
                      <td className="py-8 px-8"><p className="text-xs uppercase tracking-widest">{des.location}</p></td>
                      <td className="py-8 px-8"><span className="text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded-sm bg-primary-gold text-luxury-black">{des.tier}</span></td>
                      <td className="py-8 px-8 text-right"><button className="text-[10px] font-bold uppercase tracking-widest text-red-500 opacity-40 hover:opacity-100 transition-opacity">Remove</button></td>
                    </tr>
                  ))}

                  {activeTab === 'events' && events.map((ev) => (
                    <tr key={ev._id} className="hover:bg-primary-gold/[0.02] transition-colors">
                      <td className="py-8 px-8">
                        <p className="text-sm font-bold text-luxury-black dark:text-white">{ev.title}</p>
                        <p className="text-[10px] uppercase tracking-widest opacity-40 font-bold">{ev.date}</p>
                      </td>
                      <td className="py-8 px-8"><p className="text-xs uppercase tracking-widest">{ev.location}</p></td>
                      <td className="py-8 px-8"><span className="text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded-sm bg-secondary-emerald text-white">{ev.status}</span></td>
                      <td className="py-8 px-8 text-right"><button className="text-[10px] font-bold uppercase tracking-widest text-red-500 opacity-40 hover:opacity-100 transition-opacity">Cancel</button></td>
                    </tr>
                  ))}

                  {((activeTab === 'subscribers' && subscribers.length === 0) || 
                    (activeTab === 'designers' && designers.length === 0) || 
                    (activeTab === 'events' && events.length === 0)) && (
                    <tr>
                      <td colSpan={4} className="py-32 text-center text-[10px] uppercase tracking-widest opacity-30">No records found.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Action Bar */}
        {activeTab !== 'subscribers' && (
          <div className="mt-12 flex justify-between items-center bg-luxury-black text-white p-8 border border-white/5 shadow-2xl">
            <div>
              <h4 className="text-[10px] font-bold uppercase tracking-[0.4em] text-primary-gold mb-1">Registry Actions</h4>
              <p className="text-xs opacity-60">Manage your global presence and event calendar.</p>
            </div>
            <button onClick={() => setShowAddForm(true)} className="bg-primary-gold text-luxury-black text-[10px] font-bold uppercase tracking-widest px-10 py-4 hover:scale-105 transition-all">
              Add New {activeTab === 'events' ? 'Event' : 'Designer'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
