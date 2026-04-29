import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

const designers = [
  {
    id: 1,
    name: "Ayesha Malik",
    specialty: "Bridal Couture",
    image: "https://images.unsplash.com/photo-1594235412462-9573a115b7b1?q=80&w=2070&auto=format&fit=crop",
    tier: "Elite",
    bio: "Ayesha Malik is a visionary in the world of Pakistani bridal couture. Based in London but rooted in Lahore's rich textile heritage, her designs bridge the gap between traditional craftsmanship and modern silhouettes.",
    location: "London, UK",
    collections: ["Noor 2026", "Vintage Rose", "Emerald Dream"],
  },
  {
    id: 2,
    name: "Zainab Chottani",
    specialty: "Luxury Pret",
    image: "https://images.unsplash.com/photo-1445205170230-053b83016050?q=80&w=2071&auto=format&fit=crop",
    tier: "Premium",
    bio: "Zainab Chottani has become a household name in Pakistan and globally for her intricate embroidery and bold color choices. Her luxury pret collections are a staple for the modern Pakistani woman.",
    location: "Karachi, PK",
    collections: ["Summer Luxe", "Orchid Bliss"],
  },
  {
    id: 3,
    name: "Hassan Sheheryar",
    specialty: "Men's Formal",
    image: "https://images.unsplash.com/photo-1617137968427-85924c800a22?q=80&w=1974&auto=format&fit=crop",
    tier: "Elite",
    bio: "Hassan Sheheryar (HSY) is often referred to as the 'King of Couture'. With over two decades in the industry, his influence on Pakistani men's formal wear is unparalleled.",
    location: "Dubai, UAE",
    collections: ["The Kingdom", "Sultanate"],
  },
  {
    id: 4,
    name: "Sania Maskatiya",
    specialty: "Contemporary Fusion",
    image: "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?q=80&w=1974&auto=format&fit=crop",
    tier: "Premium",
    bio: "Sania Maskatiya is known for her innovative prints and contemporary silhouettes. She has represented Pakistan at New York Fashion Week and continues to push boundaries in fusion wear.",
    location: "Karachi, PK",
    collections: ["Modern Silk", "Abstract Lines"],
  },
  {
    id: 5,
    name: "Fahad Hussayn",
    specialty: "Avant-Garde Bridal",
    image: "https://images.unsplash.com/photo-1496217590455-aa63a8350eea?q=80&w=1974&auto=format&fit=crop",
    tier: "Basic",
    bio: "Fahad Hussayn's designs are art pieces. Known for his dramatic aesthetics and storytelling through fashion, he is the go-to for the avant-garde Pakistani bride.",
    location: "Lahore, PK",
    collections: ["Dark Romance", "Royal Theatre"],
  },
  {
    id: 6,
    name: "Elan by Khadijah",
    specialty: "High Embroidery",
    image: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=2070&auto=format&fit=crop",
    tier: "Elite",
    bio: "Elan is synonymous with luxury. Khadijah Shah's attention to detail and exquisite hand-embroidery has made Elan the most sought-after brand for high-end events.",
    location: "Lahore, PK",
    collections: ["Palais Indochine", "Le Bijou"],
  },
];

export default async function DesignerDetailPage({ params }: { params: { id: string } }) {
  const designerId = parseInt(params.id);
  const designer = designers.find((d) => d.id === designerId);

  if (!designer) {
    notFound();
  }

  return (
    <div className="bg-warm-ivory dark:bg-luxury-black min-h-screen py-24">
      <div className="container mx-auto px-6">
        <Link href="/designers" className="text-primary-gold font-bold uppercase tracking-widest text-[10px] mb-12 inline-block hover:text-vibrant-gold transition-colors">
          ← Back to Collective
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-start">
          <div className="relative aspect-[3/4] w-full overflow-hidden shadow-2xl">
            <Image
              src={designer.image}
              alt={designer.name}
              fill
              className="object-cover"
              priority
            />
            <div className="absolute top-8 left-8">
              <span className="bg-primary-gold text-luxury-black text-[10px] font-black uppercase tracking-widest px-4 py-2 shadow-xl">
                {designer.tier} Member
              </span>
            </div>
          </div>

          <div className="flex flex-col">
            <h1 className="text-6xl md:text-8xl font-serif font-bold mb-6">{designer.name}</h1>
            <div className="flex items-center gap-4 mb-10">
              <span className="text-primary-gold font-bold uppercase tracking-[0.2em] text-sm">{designer.specialty}</span>
              <span className="text-luxury-black/30 dark:text-warm-ivory/30">•</span>
              <span className="text-luxury-black/50 dark:text-warm-ivory/50 font-bold uppercase tracking-[0.2em] text-xs">{designer.location}</span>
            </div>

            <div className="prose dark:prose-invert max-w-none mb-16">
              <p className="text-xl leading-relaxed text-luxury-black/70 dark:text-warm-ivory/70">
                {designer.bio}
              </p>
            </div>

            <div className="mb-16">
                <h3 className="text-primary-gold font-bold uppercase tracking-widest text-xs mb-8">Latest Collections</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {designer.collections.map((collection) => (
                        <div key={collection} className="border border-primary-gold/10 p-6 hover:border-primary-gold/50 transition-colors cursor-pointer group">
                            <h4 className="text-lg font-serif font-bold group-hover:text-primary-gold transition-colors">{collection}</h4>
                            <p className="text-[10px] uppercase tracking-widest opacity-40 mt-2">View Lookbook →</p>
                        </div>
                    ))}
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

        {/* Portfolio Preview Grid */}
        <div className="mt-40">
            <h2 className="text-4xl font-serif font-bold mb-12">Portfolio Preview</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="relative aspect-square overflow-hidden grayscale hover:grayscale-0 transition-all duration-700 cursor-zoom-in">
                        <Image 
                            src={`https://images.unsplash.com/photo-${1594938298603 + i}-c8148c4dae35?q=80&w=800&auto=format&fit=crop`} 
                            alt="Portfolio Work" 
                            fill 
                            className="object-cover"
                        />
                    </div>
                ))}
            </div>
        </div>
      </div>
    </div>
  );
}
