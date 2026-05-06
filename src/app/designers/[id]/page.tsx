import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import dbConnect from "@/lib/dbConnect";
import User from "@/models/User";

export default async function DesignerDetailPage({ params }: { params: { id: string } }) {
  await dbConnect();
  
  let designer;
  
  // Try to find in database first
  try {
    designer = await User.findById(params.id);
  } catch (err) {
    // If not a valid ID, we might have hardcoded fallback
  }

  // Fallback for legacy/mock data if needed, but primarily use DB
  if (!designer) {
    notFound();
  }

  const kyc = designer.kycData;

  return (
    <div className="bg-warm-ivory dark:bg-luxury-black min-h-screen py-24">
      <div className="container mx-auto px-6">
        <Link href="/designers" className="text-primary-gold font-bold uppercase tracking-widest text-[10px] mb-12 inline-block hover:text-vibrant-gold transition-colors">
          ← Back to Collective
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-start">
          <div className="relative aspect-[3/4] w-full overflow-hidden shadow-2xl">
            <Image
              src={kyc?.documents?.selfieWithCnic || "https://images.unsplash.com/photo-1594235412462-9573a115b7b1?q=80&w=2070&auto=format&fit=crop"}
              alt={designer.name}
              fill
              className="object-cover"
              priority
            />
            <div className="absolute top-8 left-8">
              <span className="bg-primary-gold text-luxury-black text-[10px] font-black uppercase tracking-widest px-4 py-2 shadow-xl">
                {designer.membership?.plan || 'Elite'} Member
              </span>
            </div>
          </div>

          <div className="flex flex-col">
            <h1 className="text-6xl md:text-8xl font-serif font-bold mb-6">{designer.name}</h1>
            <div className="flex items-center gap-4 mb-10">
              <span className="text-primary-gold font-bold uppercase tracking-[0.2em] text-sm">{kyc?.category || 'Couture Designer'}</span>
              <span className="text-luxury-black/30 dark:text-warm-ivory/30">•</span>
              <span className="text-luxury-black/50 dark:text-warm-ivory/50 font-bold uppercase tracking-[0.2em] text-xs">{kyc?.city || 'Global'}, {kyc?.businessName}</span>
            </div>

            <div className="prose dark:prose-invert max-w-none mb-16">
              <p className="text-xl leading-relaxed text-luxury-black/70 dark:text-warm-ivory/70">
                {kyc?.businessName} is a premiere fashion entity in the collective. With {kyc?.experience || 0} years of industry experience, this designer brings a unique perspective to the global Pakistani fashion landscape.
              </p>
            </div>

            <div className="mb-16">
                <h3 className="text-primary-gold font-bold uppercase tracking-widest text-xs mb-8">Portfolio & Socials</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {kyc?.portfolioLinks?.map((link: string, i: number) => (
                        <a key={i} href={link} target="_blank" rel="noopener noreferrer" className="border border-primary-gold/10 p-6 hover:border-primary-gold/50 transition-colors cursor-pointer group flex items-center justify-between">
                            <h4 className="text-lg font-serif font-bold group-hover:text-primary-gold transition-colors truncate max-w-[200px]">{link}</h4>
                            <p className="text-[10px] uppercase tracking-widest opacity-40">Visit →</p>
                        </a>
                    ))}
                    {!kyc?.portfolioLinks?.length && (
                         <div className="col-span-2 text-white/20 uppercase tracking-widest text-[10px] py-10 border border-dashed border-white/10 text-center">
                            No external links registered yet.
                         </div>
                    )}
                </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-6">
                <button className="bg-primary-gold hover:bg-vibrant-gold text-luxury-black font-bold py-5 px-12 rounded-sm transition-all uppercase tracking-widest text-xs shadow-lg">
                    Inquire for Collaboration
                </button>
                <button className="border border-luxury-black/20 dark:border-warm-ivory/20 hover:border-primary-gold dark:hover:border-primary-gold py-5 px-12 rounded-sm transition-all uppercase tracking-widest text-xs font-bold">
                    Follow Designer
                </button>
            </div>
          </div>
        </div>

        {/* Documents Preview (Simplified) */}
        <div className="mt-40">
            <h2 className="text-4xl font-serif font-bold mb-12">Artistic Showcase</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
                {kyc?.documents?.cnicFront && (
                    <div className="relative aspect-video overflow-hidden grayscale hover:grayscale-0 transition-all duration-700">
                        <img src={kyc.documents.cnicFront} alt="Showcase 1" className="w-full h-full object-cover" />
                    </div>
                )}
                {kyc?.documents?.cnicBack && (
                    <div className="relative aspect-video overflow-hidden grayscale hover:grayscale-0 transition-all duration-700">
                        <img src={kyc.documents.cnicBack} alt="Showcase 2" className="w-full h-full object-cover" />
                    </div>
                )}
                {kyc?.documents?.license && (
                    <div className="relative aspect-video overflow-hidden grayscale hover:grayscale-0 transition-all duration-700">
                        <img src={kyc.documents.license} alt="Showcase 3" className="w-full h-full object-cover" />
                    </div>
                )}
            </div>
        </div>
      </div>
    </div>
  );
}
