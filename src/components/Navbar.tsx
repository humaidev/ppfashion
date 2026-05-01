"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useRouter, usePathname } from "next/navigation";

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [userRole, setUserRole] = useState<string | null>(null);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const checkAuth = async () => {
    try {
      const res = await fetch("/api/auth/status");
      const data = await res.json();
      setIsLoggedIn(data.isLoggedIn);
      setUserRole(data.role || 'DESIGNER');
    } catch (err) {
      setIsLoggedIn(false);
      setUserRole(null);
    }
  };

  useEffect(() => {
    checkAuth();
    setIsUserMenuOpen(false); // Close menu on route change
  }, [pathname]);

  const handleLogout = async () => {
    try {
      await fetch("/api/logout", { method: "POST" });
      setIsLoggedIn(false);
      setIsUserMenuOpen(false);
      router.push("/");
      router.refresh(); // Clear client cache
    } catch (err) {
      console.error("Logout failed", err);
    }
  };

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
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 flex items-center ${isScrolled
          ? "bg-luxury-black/95 backdrop-blur-md shadow-2xl border-b border-secondary-emerald/20 h-[100px]"
          : "bg-transparent h-[100px]"
          }`}
      >
        <div className="container mx-auto px-6 flex justify-between items-center h-full">
          {/* Logo Container */}
          <div className="flex items-center h-full relative -top-2">
            <Link
              href="/"
              className="flex items-center hover:opacity-100 transition-opacity duration-300"
            >
              <Image
                src="/logo.png"
                alt="PPFashion Logo"
                width={500}
                height={200}
                className="object-contain w-auto h-[80px] md:h-[90px]"
                priority
                unoptimized
              />
            </Link>
          </div>

          {/* Desktop Links */}
          <div className="hidden xl:flex items-center space-x-8 relative -top-2">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className={`nav-link-hover text-[13px] font-bold hover:text-primary-gold transition-colors uppercase tracking-[0.2em] ${isScrolled ? "text-white/90" : "text-white"}`}
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* Desktop Actions */}
          <div className="hidden xl:flex items-center space-x-6 relative -top-2">
            {isLoggedIn ? (
              <div className="relative">
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center gap-3 group"
                >
                  <div className="w-10 h-10 rounded-full border border-primary-gold/30 flex items-center justify-center bg-white/5 group-hover:border-primary-gold transition-all overflow-hidden">
                    <svg className="w-5 h-5 text-primary-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                </button>

                <AnimatePresence>
                  {isUserMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="absolute right-0 mt-4 w-64 bg-luxury-black border border-white/10 shadow-2xl py-4 z-50"
                    >
                      {/* <div className="px-6 py-4 border-b border-white/5 mb-2">
                        <p className="text-[10px] font-black uppercase tracking-widest text-primary-gold">Member Menu</p>
                      </div> */}
                      <Link href="/dashboard" className="flex items-center px-6 py-3 text-[11px] font-bold uppercase tracking-widest text-white/70 hover:text-white hover:bg-white/5 transition-all">
                        Dashboard
                      </Link>
                      <Link href="/profile" className="flex items-center px-6 py-3 text-[11px] font-bold uppercase tracking-widest text-white/70 hover:text-white hover:bg-white/5 transition-all">
                        My Profile
                      </Link>
                      <Link href="/change-password" className="flex items-center px-6 py-3 text-[11px] font-bold uppercase tracking-widest text-white/70 hover:text-white hover:bg-white/5 transition-all">
                        Change Password
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="w-full text-left flex items-center px-6 py-3 text-[11px] font-bold uppercase tracking-widest text-red-500 hover:bg-red-500/5 transition-all mt-2 border-t border-white/5"
                      >
                        Logout
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <Link
                href="/login"
                className={`text-[11px] font-bold transition-all px-4 py-2 border rounded-sm uppercase tracking-widest ${isScrolled ? "text-white/70 border-white/20 hover:text-white hover:border-white/60" : "text-white border-white/30 hover:border-white/80"}`}
              >
                Log in
              </Link>
            )}
            <Link
              href="/membership"
              className="brand-gradient brand-gradient-hover text-white font-bold py-3 px-8 rounded-sm transition-all shadow-[0_0_20px_rgba(0,79,52,0.3)] active:scale-95 uppercase text-[10px] tracking-[0.2em]"
            >
              Become a Member
            </Link>
          </div>

          {/* Mobile Toggle */}
          <button
            className="xl:hidden text-white p-2 hover:bg-white/5 rounded-full transition-all relative -top-2"
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
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed top-0 left-0 h-full w-[85%] max-w-sm bg-white shadow-2xl z-[110] overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex flex-col h-full p-8">
                <div className="flex justify-between items-center mb-10">
                  <div className="bg-white p-1 rounded-sm">
                    <Image src="/pp.jpeg" alt="Logo" width={130} height={30} className="object-contain mix-blend-multiply" />
                  </div>
                  <button onClick={() => setIsMenuOpen(false)} className="text-black p-2 hover:bg-black/5 rounded-full transition-colors">
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                <div className="flex flex-col space-y-8 mb-auto pr-4">
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
                  {isLoggedIn ? (
                    <button
                      onClick={() => {
                        handleLogout();
                        setIsMenuOpen(false);
                      }}
                      className="w-full text-center text-sm font-bold text-red-500 py-4 border border-red-500/10 rounded-sm uppercase tracking-widest hover:bg-red-500/5 transition-all"
                    >
                      Logout
                    </button>
                  ) : (
                    <Link
                      href="/login"
                      className="w-full text-center text-sm font-bold text-black/70 py-4 border border-black/10 rounded-sm uppercase tracking-widest hover:bg-black/5 transition-all"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Log in
                    </Link>
                  )}
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
