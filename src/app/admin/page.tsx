"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import toast, { Toaster } from 'react-hot-toast';

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
  startDate: string;
  endDate: string;
  location: string;
  status: string;
  type: string;
  price: string;
  image: string;
}

interface IBlog {
  _id: string;
  title: string;
  excerpt: string;
  author: string;
  createdAt: string;
  image: string;
}

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<'newsletter' | 'membership' | 'kyc' | 'eventApps' | 'designers' | 'payments' | 'events' | 'blogs' | 'plans'>('newsletter');
  const [subscribers, setSubscribers] = useState<ISubscriber[]>([]);
  const [designers, setDesigners] = useState<IDesigner[]>([]);
  const [events, setEvents] = useState<IEvent[]>([]);
  const [blogs, setBlogs] = useState<IBlog[]>([]);
  const [kycApps, setKycApps] = useState<any[]>([]);
  const [eventApps, setEventApps] = useState<any[]>([]);
  const [plans, setPlans] = useState<any[]>([]);
  const [payments, setPayments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedKYC, setSelectedKYC] = useState<any>(null);
  const [fullScreenImage, setFullScreenImage] = useState<string | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<{ id: string, type: string } | null>(null);
  const [showFeedbackModal, setShowFeedbackModal] = useState<{ id: string, type: 'kyc' | 'eventApp' } | null>(null);
  const [feedbackText, setFeedbackText] = useState("");
  const [editMode, setEditMode] = useState<string | null>(null);
  const router = useRouter();

  const [newDesigner, setNewDesigner] = useState({ name: '', specialty: '', tier: 'Premium', location: '', image: '' });
  const [newEvent, setNewEvent] = useState({ title: '', startDate: '', endDate: '', location: '', type: '', price: '', status: 'Applications Open', image: '' });
  const [newPlan, setNewPlan] = useState({ name: '', price: '', currency: '£', interval: 'monthly', description: '', features: '', isPopular: false });
  const [newBlog, setNewBlog] = useState({ title: '', excerpt: '', content: '', author: '', image: '' });

  useEffect(() => {
    const checkAdmin = async () => {
      const res = await fetch("/api/auth/status");
      const data = await res.json();
      if (!data.isLoggedIn || data.role !== 'ADMIN') {
        router.push("/login");
      } else {
        fetchData();
      }
    };
    checkAdmin();
  }, [activeTab]);

  const fetchData = async () => {
    setLoading(true);
    const endpoint = activeTab === 'newsletter' ? '/api/admin/subscribers?type=Newsletter' :
      activeTab === 'membership' ? '/api/admin/subscribers?type=Member' :
        activeTab === 'designers' ? '/api/admin/designers' :
          activeTab === 'kyc' ? '/api/admin/kyc' :
            activeTab === 'eventApps' ? '/api/admin/event-applications' :
              activeTab === 'plans' ? '/api/admin/plans' : 
                activeTab === 'payments' ? '/api/payment' : 
                  activeTab === 'blogs' ? '/api/admin/blogs' : '/api/admin/events';

    try {
      const res = await fetch(endpoint);
      const data = await res.json();
      if (data.success) {
        if (activeTab === 'newsletter' || activeTab === 'membership') setSubscribers(data.subscribers || []);
        if (activeTab === 'designers') setDesigners(data.designers || []);
        if (activeTab === 'events') setEvents(data.events || []);
        if (activeTab === 'blogs') setBlogs(data.blogs || []);
        if (activeTab === 'kyc') setKycApps(data.applications || []);
        if (activeTab === 'eventApps') setEventApps(data.applications || []);
        if (activeTab === 'plans') setPlans(data.plans || []);
        if (activeTab === 'payments') setPayments(data.transactions || []);
      }
    } catch (err) {
      console.error("Fetch failed", err);
    }
    setLoading(false);
  };

  const handleSeed = async () => {
    const t = toast.loading("Seeding collective...");
    try {
      const res = await fetch('/api/admin/seed', { method: 'POST' });
      const data = await res.json();
      if (data.success) {
        toast.success("Collective database initialized", { id: t });
        fetchData();
      } else {
        toast.error(`Seed failed: ${data.error}`, { id: t });
      }
    } catch (err) {
      toast.error("Seed error occurred", { id: t });
    }
  };

  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const endpoint = activeTab === 'designers' ? '/api/admin/designers' : 
                     activeTab === 'events' ? '/api/admin/events' : 
                     activeTab === 'blogs' ? '/api/admin/blogs' : '/api/admin/plans';
    
    const bodyData = activeTab === 'designers' ? 
      (editMode ? { ...newDesigner, id: editMode } : newDesigner) : 
      activeTab === 'events' ? 
      (editMode ? { ...newEvent, id: editMode } : newEvent) :
      activeTab === 'blogs' ?
      (editMode ? { ...newBlog, id: editMode } : newBlog) :
      (editMode ? { ...newPlan, id: editMode, features: typeof newPlan.features === 'string' ? newPlan.features.split(',').map(f => f.trim()) : newPlan.features } : { ...newPlan, features: typeof newPlan.features === 'string' ? newPlan.features.split(',').map(f => f.trim()) : newPlan.features });

    const method = editMode ? 'PUT' : 'POST';

    const t = toast.loading(editMode ? "Updating record..." : "Creating record...");
    try {
      const res = await fetch(endpoint, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bodyData)
      });
      if (res.ok) {
        toast.success(editMode ? "Record updated successfully" : "New record initialized", { id: t });
        setShowAddForm(false);
        setEditMode(null);
        // Reset all forms
        setNewDesigner({ name: '', specialty: '', tier: 'Premium', location: '', image: '' });
        setNewEvent({ title: '', startDate: '', endDate: '', location: '', type: '', price: '', status: 'Applications Open', image: '' });
        setNewPlan({ name: '', price: '', currency: '£', interval: 'monthly', description: '', features: '', isPopular: false });
        setNewBlog({ title: '', excerpt: '', content: '', author: '', image: '' });
        fetchData();
      } else {
        toast.error("Failed to save record", { id: t });
      }
    } catch (err) {
      toast.error("Network error occurred", { id: t });
    }
  };

  const executeDelete = async () => {
    if (!showDeleteConfirm) return;
    const { id, type } = showDeleteConfirm;
    const endpoint = type === 'designers' ? `/api/admin/designers?id=${id}` : 
                     type === 'events' ? `/api/admin/events?id=${id}` :
                     type === 'blogs' ? `/api/admin/blogs?id=${id}` :
                     `/api/admin/plans?id=${id}`;

    const t = toast.loading("De-registering...");
    try {
      const res = await fetch(endpoint, { method: 'DELETE' });
      if (res.ok) {
        toast.success("Record successfully purged", { id: t });
        setShowDeleteConfirm(null);
        fetchData();
      } else {
        toast.error("Purge failed", { id: t });
      }
    } catch (err) {
      toast.error("Deletion error", { id: t });
    }
  };

  const openEdit = (item: any) => {
    setEditMode(item._id);
    if (activeTab === 'designers') {
      setNewDesigner({ name: item.name, specialty: item.specialty, tier: item.tier, location: item.location, image: item.image });
    } else if (activeTab === 'events') {
      setNewEvent({ title: item.title, startDate: item.startDate, endDate: item.endDate, location: item.location, type: item.type, price: item.price, status: item.status, image: item.image });
    } else if (activeTab === 'blogs') {
      setNewBlog({ title: item.title, excerpt: item.excerpt, content: item.content, author: item.author, image: item.image });
    } else {
      setNewPlan({ name: item.name, price: item.price, currency: item.currency || '£', interval: item.interval, description: item.description, features: item.features.join(', '), isPopular: item.isPopular });
    }
    setShowAddForm(true);
  };

  return (
    <div className="min-h-screen bg-luxury-black text-white py-12 px-6 overflow-hidden relative">
      <Toaster position="top-right" toastOptions={{ style: { background: '#0A0A0A', color: '#fff', border: '1px solid rgba(232, 209, 150, 0.2)', fontSize: '12px', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.1em' } }} />

      {/* Abstract Background Decoration */}
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-primary-gold/5 blur-[150px] -mr-96 -mt-96 pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-secondary-emerald/5 blur-[150px] -ml-64 -mb-64 pointer-events-none"></div>

      <div className="container mx-auto max-w-7xl relative z-10">
        {/* Header Section */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-16 gap-8">
          <div>
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
              <h1 className="text-primary-gold font-bold uppercase tracking-[0.6em] text-[10px] mb-4">Command Center</h1>
              <h2 className="text-5xl font-serif font-bold tracking-tighter uppercase leading-[0.85]">Registry <br />Management</h2>
            </motion.div>
          </div>
          <div className="flex items-center gap-6">
            <div className="text-right">
              <p className="text-[10px] uppercase tracking-widest text-white/30 font-bold mb-1">System Status</p>
              <div className="flex items-center gap-2 justify-end">
                <div className="w-2 h-2 rounded-full bg-secondary-emerald animate-pulse shadow-[0_0_10px_#00FF9D]"></div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-secondary-emerald">Operational</p>
              </div>
            </div>
          </div>
        </header>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-16">
          {[
            { label: 'Pending KYC', val: kycApps.length, color: 'text-primary-gold' },
            { id: 'revenue', label: 'Global Revenue', val: `£${payments.reduce((acc, curr) => acc + (parseFloat(curr.amount?.replace(/\D/g, '') || '0')), 0)}`, color: 'text-secondary-emerald' },
            { label: 'Applications', val: eventApps.length, color: 'text-white' },
            { label: 'Active Members', val: designers.length + subscribers.length, color: 'text-white/40' },
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-white/[0.02] border border-white/5 p-8 rounded-sm hover:border-white/10 transition-colors"
            >
              <p className="text-[10px] uppercase tracking-widest font-bold opacity-30 mb-4">{stat.label}</p>
              <p className={`text-4xl font-serif font-bold ${stat.color}`}>{stat.val}</p>
            </motion.div>
          ))}
        </div>

        {/* Navigation Sidebar Layout */}
        <div className="flex flex-col lg:flex-row gap-12">
          {/* Tabs Menu */}
          <div className="lg:w-64 flex flex-col gap-2">
            {[
              { id: 'newsletter', label: 'Newsletter', icon: 'M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z' },
              { id: 'kyc', label: 'KYC Queue', icon: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z' },
              { id: 'eventApps', label: 'Event Apps', icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01' },
              { id: 'membership', label: 'Membership', icon: 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z' },
              { id: 'designers', label: 'Designers', icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z' },
              { id: 'payments', label: 'Payments', icon: 'M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z' },
              { id: 'events', label: 'Global Events', icon: 'M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z M15 11a3 3 0 11-6 0 3 3 0 016 0z' },
              { id: 'blogs', label: 'Journal / Blog', icon: 'M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z' },
              { id: 'plans', label: 'Membership Plans Registry', icon: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-4 px-6 py-5 text-[10px] font-black uppercase tracking-[0.2em] transition-all border-l-2 ${activeTab === tab.id
                  ? 'bg-primary-gold/10 border-primary-gold text-primary-gold'
                  : 'bg-transparent border-transparent text-white/30 hover:bg-white/5 hover:text-white'
                  }`}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d={tab.icon} /></svg>
                {tab.label}
              </button>
            ))}
          </div>

          {/* Table Content */}
          <div className="flex-1 bg-white/[0.01] border border-white/5 min-h-[600px] overflow-hidden flex flex-col">
            {/* Contextual Action Bar */}
            {(activeTab === 'events' || activeTab === 'plans' || activeTab === 'designers' || activeTab === 'blogs' || activeTab === 'membership') && (
              <div className="p-8 border-b border-white/5 flex justify-between items-center bg-white/[0.02]">
                <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-white/20">
                  {activeTab === 'events' ? 'Global Events Registry' : 
                   activeTab === 'plans' ? 'Membership Plans Registry' : 
                   activeTab === 'designers' ? 'Designer Collective Registry' : 
                   activeTab === 'membership' ? 'Active Membership Registry' :
                   'Journal & Blog Registry'}
                </h4>
                <button
                  onClick={() => { 
                    if (activeTab === 'membership') {
                      setActiveTab('plans');
                    } else {
                      setEditMode(null); 
                      setShowAddForm(true); 
                    }
                  }}
                  className="bg-primary-gold text-luxury-black px-6 py-3 text-[9px] font-black uppercase tracking-widest hover:scale-105 transition-all shadow-[0_0_20px_rgba(232,209,150,0.2)]"
                >
                  {activeTab === 'events' ? 'Add New Event' : 
                   activeTab === 'plans' ? 'Create New Plan' : 
                   activeTab === 'designers' ? 'Add New Designer' : 
                   activeTab === 'membership' ? 'Manage Membership Plans' :
                   'Publish New Post'}
                </button>
              </div>
            )}

            {loading ? (
              <div className="flex-1 flex flex-col items-center justify-center">
                <div className="w-12 h-12 border-2 border-primary-gold border-t-transparent rounded-full animate-spin mb-6 shadow-[0_0_20px_#E8D196]"></div>
                <p className="text-[10px] uppercase tracking-[0.4em] font-bold text-white/20">Accessing Cloud Registry</p>
              </div>
            ) : (
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="overflow-x-auto"
                >
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-white/[0.03] border-b border-white/10">
                        <th className="py-8 px-10 text-[9px] font-black uppercase tracking-widest text-white/40">
                          {activeTab === 'newsletter' ? 'Subscriber' :
                            activeTab === 'membership' ? 'Member / Brand' :
                              activeTab === 'kyc' ? 'Designer / Business' :
                                activeTab === 'eventApps' ? 'Designer / Event' :
                                  activeTab === 'plans' ? 'Plan Name / Interval' :
                                    activeTab === 'payments' ? 'Designer / User' :
                                      activeTab === 'designers' ? 'Designer / Location' : 
                                        activeTab === 'blogs' ? 'Post Title / Author' : 'Event / Type'}
                        </th>
                        <th className="py-8 px-10 text-[9px] font-black uppercase tracking-widest text-white/40">
                          {activeTab === 'newsletter' ? 'Contact Email' :
                            activeTab === 'membership' ? 'Plan / Details' :
                              activeTab === 'kyc' ? 'Credentials / Docs' :
                                activeTab === 'eventApps' ? 'Schedule / Contact' :
                                  activeTab === 'plans' ? 'Pricing / Description' :
                                    activeTab === 'payments' ? 'Transaction / ID' :
                                      activeTab === 'designers' ? 'Specialty / Tier' : 
                                        activeTab === 'blogs' ? 'Date / Excerpt' : 'Date / Venue'}
                        </th>
                        <th className="py-8 px-10 text-[9px] font-black uppercase tracking-widest text-white/40">
                          {activeTab === 'subscribers' ? 'Tier Status' :
                            activeTab === 'events' ? 'Event Status' : 
                             activeTab === 'plans' ? 'Visibility' : 
                               activeTab === 'payments' ? 'Amount / Method' : 
                                 activeTab === 'designers' ? 'Account Profile' : 
                                   activeTab === 'blogs' ? 'Status' : 'Approval Status'}
                        </th>
                        <th className="py-8 px-10 text-right text-[9px] font-black uppercase tracking-widest text-white/40">Management</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {/* Newsletter & Membership Render */}
                      {(activeTab === 'newsletter' || activeTab === 'membership') && subscribers.map((sub) => (
                        <tr key={sub._id} className="group hover:bg-white/[0.02] transition-colors">
                          <td className="py-10 px-10">
                            <p className="text-sm font-bold text-white mb-1">{sub.fullName}</p>
                            <p className="text-[10px] uppercase tracking-widest text-primary-gold/40 font-bold italic">{sub.brandName || (sub.type === 'Newsletter' ? "Public Subscriber" : "Individual Member")}</p>
                          </td>
                          <td className="py-10 px-10"><p className="text-xs text-white/60">{sub.email}</p></td>
                          <td className="py-10 px-10">
                            <span className={`text-[9px] font-black uppercase tracking-widest px-4 py-1.5 rounded-full ${sub.plan === 'Elite' ? 'bg-secondary-emerald/20 text-secondary-emerald' : 'bg-primary-gold/10 text-primary-gold'}`}>{sub.plan}</span>
                          </td>
                          <td className="py-10 px-10 text-right">
                            <div className="flex justify-end gap-2 transition-opacity">
                              <button onClick={() => setShowDeleteConfirm({ id: sub._id, type: 'subscribers' })} className="p-3 bg-white/5 border border-white/10 text-white hover:bg-red-500 hover:text-white transition-all"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg></button>
                            </div>
                          </td>
                        </tr>
                      ))}

                      {/* KYC Queue Render */}
                      {activeTab === 'kyc' && kycApps.map((app) => (
                        <tr key={app._id} className="group hover:bg-white/[0.02] transition-colors">
                          <td className="py-10 px-10">
                            <p className="text-sm font-bold text-white mb-1">{app.name}</p>
                            <p className="text-[10px] uppercase tracking-widest text-primary-gold/60 font-bold">{app.kycData?.businessName}</p>
                          </td>
                          <td className="py-10 px-10">
                            <p className="text-xs text-white/60 font-medium italic">{app.email}</p>
                          </td>
                          <td className="py-10 px-10">
                            <span className={`text-[9px] font-black uppercase tracking-widest px-4 py-1.5 rounded-full border ${
                              app.kycStatus === 'APPROVED' ? 'bg-secondary-emerald/20 text-secondary-emerald border-secondary-emerald/20' :
                              app.kycStatus === 'REJECTED' ? 'bg-red-500/20 text-red-500 border-red-500/20' :
                              'bg-primary-gold/10 text-primary-gold border-primary-gold/20'
                            }`}>{app.kycStatus}</span>
                          </td>
                          <td className="py-10 px-10 text-right">
                            <div className="flex justify-end gap-2 transition-opacity">
                              <button onClick={() => setSelectedKYC(app)} className="p-3 bg-white/5 border border-white/10 text-white hover:border-primary-gold hover:text-primary-gold transition-all" title="View Full Details">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                </svg>
                              </button>
                              
                              {app.kycStatus === 'PENDING' && (
                                <>
                                  <button onClick={() => updateKYC(app._id, 'APPROVED')} className="p-3 bg-secondary-emerald/20 text-secondary-emerald hover:bg-secondary-emerald hover:text-white transition-all" title="Approve">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                    </svg>
                                  </button>
                                  <button onClick={() => updateKYC(app._id, 'REJECTED')} className="p-3 bg-red-500/20 text-red-500 hover:bg-red-500 hover:text-white transition-all" title="Reject">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                  </button>
                                </>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}

                      {/* Event Apps Render */}
                      {activeTab === 'eventApps' && eventApps.map((app) => (
                        <tr key={app._id} className="group hover:bg-white/[0.02] transition-colors">
                          <td className="py-10 px-10">
                            <p className="text-sm font-bold text-white mb-1">{app.designer?.name}</p>
                            <p className="text-[10px] uppercase tracking-widest text-primary-gold/60 font-bold italic">{app.event?.title}</p>
                          </td>
                          <td className="py-10 px-10">
                            <p className="text-xs text-white/40 mb-1">{app.designer?.email}</p>
                            <p className="text-[9px] font-bold uppercase text-white/20">{app.event?.date}</p>
                          </td>
                          <td className="py-10 px-10">
                            <span className={`text-[9px] font-black uppercase tracking-widest px-4 py-1.5 rounded-full border ${
                              app.status === 'APPROVED' ? 'bg-secondary-emerald/20 text-secondary-emerald border-secondary-emerald/20' :
                              app.status === 'REJECTED' ? 'bg-red-500/20 text-red-500 border-red-500/20' :
                              'bg-white/10 text-white/40 border-white/5'
                            }`}>{app.status}</span>
                          </td>
                          <td className="py-10 px-10 text-right">
                            <div className="flex justify-end gap-2 transition-opacity">
                              {app.status === 'PENDING' ? (
                                <>
                                  <button onClick={() => updateEventApp(app._id, 'APPROVED')} className="text-[9px] font-black uppercase bg-white/5 border border-white/10 px-4 py-2 hover:bg-primary-gold hover:text-luxury-black transition-all">Approve</button>
                                  <button onClick={() => updateEventApp(app._id, 'REJECTED')} className="text-[9px] font-black uppercase text-red-500 px-4 py-2 hover:bg-red-500 hover:text-white transition-all">Decline</button>
                                </>
                              ) : (
                                <span className="text-[9px] font-black uppercase text-white/20 tracking-widest px-4 py-2 italic">Processed</span>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}

                      {/* Membership Plans Render */}
                      {activeTab === 'plans' && plans.map((plan) => (
                        <tr key={plan._id} className="group hover:bg-white/[0.02] transition-colors">
                          <td className="py-10 px-10">
                            <p className="text-sm font-bold text-white mb-1">{plan.name}</p>
                            <p className="text-[10px] uppercase tracking-widest text-primary-gold/40 font-bold italic">{plan.interval}</p>
                          </td>
                          <td className="py-10 px-10">
                            <p className="text-xs text-white/60 mb-1">{plan.currency || '£'}{plan.price}</p>
                            <p className="text-[9px] font-bold uppercase text-white/20 truncate max-w-[200px]">{plan.description}</p>
                          </td>
                          <td className="py-10 px-10">
                            <span className={`text-[9px] font-black uppercase tracking-widest px-4 py-1.5 rounded-full border ${plan.isPopular ? 'bg-primary-gold/20 text-primary-gold border-primary-gold/20' : 'bg-white/10 text-white/40 border-white/5'}`}>{plan.isPopular ? 'Featured' : 'Standard'}</span>
                          </td>
                          <td className="py-10 px-10 text-right">
                            <div className="flex justify-end gap-2 transition-opacity">
                              <button onClick={() => openEdit(plan)} className="p-3 bg-white/5 border border-white/10 text-white hover:border-primary-gold hover:text-primary-gold transition-all"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg></button>
                              <button onClick={() => setShowDeleteConfirm({ id: plan._id, type: 'plans' })} className="p-3 bg-red-500/20 text-red-500 hover:bg-red-500 hover:text-white transition-all"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg></button>
                            </div>
                          </td>
                        </tr>
                      ))}

                      {/* Payment History Render */}
                      {activeTab === 'payments' && payments.map((pay) => (
                        <tr key={pay._id} className="group hover:bg-white/[0.02] transition-colors">
                          <td className="py-10 px-10">
                            <p className="text-sm font-bold text-white mb-1">{pay.userId?.name || 'Guest Designer'}</p>
                            <p className="text-[10px] uppercase tracking-widest text-white/20 font-bold">{pay.userId?.email}</p>
                          </td>
                          <td className="py-10 px-10">
                            <p className="text-xs text-primary-gold font-bold mb-1 tracking-widest">{pay.transactionId}</p>
                            <p className="text-[9px] uppercase text-white/30 font-bold">{new Date(pay.createdAt).toLocaleString()}</p>
                          </td>
                          <td className="py-10 px-10">
                            <div className="flex flex-col">
                              <span className="text-sm font-black text-white">{pay.amount}</span>
                              <span className="text-[9px] uppercase text-secondary-emerald font-bold tracking-widest">{pay.paymentMethod} ••{pay.cardLast4}</span>
                            </div>
                          </td>
                          <td className="py-10 px-10 text-right">
                             <span className="text-[9px] font-black uppercase tracking-[0.3em] text-secondary-emerald bg-secondary-emerald/10 px-4 py-2 rounded-full border border-secondary-emerald/20">Success</span>
                          </td>
                        </tr>
                      ))}

                      {/* Designers Render (Registered Users) */}
                      {activeTab === 'designers' && designers.map((des: any) => (
                        <tr key={des._id} className="group hover:bg-white/[0.02] transition-colors">
                          <td className="py-10 px-10">
                            <p className="text-sm font-bold text-white mb-1">{des.name}</p>
                            <p className="text-[10px] uppercase tracking-widest text-primary-gold/40 font-bold italic">{des.location || des.email}</p>
                          </td>
                          <td className="py-10 px-10">
                            <p className="text-xs text-white/60 mb-1">{des.specialty || 'General'}</p>
                            <p className="text-[9px] font-bold uppercase tracking-widest text-secondary-emerald">
                              {des.tier || 'Premium'} Member
                            </p>
                          </td>
                          <td className="py-10 px-10">
                            <span className={`text-[9px] font-black uppercase tracking-widest px-4 py-1.5 rounded-full border border-secondary-emerald/20 bg-secondary-emerald/20 text-secondary-emerald`}>
                              Active Profile
                            </span>
                          </td>
                          <td className="py-10 px-10 text-right">
                            <div className="flex justify-end gap-2 transition-opacity">
                              <button onClick={() => openEdit(des)} className="p-3 bg-white/5 border border-white/10 text-white hover:border-primary-gold hover:text-primary-gold transition-all"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg></button>
                              <button onClick={() => setShowDeleteConfirm({ id: des._id, type: 'designers' })} className="p-3 bg-red-500/20 text-red-500 hover:bg-red-500 hover:text-white transition-all">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}

                      {/* Events Render */}
                      {activeTab === 'events' && events.map((ev) => (
                        <tr key={ev._id} className="group hover:bg-white/[0.02] transition-colors">
                          <td className="py-10 px-10">
                            <p className="text-sm font-bold text-white mb-1">{ev.title}</p>
                            <p className="text-[10px] uppercase tracking-widest text-primary-gold/40 font-bold italic">{ev.type}</p>
                          </td>
                          <td className="py-10 px-10">
                            <p className="text-xs text-white/60 mb-1">
                              {ev.startDate} — {ev.endDate}
                            </p>
                            <p className="text-[9px] font-bold uppercase text-white/20">{ev.location}</p>
                          </td>
                          <td className="py-10 px-10"><span className="text-[9px] font-black uppercase tracking-widest px-4 py-1.5 rounded-full bg-secondary-emerald/20 text-secondary-emerald border border-secondary-emerald/20">{ev.status}</span></td>
                          <td className="py-10 px-10 text-right">
                            <div className="flex justify-end gap-2 transition-opacity">
                              <button onClick={() => openEdit(ev)} className="p-3 bg-white/5 border border-white/10 text-white hover:border-primary-gold hover:text-primary-gold transition-all"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg></button>
                              <button onClick={() => setShowDeleteConfirm({ id: ev._id, type: 'events' })} className="p-3 bg-red-500/20 text-red-500 hover:bg-red-500 hover:text-white transition-all"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg></button>
                            </div>
                          </td>
                        </tr>
                      ))}

                      {/* Blogs Render */}
                      {activeTab === 'blogs' && blogs.map((blog) => (
                        <tr key={blog._id} className="group hover:bg-white/[0.02] transition-colors">
                          <td className="py-10 px-10">
                            <p className="text-sm font-bold text-white mb-1">{blog.title}</p>
                            <p className="text-[10px] uppercase tracking-widest text-primary-gold/40 font-bold italic">{blog.author}</p>
                          </td>
                          <td className="py-10 px-10">
                            <p className="text-xs text-white/60 mb-1">{new Date(blog.createdAt).toLocaleDateString()}</p>
                            <p className="text-[9px] font-bold uppercase text-white/20 truncate max-w-[200px]">{blog.excerpt}</p>
                          </td>
                          <td className="py-10 px-10"><span className="text-[9px] font-black uppercase tracking-widest px-4 py-1.5 rounded-full bg-secondary-emerald/20 text-secondary-emerald border border-secondary-emerald/20">Published</span></td>
                          <td className="py-10 px-10 text-right">
                            <div className="flex justify-end gap-2 transition-opacity">
                              <button onClick={() => openEdit(blog)} className="p-3 bg-white/5 border border-white/10 text-white hover:border-primary-gold hover:text-primary-gold transition-all"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg></button>
                              <button onClick={() => setShowDeleteConfirm({ id: blog._id, type: 'blogs' })} className="p-3 bg-red-500/20 text-red-500 hover:bg-red-500 hover:text-white transition-all"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg></button>
                            </div>
                          </td>
                        </tr>
                      ))}

                      {/* Fallback for Empty */}
                      {((activeTab === 'newsletter' && subscribers.length === 0) ||
                        (activeTab === 'membership' && subscribers.length === 0) ||
                        (activeTab === 'kyc' && kycApps.length === 0) ||
                        (activeTab === 'eventApps' && eventApps.length === 0) ||
                        (activeTab === 'designers' && designers.length === 0) ||
                        (activeTab === 'events' && events.length === 0) ||
                        (activeTab === 'blogs' && blogs.length === 0) ||
                        (activeTab === 'plans' && plans.length === 0)) && (
                          <tr>
                            <td colSpan={4} className="py-40 text-center">
                              <p className="text-[10px] font-bold uppercase tracking-[0.5em] text-white/10">No records found in this partition</p>
                            </td>
                          </tr>
                        )}
                    </tbody>
                  </table>
                </motion.div>
              </AnimatePresence>
            )}
          </div>
        </div>

        {/* Global Action Floating Bar */}
        <div className="mt-20 border-t border-white/5 pt-12 flex flex-col md:flex-row justify-between items-center gap-10">
          <div className="max-w-md text-center md:text-left">
            <h4 className="text-xl font-serif font-bold mb-4 italic text-primary-gold">Strategic Expansion</h4>
            <p className="text-xs text-white/40 leading-relaxed uppercase tracking-widest font-medium">Manually initiate record creation or seed the global collective database.</p>
          </div>
          <div className="flex gap-6">
            <button
              onClick={handleSeed}
              className="border border-white/10 text-white/60 px-10 py-5 text-[10px] font-black uppercase tracking-widest hover:border-primary-gold hover:text-primary-gold transition-all"
            >
              Seed Collective
            </button>
          </div>
        </div>
      </div>

      {/* Add Form Overlay */}
      <AnimatePresence>
        {showAddForm && (
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
              <button onClick={() => { setShowAddForm(false); setEditMode(null); }} className="absolute top-8 right-8 text-white/40 hover:text-white transition-colors">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
              </button>

              <h3 className="text-3xl font-serif font-bold mb-12 italic gold-gradient-text text-center">
                 {editMode ? 'Modify' : 'Initialize'} {activeTab === 'events' ? 'Event' : activeTab === 'designers' ? 'Designer' : activeTab === 'blogs' ? 'Journal Post' : 'Membership Plan'}
              </h3>

              <form onSubmit={handleAddSubmit} className="space-y-8">
                {activeTab === 'designers' ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <input type="text" placeholder="Name" required className="admin-input col-span-2" value={newDesigner.name} onChange={(e) => setNewDesigner({ ...newDesigner, name: e.target.value })} />
                    <input type="text" placeholder="Specialty" required className="admin-input" value={newDesigner.specialty} onChange={(e) => setNewDesigner({ ...newDesigner, specialty: e.target.value })} />
                    <input type="text" placeholder="Location" required className="admin-input" value={newDesigner.location} onChange={(e) => setNewDesigner({ ...newDesigner, location: e.target.value })} />
                    <input type="text" placeholder="Tier (e.g. Premium)" required className="admin-input" value={newDesigner.tier} onChange={(e) => setNewDesigner({ ...newDesigner, tier: e.target.value })} />
                    <div className="col-span-2 space-y-4">
                      <label className="text-[10px] uppercase tracking-widest text-white/30 font-bold">Featured Profile Image</label>
                      <div className="flex items-center gap-6">
                        <div className="w-20 h-20 bg-white/5 border border-white/10 rounded-sm overflow-hidden flex items-center justify-center">
                          {newDesigner.image ? <img src={newDesigner.image} className="w-full h-full object-cover" /> : <svg className="w-6 h-6 text-white/10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>}
                        </div>
                        <input type="file" accept="image/*" onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            const reader = new FileReader();
                            reader.onloadend = () => setNewDesigner({ ...newDesigner, image: reader.result as string });
                            reader.readAsDataURL(file);
                          }
                        }} className="text-[10px] text-white/40 file:bg-white/5 file:border-none file:text-white file:px-4 file:py-2 file:text-[9px] file:uppercase file:tracking-widest hover:file:bg-white/10 cursor-pointer" />
                      </div>
                    </div>
                  </div>
                ) : activeTab === 'events' ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <input type="text" placeholder="Event Title (e.g. Couture Week 2026)" required className="admin-input col-span-2" value={newEvent.title} onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })} />
                    <input type="text" placeholder="Event Type (e.g. Fashion Show, Exhibition)" required className="admin-input" value={newEvent.type} onChange={(e) => setNewEvent({ ...newEvent, type: e.target.value })} />
                    <input type="text" placeholder="Entry Price (e.g. From £50)" required className="admin-input" value={newEvent.price} onChange={(e) => setNewEvent({ ...newEvent, price: e.target.value })} />

                    <div className="space-y-2">
                      <label className="text-[9px] uppercase tracking-widest text-white/30 font-bold">Commencement Date</label>
                      <input type="date" required className="admin-input" value={newEvent.startDate} onChange={(e) => setNewEvent({ ...newEvent, startDate: e.target.value })} />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[9px] uppercase tracking-widest text-white/30 font-bold">Conclusion Date</label>
                      <input type="date" required className="admin-input" value={newEvent.endDate} onChange={(e) => setNewEvent({ ...newEvent, endDate: e.target.value })} />
                    </div>

                    <input type="text" placeholder="Venue Location (e.g. Royal Albert Hall, London)" required className="admin-input" value={newEvent.location} onChange={(e) => setNewEvent({ ...newEvent, location: e.target.value })} />
                    <input type="text" placeholder="Status (e.g. Applications Open)" required className="admin-input" value={newEvent.status} onChange={(e) => setNewEvent({ ...newEvent, status: e.target.value })} />

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
                            reader.onloadend = () => setNewEvent({ ...newEvent, image: reader.result as string });
                            reader.readAsDataURL(file);
                          }
                        }} className="text-[10px] text-white/40 file:bg-white/5 file:border-none file:text-white file:px-4 file:py-2 file:text-[9px] file:uppercase file:tracking-widest hover:file:bg-white/10 cursor-pointer" />
                      </div>
                    </div>
                  </div>
                ) : activeTab === 'blogs' ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <input type="text" placeholder="Post Title" required className="admin-input col-span-2" value={newBlog.title} onChange={(e) => setNewBlog({ ...newBlog, title: e.target.value })} />
                    <input type="text" placeholder="Author Name" required className="admin-input" value={newBlog.author} onChange={(e) => setNewBlog({ ...newBlog, author: e.target.value })} />
                    <input type="text" placeholder="Short Excerpt" required className="admin-input" value={newBlog.excerpt} onChange={(e) => setNewBlog({ ...newBlog, excerpt: e.target.value })} />
                    
                    <div className="col-span-2 space-y-2">
                      <label className="text-[9px] uppercase tracking-widest text-white/30 font-bold">Post Content (HTML allowed)</label>
                      <textarea 
                       placeholder="Write your article here..." 
                       required
                       className="w-full bg-transparent border border-white/10 p-4 text-white focus:outline-none focus:border-primary-gold transition-all text-sm min-h-[200px]"
                       value={newBlog.content}
                       onChange={(e) => setNewBlog({ ...newBlog, content: e.target.value })}
                      />
                    </div>

                    <div className="col-span-2 space-y-4">
                      <label className="text-[10px] uppercase tracking-widest text-white/30 font-bold">Featured Cover Image</label>
                      <div className="flex items-center gap-6">
                        <div className="w-32 h-20 bg-white/5 border border-white/10 rounded-sm overflow-hidden flex items-center justify-center">
                          {newBlog.image ? <img src={newBlog.image} className="w-full h-full object-cover" /> : <svg className="w-8 h-8 text-white/10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>}
                        </div>
                        <input type="file" accept="image/*" onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            const reader = new FileReader();
                            reader.onloadend = () => setNewBlog({ ...newBlog, image: reader.result as string });
                            reader.readAsDataURL(file);
                          }
                        }} className="text-[10px] text-white/40 file:bg-white/5 file:border-none file:text-white file:px-4 file:py-2 file:text-[9px] file:uppercase file:tracking-widest hover:file:bg-white/10 cursor-pointer" />
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <input type="text" placeholder="Plan Name (e.g. Elite Collective)" required className="admin-input col-span-2" value={newPlan.name} onChange={(e) => setNewPlan({ ...newPlan, name: e.target.value })} />
                    
                    <div className="flex gap-2">
                       <select className="admin-input bg-luxury-black w-24" value={newPlan.currency} onChange={(e) => setNewPlan({ ...newPlan, currency: e.target.value })}>
                         <option value="£">£ (GBP)</option>
                         <option value="$">$ (USD)</option>
                         <option value="€">€ (EUR)</option>
                         <option value="PKR">PKR</option>
                       </select>
                       <input type="text" placeholder="Price (e.g. 199)" required className="admin-input flex-1" value={newPlan.price} onChange={(e) => setNewPlan({ ...newPlan, price: e.target.value })} />
                    </div>
                    
                    <select className="admin-input bg-luxury-black" value={newPlan.interval} onChange={(e) => setNewPlan({ ...newPlan, interval: e.target.value as any })}>
                      <option value="monthly">Monthly Billing</option>
                      <option value="yearly">Yearly Billing</option>
                    </select>

                    <input type="text" placeholder="Short Description" required className="admin-input col-span-2" value={newPlan.description} onChange={(e) => setNewPlan({ ...newPlan, description: e.target.value })} />
                    
                    <div className="col-span-2 space-y-2">
                      <label className="text-[9px] uppercase tracking-widest text-white/30 font-bold">Plan Features (Comma separated)</label>
                      <textarea 
                       placeholder="Feature 1, Feature 2, Feature 3..." 
                       className="w-full bg-transparent border-b border-white/10 py-1 text-white focus:outline-none focus:border-primary-gold transition-all text-sm"
                       value={newPlan.features}
                       onChange={(e) => setNewPlan({ ...newPlan, features: e.target.value })}
                      />
                    </div>

                    <label className="flex items-center gap-4 cursor-pointer col-span-2">
                      <input type="checkbox" checked={newPlan.isPopular} onChange={(e) => setNewPlan({ ...newPlan, isPopular: e.target.checked })} className="w-4 h-4 accent-primary-gold" />
                      <span className="text-[10px] uppercase tracking-widest text-white/60 font-bold">Feature as 'Most Popular'</span>
                    </label>
                  </div>
                )}

                <button type="submit" className="w-full brand-gradient py-6 text-[10px] font-black uppercase tracking-[0.4em] shadow-3xl hover:scale-[1.02] transition-all">
                  {editMode ? 'Save Modifications' : 'Commit Record to Registry'}
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* KYC Detail Modal */}
      <AnimatePresence>
        {selectedKYC && (
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

              <div className="mb-12">
                <p className="text-primary-gold font-bold uppercase tracking-[0.4em] text-[9px] mb-4 text-center">Comprehensive Verification Dossier</p>
                <h3 className="text-4xl font-serif font-bold text-white text-center uppercase tracking-tighter italic">{selectedKYC.name}</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-16">
                <div className="space-y-8">
                  <div>
                    <p className="text-[10px] uppercase tracking-widest text-white/30 font-bold mb-2">Business / Brand Entity</p>
                    <p className="text-lg font-serif italic text-white">{selectedKYC.kycData?.businessName}</p>
                  </div>
                  <div>
                    <p className="text-[10px] uppercase tracking-widest text-white/30 font-bold mb-2">Artistic Category</p>
                    <p className="text-sm font-bold text-primary-gold uppercase tracking-widest">{selectedKYC.kycData?.category}</p>
                  </div>
                  <div>
                    <p className="text-[10px] uppercase tracking-widest text-white/30 font-bold mb-2">Industry Experience</p>
                    <p className="text-sm font-bold text-white">{selectedKYC.kycData?.experience}</p>
                  </div>
                </div>
                <div className="space-y-8">
                  <div>
                    <p className="text-[10px] uppercase tracking-widest text-white/30 font-bold mb-2">Strategic Location</p>
                    <p className="text-sm font-bold text-white uppercase tracking-widest">{selectedKYC.kycData?.city}</p>
                  </div>
                  <div>
                    <p className="text-[10px] uppercase tracking-widest text-white/30 font-bold mb-2">Registered Address</p>
                    <p className="text-xs text-white/60 leading-relaxed font-medium uppercase tracking-widest">{selectedKYC.kycData?.address}</p>
                  </div>
                </div>
              </div>

              <div className="mb-16">
                <p className="text-[10px] uppercase tracking-widest text-white/30 font-bold mb-8 border-b border-white/5 pb-4">Verification Documents</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[
                    { label: 'Identity Front', src: selectedKYC.kycData?.documents?.cnicFront },
                    { label: 'Identity Back', src: selectedKYC.kycData?.documents?.cnicBack },
                    { label: 'Security Selfie', src: selectedKYC.kycData?.documents?.selfieWithCnic },
                  ].map((doc) => (
                    <div key={doc.label} className="group relative">
                      <p className="text-[9px] uppercase tracking-widest text-white/40 mb-3 font-black">{doc.label}</p>
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

              {selectedKYC.kycStatus === 'PENDING' && (
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
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Full Screen Image Overlay */}
      <AnimatePresence>
        {fullScreenImage && (
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
        )}
      </AnimatePresence>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {showDeleteConfirm && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[130] bg-black/90 backdrop-blur-md flex items-center justify-center p-6"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
              className="bg-white/[0.03] border border-white/10 p-12 max-w-md w-full text-center"
            >
              <div className="w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-8">
                <svg className="w-10 h-10 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
              </div>
              <h3 className="text-2xl font-serif font-bold text-white mb-4 italic">Irreversible Purge</h3>
              <p className="text-xs text-white/40 uppercase tracking-widest leading-relaxed mb-10">Are you certain you wish to permanently remove this record from the collective database?</p>
              <div className="flex gap-4">
                <button onClick={() => setShowDeleteConfirm(null)} className="flex-1 py-4 text-[10px] font-black uppercase tracking-widest text-white/30 hover:text-white transition-all">Cancel</button>
                <button onClick={executeDelete} className="flex-1 bg-red-600 text-white py-4 text-[10px] font-black uppercase tracking-widest shadow-xl">Confirm Delete</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Feedback Modal */}
      <AnimatePresence>
        {showFeedbackModal && (
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
                className="w-full bg-transparent border-b border-white/10 py-1 text-white focus:outline-none focus:border-primary-gold transition-all mb-10 text-sm"
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
        )}
      </AnimatePresence>

      <style jsx>{`
        .admin-input {
          width: 100%;
          background: transparent;
          border-bottom: 1px solid rgba(255,255,255,0.1);
          padding: 1.5rem 0;
          color: white;
          font-size: 0.9rem;
          transition: all 0.3s;
        }
        .admin-input:focus {
          outline: none;
          border-color: #E8D196;
        }
        select.admin-input option {
          background: #0A0A0A;
          color: white;
          padding: 1rem;
        }
        select.admin-input {
          cursor: pointer;
          appearance: none;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%23E8D196'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E");
          background-repeat: no-repeat;
          background-position: right center;
          background-size: 1.5rem;
          padding-right: 2rem;
        }
      `}</style>
    </div>
  );

  // Helper Functions for Inline Actions
  async function updateKYC(userId: string, status: string) {
    if (status === 'REJECTED') {
      setShowFeedbackModal({ id: userId, type: 'kyc' });
      return;
    }

    const t = toast.loading("Updating status...");
    try {
      await fetch('/api/admin/kyc', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, status })
      });
      toast.success(`User successfully ${status.toLowerCase()}`, { id: t });
      fetchData();
    } catch (err) {
      toast.error("Update failed", { id: t });
    }
  }

  async function submitFeedback() {
    if (!showFeedbackModal || !feedbackText) return;
    const { id, type } = showFeedbackModal;
    const endpoint = type === 'kyc' ? '/api/admin/kyc' : '/api/admin/event-applications';

    const t = toast.loading("Submitting feedback...");
    try {
      await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ [type === 'kyc' ? 'userId' : 'applicationId']: id, status: 'REJECTED', feedback: feedbackText })
      });
      toast.success("Feedback delivered successfully", { id: t });
      setShowFeedbackModal(null);
      setFeedbackText("");
      fetchData();
    } catch (err) {
      toast.error("Feedback delivery failed", { id: t });
    }
  }

  async function updateEventApp(applicationId: string, status: string) {
    if (status === 'REJECTED') {
      setShowFeedbackModal({ id: applicationId, type: 'eventApp' });
      return;
    }

    const t = toast.loading("Processing...");
    try {
      await fetch('/api/admin/event-applications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ applicationId, status })
      });
      toast.success(`Application successfully ${status.toLowerCase()}`, { id: t });
      fetchData();
    } catch (err) {
      toast.error("Update failed", { id: t });
    }
  }
}
