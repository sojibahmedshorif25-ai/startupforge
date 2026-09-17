import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema(
  {
    user_email: { type: String, required: true },
    title: { type: String, required: true },
    message: { type: String, required: true },
    type: { type: String, enum: ['application_status', 'startup_status', 'payment', 'system'], default: 'system' },
    link: { type: String, default: '' },
    isRead: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.model('Notification', notificationSchema);
