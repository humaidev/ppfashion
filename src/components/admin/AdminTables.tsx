"use client";

import { motion } from "framer-motion";

interface TableProps {
  data: any[];
  onAction?: (item: any) => void;
  onDelete?: (id: string) => void;
  onUpdate?: (id: string, status: string) => void;
  openEdit?: (item: any) => void;
}

export const SubscriberTable = ({ data, onDelete }: TableProps) => (
  <>
    {data.map((sub) => (
      <tr key={sub._id} className="group hover:bg-white/[0.02] transition-colors">
        <td className="py-10 px-10">
          <p className="text-sm font-bold text-white mb-1">{sub.fullName}</p>
          <p className="text-[10px] uppercase tracking-widest text-primary-gold/40 font-bold italic">{sub.brandName || "Individual Member"}</p>
        </td>
        <td className="py-10 px-10"><p className="text-xs text-white/60">{sub.email}</p></td>
        <td className="py-10 px-10">
          <span className={`text-[9px] font-black uppercase tracking-widest px-4 py-1.5 rounded-full ${sub.plan === 'Elite' ? 'bg-secondary-emerald/20 text-secondary-emerald' : 'bg-primary-gold/10 text-primary-gold'}`}>{sub.plan} Plan</span>
        </td>
        <td className="py-10 px-10 text-right">
           <div className="flex justify-end gap-2 transition-opacity">
              <button onClick={() => onDelete?.(sub._id)} className="p-3 bg-white/5 border border-white/10 text-white hover:bg-red-500 hover:text-white transition-all"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg></button>
           </div>
        </td>
      </tr>
    ))}
  </>
);

export const KYCTable = ({ data, onAction, onUpdate }: TableProps) => (
  <>
    {data.map((app) => (
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
              <button onClick={() => onAction?.(app)} className="p-3 bg-white/5 border border-white/10 text-white hover:border-primary-gold hover:text-primary-gold transition-all" title="View Full Details">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </button>
              
              {app.kycStatus === 'PENDING' && (
                <>
                  <button onClick={() => onUpdate?.(app._id, 'APPROVED')} className="p-3 bg-secondary-emerald/20 text-secondary-emerald hover:bg-secondary-emerald hover:text-white transition-all" title="Approve">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                  </button>
                  <button onClick={() => onUpdate?.(app._id, 'REJECTED')} className="p-3 bg-red-500/20 text-red-500 hover:bg-red-500 hover:text-white transition-all" title="Reject">
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
  </>
);

export const EventAppTable = ({ data, onUpdate }: TableProps) => (
  <>
    {data.map((app) => (
      <tr key={app._id} className="group hover:bg-white/[0.02] transition-colors">
        <td className="py-10 px-10">
          <p className="text-sm font-bold text-white mb-1">{app.designerName}</p>
          <p className="text-[10px] uppercase tracking-widest text-primary-gold/60 font-bold">{app.eventTitle}</p>
        </td>
        <td className="py-10 px-10">
          <p className="text-xs text-white/40 mb-3 italic">{app.designerEmail}</p>
        </td>
        <td className="py-10 px-10">
          <span className={`text-[9px] font-black uppercase tracking-widest px-4 py-1.5 rounded-full border ${
            app.status === 'APPROVED' ? 'bg-secondary-emerald/20 text-secondary-emerald border-secondary-emerald/20' :
            app.status === 'REJECTED' ? 'bg-red-500/20 text-red-500 border-red-500/20' :
            'bg-primary-gold/10 text-primary-gold border-primary-gold/20'
          }`}>{app.status}</span>
        </td>
        <td className="py-10 px-10 text-right">
           <div className="flex justify-end gap-2 transition-opacity">
              {app.status === 'PENDING' ? (
                <>
                  <button onClick={() => onUpdate?.(app._id, 'APPROVED')} className="text-[9px] font-black uppercase bg-white/5 border border-white/10 px-4 py-2 hover:bg-primary-gold hover:text-luxury-black transition-all">Approve</button>
                  <button onClick={() => onUpdate?.(app._id, 'REJECTED')} className="text-[9px] font-black uppercase text-red-500 px-4 py-2 hover:bg-red-500 hover:text-white transition-all">Decline</button>
                </>
              ) : (
                <span className="text-[9px] font-black uppercase text-white/20 tracking-widest px-4 py-2 italic">Decision Finalized</span>
              )}
           </div>
        </td>
      </tr>
    ))}
  </>
);

export const DesignerTable = ({ data, openEdit, onDelete }: TableProps) => (
  <>
    {data.map((des) => (
      <tr key={des._id} className="group hover:bg-white/[0.02] transition-colors">
        <td className="py-10 px-10">
          <p className="text-sm font-bold text-white mb-1">{des.name}</p>
          <p className="text-[10px] uppercase tracking-widest text-primary-gold/40 font-bold italic">{des.specialty}</p>
        </td>
        <td className="py-10 px-10"><p className="text-xs text-white/60 uppercase tracking-widest">{des.location}</p></td>
        <td className="py-10 px-10"><span className="text-[9px] font-black uppercase tracking-widest px-4 py-1.5 rounded-full bg-primary-gold/10 text-primary-gold border border-primary-gold/20">{des.tier}</span></td>
        <td className="py-10 px-10 text-right">
          <div className="flex justify-end gap-2 transition-opacity">
            <button onClick={() => openEdit?.(des)} className="p-3 bg-white/5 border border-white/10 text-white hover:border-primary-gold hover:text-primary-gold transition-all"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg></button>
            <button onClick={() => onDelete?.(des._id)} className="p-3 bg-red-500/20 text-red-500 hover:bg-red-500 hover:text-white transition-all"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg></button>
          </div>
        </td>
      </tr>
    ))}
  </>
);

export const EventTable = ({ data, openEdit, onDelete }: TableProps) => (
  <>
    {data.map((ev) => (
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
            <button onClick={() => openEdit?.(ev)} className="p-3 bg-white/5 border border-white/10 text-white hover:border-primary-gold hover:text-primary-gold transition-all"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg></button>
            <button onClick={() => onDelete?.(ev._id)} className="p-3 bg-red-500/20 text-red-500 hover:bg-red-500 hover:text-white transition-all"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg></button>
          </div>
        </td>
      </tr>
    ))}
  </>
);
