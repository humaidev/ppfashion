"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import StripePaymentForm from "@/components/StripePaymentForm";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

export default function KYCPage() {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const [formData, setFormData] = useState({
    cnic: "",
    passport: "",
    businessName: "",
    category: "",
    experience: "",
    portfolioLinks: "", 
    city: "",
    address: "",
    documents: {
      cnicFront: "",
      cnicBack: "",
      selfieWithCnic: "",
      license: ""
    }
  });
  const [plans, setPlans] = useState<any[]>([]);
  const [selectedPlan, setSelectedPlan] = useState<any>(null);

  const [agreed, setAgreed] = useState(false);

  useEffect(() => {
    // Check if user is logged in
    const checkUser = async () => {
      const res = await fetch("/api/auth/profile");
      const data = await res.json();
      if (!data.success) {
        router.push("/login");
        return;
      }
      
      if (data.user?.kycStatus !== 'NOT_SUBMITTED') {
        // Pre-fill form if data exists
        setFormData({
          ...formData,
          cnic: data.user.kycData?.cnic || "",
          passport: data.user.kycData?.passport || "",
          businessName: data.user.kycData?.businessName || "",
          category: data.user.kycData?.category || "",
          experience: data.user.kycData?.experience || "",
          portfolioLinks: data.user.kycData?.portfolioLinks?.join(", ") || "",
          city: data.user.kycData?.city || "",
          address: data.user.kycData?.address || "",
          documents: {
            cnicFront: data.user.kycData?.documents?.cnicFront || "",
            cnicBack: data.user.kycData?.documents?.cnicBack || "",
            selfieWithCnic: data.user.kycData?.documents?.selfieWithCnic || "",
            license: data.user.kycData?.documents?.license || ""
          }
        });
        
        if (data.user.kycStatus === 'APPROVED' || data.user.kycStatus === 'PENDING') {
           setStep(6); // Success / View mode
        }
      }
    };
    const fetchPlans = async () => {
      const res = await fetch("/api/plans");
      const data = await res.json();
      if (data.success) setPlans(data.plans);
    };
    checkUser();
    fetchPlans();
  }, [router]);

  const handlePaymentSuccess = async (paymentIntent: any) => {
    setLoading(true);
    setError("");

    try {
      // Finalize KYC Submission
      const res = await fetch("/api/kyc/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          portfolioLinks: formData.portfolioLinks.split(",").map(s => s.trim()).filter(s => s)
        }),
      });

      const data = await res.json();
      if (data.success) {
        setStep(6); // Success screen
      } else {
        setError(data.message || "KYC submission failed");
      }
    } catch (err) {
      setError("Server error during final processing");
    } finally {
      setLoading(false);
    }
  };

  const nextStep = () => {
    setError("");
    if (step === 1) {
      if (!formData.cnic) {
        setError("Identity Number (CNIC) field is missing. Please fill this to proceed.");
        return;
      }
    }
    if (step === 2) {
      if (!formData.businessName || !formData.category || !formData.experience) {
        setError("One or more business profile details are missing. Please complete all fields.");
        return;
      }
    }
    if (step === 3) {
      if (!formData.city || !formData.address) {
        setError("Location and address details have not been filled. Please provide them.");
        return;
      }
    }
    setStep(s => s + 1);
  };
  const prevStep = () => {
    setError("");
    setStep(s => s - 1);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (name.startsWith("doc_")) {
      const docName = name.replace("doc_", "");
      setFormData({
        ...formData,
        documents: { ...formData.documents, [docName]: value }
      });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  return (
    <div className="min-h-screen bg-luxury-black py-20 px-6">
      <div className="container mx-auto max-w-3xl">
        <div className="text-center mb-16">
          <h1 className="text-primary-gold font-bold uppercase tracking-[0.5em] text-[10px] mb-4">Verification Registry</h1>
          <h2 className="text-4xl font-serif font-bold text-white tracking-tighter uppercase">Submit Your KYC</h2>
          <div className="flex justify-center mt-10 gap-4">
             {[1, 2, 3, 4, 5].map(i => (
               <div key={i} className={`w-12 h-1 ${step >= i ? 'bg-primary-gold' : 'bg-white/10'}`}></div>
             ))}
          </div>
        </div>

        <div className="bg-white/[0.02] border border-white/5 p-10 md:p-16 shadow-2xl relative">
          {error && <div className="mb-10 p-4 bg-red-500/10 border border-red-500/20 text-red-500 text-[10px] uppercase tracking-widest text-center">{error}</div>}

          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} key="step1">
                <h3 className="text-xl font-serif font-bold mb-10 italic text-white/90">Step 1: Identity Information</h3>
                <div className="space-y-8">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-white/30">CNIC / ID Number</label>
                    <input type="text" name="cnic" required value={formData.cnic} onChange={handleInputChange} className="kyc-input" placeholder="42101-0000000-1" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-white/30">Passport Number (Optional)</label>
                    <input type="text" name="passport" value={formData.passport} onChange={handleInputChange} className="kyc-input" placeholder="AB1234567" />
                  </div>
                </div>
                <div className="mt-12 flex justify-end">
                   <button onClick={nextStep} className="kyc-btn-primary">Next: Business Details →</button>
                </div>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} key="step2">
                <h3 className="text-xl font-serif font-bold mb-10 italic text-white/90">Step 2: Business Profile</h3>
                <div className="space-y-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-white/30">Business / Brand Name</label>
                      <input type="text" name="businessName" required value={formData.businessName} onChange={handleInputChange} className="kyc-input" placeholder="Ethereal Couture" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-white/30">Category</label>
                      <select name="category" required value={formData.category} onChange={handleInputChange} className="kyc-input">
                        <option value="" className="bg-luxury-black">Select Category</option>
                        <option value="Bridal" className="bg-luxury-black">Bridal Couture</option>
                        <option value="Pret" className="bg-luxury-black">Luxury Pret</option>
                        <option value="Formal" className="bg-luxury-black">Men's Formal</option>
                        <option value="Jewelry" className="bg-luxury-black">Luxury Jewelry</option>
                      </select>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-white/30">Experience (Years)</label>
                    <input type="number" name="experience" required value={formData.experience} onChange={handleInputChange} className="kyc-input" placeholder="5" min="0" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-white/30">Portfolio / Social Links (Comma separated)</label>
                    <textarea name="portfolioLinks" value={formData.portfolioLinks} onChange={handleInputChange} className="kyc-input min-h-[100px]" placeholder="https://instagram.com/brand, https://behance.net/portfolio" />
                  </div>
                </div>
                <div className="mt-12 flex justify-between">
                   <button onClick={prevStep} className="kyc-btn-secondary">← Back</button>
                   <button onClick={nextStep} className="kyc-btn-primary">Next: Location →</button>
                </div>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} key="step3">
                <h3 className="text-xl font-serif font-bold mb-10 italic text-white/90">Step 3: Official Address</h3>
                <div className="space-y-8">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-white/30">City</label>
                    <input type="text" name="city" required value={formData.city} onChange={handleInputChange} className="kyc-input" placeholder="London / Lahore / Dubai" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-white/30">Complete Address</label>
                    <textarea name="address" required value={formData.address} onChange={handleInputChange} className="kyc-input min-h-[100px]" placeholder="Suite 42, Elite Towers, Mayfair" />
                  </div>
                </div>
                <div className="mt-12 flex justify-between">
                   <button onClick={prevStep} className="kyc-btn-secondary">← Back</button>
                   <button onClick={nextStep} className="kyc-btn-primary">Next: Documents →</button>
                </div>
              </motion.div>
            )}

            {step === 4 && (
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} key="step4">
                <h3 className="text-xl font-serif font-bold mb-10 italic text-white/90">Step 4: Document Uploads</h3>
                <div className="space-y-10">
                  {[
                    { label: "CNIC / Identity Front", name: "cnicFront" },
                    { label: "CNIC / Identity Back", name: "cnicBack" },
                    { label: "Selfie with Identity", name: "selfieWithCnic" },
                    { label: "Trade License (Optional)", name: "license" },
                  ].map((doc) => (
                    <div key={doc.name} className="space-y-4">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-white/30">{doc.label}</label>
                      <div className="flex items-center gap-6">
                        <div className="w-24 h-16 bg-white/5 border border-white/10 rounded-sm overflow-hidden flex items-center justify-center">
                          {(formData.documents as any)[doc.name] ? (
                            <img src={(formData.documents as any)[doc.name]} className="w-full h-full object-cover" />
                          ) : (
                            <svg className="w-6 h-6 text-white/10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                          )}
                        </div>
                        <div className="flex-1">
                          <input 
                            type="file" 
                            accept="image/*"
                            required={doc.name !== "license"}
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                const reader = new FileReader();
                                reader.onloadend = () => {
                                  setFormData({
                                    ...formData,
                                    documents: { ...formData.documents, [doc.name]: reader.result as string }
                                  });
                                };
                                reader.readAsDataURL(file);
                              }
                            }}
                            className="text-[10px] text-white/40 file:bg-white/5 file:border-none file:text-white file:px-4 file:py-2 file:text-[9px] file:uppercase file:tracking-widest hover:file:bg-white/10 cursor-pointer"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  <div className="pt-8 flex items-center gap-4">
                    <input 
                      type="checkbox" 
                      id="terms"
                      required 
                      checked={agreed}
                      onChange={(e) => setAgreed(e.target.checked)}
                      className="w-4 h-4 accent-primary-gold cursor-pointer" 
                    />
                    <label htmlFor="terms" className="text-[9px] text-white/60 uppercase tracking-widest font-bold cursor-pointer select-none">
                      I accept the terms and conditions of the Elite Collective.
                    </label>
                  </div>
                </div>
                <div className="mt-12 flex justify-between">
                   <button onClick={prevStep} className="kyc-btn-secondary">← Back</button>
                   <button 
                    onClick={() => {
                      if (!formData.documents.cnicFront || !formData.documents.cnicBack || !formData.documents.selfieWithCnic) {
                        setError("Please upload all required identity documents.");
                        return;
                      }
                      if (!agreed) {
                        setError("You must agree to the terms.");
                        return;
                      }
                      nextStep();
                    }} 
                    className="kyc-btn-primary"
                   >
                     Next: Membership & Payment →
                   </button>
                </div>
              </motion.div>
            )}

            {step === 5 && (
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} key="step5">
                <h3 className="text-xl font-serif font-bold mb-6 italic text-white/90">Step 5: Membership & Payment</h3>
                
                <div className="mb-10">
                  <p className="text-[10px] uppercase tracking-widest text-white/30 font-bold mb-6">Select Your Subscription Tier</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {plans.map(plan => (
                      <div 
                        key={plan._id} 
                        onClick={() => setSelectedPlan(plan)}
                        className={`p-6 border cursor-pointer transition-all ${selectedPlan?._id === plan._id ? 'border-primary-gold bg-primary-gold/5' : 'border-white/5 bg-white/[0.02] hover:border-white/20'}`}
                      >
                        <h4 className="text-lg font-serif font-bold text-white mb-1 italic">{plan.name}</h4>
                        <p className="text-primary-gold font-bold text-sm mb-4">{plan.price} <span className="text-[9px] uppercase opacity-40">/ {plan.interval}</span></p>
                        <ul className="space-y-2">
                          {plan.features.slice(0, 3).map((f: any, i: number) => (
                            <li key={i} className="text-[9px] text-white/40 uppercase tracking-widest flex items-center gap-2">
                              <span className="w-1 h-1 bg-primary-gold rounded-full"></span> {f}
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </div>

                {selectedPlan && (
                  <Elements stripe={stripePromise}>
                    <StripePaymentForm 
                      plan={selectedPlan}
                      formData={formData}
                      loading={loading}
                      setLoading={setLoading}
                      onSuccess={handlePaymentSuccess}
                      onError={setError}
                    />
                  </Elements>
                )}

                <div className="mt-8 flex justify-start">
                   <button onClick={prevStep} className="kyc-btn-secondary">← Back to Selection</button>
                </div>
              </motion.div>
            )}

            {step === 6 && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} key="step6">
                <div className="text-center py-20">
                   <div className="w-20 h-20 bg-secondary-emerald/20 text-secondary-emerald rounded-full flex items-center justify-center mx-auto mb-10 border border-secondary-emerald/30">
                      <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg>
                   </div>
                   <h3 className="text-4xl font-serif font-bold text-white mb-6 italic">Payment & Submission Successful</h3>
                   <p className="text-white/40 uppercase tracking-[0.2em] text-xs max-w-md mx-auto leading-relaxed">Your membership has been activated and your verification dossier is now under executive review.</p>
                   
                   <button onClick={() => router.push('/dashboard')} className="mt-12 kyc-btn-primary px-16">Enter Designer Dashboard</button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-10 text-left">
                   <div className="bg-white/[0.03] p-6 border border-white/5">
                      <p className="text-[9px] uppercase tracking-widest text-white/30 font-bold mb-4">Identity Details</p>
                      <p className="text-sm text-white/80 font-medium">ID: {formData.cnic}</p>
                      <p className="text-sm text-white/80 font-medium mt-2">Brand: {formData.businessName}</p>
                   </div>
                   <div className="bg-white/[0.03] p-6 border border-white/5">
                      <p className="text-[9px] uppercase tracking-widest text-white/30 font-bold mb-4">Location</p>
                      <p className="text-sm text-white/80 font-medium">{formData.city}</p>
                      <p className="text-[9px] text-white/40 mt-2">{formData.address}</p>
                   </div>
                </div>

                <div className="grid grid-cols-3 gap-4 mb-12">
                   {Object.entries(formData.documents).filter(([_,v]) => v).map(([k, v]) => (
                     <div key={k} className="aspect-video bg-white/5 border border-white/10 rounded-sm overflow-hidden">
                        <img src={v} className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-500" />
                     </div>
                   ))}
                </div>

                {/* Saved Card Section */}
                <div className="bg-white/5 border border-white/10 p-8 mb-12 flex items-center justify-between rounded-sm">
                   <div className="flex items-center gap-6">
                     <div className="w-14 h-10 bg-gradient-to-br from-white/10 to-white/5 rounded-md border border-white/10 flex items-center justify-center shadow-inner">
                        <svg className="w-6 h-6 text-primary-gold/60" fill="currentColor" viewBox="0 0 24 24"><path d="M20 4H4c-1.11 0-1.99.89-1.99 2L2 18c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V6c0-1.11-.89-2-2-2zm0 14H4v-6h16v6zm0-10H4V6h16v4z"/></svg>
                     </div>
                     <div>
                       <p className="text-[9px] uppercase tracking-[0.3em] text-white/30 font-black mb-1">Default Payment Method</p>
                       <p className="text-sm font-bold text-white tracking-[0.2em]">•••• •••• •••• {formData.cnic.slice(-4) || "4242"}</p>
                     </div>
                   </div>
                   <div className="text-right">
                      <span className="text-[9px] font-black uppercase text-secondary-emerald bg-secondary-emerald/10 px-4 py-2 rounded-full border border-secondary-emerald/20 tracking-widest shadow-[0_0_15px_rgba(0,255,157,0.1)]">Card Verified</span>
                   </div>
                </div>

                <div className="flex flex-col gap-4">
                  <button onClick={() => router.push('/dashboard')} className="kyc-btn-primary w-full">Return to Dashboard</button>
                  
                  {formData.documents.cnicFront && (
                    <button 
                      onClick={() => setStep(1)} 
                      className="border border-white/10 text-white/60 py-4 text-[10px] font-bold uppercase tracking-widest hover:bg-white hover:text-luxury-black transition-all"
                    >
                      Edit Application Details
                    </button>
                  )}
                  
                  <p className="text-[9px] text-center text-white/20 uppercase tracking-widest font-bold mt-4">
                    {formData.documents.cnicFront ? "You can modify your details before final approval." : "Record is currently under active review and cannot be modified."}
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <style jsx>{`
        .kyc-input {
          width: 100%;
          background: transparent;
          border-bottom: 1px solid rgba(255,255,255,0.1);
          padding: 1rem 0;
          color: white;
          transition: all 0.3s;
          font-size: 0.9rem;
        }
        .kyc-input:focus {
          outline: none;
          border-color: #E8D196;
        }
        .kyc-btn-primary {
          background: linear-gradient(135deg, #004F34 0%, #00825B 100%);
          color: white;
          padding: 1rem 2.5rem;
          font-size: 10px;
          font-weight: 900;
          text-transform: uppercase;
          letter-spacing: 0.2em;
          box-shadow: 0 10px 30px rgba(0,79,52,0.3);
          transition: all 0.3s;
        }
        .kyc-btn-primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 15px 40px rgba(0,79,52,0.4);
        }
        .kyc-btn-secondary {
          color: white;
          opacity: 0.4;
          font-size: 10px;
          font-weight: 900;
          text-transform: uppercase;
          letter-spacing: 0.2em;
          transition: all 0.3s;
        }
        .kyc-btn-secondary:hover {
          opacity: 1;
        }
      `}</style>
    </div>
  );
}
