import Link from "next/link";
import Image from "next/image";

export default function Footer() {
  return (
    <footer className="bg-luxury-black text-white py-20 border-t border-white/5 relative overflow-hidden">
      {/* Subtle Top Accent */}
      <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-primary-gold/10 to-transparent"></div>

      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-16 md:gap-12 lg:gap-8">

          {/* Brand Info */}
          <div className="lg:col-span-5">
            <Link href="/" className="inline-block mb-8 hover:opacity-80 transition-all origin-left">
                <Image
                  src="/logo.png"
                  alt="PPFashion Logo"
                  width={200}
                  height={60}
                  className="object-contain"
                  unoptimized
                />
            </Link>
            <p className="text-white/40 max-w-sm mb-10 leading-relaxed text-sm font-medium italic">
              Empowering the elite Pakistani fashion collective through exclusive networking and high-profile global showcases.
            </p>
            <div className="flex gap-6 mb-10">
              {['Instagram', 'LinkedIn', 'Twitter'].map(social => (
                <a key={social} href="#" className="text-[9px] font-bold uppercase tracking-[0.3em] text-white/20 hover:text-primary-gold transition-colors">{social}</a>
              ))}
            </div>
            <Link
              href="/membership"
              className="brand-gradient brand-gradient-hover inline-block text-white font-bold py-4 px-10 rounded-sm transition-all shadow-xl shadow-secondary-emerald/20 uppercase text-[9px] tracking-[0.3em]"
            >
              Become a Member
            </Link>
          </div>

          {/* Links and Contact in a 2-column grid on small screens if possible, or 1 column but compact */}
          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-12 sm:gap-8">
            {/* The Collective */}
            <div>
              <h3 className="text-[12px] font-black gold-gradient-text uppercase tracking-[0.4em] mb-8 pb-2 border-b border-primary-gold/20 drop-shadow-[0_0_10px_rgba(198,165,92,0.4)]">The Collective</h3>
              <ul className="space-y-4">
                {[
                  { name: 'Our Story', href: '/about' },
                  { name: 'Global Events', href: '/events' },
                  { name: 'Designers', href: '/designers' },
                  { name: 'Membership', href: '/membership' },
                  { name: 'FAQ', href: '/faq' },
                  { name: 'Contact Us', href: '/contact' }
                ].map(link => (
                  <li key={link.name}>
                    <Link href={link.href} className="text-[11px] font-bold uppercase tracking-[0.2em] text-white/50 hover:text-white transition-colors">
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact Registry */}
            <div>
              <h3 className="text-[12px] font-black gold-gradient-text uppercase tracking-[0.4em] mb-8 pb-2 border-b border-primary-gold/20 drop-shadow-[0_0_10px_rgba(198,165,92,0.4)]">Registry</h3>
              <div className="space-y-8">
                <div>
                  <p className="text-[9px] font-bold text-white/20 uppercase tracking-[0.3em] mb-2">Global Headquarters</p>
                  <p className="text-[12px] font-serif font-bold text-white/70 leading-relaxed tracking-tight">124 St Vincent St, <br />Glasgow G2 5HF, UK</p>
                </div>
                <div>
                  <p className="text-[9px] font-bold text-white/20 uppercase tracking-[0.3em] mb-2">Electronic Mail</p>
                  <p className="text-[12px] font-serif font-bold text-white/70 tracking-tight">registry@ppfassion.com</p>
                </div>
                <div>
                  <p className="text-[9px] font-bold text-white/20 uppercase tracking-[0.3em] mb-2">Direct Inquiry</p>
                  <p className="text-[12px] font-serif font-bold text-white/70 tracking-tight">+44 (0) 141 555 7800</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Legal Bar */}
        <div className="mt-20 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <p className="text-white/20 text-[8px] font-bold uppercase tracking-[0.4em]">
            &copy; {new Date().getFullYear()} Pakistani Passion for Fashion. International Rights Reserved.
          </p>
          <div className="flex flex-wrap gap-6 text-white/10 text-[8px] font-bold uppercase tracking-[0.3em]">
            <a href="#" className="hover:text-white transition-colors">Privacy</a>
            <a href="#" className="hover:text-white transition-colors">Terms</a>
            <a href="#" className="hover:text-white transition-colors">Diversity</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
