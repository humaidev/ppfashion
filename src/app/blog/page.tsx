import Image from "next/image";
import Link from "next/link";

const posts = [
  {
    id: 1,
    title: "The Rise of Emerald in 2026 Bridal Wear",
    excerpt: "Exploring the evolution of color palettes in recent Pakistani runway shows and why emerald is the choice for elite designers.",
    date: "April 12, 2026",
    category: "Trends",
    image: "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?q=80&w=2080&auto=format&fit=crop",
  },
  {
    id: 2,
    title: "Navigating the Global Market as a Desi Designer",
    excerpt: "A guide for emerging designers on how to scale their brand internationally while maintaining cultural authenticity.",
    date: "March 28, 2026",
    category: "Business",
    image: "https://images.unsplash.com/photo-1558769132-cb1aea458c5e?q=80&w=1974&auto=format&fit=crop",
  },
  {
    id: 3,
    title: "10 Minutes with Ayesha Malik",
    excerpt: "An exclusive interview with our newest Elite member about her journey from Glasgow to the global stage.",
    date: "March 15, 2026",
    category: "Spotlight",
    image: "https://images.unsplash.com/photo-1509631179647-0177331693ae?q=80&w=1976&auto=format&fit=crop",
  },
];

export default function BlogPage() {
  return (
    <div className="bg-luxury-black min-h-screen py-32 pb-40">
      <div className="container mx-auto px-6">
        <div className="max-w-4xl mb-20 md:mb-32 border-l-2 border-primary-gold/20 pl-6 md:pl-10">
          <h1 className="text-primary-gold font-bold uppercase tracking-[0.4em] mb-6 text-[10px]">The Digital Magazine</h1>
          <h2 className="text-4xl md:text-[7rem] font-serif font-bold text-white mb-10 leading-[0.9] tracking-tighter">Insights <br />& Perspectives</h2>
          <p className="text-xl text-white/50 leading-relaxed max-w-2xl">
            Trend reports, exclusive designer spotlights, and strategic business 
            insights from the forefront of the global Pakistani fashion industry.
          </p>
        </div>

        {/* Featured Post */}
        <div className="mb-48">
            <Link href="/blog/1" className="group grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
                <div className="lg:col-span-7 relative aspect-[16/9] overflow-hidden shadow-2xl">
                    <div className="absolute inset-0 bg-luxury-black/30 group-hover:bg-transparent transition-all z-10 duration-700"></div>
                    <Image
                        src={posts[0].image}
                        alt={posts[0].title}
                        fill
                        className="object-cover transition-all duration-1000 group-hover:scale-105 group-hover:rotate-1 grayscale group-hover:grayscale-0"
                    />
                </div>
                <div className="lg:col-span-5">
                    <span className="text-primary-gold font-bold uppercase tracking-[0.3em] text-[10px] mb-6 block">{posts[0].category} — {posts[0].date}</span>
                    <h3 className="text-3xl md:text-6xl font-serif font-bold mb-8 text-white group-hover:text-primary-gold transition-colors leading-tight tracking-tight group-hover:italic">
                      {posts[0].title}
                    </h3>
                    <p className="text-lg text-white/40 mb-10 leading-relaxed font-medium">
                        {posts[0].excerpt}
                    </p>
                    <span className="inline-block brand-gradient brand-gradient-hover text-white font-bold py-4 px-10 rounded-sm transition-all uppercase tracking-widest text-[10px] shadow-lg">
                      Read Exclusive Insight
                    </span>
                </div>
            </Link>
        </div>

        {/* Grid Posts */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-20 gap-y-32">
          {posts.slice(1).map((post) => (
            <Link key={post.id} href={`/blog/${post.id}`} className="group flex flex-col">
              <div className="relative aspect-[16/9] overflow-hidden mb-10 shadow-2xl">
                <div className="absolute inset-0 bg-luxury-black/40 group-hover:bg-transparent transition-all z-10 duration-700"></div>
                <Image
                  src={post.image}
                  alt={post.title}
                  fill
                  className="object-cover transition-all duration-1000 grayscale group-hover:grayscale-0 group-hover:scale-105"
                />
              </div>
              <span className="text-primary-gold font-bold uppercase tracking-[0.3em] text-[10px] mb-6 block">{post.category} • {post.date}</span>
              <h4 className="text-2xl md:text-4xl font-serif font-bold mb-6 text-white group-hover:text-primary-gold transition-colors group-hover:italic leading-tight tracking-tight duration-500">
                {post.title}
              </h4>
              <p className="text-sm text-white/40 leading-relaxed max-w-lg font-medium mb-8">
                {post.excerpt}
              </p>
              <div className="mt-auto flex items-center gap-3 text-primary-gold font-bold uppercase tracking-widest text-[10px] group-hover:translate-x-4 transition-all duration-500">
                Full Story <span className="text-xl">→</span>
              </div>
            </Link>
          ))}
        </div>

        {/* Newsletter Signup */}
        <div className="mt-32 md:mt-48 p-10 md:p-24 bg-white/[0.02] border border-white/5 relative overflow-hidden backdrop-blur-sm">
            <div className="absolute top-0 right-0 w-full h-full bg-primary-gold/[0.02] -skew-x-12 transform translate-x-1/2"></div>
            <div className="relative z-10 text-center max-w-2xl mx-auto">
                <h3 className="text-primary-gold font-bold uppercase tracking-[0.4em] text-[10px] mb-6">Stay Ahead</h3>
                <h4 className="text-4xl md:text-7xl font-serif font-bold text-white mb-8 tracking-tighter">The Insider Report</h4>
                <p className="text-white/40 mb-12 leading-relaxed font-medium">
                    Get exclusive trend reports and early access to VVIP event tickets directly in your inbox.
                </p>
                <form className="flex flex-col sm:flex-row gap-4">
                    <input 
                        type="email" 
                        placeholder="your@email.com" 
                        className="flex-1 bg-white/5 border border-white/10 text-white placeholder:text-white/20 px-8 py-5 focus:outline-none focus:border-primary-gold transition-all"
                    />
                    <button className="brand-gradient brand-gradient-hover text-white font-bold py-5 px-12 uppercase tracking-widest text-[10px] transition-all shadow-lg active:scale-95">
                      Join the Circle
                    </button>
                </form>
            </div>
        </div>
      </div>
    </div>
  );
}
