import mongoose, { Schema, model, models } from 'mongoose';

export interface IPlan {
  _id: string;
  name: string;
  price: string;
  interval: 'monthly' | 'yearly';
  description: string;
  features: string[];
  isPopular?: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const PlanSchema = new Schema<IPlan>({
  name: { type: String, required: true },
  price: { type: String, required: true },
  interval: { type: String, enum: ['monthly', 'yearly'], default: 'monthly' },
  description: { type: String, required: true },
  features: [{ type: String }],
  isPopular: { type: Boolean, default: false },
}, { timestamps: true });

export default models.Plan || model<IPlan>('Plan', PlanSchema);
