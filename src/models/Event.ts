import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IEvent extends Document {
  title: string;
  date: string;
  location: string;
  type: string;
  image: string;
  status: string;
  price: string;
  description?: string;
  itinerary?: string[];
  createdAt: Date;
}

const EventSchema: Schema = new Schema(
  {
    title: { type: String, required: true },
    date: { type: String, required: true },
    location: { type: String, required: true },
    type: { type: String, required: true },
    image: { type: String, required: true },
    status: { type: String, default: 'Applications Open' },
    price: { type: String, required: true },
    description: { type: String },
    itinerary: { type: [String], default: [] },
  },
  { timestamps: true }
);

const Event: Model<IEvent> = 
  mongoose.models.Event || mongoose.model<IEvent>('Event', EventSchema);

export default Event;
