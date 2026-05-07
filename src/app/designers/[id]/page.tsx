import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import dbConnect from "@/lib/dbConnect";
import User from "@/models/User";
import Designer from "@/models/Designer";

export default async function DesignerDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  await dbConnect();
  
  let designer: any = null;
  let isUserAccount = false;
  
  try {
    // 0. Handle Mock IDs for testing
    if (id === 'm1' || id === 'm2' || id === 'm3' || id === 'e1' || id === 'e2') {
       designer = {
          name: id.startsWith('m') ? "Elite Designer" : "Couture Member",
          specialty: "Bridal Couture",
          location: "London, UK",
          tier: "Elite",
          image: "/runway-red.jpg",
          bio: "A visionary designer from our elite collective showcase.",
          kycData: { experience: 10 },
          portfolio: { images: ["/runway-red.jpg", "/runway-couple.jpg", "/runway-bridal-1.jpg"] }
       };
    } else {
       // 1. ALWAYS prioritize the User account for live data
       const user = await User.findById(id).lean();
    
       if (user) {
         isUserAccount = true;
         const portfolio = (user as any).portfolio;
         designer = {
           _id: user._id.toString(),
           name: user.name,
           specialty: (user as any).kycData?.category || "Bespoke Designer",
           image: portfolio?.images?.[0] || (user as any).image || "/runway-red.jpg",
           tier: user.membership?.plan || "Basic",
           location: (user as any).kycData?.city || "Global",
           bio: portfolio?.brandBio || null, // Dynamic Bio
           portfolio: portfolio,
           collections: [],
           kycData: user.kycData
         };
       } else {
         // 2. If not a User ID, check the static Designer Collective
         designer = await Designer.findById(id).lean();
         
         // 3. Last chance: If still not found, search User by name
         if (designer) {
            const linkedUser = await User.findOne({ name: designer.name }).lean();
            if (linkedUser) {
               const portfolio = (linkedUser as any).portfolio;
               designer = {
                   ...designer,
                   image: portfolio?.images?.[0] || designer.image,
                   bio: portfolio?.brandBio || null, // Dynamic Bio
                   portfolio: portfolio,
                   kycData: linkedUser.kycData
               };
            }
         }
       }
    }
  } catch (err) {
    console.error("Fetch failed", err);
  }

  if (!designer) {
    notFound();
  }

  return (
    <div className="bg-luxury-black min-h-screen py-24">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-16 gap-6">
          <Link href="/designers" className="text-primary-gold font-bold uppercase tracking-widest text-[10px] hover:text-white transition-colors">
            ← Back to Collective
          </Link>
          {isUserAccount && (
            <div className="bg-primary-gold/10 border border-primary-gold/20 px-4 py-2 text-[9px] font-black uppercase tracking-widest text-primary-gold">
              Active Member Profile
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
          {/* Brand Visual - Smaller & More Elegant */}
          <div className="lg:col-span-5 relative aspect-[4/5] w-full max-w-md mx-auto lg:mx-0 overflow-hidden shadow-2xl border border-white/5 group">
            <img
              src={designer.image || "/runway-couple.jpg"}
              alt={designer.name}
              className="w-full h-full object-cover transition-transform duration-[2000ms] group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-luxury-black via-transparent to-transparent opacity-60"></div>
          </div>

          <div className="lg:col-span-7 flex flex-col">
            <div className="mb-6">
              <span className="brand-gradient text-white text-[9px] font-black uppercase tracking-widest px-4 py-2 shadow-2xl">
                {designer.tier} Collective Member
              </span>
            </div>
            <h1 className="text-5xl md:text-8xl font-serif font-bold mb-10 leading-none tracking-tighter uppercase">{designer.name}</h1>
            
            <div className="grid grid-cols-2 md:grid-cols-3 gap-6 mb-12">
              <div className="border-l-2 border-primary-gold pl-4">
                <p className="text-primary-gold font-bold uppercase tracking-[0.4em] text-[10px] mb-2">Category</p>
                <p className="text-white text-xl font-serif italic">{designer.specialty}</p>
              </div>
              <div className="border-l-2 border-primary-gold pl-4">
                <p className="text-primary-gold font-bold uppercase tracking-[0.4em] text-[10px] mb-2">Location</p>
                <p className="text-white text-xl font-serif italic">{designer.location}</p>
              </div>
              <div className="border-l-2 border-primary-gold pl-4">
                <p className="text-primary-gold font-bold uppercase tracking-[0.4em] text-[10px] mb-2">Experience</p>
                <p className="text-white text-xl font-serif italic">{designer.kycData?.experience || '5+'} Years</p>
              </div>
            </div>

            {designer.bio && designer.bio.trim() !== "" && (
              <div className="bg-white/[0.03] border border-white/10 p-8 md:p-12 mb-16 relative overflow-hidden">
                <p className="text-xl md:text-2xl leading-relaxed text-white/70 font-serif italic relative z-10">
                  "{designer.bio}"
                </p>
                <div className="absolute -top-4 -left-4 text-6xl text-primary-gold/10 font-serif">“</div>
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-6">
                <button className="bg-primary-gold text-luxury-black font-black py-5 px-12 transition-all uppercase tracking-widest text-[10px] shadow-[0_0_30px_rgba(232,209,150,0.2)] hover:scale-105 active:scale-95">
                    Request Exclusive Viewing
                </button>
            </div>
          </div>
        </div>

        {/* Artistic Showcase Gallery - Only show if images exist */}
        {designer.portfolio?.images && designer.portfolio.images.length > 0 && (
          <div className="mt-40 pt-40 border-t border-white/5">
              <div className="text-center mb-24">
                  <h2 className="text-primary-gold font-bold uppercase tracking-[0.5em] text-[10px] mb-6">Artistic Showcase</h2>
                  <h3 className="text-4xl md:text-7xl font-serif font-bold text-white italic">Current Collections</h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
                  {designer.portfolio.images.map((img: string, i: number) => (
                     <div key={i} className="relative aspect-square overflow-hidden border border-white/5 group shadow-2xl">
                          <img src={img} alt={`${designer.name} Collection`} className="w-full h-full object-cover transition-transform duration-[3000ms] group-hover:scale-110" />
                          <div className="absolute inset-0 bg-luxury-black/60 opacity-0 group-hover:opacity-100 transition-all duration-700 flex items-center justify-center">
                             <span className="text-primary-gold uppercase tracking-[0.3em] text-[9px] font-bold border border-primary-gold/40 px-6 py-3">Piece 0{i+1}</span>
                          </div>
                     </div>
                  ))}
              </div>
          </div>
        )}
      </div>
    </div>
  );
}
