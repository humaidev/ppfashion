export default function PrivacyPage() {
  return (
    <div className="bg-luxury-black min-h-screen py-32 text-white">
      <div className="container mx-auto px-6 max-w-4xl">
        <h1 className="text-4xl md:text-6xl font-serif font-bold mb-12 italic gold-gradient-text">Privacy Policy</h1>
        <div className="space-y-8 text-white/70 leading-relaxed font-medium">
          <section>
            <h2 className="text-xl font-bold text-white uppercase tracking-widest mb-4">1. Data Collection</h2>
            <p>We collect essential information to provide elite fashion services, including identity verification documents for designers and contact details for members.</p>
          </section>
          <section>
            <h2 className="text-xl font-bold text-white uppercase tracking-widest mb-4">2. Usage</h2>
            <p>Your data is used exclusively for membership management, event applications, and secure communication within the PPFashion collective.</p>
          </section>
          <section>
            <h2 className="text-xl font-bold text-white uppercase tracking-widest mb-4">3. Security</h2>
            <p>We employ high-grade encryption and secure cloud storage to protect your professional dossier and personal information.</p>
          </section>
        </div>
      </div>
    </div>
  );
}
