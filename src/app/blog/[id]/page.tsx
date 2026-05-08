"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { notFound, useParams } from "next/navigation";

export default function BlogPostPage() {
  const params = useParams();
  const [post, setPost] = useState<any>(null);
  const [otherPosts, setOtherPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const res = await fetch(`/api/blogs/${params.id}`);
        const data = await res.json();
        if (data.success) {
          setPost(data.blog);
        } else {
          setPost(null);
        }

        const othersRes = await fetch("/api/blogs");
        const othersData = await othersRes.json();
        if (othersData.success) {
          setOtherPosts(othersData.blogs.filter((b: any) => b._id !== params.id).slice(0, 2));
        }
      } catch (err) {
        console.error("Post fetch failed");
      } finally {
        setLoading(false);
      }
    };
    if (params.id) fetchPost();
  }, [params.id]);

  if (loading) return (
    <div className="min-h-screen bg-luxury-black flex items-center justify-center">
      <div className="w-12 h-12 border-2 border-primary-gold border-t-transparent rounded-full animate-spin"></div>
    </div>
  );

  if (!post) return notFound();

  return (
    <div className="bg-warm-ivory dark:bg-luxury-black min-h-screen py-24">
      <div className="container mx-auto px-6 max-w-4xl">
        <Link href="/blog" className="text-primary-gold font-bold uppercase tracking-widest text-[10px] mb-12 inline-block hover:text-vibrant-gold transition-colors">
          ← Back to Magazine
        </Link>

        <article>
          <header className="mb-16">
            <div className="flex items-center gap-4 mb-8">
                <span className="text-primary-gold font-bold uppercase tracking-widest text-xs">Insight</span>
                <span className="text-luxury-black/30 dark:text-warm-ivory/30">•</span>
                <span className="text-luxury-black/50 dark:text-warm-ivory/50 font-bold uppercase tracking-widest text-xs">{new Date(post.createdAt).toLocaleDateString()}</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-serif font-bold mb-10 leading-tight text-white">{post.title}</h1>
            
            <div className="flex items-center gap-6 p-8 border-y border-primary-gold/10">
                <div className="relative w-16 h-16 rounded-full overflow-hidden grayscale">
                    <Image src={`https://i.pravatar.cc/100?u=${post.author}`} alt={post.author} fill className="object-cover" />
                </div>
                <div>
                    <p className="text-luxury-black dark:text-white font-bold uppercase tracking-widest text-xs mb-1">{post.author}</p>
                    <p className="text-primary-gold font-bold uppercase tracking-widest text-[9px]">Contributor — PPFashion Collective</p>
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
            className="prose prose-xl dark:prose-invert max-w-none prose-headings:font-serif prose-headings:text-primary-gold prose-blockquote:border-primary-gold prose-blockquote:bg-primary-gold/5 prose-blockquote:p-8 prose-blockquote:font-serif prose-blockquote:italic text-white/70"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />
        </article>

        {otherPosts.length > 0 && (
          <div className="mt-32 pt-20 border-t border-primary-gold/10">
              <h3 className="text-2xl font-serif font-bold mb-12 text-white italic">More Perspectives</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                  {otherPosts.map((otherPost) => (
                      <Link key={otherPost._id} href={`/blog/${otherPost._id}`} className="group">
                          <div className="relative aspect-video overflow-hidden mb-6">
                              <Image src={otherPost.image} alt={otherPost.title} fill className="object-cover grayscale group-hover:grayscale-0 transition-all" />
                          </div>
                          <h4 className="text-xl font-serif font-bold text-white group-hover:text-primary-gold transition-colors">{otherPost.title}</h4>
                      </Link>
                  ))}
              </div>
          </div>
        )}
      </div>
    </div>
  );
}
