import mongoose, { Schema, Document, Model } from 'mongoose';

export interface ISubscriber extends Document {
  fullName: string;
  email: string;
  phone?: string;
  brandName?: string;
  instagram?: string;
  website?: string;
  yearsInBusiness?: string;
  portfolioLink?: string;
  visionStatement?: string;
  plan: string;
  status: 'Pending' | 'Approved' | 'Rejected';
  type: 'Member' | 'Newsletter';
  createdAt: Date;
}

const SubscriberSchema: Schema = new Schema(
  {
    fullName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String },
    brandName: { type: String },
    instagram: { type: String },
    website: { type: String },
    yearsInBusiness: { type: String },
    portfolioLink: { type: String },
    visionStatement: { type: String },
    plan: { type: String, default: 'Newsletter' },
    status: { 
      type: String, 
      enum: ['Pending', 'Approved', 'Rejected'], 
      default: 'Pending' 
    },
    type: {
      type: String,
      enum: ['Member', 'Newsletter'],
      default: 'Member'
    }
  },
  { timestamps: true }
);

const Subscriber: Model<ISubscriber> = 
  mongoose.models.Subscriber || mongoose.model<ISubscriber>('Subscriber', SubscriberSchema);

export default Subscriber;
