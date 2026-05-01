import mongoose, { Schema, Document, Model } from 'mongoose';

export enum EventApplicationStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
}

export interface IEventApplication extends Document {
  event: mongoose.Types.ObjectId;
  designer: mongoose.Types.ObjectId;
  status: EventApplicationStatus;
  adminNotes?: string;
  appliedAt: Date;
}

const EventApplicationSchema: Schema = new Schema(
  {
    event: { type: Schema.Types.ObjectId, ref: 'Event', required: true },
    designer: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    status: { 
      type: String, 
      enum: Object.values(EventApplicationStatus), 
      default: EventApplicationStatus.PENDING 
    },
    adminNotes: String,
    appliedAt: { type: Date, default: Date.now }
  },
  { timestamps: true }
);

const EventApplication: Model<IEventApplication> = 
  mongoose.models.EventApplication || mongoose.model<IEventApplication>('EventApplication', EventApplicationSchema);

export default EventApplication;
