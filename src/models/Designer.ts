import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IDesigner extends Document {
  name: string;
  businessName?: string;
  specialty: string;
  experience?: number;
  cnic?: string;
  passport?: string;
  email?: string;
  location: string;
  address?: string;
  portfolioLinks?: string[];
  image: string;
  tier: 'Basic' | 'Premium' | 'Elite';
  bio: string;
  collections: string[];
  documents?: {
    cnicFront?: string;
    cnicBack?: string;
    selfieWithCnic?: string;
    license?: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

const DesignerSchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    businessName: { type: String },
    specialty: { type: String, required: true },
    experience: { type: Number },
    cnic: { type: String },
    passport: { type: String },
    email: { type: String },
    location: { type: String, required: true },
    address: { type: String },
    portfolioLinks: { type: [String], default: [] },
    image: { type: String, required: true },
    tier: { 
      type: String, 
      enum: ['Basic', 'Premium', 'Elite'], 
      default: 'Basic' 
    },
    bio: { type: String, required: true },
    collections: { type: [String], default: [] },
    documents: {
      cnicFront: { type: String },
      cnicBack: { type: String },
      selfieWithCnic: { type: String },
      license: { type: String }
    }
  },
  { timestamps: true }
);

// Check if the model is already defined to prevent errors in development
const Designer: Model<IDesigner> = 
  mongoose.models.Designer || mongoose.model<IDesigner>('Designer', DesignerSchema);

export default Designer;
