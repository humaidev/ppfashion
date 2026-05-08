export default function TermsPage() {
  return (
    <div className="bg-luxury-black min-h-screen py-32 text-white">
      <div className="container mx-auto px-6 max-w-4xl">
        <h1 className="text-4xl md:text-6xl font-serif font-bold mb-12 italic gold-gradient-text">Terms of Service</h1>
        <div className="space-y-8 text-white/70 leading-relaxed font-medium">
          <section>
            <h2 className="text-xl font-bold text-white uppercase tracking-widest mb-4">1. Membership</h2>
            <p>Membership in the collective is subject to rigorous review and approval by our elite jury. We reserve the right to revoke membership for violations of our code of excellence.</p>
          </section>
          <section>
            <h2 className="text-xl font-bold text-white uppercase tracking-widest mb-4">2. Professional Conduct</h2>
            <p>Members are expected to maintain the highest standards of professionalism during all global events and showcases.</p>
          </section>
          <section>
            <h2 className="text-xl font-bold text-white uppercase tracking-widest mb-4">3. Intellectual Property</h2>
            <p>Designers retain all rights to their original creations. PPFashion retains rights to promotional material generated during our showcases.</p>
          </section>
        </div>
      </div>
    </div>
  );
}
