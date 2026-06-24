import mongoose from 'mongoose';

const applicationSchema = new mongoose.Schema({
  opportunity_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Opportunity', required: true },
  applicant_email: { type: String, required: true },
  applicant_name: { type: String, default: '' },
  portfolio_link: { type: String, default: '' },
  motivation: { type: String, required: true },
  status: { type: String, enum: ['pending', 'accepted', 'rejected'], default: 'pending' },
}, { timestamps: true });

export default mongoose.model('Application', applicationSchema);
