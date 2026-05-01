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
    experience: string;
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
    plan: MembershipPlan;
    status: 'ACTIVE' | 'EXPIRED' | 'INACTIVE';
    startDate?: Date;
    expiryDate?: Date;
    stripeSubscriptionId?: string;
    stripeCustomerId?: string;
    cardLast4?: string;
    paymentMethod?: string;
  };

  // Verification
  isEmailVerified: boolean;
  verificationCode?: string;

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
      experience: String,
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
      plan: { type: String, enum: Object.values(MembershipPlan), default: MembershipPlan.NONE },
      status: { type: String, enum: ['ACTIVE', 'EXPIRED', 'INACTIVE'], default: 'INACTIVE' },
      startDate: Date,
      expiryDate: Date,
      stripeSubscriptionId: String,
      stripeCustomerId: String,
      cardLast4: String,
      paymentMethod: String,
    },

    isEmailVerified: { type: Boolean, default: false },
    verificationCode: { type: String },
  },
  { timestamps: true }
);

const User: Model<IUser> = mongoose.models.User || mongoose.model<IUser>('User', UserSchema);

export default User;
