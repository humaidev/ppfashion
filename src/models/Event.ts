import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IEvent extends Document {
  title: string;
  startDate: string;
  endDate: string;
  location: string;
  type: string;
  image: string;
  status: string;
  description?: string;
  itinerary?: string[];
  createdAt: Date;
}

const EventSchema: Schema = new Schema(
  {
    title: { type: String, required: true },
    startDate: { type: String, required: true },
    endDate: { type: String, required: true },
    location: { type: String, required: true },
    type: { type: String, required: true },
    image: { type: String, required: true },
    status: { type: String, default: 'Applications Open' },
    description: { type: String },
    itinerary: { type: [String], default: [] },
  },
  { timestamps: true }
);

const Event: Model<IEvent> = 
  mongoose.models.Event || mongoose.model<IEvent>('Event', EventSchema);

export default Event;
