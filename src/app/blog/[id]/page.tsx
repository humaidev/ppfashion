import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

const posts = [
  {
    id: 1,
    title: "The Rise of Emerald in 2026 Bridal Wear",
    excerpt: "Exploring the evolution of color palettes in recent Pakistani runway shows and why emerald is the choice for elite designers.",
    date: "April 12, 2026",
    category: "Trends",
    image: "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?q=80&w=2080&auto=format&fit=crop",
    author: "Fatima Hussain",
    role: "Lead Fashion Curator",
    content: `
      <p>Emerald green has long been a staple in South Asian weddings, but 2026 marks its transformation from a traditional accent to a dominant primary theme. In this year's Pakistani runway shows, we've seen designers like Ayesha Malik and Elan move away from the traditional reds and maroons in favor of deep, velvet emeralds and jewel-toned silks.</p>
      
      <h3>Why Emerald?</h3>
      <p>The shift is driven by a desire for sophisticated royalty. Unlike red, which is synonymous with tradition, emerald offers a contemporary edge that feels both timeless and innovative. It provides a perfect canvas for gold tilla work and silver zardozi, making the intricate details pop in a way that lighter colors cannot achieve.</p>
      
      <h3>How to Style</h3>
      <p>For the modern bride, pairing emerald with champagne gold accessories or even contrasting ruby jewelry creates a look that is unmistakably elite. We're also seeing emerald integrated into men's formal wear, with sherwanis and waistcoats featuring deep green embroidery on charcoal bases.</p>
      
      <blockquote>"Emerald isn't just a color this season; it's a statement of power and heritage refined." — Ayesha Malik</blockquote>
    `,
  },
  {
    id: 2,
    title: "Navigating the Global Market as a Desi Designer",
    excerpt: "A guide for emerging designers on how to scale their brand internationally while maintaining cultural authenticity.",
    date: "March 28, 2026",
    category: "Business",
    image: "https://images.unsplash.com/photo-1558769132-cb1aea458c5e?q=80&w=1974&auto=format&fit=crop",
    author: "Zaid Omar",
    role: "Strategic Growth Advisor",
    content: `
      <p>Scaling a Pakistani fashion brand internationally requires more than just beautiful designs. It requires a deep understanding of global logistics, digital marketing, and most importantly, cultural storytelling.</p>
      
      <h3>Digital-First Approach</h3>
      <p>In 2026, your digital presence is your flagship store. Emerging designers must invest in high-fidelity visual assets and seamless e-commerce experiences. The global Pakistani diaspora is looking for quality, but they are also looking for a brand they can trust with international shipping and sizing accuracy.</p>
      
      <h3>Preserving Authenticity</h3>
      <p>The mistake many designers make is trying to 'Westernize' their designs too much. Global luxury markets are currently obsessed with authenticity. Your unique selling point is the thousands of years of heritage behind your embroidery techniques. Lean into that.</p>
    `,
  },
  {
    id: 3,
    title: "10 Minutes with Ayesha Malik",
    excerpt: "An exclusive interview with our newest Elite member about her journey from Glasgow to the global stage.",
    date: "March 15, 2026",
    category: "Spotlight",
    image: "https://images.unsplash.com/photo-1509631179647-0177331693ae?q=80&w=1976&auto=format&fit=crop",
    author: "Sara Khan",
    role: "Editor-in-Chief",
    content: `
      <p>We sat down with Ayesha Malik to discuss her recent collection 'Noor' and how being part of the Pakistani Passion for Fashion collective has helped her brand grow.</p>
      
      <h3>The Inspiration</h3>
      <p>Ayesha: "I wanted to create something that felt like home but looked like the future. My inspiration always comes from the streets of Lahore, but my execution is influenced by the architecture of Glasgow."</p>
      
      <h3>The Collective</h3>
      <p>"The networking opportunities within the collective are unparalleled. Being able to share supplier contacts and logistics advice with other designers has saved me years of trial and error."</p>
    `,
  },
];

export default async function BlogPostPage({ params }: { params: { id: string } }) {
  const postId = parseInt(params.id);
  const post = posts.find((p) => p.id === postId);

  if (!post) {
    notFound();
  }

  return (
    <div className="bg-warm-ivory dark:bg-luxury-black min-h-screen py-24">
      <div className="container mx-auto px-6 max-w-4xl">
        <Link href="/blog" className="text-primary-gold font-bold uppercase tracking-widest text-[10px] mb-12 inline-block hover:text-vibrant-gold transition-colors">
          ← Back to Magazine
        </Link>

        <article>
          <header className="mb-16">
            <div className="flex items-center gap-4 mb-8">
                <span className="text-primary-gold font-bold uppercase tracking-widest text-xs">{post.category}</span>
                <span className="text-luxury-black/30 dark:text-warm-ivory/30">•</span>
                <span className="text-luxury-black/50 dark:text-warm-ivory/50 font-bold uppercase tracking-widest text-xs">{post.date}</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-serif font-bold mb-10 leading-tight">{post.title}</h1>
            
            <div className="flex items-center gap-6 p-8 border-y border-primary-gold/10">
                <div className="relative w-16 h-16 rounded-full overflow-hidden grayscale">
                    <Image src={`https://i.pravatar.cc/100?u=${post.id}`} alt={post.author} fill className="object-cover" />
                </div>
                <div>
                    <p className="text-luxury-black dark:text-white font-bold uppercase tracking-widest text-xs mb-1">{post.author}</p>
                    <p className="text-primary-gold font-bold uppercase tracking-widest text-[9px]">{post.role}</p>
                </div>
            </div>
          </header>

          <div className="relative aspect-video w-full overflow-hidden mb-16 shadow-2xl">
            <Image
                src={post.image}
                alt={post.title}
                fill
                className="object-cover"
                priority
            />
          </div>

          <div 
            className="prose prose-xl dark:prose-invert max-w-none prose-headings:font-serif prose-headings:text-primary-gold prose-blockquote:border-primary-gold prose-blockquote:bg-primary-gold/5 prose-blockquote:p-8 prose-blockquote:font-serif prose-blockquote:italic"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />
        </article>

        <div className="mt-32 pt-20 border-t border-primary-gold/10">
            <h3 className="text-2xl font-serif font-bold mb-12">More Perspectives</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                {posts.filter(p => p.id !== postId).slice(0, 2).map((otherPost) => (
                    <Link key={otherPost.id} href={`/blog/${otherPost.id}`} className="group">
                        <div className="relative aspect-video overflow-hidden mb-6">
                            <Image src={otherPost.image} alt={otherPost.title} fill className="object-cover grayscale group-hover:grayscale-0 transition-all" />
                        </div>
                        <h4 className="text-xl font-serif font-bold group-hover:text-primary-gold transition-colors">{otherPost.title}</h4>
                    </Link>
                ))}
            </div>
        </div>
      </div>
    </div>
  );
}
