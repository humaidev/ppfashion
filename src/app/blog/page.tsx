"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";

export default function BlogPage() {
  const [blogs, setBlogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const res = await fetch(`/api/blogs?t=${Date.now()}`, { cache: 'no-store' });
        const data = await res.json();
        if (data.success) setBlogs(data.blogs);
      } catch (err) {
        console.error("Blog fetch failed");
      } finally {
        setLoading(false);
      }
    };
    fetchBlogs();
  }, []);

  if (loading) return (
    <div className="min-h-screen bg-luxury-black flex items-center justify-center">
      <div className="w-12 h-12 border-2 border-primary-gold border-t-transparent rounded-full animate-spin"></div>
    </div>
  );

  const featuredPost = blogs[0];
  const gridPosts = blogs.slice(1);

  return (
    <div className="bg-luxury-black min-h-screen py-32 pb-40">
      <div className="container mx-auto px-6">
        <div className="max-w-4xl mb-20 md:mb-32 border-l-2 border-primary-gold/20 pl-6 md:pl-10">
          <div className="flex items-center gap-4 mb-6">
            <h1 className="text-primary-gold font-bold uppercase tracking-[0.4em] text-[10px]">The Digital Magazine</h1>
            <span className="bg-primary-gold/10 text-primary-gold text-[8px] px-3 py-1 rounded-full font-black animate-pulse uppercase tracking-widest">Live Sync Active</span>
          </div>
          <h2 className="text-4xl md:text-[7rem] font-serif font-bold text-white mb-10 leading-[0.9] tracking-tighter">Insights <br />& Perspectives</h2>
          <p className="text-xl text-white/50 leading-relaxed max-w-2xl">
            Trend reports, exclusive designer spotlights, and strategic business 
            insights from the forefront of the global Pakistani fashion industry.
          </p>
        </div>

        {blogs.length === 0 ? (
          <div className="py-20 text-center border border-dashed border-white/5">
             <p className="text-white/20 uppercase tracking-[0.4em] text-[10px] font-bold">The archives are currently being curated</p>
          </div>
        ) : (
          <>
            {/* Featured Post */}
            {featuredPost && (
              <div className="mb-48">
                  <Link href={`/blog/${featuredPost._id}`} className="group grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
                      <div className="lg:col-span-7 relative aspect-[16/9] overflow-hidden shadow-2xl">
                          <div className="absolute inset-0 bg-luxury-black/30 group-hover:bg-transparent transition-all z-10 duration-700"></div>
                          <Image
                              src={featuredPost.image}
                              alt={featuredPost.title}
                              fill
                              className="object-cover transition-all duration-1000 group-hover:scale-105 group-hover:rotate-1 grayscale group-hover:grayscale-0"
                          />
                      </div>
                      <div className="lg:col-span-5">
                          <span className="text-primary-gold font-bold uppercase tracking-[0.3em] text-[10px] mb-6 block">Spotlight — {new Date(featuredPost.createdAt).toLocaleDateString()}</span>
                          <h3 className="text-3xl md:text-6xl font-serif font-bold mb-8 text-white group-hover:text-primary-gold transition-colors leading-tight tracking-tight group-hover:italic">
                            {featuredPost.title}
                          </h3>
                          <p className="text-lg text-white/40 mb-10 leading-relaxed font-medium line-clamp-3">
                              {featuredPost.excerpt}
                          </p>
                          <span className="inline-block brand-gradient brand-gradient-hover text-white font-bold py-4 px-10 rounded-sm transition-all uppercase tracking-widest text-[10px] shadow-lg">
                            Read Exclusive Insight
                          </span>
                      </div>
                  </Link>
              </div>
            )}

            {/* Grid Posts */}
            {gridPosts.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-20 gap-y-32">
                {gridPosts.map((post) => (
                  <Link key={post._id} href={`/blog/${post._id}`} className="group flex flex-col">
                    <div className="relative aspect-[16/9] overflow-hidden mb-10 shadow-2xl">
                      <div className="absolute inset-0 bg-luxury-black/40 group-hover:bg-transparent transition-all z-10 duration-700"></div>
                      <Image
                        src={post.image}
                        alt={post.title}
                        fill
                        className="object-cover transition-all duration-1000 grayscale group-hover:grayscale-0 group-hover:scale-105"
                      />
                    </div>
                    <span className="text-primary-gold font-bold uppercase tracking-[0.3em] text-[10px] mb-6 block">Perspectives • {new Date(post.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                    <h4 className="text-2xl md:text-4xl font-serif font-bold mb-6 text-white group-hover:text-primary-gold transition-colors group-hover:italic leading-tight tracking-tight duration-500">
                      {post.title}
                    </h4>
                    <p className="text-sm text-white/40 leading-relaxed max-w-lg font-medium mb-8 line-clamp-3">
                      {post.excerpt}
                    </p>
                    <div className="mt-auto flex items-center gap-3 text-primary-gold font-bold uppercase tracking-widest text-[10px] group-hover:translate-x-4 transition-all duration-500">
                      Full Story <span className="text-xl">→</span>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </>
        )}

        {/* Newsletter Signup */}
        <div className="mt-56 p-10 md:p-24 bg-white/[0.02] border border-white/5 relative overflow-hidden backdrop-blur-sm">
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
