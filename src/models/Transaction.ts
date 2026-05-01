import mongoose, { Schema, model, models } from 'mongoose';

export enum TransactionStatus {
  PENDING = 'PENDING',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED'
}

export interface ITransaction {
  _id: string;
  userId: mongoose.Types.ObjectId;
  planId: mongoose.Types.ObjectId;
  amount: string;
  currency: string;
  status: TransactionStatus;
  paymentMethod: string;
  cardLast4?: string;
  transactionId: string;
  createdAt: Date;
  updatedAt: Date;
}

const TransactionSchema = new Schema<ITransaction>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  planId: { type: Schema.Types.ObjectId, ref: 'Plan' },
  amount: { type: String, required: true },
  currency: { type: String, default: 'GBP' },
  status: { type: String, enum: Object.values(TransactionStatus), default: TransactionStatus.PENDING },
  paymentMethod: { type: String, required: true },
  cardLast4: { type: String },
  transactionId: { type: String, required: true, unique: true },
}, { timestamps: true });

export default models.Transaction || model<ITransaction>('Transaction', TransactionSchema);
