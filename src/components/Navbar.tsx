"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "About", href: "/about" },
    { name: "Events", href: "/events" },
    { name: "Designers", href: "/designers" },
    { name: "Membership", href: "/membership" },
    { name: "Blog", href: "/blog" },
    { name: "Contact", href: "/contact" },
  ];

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${isScrolled
          ? "bg-white shadow-lg border-b border-black/5 py-3"
          : "bg-white py-6"
          }`}
      >
        <div className="container mx-auto px-6 flex justify-between items-center">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-3 hover:opacity-90 transition-opacity duration-300 transform hover:scale-105"
          >
            <Image
              src="/pp.png"
              alt="PPFashion Logo"
              width={140}
              height={35}
              className="object-contain md:w-[170px]"
              priority
            />
          </Link>

          {/* Desktop Links */}
          <div className="hidden xl:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="nav-link-hover text-[11px] font-bold hover:text-primary-gold transition-colors uppercase tracking-[0.2em] text-black/80"
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* Desktop Actions */}
          <div className="hidden xl:flex items-center space-x-4">
            <Link
              href="/login"
              className="text-[11px] font-bold text-black/70 hover:text-black transition-all px-4 py-2 border border-black/20 hover:border-black/60 rounded-sm uppercase tracking-widest"
            >
              Log in
            </Link>
            <Link
              href="/membership"
              className="brand-gradient brand-gradient-hover text-white font-bold py-3 px-8 rounded-sm transition-all shadow-[0_0_20px_rgba(194,2,122,0.3)] active:scale-95 uppercase text-[10px] tracking-[0.2em]"
            >
              Become a Member
            </Link>
          </div>

          {/* Mobile Toggle */}
          <button 
            className="xl:hidden text-black p-2 hover:bg-black/5 rounded-full transition-all"
            onClick={() => setIsMenuOpen(true)}
          >
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </nav>

      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {isMenuOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100]"
              onClick={() => setIsMenuOpen(false)}
            />
            <motion.div 
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 h-full w-[85%] max-w-sm bg-white shadow-2xl z-[110]"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex flex-col h-full p-8">
                <div className="flex justify-between items-center mb-16">
                  <Image src="/pp.png" alt="Logo" width={120} height={30} className="object-contain" />
                  <button onClick={() => setIsMenuOpen(false)} className="text-black p-2 hover:bg-black/5 rounded-full transition-colors">
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                <div className="flex flex-col space-y-8 mb-auto overflow-y-auto pr-4">
                  {navLinks.map((link) => (
                    <Link
                      key={link.name}
                      href={link.href}
                      className="text-2xl font-serif font-bold text-black hover:text-primary-gold transition-colors tracking-tight"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      {link.name}
                    </Link>
                  ))}
                </div>

                <div className="flex flex-col space-y-4 pt-10 border-t border-black/5 mt-8">
                  <Link href="/login" className="w-full text-center text-sm font-bold text-black/70 py-4 border border-black/10 rounded-sm uppercase tracking-widest hover:bg-black/5 transition-all">Log in</Link>
                  <Link href="/membership" className="w-full text-center brand-gradient text-white font-bold py-5 rounded-sm uppercase tracking-widest text-[11px] shadow-lg shadow-primary-gold/20">Become a Member</Link>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
