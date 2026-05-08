"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function MembershipPage() {
  const [user, setUser] = useState<any>(null);
  const [plans, setPlans] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const profileRes = await fetch("/api/auth/profile");
        const profileData = await profileRes.json();
        if (profileData.success) setUser(profileData.user);

        const plansRes = await fetch("/api/plans");
        const plansData = await plansRes.json();
        if (plansData.success) setPlans(plansData.plans);
      } catch (err) {
        console.error("Data fetch failed");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handlePurchase = async (plan: any) => {
    if (!user) {
      router.push("/login");
      return;
    }
    if (user.kycStatus !== 'APPROVED') {
      router.push("/dashboard");
      return;
    }

    setProcessing(true);
    try {
      const res = await fetch("/api/membership/purchase", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ planId: plan._id, planName: plan.name }),
      });
      const data = await res.json();
      if (data.success) {
        alert(`${plan.name} activated successfully!`);
        router.push("/dashboard");
      }
    } catch (err) {
      alert("Purchase failed");
    } finally {
      setProcessing(false);
    }
  };

  if (loading) return <div className="min-h-screen bg-black flex items-center justify-center"><div className="w-12 h-12 border-4 border-primary-gold border-t-transparent rounded-full animate-spin"></div></div>;

  return (
    <div className="bg-black min-h-screen py-32 pb-40 text-white">
      <div className="container mx-auto px-6 max-w-7xl">
        <div className="max-w-4xl mb-24 border-l-2 border-primary-gold/20 pl-10">
          <h1 className="gold-gradient-text font-bold uppercase tracking-[0.4em] mb-6 text-[10px]">Exclusive Access</h1>
          <h2 className="text-5xl md:text-8xl font-serif font-bold text-white mb-10 leading-[0.9] tracking-tighter uppercase italic">Choose Your <br />Plan</h2>
          <p className="text-lg text-white/50 leading-relaxed max-w-2xl font-medium">
            {user
              ? `Welcome back, ${user.name}. Choose an industry-leading tier to activate your collective membership and scale your global presence.`
              : "Join a community of excellence and unlock exclusive runway opportunities in the global fashion industry."
            }
          </p>
        </div>

        {user && user.role !== 'ADMIN' && user.kycStatus !== 'APPROVED' && (
          <div className="mb-24 p-10 bg-red-500/5 border border-red-500/10 flex flex-col md:flex-row justify-between items-center gap-8">
            <div>
              <p className="text-[10px] uppercase tracking-[0.3em] font-black text-red-500 mb-2">Verification Required</p>
              <p className="text-xs text-white/40 uppercase tracking-widest">You must have an approved KYC status to activate a membership tier.</p>
            </div>
            <Link href="/dashboard" className="border border-red-500/30 text-red-500 px-12 py-5 text-[9px] font-black uppercase tracking-widest hover:bg-red-500 hover:text-white transition-all">Verify Status</Link>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 justify-center items-stretch">
          {plans.map((plan) => (
            <div
              key={plan._id}
              className={`relative flex flex-col p-12 rounded-sm transition-all duration-700 bg-white/[0.02] border border-white/5 hover:border-primary-gold/50 group ${plan.isPopular ? 'ring-1 ring-primary-gold/30 shadow-[0_30px_100px_rgba(232,209,150,0.05)] scale-[1.02] z-10 bg-white/[0.04]' : ''}`}
            >
              {plan.isPopular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-primary-gold text-luxury-black px-6 py-2 text-[9px] font-black uppercase tracking-[0.2em] rounded-full shadow-xl">
                  Most Popular
                </div>
              )}

              <div className="mb-12">
                <h3 className="text-4xl font-serif font-bold mb-6 italic text-white group-hover:gold-gradient-text transition-all">{plan.name}</h3>
                <div className="flex items-baseline gap-2 mb-6">
                  <span className="text-6xl font-bold tracking-tighter text-white">{plan.currency || '£'}{plan.price}</span>
                  <span className="text-[10px] uppercase tracking-[0.3em] text-white/30 font-bold">/ {plan.interval === 'monthly' ? 'Month' : 'Year'}</span>
                </div>
                <p className="text-xs text-white/40 leading-relaxed font-medium min-h-[48px]">{plan.description}</p>
              </div>

              <div className="flex-1 mb-12">
                <ul className="space-y-6">
                  {plan.features.map((feature: string, idx: number) => (
                    <li key={idx} className="flex items-start gap-4 text-[11px] font-bold uppercase tracking-widest text-white/60">
                      <svg className="w-4 h-4 flex-shrink-0 text-primary-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                      </svg>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="space-y-6">
                {(() => {
                  const isCurrentPlan = user?.membership?.plan === plan.name && user?.membership?.status === 'ACTIVE';
                  
                  // Calculate days until expiry
                  let daysUntilExpiry = 999;
                  if (user?.membership?.expiryDate) {
                    const expiry = new Date(user.membership.expiryDate);
                    const now = new Date();
                    daysUntilExpiry = Math.ceil((expiry.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
                  }

                  const showRenew = isCurrentPlan && daysUntilExpiry <= 7;

                  if (isCurrentPlan && !showRenew) {
                    return (
                      <button className="w-full text-center font-black py-6 rounded-sm uppercase tracking-[0.3em] text-[10px] bg-secondary-emerald/20 text-secondary-emerald border border-secondary-emerald/30 cursor-default">
                        Current Active Plan
                      </button>
                    );
                  }

                  const isUpgrade = user?.membership?.status === 'ACTIVE' && !isCurrentPlan;

                  return (
                    <button
                      disabled={processing}
                      onClick={() => handlePurchase(plan)}
                      className={`w-full text-center font-black py-6 rounded-sm transition-all uppercase tracking-[0.3em] text-[10px] shadow-2xl brand-gradient brand-gradient-hover text-white hover:scale-[1.02] active:scale-[0.98] ${processing ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                      {processing ? "Initializing..." : 
                        showRenew ? "Renew Membership" :
                        isUpgrade ? `Upgrade to ${plan.name}` : 
                        (user?.kycStatus === 'APPROVED' || user?.role === 'ADMIN') ? `Activate ${plan.name}` : "Become Member"
                      }
                    </button>
                  );
                })()}
                {plan.interval === 'monthly' && (
                  <p className="text-center text-[9px] uppercase tracking-widest text-white/20 font-bold">
                    Or pay annually and save 15%
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Capability Matrix Section */}
        <div className="mt-56 pt-32 border-t border-white/5">
          <div className="max-w-xl mb-24">
            <h3 className="text-5xl font-serif font-bold text-white uppercase italic tracking-tighter mb-4">Capability Matrix</h3>
            <p className="text-[10px] uppercase tracking-[0.4em] text-primary-gold font-bold">Comprehensive Tier Comparison</p>
          </div>

          <div className="bg-white/[0.01] border border-white/5 p-4 md:p-12 rounded-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[800px]">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="py-12 text-[10px] font-black uppercase tracking-[0.4em] text-white/20 w-1/3">Service Deliverables</th>
                    {plans.map(plan => (
                      <th key={plan._id} className="py-12 text-center text-[11px] font-black uppercase tracking-[0.4em] text-primary-gold italic">{plan.name}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {[
                    "Elite Directory Profile",
                    "Runway Event Priority",
                    "Global PR Placements",
                    "Private Networking Dinners",
                    "Dedicated Brand Landing Page",
                    "Wholesale Buyer Connections",
                    "VIP Mentoring Sessions",
                    "Press Release Distribution"
                  ].map((feature) => (
                    <tr key={feature} className="group hover:bg-white/[0.02] transition-colors">
                      <td className="py-10 text-[10px] font-black uppercase tracking-[0.2em] text-white/40 group-hover:text-white transition-colors">{feature}</td>
                      {plans.map(plan => {
                        const hasFeature = plan.features.some((f: string) => f.toLowerCase().includes(feature.toLowerCase()) || feature.toLowerCase().includes(f.toLowerCase()));
                        return (
                          <td key={plan._id} className="py-10 text-center">
                            {hasFeature ? (
                              <svg className="w-6 h-6 mx-auto text-secondary-emerald" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                              </svg>
                            ) : (
                              <span className="text-white/5 text-2xl font-light">—</span>
                            )}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
