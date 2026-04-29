import Image from "next/image";
import AnimatedSection from "@/components/AnimatedSection";

export default function AboutPage() {
  return (
    <div className="bg-luxury-black min-h-screen">
      {/* Hero Header */}
      <section className="py-32 border-b border-white/5 relative overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src="/runway-bridal-1.jpg"
            alt="About Background"
            fill
            className="object-cover opacity-20 brightness-[0.5] scale-110 animate-[pulse_15s_infinite_alternate]"
          />
        </div>
        <AnimatedSection className="container mx-auto px-6 text-center relative z-10">
          <h1 className="text-primary-gold font-bold uppercase tracking-[0.4em] mb-6 text-[10px] md:text-sm">Our Story</h1>
          <h2 className="text-4xl md:text-8xl font-serif font-bold text-white tracking-tighter">Pakistani Passion <br/>for Fashion</h2>
        </AnimatedSection>
      </section>

      {/* Mission & Vision */}
      <section className="py-40">
        <div className="container mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-24 items-center">
          <AnimatedSection className="relative aspect-square">
            <Image
              src="/event-group.jpg"
              alt="Pakistani Passion for Fashion Collective"
              fill
              className="object-cover rounded-sm grayscale hover:grayscale-0 transition-all duration-1000 shadow-2xl"
            />
            <div className="absolute -bottom-10 -right-10 w-64 h-64 brand-gradient -z-10 hidden md:block opacity-30 blur-3xl animate-pulse"></div>
          </AnimatedSection>
          
          <AnimatedSection className="border-l-2 border-primary-gold/20 pl-6 md:pl-12" delay={0.2}>
            <h3 className="text-3xl md:text-5xl font-serif font-bold mb-10 text-white tracking-tight italic">Elevating South Asian Heritage</h3>
            <p className="text-xl text-white/60 mb-10 leading-relaxed font-medium">
              Pakistani Passion for Fashion was born out of a desire to create a permanent, 
              prestigious digital home for South Asian fashion talent. 
            </p>
            <p className="text-xl text-white/60 mb-12 leading-relaxed font-medium">
              We provide a unified ecosystem where emerging designers can stand 
              alongside established brands, sharing resources and the global spotlight.
            </p>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-12 pt-10 border-t border-white/5">
              <div>
                <h4 className="text-primary-gold font-bold uppercase tracking-[0.3em] text-[10px] mb-6">Our Mission</h4>
                <p className="text-white/50 text-sm leading-relaxed italic border-l border-primary-gold/30 pl-4">To represent the pinnacle of South Asian fashion excellence in the UK.</p>
              </div>
              <div>
                <h4 className="text-primary-gold font-bold uppercase tracking-[0.3em] text-[10px] mb-6">Our Goal</h4>
                <p className="text-white/50 text-sm leading-relaxed italic border-l border-primary-gold/30 pl-4">To create a global network of professionals and buyers.</p>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Philosophy Section */}
      <section className="py-40 bg-white/[0.02] border-y border-white/5 relative overflow-hidden">
        <div className="container mx-auto px-6 relative z-10">
          <AnimatedSection className="max-w-5xl mx-auto text-center mb-16 md:mb-24">
            <h3 className="text-primary-gold font-bold uppercase tracking-[0.4em] text-[10px] mb-6">Our Philosophy</h3>
            <h4 className="text-4xl md:text-8xl font-serif font-bold text-white tracking-tighter">More Than Just a Show</h4>
          </AnimatedSection>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { title: "Community", desc: "Fostering genuine connections between designers and buyers." },
              { title: "Innovation", desc: "Blending traditional craftsmanship with modern technology." },
              { title: "Legacy", desc: "Preserving cultural heritage for future designers." }
            ].map((item, i) => (
              <AnimatedSection key={i} delay={i * 0.2} className="group p-12 border border-white/5 hover:border-primary-gold/30 transition-all duration-500 bg-luxury-black/50 backdrop-blur-sm">
                <h5 className="text-3xl font-serif font-bold mb-6 text-primary-gold group-hover:italic transition-all">{item.title}</h5>
                <p className="text-white/50 leading-relaxed text-sm font-medium">{item.desc}</p>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
