import Link from "next/link";

const tiers = [
  {
    name: "Basic",
    price: "£19",
    yearlyPrice: "£199",
    description: "Perfect for emerging designers looking for visibility.",
    features: [
      "Portfolio Profile",
      "Directory Listing",
      "Event Updates",
      "Digital Member Badge",
      "Access to Public Forums",
    ],
    cta: "Join Basic",
    popular: false,
    color: "bg-soft-gray",
  },
  {
    name: "Premium",
    price: "£49",
    yearlyPrice: "£499",
    description: "For established designers wanting priority growth.",
    features: [
      "Featured Homepage Spot",
      "Priority Event Application",
      "Private Community Access",
      "Monthly Growth Webinars",
      "Supplier Lists Access",
      "Silver Member Badge",
    ],
    cta: "Join Premium",
    popular: true,
    color: "bg-primary-gold",
  },
  {
    name: "Elite",
    price: "£99",
    yearlyPrice: "£999",
    description: "The ultimate tier for industry leaders.",
    features: [
      "VIP Event Invites",
      "1-on-1 Mentoring",
      "PR & Media Features",
      "Custom Landing Page",
      "Runway Priority Slot",
      "Gold Member Badge",
      "Full Resource Access",
    ],
    cta: "Go Elite",
    popular: false,
    color: "bg-secondary-emerald",
  },
];

export default function MembershipPage() {
  return (
    <div className="bg-luxury-black min-h-screen py-32 pb-40">
      <div className="container mx-auto px-6">
        <div className="max-w-4xl mb-20 md:mb-32 border-l-2 border-primary-gold/20 pl-6 md:pl-10">
          <h1 className="gold-gradient-text font-bold uppercase tracking-[0.4em] mb-6 text-[10px]">Membership Tiers</h1>
          <h2 className="text-4xl md:text-[7rem] font-serif font-bold text-white mb-10 leading-[0.9] tracking-tighter">Elevate Your <br />Presence</h2>
          <p className="text-xl text-white/50 leading-relaxed max-w-2xl">
            Choose the tier that matches your ambition. Join a community of excellence 
            and unlock exclusive opportunities in the global Pakistani fashion industry.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {tiers.map((tier) => (
            <div 
              key={tier.name}
              className={`relative flex flex-col p-12 rounded-sm transition-all duration-700 transform hover:-translate-y-4 group ${
                tier.popular 
                  ? "bg-white/[0.03] text-white border-2 border-secondary-emerald shadow-[0_0_80px_rgba(0,79,52,0.15)] scale-105 z-10" 
                  : "bg-white/[0.02] backdrop-blur-sm border border-white/5 hover:border-secondary-emerald/30"
              }`}
            >
              {tier.popular && (
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 brand-gradient text-white text-[10px] font-bold uppercase tracking-widest px-8 py-2 rounded-full shadow-2xl">
                  Most Popular
                </div>
              )}

              <div className="mb-12">
                <h3 className="text-3xl font-serif font-bold mb-4 gold-gradient-text italic">
                  {tier.name}
                </h3>
                <div className="flex items-baseline gap-2 mb-6">
                  <span className="text-5xl font-bold tracking-tighter text-white">{tier.price}</span>
                  <span className="text-sm uppercase tracking-widest opacity-40">/ Month</span>
                </div>
                <p className="text-sm text-white/50 leading-relaxed font-medium">
                  {tier.description}
                </p>
              </div>

              <div className="flex-1 mb-12">
                <ul className="space-y-5">
                  {tier.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-4 text-xs font-medium text-white/70">
                      <svg className={`w-5 h-5 flex-shrink-0 ${tier.popular ? "text-primary-gold" : "text-primary-gold/40"}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                      </svg>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>

              <Link
                href={`/register?plan=${tier.name.toLowerCase()}`}
                className={`text-center font-bold py-5 rounded-sm transition-all uppercase tracking-widest text-[10px] shadow-2xl ${
                  tier.popular
                    ? "brand-gradient text-white brand-gradient-hover"
                    : "bg-white/5 text-white hover:brand-gradient"
                }`}
              >
                {tier.cta}
              </Link>
              
              <div className="mt-6 text-center">
                <p className="text-[10px] opacity-20 uppercase tracking-[0.2em] font-bold">
                  Or {tier.yearlyPrice} annually (save 15%)
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Benefits Table */}
        <div className="mt-32 md:mt-48 overflow-x-auto bg-white/[0.01] border border-white/5 p-6 md:p-12">
          <table className="w-full text-left border-collapse min-w-[600px]">
            <thead>
              <tr className="border-b border-white/10">
                <th className="py-12 px-8 font-serif text-2xl md:text-4xl font-bold uppercase tracking-tighter text-white italic w-[40%]">Capability Matrix</th>
                <th className="py-12 px-8 text-center font-bold text-white/20 uppercase tracking-[0.3em] text-[10px] w-[20%]">Basic</th>
                <th className="py-12 px-8 text-center font-bold text-white uppercase tracking-[0.3em] text-[10px] w-[20%]">Premium</th>
                <th className="py-12 px-8 text-center font-bold text-white uppercase tracking-[0.3em] text-[10px] w-[20%]">Elite</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {[
                { label: "Elite Directory Profile", basic: true, premium: true, elite: true },
                { label: "Runway Event Priority", basic: false, premium: "High", elite: "VIP Priority" },
                { label: "Global PR Placements", basic: false, premium: "Monthly", elite: "Weekly Guaranteed" },
                { label: "Private Networking Dinners", basic: false, premium: true, elite: true },
                { label: "Dedicated Brand Landing Page", basic: false, premium: false, elite: true },
                { label: "Wholesale Buyer Connections", basic: false, premium: false, elite: true },
              ].map((row) => (
                <tr key={row.label} className="border-b border-white/5 hover:bg-white/[0.02] transition-all group">
                  <td className="py-10 px-8 font-bold uppercase tracking-[0.2em] text-[9px] text-white/40 group-hover:text-white transition-colors">{row.label}</td>
                  <td className="py-10 px-8 text-center text-white/30">
                    {row.basic === true ? <span className="text-xl">✓</span> : (row.basic === false ? "-" : <span className="font-bold tracking-widest uppercase text-[10px]">{row.basic}</span>)}
                  </td>
                  <td className="py-10 px-8 text-center text-white font-bold">
                    {row.premium === true ? <span className="text-2xl">✓</span> : (row.premium === false ? "-" : <span className="font-bold tracking-widest uppercase text-[10px]">{row.premium}</span>)}
                  </td>
                  <td className="py-10 px-8 text-center text-white font-bold">
                    {row.elite === true ? <span className="text-2xl">✓</span> : (row.elite === false ? "-" : <span className="font-bold tracking-widest uppercase text-[10px]">{row.elite}</span>)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
