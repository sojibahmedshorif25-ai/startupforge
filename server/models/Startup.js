import mongoose from 'mongoose';

const startupSchema = new mongoose.Schema({
  startup_name: { type: String, required: true },
  logo: { type: String, default: '' },
  industry: { type: String, required: true },
  description: { type: String, required: true },
  funding_stage: { type: String, required: true },
  founder_email: { type: String, required: true },
  founder_name: { type: String, default: '' },
  team_size_needed: { type: Number, default: 1 },
  status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
}, { timestamps: true });

export default mongoose.model('Startup', startupSchema);
