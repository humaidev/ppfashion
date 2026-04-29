import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IDesigner extends Document {
  name: string;
  specialty: string;
  image: string;
  tier: 'Basic' | 'Premium' | 'Elite';
  bio: string;
  location: string;
  collections: string[];
  createdAt: Date;
  updatedAt: Date;
}

const DesignerSchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    specialty: { type: String, required: true },
    image: { type: String, required: true },
    tier: { 
      type: String, 
      enum: ['Basic', 'Premium', 'Elite'], 
      default: 'Basic' 
    },
    bio: { type: String, required: true },
    location: { type: String, required: true },
    collections: { type: [String], default: [] },
  },
  { timestamps: true }
);

// Check if the model is already defined to prevent errors in development
const Designer: Model<IDesigner> = 
  mongoose.models.Designer || mongoose.model<IDesigner>('Designer', DesignerSchema);

export default Designer;
