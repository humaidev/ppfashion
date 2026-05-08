import mongoose, { Schema, Document, Model } from 'mongoose';

export enum UserRole {
  DESIGNER = 'DESIGNER',
  ADMIN = 'ADMIN',
}

export enum KYCStatus {
  NOT_SUBMITTED = 'NOT_SUBMITTED',
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
  NEEDS_REVISION = 'NEEDS_REVISION',
}

export enum MembershipPlan {
  NONE = 'NONE',
  MONTHLY = 'MONTHLY',
  YEARLY = 'YEARLY',
}

export interface IUser extends Document {
  name: string;
  email: string;
  password?: string;
  phone?: string;
  role: UserRole;
  
  // KYC Info
  kycStatus: KYCStatus;
  kycData?: {
    cnic: string;
    passport?: string;
    businessName: string;
    category: string;
    experience: number;
    portfolioLinks: string[];
    city: string;
    address: string;
    documents: {
      cnicFront: string;
      cnicBack: string;
      selfieWithCnic: string;
      license?: string;
    };
    adminFeedback?: string;
  };

  // Membership Info
  membership: {
    plan: string;
    status: 'ACTIVE' | 'EXPIRED' | 'INACTIVE';
    startDate?: Date;
    expiryDate?: Date;
    stripeSubscriptionId?: string;
    stripeCustomerId?: string;
    cardLast4?: string;
    paymentMethod?: string;
  };

  // Portfolio / Brand Info
  portfolio?: {
    brandBio: string;
    images: string[]; // URLs of collection images
    brandLogo?: string;
    socialLinks?: {
      instagram?: string;
      website?: string;
    }
  };

  // Verification
  isEmailVerified: boolean;
  verificationCode?: string;
  isFeatured: boolean;

  createdAt: Date;
  updatedAt: Date;
}

const UserSchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String }, // Optional for social login or managed users
    phone: { type: String },
    role: { type: String, enum: Object.values(UserRole), default: UserRole.DESIGNER },
    
    kycStatus: { type: String, enum: Object.values(KYCStatus), default: KYCStatus.NOT_SUBMITTED },
    kycData: {
      cnic: String,
      passport: String,
      businessName: String,
      category: String,
      experience: Number,
      portfolioLinks: [String],
      city: String,
      address: String,
      documents: {
        cnicFront: String,
        cnicBack: String,
        selfieWithCnic: String,
        license: String,
      },
      adminFeedback: String,
    },

    membership: {
      plan: { type: String, default: 'NONE' },
      status: { type: String, enum: ['ACTIVE', 'EXPIRED', 'INACTIVE'], default: 'INACTIVE' },
      startDate: Date,
      expiryDate: Date,
      stripeSubscriptionId: String,
      stripeCustomerId: String,
      cardLast4: String,
      paymentMethod: String,
    },

    portfolio: {
      brandBio: String,
      images: [String],
      brandLogo: String,
      socialLinks: {
        instagram: String,
        website: String,
      }
    },

    isEmailVerified: { type: Boolean, default: false },
    verificationCode: { type: String },
    isFeatured: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const User: Model<IUser> = mongoose.models.User || mongoose.model<IUser>('User', UserSchema);

export default User;
