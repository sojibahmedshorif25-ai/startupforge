import mongoose from 'mongoose';

const paymentSchema = new mongoose.Schema({
  user_email: { type: String, required: true },
  amount: { type: Number, required: true },
  transaction_id: { type: String, required: true },
  payment_status: { type: String, enum: ['pending', 'completed', 'failed'], default: 'completed' },
}, { timestamps: true });

export default mongoose.model('Payment', paymentSchema);
