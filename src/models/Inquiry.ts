import mongoose from 'mongoose';

const InquirySchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    required: true,
    enum: ['Membership Application', 'Event Sponsorship', 'Press Inquiry', 'General Question'],
  },
  message: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ['NEW', 'READ', 'ARCHIVED'],
    default: 'NEW',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.models.Inquiry || mongoose.model('Inquiry', InquirySchema);
