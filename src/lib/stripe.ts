import Stripe from 'stripe';

if (!process.env.STRIPE_SECRET_KEY) {
  console.warn('STRIPE_SECRET_KEY is missing. Payment integration will run in mock mode.');
}

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'mock_key', {
  apiVersion: '2023-10-16' as any,
});
