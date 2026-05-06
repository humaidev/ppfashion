"use client";

import { useState } from "react";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";

interface StripePaymentFormProps {
  plan: any;
  onSuccess: (transaction: any) => void;
  onError: (msg: string) => void;
  loading: boolean;
  setLoading: (loading: boolean) => void;
  formData: any;
}

export default function StripePaymentForm({ 
  plan, 
  onSuccess, 
  onError, 
  loading, 
  setLoading,
  formData
}: StripePaymentFormProps) {
  const stripe = useStripe();
  const elements = useElements();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) return;

    setLoading(true);

    try {
      // 1. Create PaymentIntent on server
      const res = await fetch("/api/payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          planId: plan._id,
          planName: plan.name,
          amount: plan.price,
          // We don't send card details anymore!
        })
      });

      const { clientSecret, success, message } = await res.json();

      if (!success) {
        onError(message || "Failed to initialize payment");
        setLoading(false);
        return;
      }

      // 2. Confirm payment on client
      const cardElement = elements.getElement(CardElement);
      if (!cardElement) return;

      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: cardElement,
          billing_details: {
            name: formData.businessName,
            email: formData.email, // We might need to pass email here
          },
        },
      });

      if (result.error) {
        onError(result.error.message || "Payment failed");
        setLoading(false);
      } else {
        if (result.paymentIntent.status === "succeeded") {
          // 3. Finalize Payment on Server
          const finalizeRes = await fetch("/api/payment/finalize", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ paymentIntentId: result.paymentIntent.id })
          });
          const finalizeData = await finalizeRes.json();
          
          if (finalizeData.success) {
            onSuccess(finalizeData.transaction);
          } else {
            onError(finalizeData.message || "Failed to record transaction");
            setLoading(false);
          }
        }
      }
    } catch (err) {
      onError("An unexpected error occurred.");
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="bg-black/40 p-8 rounded-sm border border-white/5">
        <p className="text-[10px] uppercase tracking-widest text-white/30 font-bold mb-6">Secure Payment Registry</p>
        
        <div className="p-4 bg-white/[0.03] border border-white/10 rounded-sm">
          <CardElement 
            options={{
              style: {
                base: {
                  fontSize: '14px',
                  color: '#ffffff',
                  '::placeholder': {
                    color: 'rgba(255,255,255,0.2)',
                  },
                },
                invalid: {
                  color: '#ef4444',
                },
              },
            }}
          />
        </div>
        <p className="text-[9px] text-white/20 uppercase tracking-widest mt-4">
          Encrypted by Stripe. Your card data never touches our servers.
        </p>
      </div>

      <button 
        type="submit"
        disabled={loading || !stripe}
        className="w-full kyc-btn-primary"
      >
        {loading ? "Authorizing Payment..." : `Pay ${plan?.price || ''} & Activate Membership`}
      </button>

      <style jsx>{`
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
        .kyc-btn-primary:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 15px 40px rgba(0,79,52,0.4);
        }
        .kyc-btn-primary:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
      `}</style>
    </form>
  );
}
