import mongoose from 'mongoose';

const opportunitySchema = new mongoose.Schema({
  startup_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Startup', required: true },
  role_title: { type: String, required: true },
  required_skills: [{ type: String }],
  work_type: { type: String, enum: ['remote', 'onsite', 'hybrid'], required: true },
  commitment_level: { type: String, enum: ['full-time', 'part-time', 'contract'], required: true },
  deadline: { type: Date, required: true },
  description: { type: String, default: '' },
}, { timestamps: true });

export default mongoose.model('Opportunity', opportunitySchema);
