import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  image: { type: String, default: '' },
  password: { type: String, required: true },
  role: { type: String, enum: ['founder', 'collaborator', 'admin'], default: 'collaborator' },
  isBlocked: { type: Boolean, default: false },
  skills: [{ type: String }],
  bio: { type: String, default: '' },
  isPremium: { type: Boolean, default: false },
  opportunityCount: { type: Number, default: 0 },
}, { timestamps: true });

export default mongoose.model('User', userSchema);
