const faqs = [
  {
    question: "How do I become a member?",
    answer: "You can apply through our Membership page. We offer three tiers: Basic, Premium, and Elite. Each application is reviewed by our board to ensure it meets our collective's standards of excellence.",
  },
  {
    question: "Are events open to non-members?",
    answer: "Most of our signature runway shows have a limited number of public tickets available. However, masterclasses and networking dinners are strictly members-only.",
  },
  {
    question: "Where are you based?",
    answer: "Our headquarters are in Glasgow, UK, but we hold events across London, Manchester, Dubai, and Lahore.",
  },
  {
    question: "Can I upgrade my membership later?",
    answer: "Yes, you can upgrade your membership tier at any time through your member dashboard. The pro-rated difference will be applied to your account.",
  },
];

export default function FAQPage() {
  return (
    <div className="bg-luxury-black min-h-screen py-32 pb-48">
      <div className="container mx-auto px-6 max-w-5xl">
        <div className="text-center mb-16 md:mb-32 border-b border-white/5 pb-12 md:pb-20 relative">
          <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-16 md:w-24 h-1 md:h-2 brand-gradient"></div>
          <h1 className="text-primary-gold font-bold uppercase tracking-[0.4em] mb-4 md:mb-6 text-[10px]">Inquiries</h1>
          <h2 className="text-4xl md:text-8xl font-serif font-bold text-white tracking-tighter">Frequently <br/>Asked Questions</h2>
        </div>

        <div className="space-y-20 max-w-4xl mx-auto">
          {faqs.map((faq, i) => (
            <div key={i} className="group">
              <h3 className="text-xl md:text-3xl font-serif font-bold mb-6 md:mb-8 text-white group-hover:text-primary-gold transition-all duration-500 group-hover:italic flex items-start gap-4">
                <span className="text-primary-gold opacity-30 group-hover:opacity-100 transition-opacity">0{i+1}.</span>
                {faq.question}
              </h3>
              <p className="text-base md:text-lg leading-relaxed text-white/50 pl-10 md:pl-12 border-l border-white/10 group-hover:border-primary-gold transition-colors duration-500 font-medium">
                {faq.answer}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-32 md:mt-48 text-center bg-white/[0.02] backdrop-blur-sm p-10 md:p-24 border border-white/5 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-full h-full bg-primary-gold/[0.02] -skew-x-12 transform translate-x-1/2"></div>
            <h3 className="text-4xl font-serif font-bold mb-8 text-white relative z-10 tracking-tight">Still have questions?</h3>
            <p className="text-white/40 mb-12 max-w-xl mx-auto font-medium relative z-10">Our global support team is available Monday through Friday to assist you with any inquiries regarding the collective.</p>
            <a href="/contact" className="relative z-10 inline-block brand-gradient brand-gradient-hover text-white font-bold py-5 px-16 rounded-sm transition-all uppercase tracking-widest text-[10px] shadow-2xl active:scale-95">
                Connect with Support
            </a>
        </div>
      </div>
    </div>
  );
}
